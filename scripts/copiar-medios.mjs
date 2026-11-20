// Copia los medios de cada ficha publicada a public/proyectos/<slug>/, de donde
// los sirve Vite en `dev` y los copia a dist/ en `build`. Así el build del
// cliente y el prerender dan la misma URL: /proyectos/<slug>/<archivo>
// (`urlMedio` en src/config/proyectos.js).
//
// Solo las fichas con `estado: "publicado"` (R0.5): los archivos de una ficha
// en construcción o retirada no deben quedar en una URL que se pueda adivinar.
// Solo el primer nivel de medios/, como el importador. No borra nada de
// public/proyectos/ (carpeta generada, fuera de git).
//
// Uso: node scripts/copiar-medios.mjs

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PROYECTOS = join(RAIZ, 'contenido', 'proyectos')
const DESTINO = join(RAIZ, 'public', 'proyectos')
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

let fichas = 0
let archivos = 0

for (const carpeta of readdirSync(PROYECTOS)) {
  const ruta = join(PROYECTOS, carpeta, 'proyecto.json')
  if (!existsSync(ruta)) continue

  const ficha = JSON.parse(readFileSync(ruta, 'utf8').replace(/^\uFEFF/, ''))
  if (ficha.estado !== 'publicado') continue
  if (!SLUG.test(ficha.slug ?? '')) {
    console.error(`${carpeta}: slug no válido, no se copian sus medios`)
    process.exit(1)
  }

  const medios = join(PROYECTOS, carpeta, 'medios')
  if (!existsSync(medios)) continue

  const destino = join(DESTINO, ficha.slug)
  mkdirSync(destino, { recursive: true })
  for (const nombre of readdirSync(medios)) {
    const origen = join(medios, nombre)
    if (!statSync(origen).isFile()) continue
    copyFileSync(origen, join(destino, nombre))
    archivos += 1
  }
  fichas += 1
}

console.log(`Medios copiados a public/proyectos/: ${archivos} archivo(s) de ${fichas} ficha(s).`)
