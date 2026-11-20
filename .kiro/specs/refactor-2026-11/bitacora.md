# Refactorización 2026-11 · bitácora

T1 · 2026-11-19 · hecho · `contenido/proyectos/proyecto.schema.json` (JSON Schema 2020-12, `if/then` para `publicado` y `laboratorio`), `scripts/validar-proyectos.mjs`, `ajv` 8.20.0 y `ajv-formats` 3.0.1 como devDependencies, scripts `validar` y `build` en `package.json`.

## Detalle de T1

- Al retomar, `npm run validar` fallaba: Ajv en modo estricto (`strictTypes`) rechazaba `minItems` y `required` sin `type` en la rama `then`. Se añadió `"type": "array"` a `imagenes` y `"type": "object"` a `textos` dentro de esa rama.
- El script ahora quita el BOM inicial antes de `JSON.parse`, porque algunos editores de Windows guardan UTF-8 con BOM.
- Comprobantes:
  - `npm run lint`: 0 errores.
  - `npm run validar`: «Fichas de proyecto válidas: 0.», código 0 (todavía no hay fichas; ITA llega en T2).
  - `npm run build`: corre primero la validación y termina con «Prerenderizado completo.», código 0. Las advertencias `[Ayemi §3.10] Tamaño de icono fuera del sistema: 18 px / 22 px` del prerender ya existían antes de T1 y quedan fuera de su alcance.
  - `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 0 errores.
  - Ficha inválida (`laboratorio`, `publicado`, `imagenes: []`, sin `textos.en`, `demo`, `codigo`, `video`/`gif`, con un `diagrama` inexistente, guardada con BOM), probada en `%TEMP%` con `npm run validar -- <carpeta>` y dentro de `contenido/proyectos/`: código 1 en ambos casos, con estos mensajes:
    `falta imagenes (al menos 1)` · `falta textos.en` · `falta demo` · `falta codigo` · `falta video o gif` · `falta medios/diagrama.svg`.
  - Ficha válida completa en `%TEMP%`: código 0. Las dos carpetas de prueba se borraron.
- Fuera del commit: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf` (14 MB, sin seguimiento). T1 no lo nombra; se deja en disco sin versionar ni borrar.

T2 · 2026-11-20 · bloqueado · sin cambios de código: la ficha de ITA no puede ser `publicado` porque no tiene video ni GIF y el esquema de T1 los exige (ver Bloqueos).

## Detalle de T2 · primer intento

- Se leyeron `requirements.md`, `design.md`, las reglas de `tasks.md`, `src/config/casos.js`, `src/config/piezas.js`, `src/pages/Caso.jsx`, `src/pages/Casos.jsx`, `prerender.mjs` y `pendientes/LEEME.md`.
- Se buscó un video o GIF de ITA en el repositorio (`*.mp4`, `*.webm`, `*.gif`, `*.mov`, fuera de `node_modules`): no hay ninguno. Las grabaciones de `../.capturas-tmp/` son de otros temas (placas, código, Laboratorio), no del sitio de ITA.
- No se creó ningún archivo de T2 y no se tocó el código. El único cambio de este commit es esta bitácora.
- Comprobantes base sobre el estado actual (igual que tras T1):
  - `npm run lint`: código 0.
  - `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL.
  - `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 0 errores.
- No hay captura antes/después de `/casos/ita-2026` porque la página no cambió.

T2 · 2026-11-20 · hecho · ficha `contenido/proyectos/ita-2026/proyecto.json` (`caso-cliente`, `publicado`) con 3 capturas, video de 12 s (`ita.mp4` 710 KB, `ita.webm` 329 KB, `ita-poster.webp`) y `diagrama.svg`; `src/config/proyectos.js`; `casos.js` reexporta desde la ficha y `/casos/ita-2026` queda idéntica. Bloqueo de T2 resuelto con la Decisión 2026-11-20.

## Detalle de T2 · segundo intento (Decisión 2026-11-20 aplicada)

### Archivos

- `contenido/proyectos/ita-2026/proyecto.json`: todo lo de `CASOS[0]`. `problema` y `hicimos` (ahora `textos.<idioma>.solucion`) son párrafos unidos con `\n\n`; `cifras`, `resultado` y `resultadoNegocio` van dentro de `textos.es`/`textos.en`; `pieza`, `cliente`, `sitio`, `permisoPersonal` (`false`), `testimonio` (`null`) y `capturasConPersonal` en el nivel superior; el `pie` de cada captura como `pie.es`/`pie.en`. `fecha` = `2026-09-10` (salida a producción, según `resultado`). `stack` = la `pila` de la pieza `ita-2026` de `piezas.js`. `categorias` = `[]`. Sin `marcasAjenas`: ITA es el cliente, no una marca ajena usada en una demo (R0.6).
- `contenido/proyectos/ita-2026/medios/`: `problema-escritorio.jpg`, `beneficios-escritorio.jpg`, `experiencia-movil.jpg` (copias de `public/casos/ita/`), `ita.mp4`, `ita.webm`, `ita-poster.webp`, `diagrama.svg`.
- `capturasConPersonal`: solo sus datos en la ficha, con `src: medios/<archivo>`. Los tres `.jpg` siguen en `pendientes/casos/ita/` y no se copiaron, para que ningún glob los publique sin permiso. El validador no comprueba esas rutas porque el esquema no tiene ese campo.
- `pendientes/LEEME.md`: los pasos para cuando llegue el permiso ahora apuntan a `public/casos/ita/` + `medios/` y a `proyecto.json`.
- `src/config/proyectos.js`: `proyectosPublicados()`, `porTipo(tipo)`, `buscarProyecto(slug)`, `categorias()`, `stacks()` sobre `import.meta.glob('/contenido/proyectos/*/proyecto.json', { eager: true, import: 'default' })`. Solo devuelve fichas `publicado`, de la más reciente a la más antigua.
- `src/config/casos.js`: `CASOS = porTipo('caso-cliente')` convertido a la forma anterior (textos en español, párrafos separados de nuevo). Las imágenes se sirven desde `public/casos/ita/` (tabla `PUBLICO`), como proponía el primer intento; el mecanismo general para servir `medios/` queda para T6/T11. `buscarCaso` y `capturasDe` no cambian de firma.
- `diagrama.svg`: sitio estático → formulario → correo de ITA, 720 × 160, `fill`/`stroke` solo con clases que usan `var(--ay-superficie)`, `var(--ay-borde-fuerte)`, `var(--ay-acento)`, `var(--ay-texto)`, `var(--ay-texto-suave)`. Lleva `role="img"`, `<title>` y `<desc>` en es/en. Las variables solo se resuelven si el SVG va en línea dentro de la página; cargado con `<img>` no hereda los tokens. Lo decide T6 al pintarlo.

### Video

Hecho solo con las 3 capturas reales publicables (no hay una cuarta sin personal). Las tres se apilan en vertical (las dos de escritorio a 1280 × 800; la móvil a 592 × 1280, centrada sobre Grafito `0x0E1217`, el `--ay-lienzo` oscuro) y una ventana de 1280 × 720 recorre la tira: 1 s quieta arriba, 10 s de desplazamiento lineal a 216 px/s, 1 s quieta abajo. 12 s, 30 fps, sin audio. `duracionSeg: 12`. El póster es el primer cuadro: la primera captura escalada a 1280 de ancho y recortada a 720 de alto.

Resultado (ffprobe): `ita.mp4` H.264 High 1280 × 720, 12,0 s, 726 804 bytes (≤ 2 MB), `faststart`; `ita.webm` VP9 1280 × 720, 12,0 s, 337 159 bytes; `ita-poster.webp` 45 620 bytes.

Comandos exactos, desde `contenido/proyectos/ita-2026/medios/` (PowerShell o bash; para otro caso basta cambiar los tres nombres y, si la altura de la tira cambia, el `2160` = alto total − 720 y el `216` = `2160 / 10`):

```bash
ffmpeg -y -loop 1 -framerate 30 -t 12 -i problema-escritorio.jpg -loop 1 -framerate 30 -t 12 -i beneficios-escritorio.jpg -loop 1 -framerate 30 -t 12 -i experiencia-movil.jpg -filter_complex "[0]scale=1280:800,setsar=1[a];[1]scale=1280:800,setsar=1[b];[2]scale=-2:1280,pad=1280:1280:(ow-iw)/2:0:color=0x0E1217,setsar=1[c];[a][b][c]vstack=inputs=3,crop=1280:720:0:'min(max(0,t-1)*216,2160)',format=yuv420p[v]" -map "[v]" -an -c:v libx264 -preset slow -crf 26 -profile:v high -movflags +faststart ita.mp4

ffmpeg -y -loop 1 -framerate 30 -t 12 -i problema-escritorio.jpg -loop 1 -framerate 30 -t 12 -i beneficios-escritorio.jpg -loop 1 -framerate 30 -t 12 -i experiencia-movil.jpg -filter_complex "[0]scale=1280:800,setsar=1[a];[1]scale=1280:800,setsar=1[b];[2]scale=-2:1280,pad=1280:1280:(ow-iw)/2:0:color=0x0E1217,setsar=1[c];[a][b][c]vstack=inputs=3,crop=1280:720:0:'min(max(0,t-1)*216,2160)',format=yuv420p[v]" -map "[v]" -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 ita.webm

ffmpeg -y -i problema-escritorio.jpg -vf "scale=1280:800,crop=1280:720:0:0" -c:v libwebp -quality 80 ita-poster.webp
```

ffmpeg usado: `2025-12-28-git-9ab2a437a1-full_build-www.gyan.dev`.

### Textos en inglés · para revisión

`src/i18n.js` no tiene el contenido de ITA en inglés (solo `enlaces.caso` = «Case: ITA website»). Todo `textos.en`, los `alt.en` y los `pie.en` de `proyecto.json` (6 capturas) los escribió Kiro y **necesitan revisión**. Los titulares del sitio de ITA citados en los `alt` se dejaron en español porque así aparecen en la captura. Las líneas `detalle` de `diagrama.svg` están en inglés técnico corto (`static site · es · en`, `form · server`, `email · Resend`) y su `<title>`/`<desc>` en ambos idiomas; también para revisión.

### Comprobantes

- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run lint`: código 0, sin avisos.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL. Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 75 archivos.
- `/casos/ita-2026` antes/después, servido con `vite preview` (puerto 4173) y capturado con Chrome sin interfaz:
  - HTML prerenderizado `dist/casos/ita-2026/index.html`: idéntico al de antes salvo los hashes de `/assets/`.
  - Captura de escritorio 1440 × 5200: SHA-256 `EA6EC4335A9B6ACF…` antes y después, el mismo archivo byte a byte.
  - Captura de móvil 390 × 9000: SHA-256 `DE357984B4DD9DD5…` antes y después, el mismo archivo byte a byte.
  - Las capturas se tomaron en `%TEMP%` y se borraron al terminar; no van en el commit.
- Fuera del commit, como en T1: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T3 · 2026-11-20 · hecho · `scripts/importar-proyecto.mjs`, script `importar-proyecto` en `package.json` y `sharp` 0.35.5 como devDependency. Una ficha de prueba importada desde `%TEMP%` quedó válida y se borró.

## Detalle de T3

### Qué hace

`npm run importar-proyecto -- <ruta-al-repo>` lee `<repo>/ayemi/proyecto.json` y los archivos de `<repo>/ayemi/medios/`, y deja la ficha en `contenido/proyectos/<slug>/`, con el `slug` que trae la propia ficha.

- Los PNG y JPG (`.png`, `.jpg`, `.jpeg`) se convierten a WebP (calidad 80) con el lado mayor ≤ 1600 px, sin agrandar las que ya son menores y respetando la orientación EXIF. No se copia el original.
- La ficha se reescribe para apuntar al `.webp`. Si el objeto de la imagen lleva `ancho`/`alto`, se actualizan a las medidas nuevas.
- El resto de archivos de `medios/` (mp4, webm, svg, gif, webp…) se copia tal cual.
- Todo se prepara en una carpeta temporal y se valida con `scripts/validar-proyectos.mjs` sobre esa carpeta. Solo si la ficha es válida se copia a `contenido/proyectos/`. Si no, se muestran los «<slug>: falta <campo>» del validador, no se importa nada y el código es 1. La carpeta temporal se borra siempre.

### Puntos que T3 no especificaba

Se resolvieron con la opción más conservadora; ninguno cambia el contrato y cada uno se cambia sin tocar la interfaz del comando:

- **La ficha ya existe.** Si `contenido/proyectos/<slug>/` existe, el importador se detiene con código 1 y no sobrescribe nada (las reglas prohíben borrar archivos no nombrados). Para reimportar hay que quitar antes la carpeta a mano.
- **Lado de 1600 px.** «≤ 1600 px» se aplicó al lado mayor, para que también las capturas verticales de teléfono queden acotadas.
- **Slug.** Se comprueba con el patrón del esquema antes de usarlo como nombre de carpeta, para que una ficha no pueda escribir fuera de `contenido/proyectos/`.
- **Subcarpetas de `medios/`.** Solo se copian los archivos del primer nivel (`medios/*`, como dice la tarea).
- **Choque de nombres.** Si `foto.png` se convertiría en un `foto.webp` que ya existe, o dos imágenes darían el mismo `.webp`, el importador se detiene.

### Comprobantes

- `npm run lint`: código 0. ESLint solo revisa `*.{js,jsx}`; los `.mjs` de `scripts/` quedan fuera, igual que `validar-proyectos.mjs` en T1.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 76 archivos.
- Repo de prueba en `%TEMP%\ayemi-repo-prueba` con una ficha `laboratorio` `publicado` (guardada con BOM), un JPG de 1440 × 900, un PNG de 2400 × 1500, `ita.mp4`, `ita-poster.webp` y `diagrama.svg`:
  - Importación: código 0, «5 archivo(s) de medios, 2 convertido(s) a WebP». La ficha quedó con `medios/captura.webp` 1440 × 900 y `medios/grande.webp` 1600 × 1000, y `npm run validar` dio «Fichas de proyecto válidas: 2.».
  - Segunda importación del mismo repo: código 1, «ya existe contenido/proyectos/prueba-importador/».
  - La misma ficha sin `demo`: código 1, «prueba-importador: falta demo», y no se creó la carpeta.
  - Se borraron `contenido/proyectos/prueba-importador/` y el repo de prueba; no quedan carpetas `ayemi-importar-*` en `%TEMP%`.
- `npm install -D sharp` avisa de vulnerabilidades en dependencias que ya estaban; `npm audit fix` no se corrió porque cambiaría paquetes que T3 no nombra.
- Fuera del commit, como en T1 y T2: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

## Bloqueos

Ninguno en T1. Ninguno en T3 (los puntos sin especificar están en «Detalle de T3»).

### T2 · ficha `publicado` sin video ni GIF · RESUELTO

**Resuelto el 2026-11-20** con la Decisión 2026-11-20 de `tasks.md` (T2): el esquema no se relaja y ITA lleva un video hecho solo con sus capturas reales. Aplicado en el segundo intento de T2 (ver «Detalle de T2 · segundo intento»).

T2 pide `estado: publicado` y nombra como medios solo las capturas y `diagrama.svg`. El esquema que fijó T1 (R1.3) exige `video` o `gif` en toda ficha `publicado`, y el validador detiene `npm run build` si faltan. ITA no tiene video ni GIF. T4 («si no hay ninguno, rota capturas de ITA») y R5.2 («un bloque sin datos no se pinta») sugieren que el caso sin video estaba previsto, pero el esquema no lo admite.

Las salidas posibles cambian el contrato o el contenido, así que las decide el arquitecto:

1. Relajar el esquema para `caso-cliente`, de modo que `video`/`gif` solo sea obligatorio en `laboratorio`. Toca `proyecto.schema.json` (T1).
2. Grabar un video o GIF real de soluciones-ita.com y añadirlo a `medios/`. Hace falta saber quién lo graba y con qué contenido: las capturas con personal siguen sin permiso.
3. Dejar la ficha en `en-construccion`. Así no se muestra (R0.5), y `/casos/ita-2026` dejaría de existir al terminar la migración.

### T2 · puntos sin especificar que también hacen falta para reanudar · RESUELTOS

**Resueltos el 2026-11-20.** La Decisión 2026-11-20 no los nombra; como ninguno bloqueaba por sí solo, el segundo intento aplicó la propuesta escrita para cada uno (detalle en «Detalle de T2 · segundo intento»). Si el arquitecto prefiere otra salida, se cambia sin tocar la API de `proyectos.js`. El de los medios sigue abierto para T6/T11.

Ninguno bloquea por sí solo, pero cada uno obliga a decidir algo:

- **Cómo llegan al navegador los archivos de `medios/`.** El validador exige rutas relativas a la carpeta de la ficha, y `design.md` no dice cómo se sirven. Importarlos con `import.meta.glob(..., { query: '?url' })` da una URL en el build del cliente (`/assets/…-hash.jpg`) y otra en el prerender (que usa el servidor de desarrollo, `/contenido/…`). El HTML estático quedaría con imágenes rotas y la hidratación no coincidiría. Propuesta mínima para T2: `casos.js` sigue sirviendo las copias que ya están en `public/casos/ita/`, y el mecanismo general se decide en T6/T11.
- **`capturasConPersonal`.** Esas tres capturas viven en `pendientes/casos/ita/`, fuera de `public/`, a la espera del permiso de ITA. Si se copian a `medios/` y un glob las incluye, saldrían publicadas. Propuesta: guardar solo sus datos en la ficha (campo extra, con `permisoPersonal: false`) sin copiar los archivos, y cambiar el paso 2 de `pendientes/LEEME.md` para que apunte a `proyecto.json`.
- **`categorias` de ITA.** Ninguna de las cinco (`tiendas`, `pagos`, `ia`, `integraciones`, `hardware`) está asignada a ITA en la especificación. Propuesta: `[]` hasta que se decida.
- **Campos sin sitio en el esquema.** `problema` y `solucion` son cadenas, pero en `casos.js` son listas (2 párrafos y 5 puntos). `cifras`, `resultado`, `resultadoNegocio`, `testimonio`, `cliente`, `sitio`, `pieza` y el `pie` de cada captura no existen en el esquema. Como el esquema no usa `additionalProperties: false`, propuesta: párrafos unidos con `\n\n`, los textos que dependen del idioma dentro de `textos.es`/`textos.en` y el resto en el nivel superior.
- **Textos en inglés.** `src/i18n.js` no tiene la traducción del contenido de ITA, solo los rótulos de la página (`caso.*`) y la tarjeta de `/enlaces`. El bloque `en` habrá que escribirlo completo y quedará marcado aquí para revisión, como pide T2.
