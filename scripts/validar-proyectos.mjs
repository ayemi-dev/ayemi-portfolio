// Valida cada contenido/proyectos/<slug>/proyecto.json contra
// contenido/proyectos/proyecto.schema.json y comprueba que existan los medios
// locales que la ficha nombra. Corre al inicio de `npm run build`: si algo
// falta, el build se detiene con «<slug>: falta <campo>» y código 1.
//
// Uso: node scripts/validar-proyectos.mjs [carpeta-de-proyectos]
// Sin argumento valida contenido/proyectos/.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ESQUEMA = join(RAIZ, 'contenido', 'proyectos', 'proyecto.schema.json')
const CARPETA = resolve(process.argv[2] ?? join(RAIZ, 'contenido', 'proyectos'))

// `/textos/es` → `textos.es`; `/imagenes/0` → `imagenes[0]`.
function campo(rutaInstancia, propiedad) {
  const partes = rutaInstancia.split('/').filter(Boolean)
  if (propiedad !== undefined) partes.push(propiedad)
  return partes
    .map((p, i) => (/^\d+$/.test(p) ? `[${p}]` : i === 0 ? p : `.${p}`))
    .join('')
}

function mensajes(slug, errores) {
  const lineas = new Set()
  const alternativas = new Map()

  for (const e of errores) {
    // Los fallos de `if/then`, `allOf` y `anyOf` repiten lo que ya dicen los
    // errores concretos que contienen.
    if (['if', 'allOf', 'anyOf'].includes(e.keyword)) continue

    if (e.keyword === 'required') {
      const nombre = campo(e.instancePath, e.params.missingProperty)
      const enAnyOf = e.schemaPath.match(/^(.*\/anyOf)\/\d+\//)
      if (enAnyOf) {
        const clave = `${e.instancePath}|${enAnyOf[1]}`
        alternativas.set(clave, [...(alternativas.get(clave) ?? []), nombre])
      } else {
        lineas.add(`${slug}: falta ${nombre}`)
      }
      continue
    }

    if (e.keyword === 'minItems') {
      lineas.add(`${slug}: falta ${campo(e.instancePath)} (al menos ${e.params.limit})`)
      continue
    }

    if (e.keyword === 'enum') {
      const permitidos = e.params.allowedValues.join(' | ')
      lineas.add(`${slug}: ${campo(e.instancePath)} debe ser uno de: ${permitidos}`)
      continue
    }

    lineas.add(`${slug}: ${campo(e.instancePath) || 'ficha'} ${e.message}`)
  }

  for (const nombres of alternativas.values()) {
    lineas.add(`${slug}: falta ${nombres.join(' o ')}`)
  }
  return [...lineas]
}

// Rutas locales que la ficha nombra. Las URL absolutas no se comprueban.
function rutasDeMedios(ficha) {
  const rutas = []
  for (const img of Array.isArray(ficha.imagenes) ? ficha.imagenes : []) {
    rutas.push(img?.src)
  }
  if (ficha.video && typeof ficha.video === 'object') {
    rutas.push(ficha.video.mp4, ficha.video.webm, ficha.video.poster)
  }
  rutas.push(ficha.gif?.src, ficha.diagrama)
  return rutas.filter((r) => typeof r === 'string' && r && !/^[a-z]+:\/\//i.test(r))
}

function validarMedios(slug, carpetaFicha, ficha) {
  const fallos = []
  for (const ruta of rutasDeMedios(ficha)) {
    const absoluta = resolve(carpetaFicha, ruta)
    if (absoluta !== carpetaFicha && !absoluta.startsWith(carpetaFicha + sep)) {
      fallos.push(`${slug}: ${ruta} sale de la carpeta de la ficha`)
    } else if (!existsSync(absoluta) || !statSync(absoluta).isFile()) {
      fallos.push(`${slug}: falta ${relative(carpetaFicha, absoluta).split(sep).join('/')}`)
    }
  }
  return fallos
}

// `strictRequired` se apaga porque las ramas `if/then` y `anyOf` exigen
// propiedades que se definen en el nivel superior, que es JSON Schema válido.
const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false })
addFormats(ajv)
const validar = ajv.compile(JSON.parse(readFileSync(ESQUEMA, 'utf8')))

const carpetas = existsSync(CARPETA)
  ? readdirSync(CARPETA, { withFileTypes: true }).filter((d) => d.isDirectory())
  : []

const fallos = []
for (const dir of carpetas) {
  const slug = dir.name
  const carpetaFicha = join(CARPETA, slug)
  const archivo = join(carpetaFicha, 'proyecto.json')

  if (!existsSync(archivo)) {
    fallos.push(`${slug}: falta proyecto.json`)
    continue
  }

  let ficha
  try {
    // Algunos editores de Windows guardan UTF-8 con BOM; JSON.parse no lo acepta.
    ficha = JSON.parse(readFileSync(archivo, 'utf8').replace(/^\uFEFF/, ''))
  } catch (error) {
    fallos.push(`${slug}: proyecto.json no es JSON válido (${error.message})`)
    continue
  }

  if (!validar(ficha)) fallos.push(...mensajes(slug, validar.errors))
  fallos.push(...validarMedios(slug, carpetaFicha, ficha))
}

if (fallos.length > 0) {
  console.error(`Fichas de proyecto con errores (${fallos.length}):`)
  for (const linea of fallos) console.error(`  ${linea}`)
  process.exit(1)
}

console.log(`Fichas de proyecto válidas: ${carpetas.length}.`)
