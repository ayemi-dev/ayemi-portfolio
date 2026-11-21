// Comprueba que ningún dist/**/index.html trae una frontera de Suspense
// separada del HTML: ni `<template id="B:` (el hueco que deja React) ni `$RC`
// (el guion que mueve el contenido a ese hueco). Con ellos, la página no tiene
// contenido hasta que corre el guion, y el LCP y el CLS empeoran en móvil.
// prerender.mjs lo evita con `progressiveChunkSize: Infinity`; esto avisa si
// una frontera nueva vuelve a separarse en silencio.
//
// Uso: node scripts/comprobar-prerender.mjs (después de prerender.mjs).

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(RAIZ, 'dist')
const MARCAS = ['<template id="B:', '$RC']

if (!existsSync(DIST)) {
  console.error('comprobar-prerender: no existe dist/. Corre antes `npm run build`.')
  process.exit(1)
}

function* paginas(carpeta) {
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name)
    if (entrada.isDirectory()) yield* paginas(ruta)
    else if (entrada.name === 'index.html') yield ruta
  }
}

let revisadas = 0
const fallos = []

for (const archivo of paginas(DIST)) {
  revisadas++
  const html = readFileSync(archivo, 'utf8')
  for (const marca of MARCAS) {
    if (html.includes(marca)) {
      fallos.push(`${relative(RAIZ, archivo).replace(/\\/g, '/')}: contiene ${marca}`)
    }
  }
}

if (fallos.length) {
  for (const fallo of fallos) console.error(fallo)
  console.error(`Frontera de Suspense separada en ${fallos.length} caso(s) de ${revisadas} HTML.`)
  process.exit(1)
}

console.log(`HTML sin fronteras separadas: ${revisadas}.`)
