// Importa la ficha de un repo de proyecto al portafolio (R1.4).
//
// Uso: npm run importar-proyecto -- <ruta-al-repo>
//
// Lee <repo>/ayemi/proyecto.json y <repo>/ayemi/medios/*, y deja la ficha en
// contenido/proyectos/<slug>/ (el slug sale de la propia ficha):
//   - Los PNG y JPG se convierten a WebP con el lado mayor ≤ 1600 px. La ficha
//     pasa a apuntar al .webp y, si la imagen lleva `ancho`/`alto`, se
//     actualizan a las medidas nuevas.
//   - El resto de archivos de medios/ (mp4, webm, svg, gif, webp…) se copia
//     tal cual.
//   - Todo se prepara primero en una carpeta temporal y se valida con
//     scripts/validar-proyectos.mjs. Solo si la ficha es válida se copia a
//     contenido/proyectos/; si no, el portafolio queda como estaba.
//   - Si contenido/proyectos/<slug>/ ya existe, no se sobrescribe.

import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DESTINO = join(RAIZ, 'contenido', 'proyectos')
const VALIDADOR = join(RAIZ, 'scripts', 'validar-proyectos.mjs')
const LADO_MAXIMO = 1600
const CALIDAD_WEBP = 80
const CONVERTIBLES = new Set(['.png', '.jpg', '.jpeg'])
// El mismo patrón que `slug` en proyecto.schema.json. Se comprueba antes de
// usarlo como nombre de carpeta para que una ficha no escriba fuera de
// contenido/proyectos/.
const PATRON_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function salir(mensaje) {
  console.error(mensaje)
  process.exit(1)
}

// Cambia cada cadena igual a una ruta convertida y ajusta `ancho`/`alto` del
// objeto que la contiene en `src`.
function reescribir(valor, cambios) {
  if (Array.isArray(valor)) return valor.map((v) => reescribir(v, cambios))
  if (valor && typeof valor === 'object') {
    const copia = {}
    for (const [clave, v] of Object.entries(valor)) copia[clave] = reescribir(v, cambios)
    const cambio = typeof valor.src === 'string' ? cambios.get(valor.src) : undefined
    if (cambio) {
      if ('ancho' in valor) copia.ancho = cambio.ancho
      if ('alto' in valor) copia.alto = cambio.alto
    }
    return copia
  }
  if (typeof valor === 'string' && cambios.has(valor)) return cambios.get(valor).ruta
  return valor
}

const repo = process.argv[2]
if (!repo) salir('Uso: npm run importar-proyecto -- <ruta-al-repo>')

const origen = join(resolve(repo), 'ayemi')
const archivoFicha = join(origen, 'proyecto.json')
if (!existsSync(archivoFicha)) salir(`No existe ${archivoFicha}.`)

let ficha
try {
  ficha = JSON.parse(readFileSync(archivoFicha, 'utf8').replace(/^\uFEFF/, ''))
} catch (error) {
  salir(`${archivoFicha} no es JSON válido (${error.message}).`)
}

const slug = ficha?.slug
if (typeof slug !== 'string' || !PATRON_SLUG.test(slug)) {
  salir(`La ficha no trae un slug válido (minúsculas, números y guiones): ${JSON.stringify(slug)}.`)
}

const final = join(DESTINO, slug)
if (existsSync(final)) {
  salir(`${slug}: ya existe contenido/proyectos/${slug}/. Bórrala o cámbiale el nombre antes de importar de nuevo.`)
}

const preparacion = mkdtempSync(join(tmpdir(), 'ayemi-importar-'))
const carpetaFicha = join(preparacion, slug)
const carpetaMedios = join(carpetaFicha, 'medios')

try {
  mkdirSync(carpetaMedios, { recursive: true })

  const origenMedios = join(origen, 'medios')
  const archivos = existsSync(origenMedios)
    ? readdirSync(origenMedios, { withFileTypes: true }).filter((d) => d.isFile())
    : []
  const nombres = new Set(archivos.map((d) => d.name.toLowerCase()))
  const cambios = new Map()
  let convertidas = 0

  for (const { name } of archivos) {
    const entrada = join(origenMedios, name)
    const extension = extname(name).toLowerCase()

    if (!CONVERTIBLES.has(extension)) {
      cpSync(entrada, join(carpetaMedios, name))
      continue
    }

    const nombreWebp = `${basename(name, extname(name))}.webp`
    if (nombres.has(nombreWebp.toLowerCase())) {
      throw new Error(`${slug}: medios/${name} se convertiría en medios/${nombreWebp}, que ya existe en el repo.`)
    }
    if (existsSync(join(carpetaMedios, nombreWebp))) {
      throw new Error(`${slug}: dos imágenes de medios/ se convertirían en medios/${nombreWebp}.`)
    }

    const { width, height } = await sharp(entrada)
      .rotate()
      .resize({ width: LADO_MAXIMO, height: LADO_MAXIMO, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: CALIDAD_WEBP })
      .toFile(join(carpetaMedios, nombreWebp))

    const nuevo = { ruta: `medios/${nombreWebp}`, ancho: width, alto: height }
    cambios.set(`medios/${name}`, nuevo)
    cambios.set(`./medios/${name}`, nuevo)
    convertidas += 1
  }

  writeFileSync(
    join(carpetaFicha, 'proyecto.json'),
    `${JSON.stringify(reescribir(ficha, cambios), null, 2)}\n`,
    'utf8',
  )

  const validacion = spawnSync(process.execPath, [VALIDADOR, preparacion], { stdio: 'inherit' })
  if (validacion.status !== 0) {
    throw new Error(`${slug}: la ficha no pasa la validación; no se importó nada.`)
  }

  mkdirSync(DESTINO, { recursive: true })
  cpSync(carpetaFicha, final, { recursive: true, errorOnExist: true, force: false })
  console.log(
    `Importado ${slug}: ${archivos.length} archivo(s) de medios, ${convertidas} convertido(s) a WebP → contenido/proyectos/${slug}/`,
  )
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
} finally {
  rmSync(preparacion, { recursive: true, force: true })
}
