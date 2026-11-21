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

T4 · 2026-11-20 · hecho · `HeroProyectos.jsx` sustituye al hero en la portada con el video de ITA (única ficha publicada con video), «Ver proyectos» → `/proyectos` y «Cuéntanos tu idea» → WhatsApp; `VideoProyecto.jsx` con `preload="none"`, reproducción al entrar en pantalla y póster con movimiento reducido; Emi sigue en su sitio.

## Detalle de T4

### Archivos

- `src/features/hero/HeroProyectos.jsx` (nuevo): etiqueta, `h1` y descripción iguales que antes. Columna derecha: `BienvenidaEmi` arriba, igual que en `Hero.jsx`, y debajo los medios.
  - Con fichas publicadas que tengan `video`: rotan sus videos (al terminar uno empieza el siguiente; con uno solo, `loop`). Pie con `textos.<idioma>.titulo` de la ficha.
  - Sin ninguno: rotan con fundido de 400 ms (`duration-lenta`), cada 5 s, las capturas de ITA y las vistas perspectiva/superior/inferior de las placas con ficha de `PLACAS` (`public/pcb/*`), con el `alt` de `/pcb`. Con movimiento reducido, solo la primera captura, quieta. Hoy esta rama no se ve porque ITA tiene video.
- `src/features/proyectos/VideoProyecto.jsx` (nuevo): `<video muted playsInline loop preload="none" poster>` con `webm` y `mp4`; `IntersectionObserver` (25 %) reproduce al entrar y pausa al salir. Con `prefers-reduced-motion: reduce` pinta `<img>` con el póster. Props `controles` (para T6) y `diferido`.
- `src/hooks/useMovimientoReducido.js` (nuevo): `useSyncExternalStore` sobre la media query; en el prerender vale `false`, así que no hay desajuste de hidratación. Va en un archivo aparte porque ESLint (`react-refresh/only-export-components`) no deja exportarlo junto al componente.
- `src/config/proyectos.js`: nueva `urlMedio(proyecto, ruta)`, con la misma tabla `PUBLICO` que `casos.js` (`ita-2026` → `/casos/ita`).
- `public/casos/ita/`: copias de `ita.mp4`, `ita.webm` e `ita-poster.webp` de `medios/`, el mismo mecanismo provisional que T2 usó con las capturas.
- `src/pages/Inicio.jsx`: usa `HeroProyectos`. `src/features/hero/Hero.jsx` queda sin uso y no se borra, porque T4 no lo nombra.
- `src/i18n.js` (es/en): `hero.botonPrimario` = «Ver proyectos» / «See projects»; `hero.botonSecundario` = «Cuéntanos tu idea» / «Tell us your idea»; nuevas `hero.pausarCapturas`, `hero.reanudarCapturas`, `video.pausar`, `video.reproducir`.
- `src/pages/Casos.jsx` y `src/pages/Laboratorio.jsx`: sus botones de cierre leían `hero.botonPrimario`; ahora leen `hero.botonSecundario` para seguir diciendo «Cuéntanos tu idea» → `/#contacto`. Sin este cambio dirían «Ver proyectos» y llevarían al contacto.

### Puntos que T4 no especificaba

Se resolvieron con la opción más conservadora. Ninguno cambia el contrato, y cada uno se puede cambiar sin tocar la API de los componentes:

- **Texto del mensaje de WhatsApp.** «Mismo texto que hoy usa el botón» se leyó como la etiqueta: «Cuéntanos tu idea» era el texto del botón primario actual, que hoy lleva a `/#contacto` sin mensaje de WhatsApp. Para el «tema idea» se reutiliza el mensaje de `/enlaces` con su tema «Otra idea» / «Another idea»: «Hola, Ayemi. Quiero platicar de: Otra idea.» No se escribió copia nueva. `medicion.js` le añade el origen UTM y lo cuenta como `clic_whatsapp`, sin cambios. **Para revisión**: si se prefiere otro texto, basta una clave nueva en i18n.
- **Panel «Qué recibes».** Salió del hero porque T4 solo pide conservar etiqueta, título y descripción, y T9 reutiliza `hero.pruebas.llaves*` en «Entrega con llaves». Los textos siguen en i18n.
- **Pausa.** El video (12 s en bucle) y la rotación se mueven solos más de 5 s, así que WCAG 2.2.2 pide poder detenerlos. Cada uno lleva un botón terciario de texto («Pausar el video» / «Reproducir el video»). No se añadió ningún icono, porque eso necesita aprobación de la dirección de marca.
- **Orden de fuentes.** Primero `webm`, después `mp4`. En el Chrome sin interfaz de esta máquina, la decodificación VP9 por hardware dio `PIPELINE_ERROR_DECODE`. Con `--disable-accelerated-video-decode` el mismo `ita.webm` se reproduce, y `ffmpeg -v error -i ita.webm -f null -` lo decodifica sin errores, así que el fallo es del entorno y no del archivo. Si aparece en navegadores reales, basta poner `mp4` primero.
- **`/proyectos`** todavía no existe (llega en T5/T7). Hasta entonces «Ver proyectos» acaba en la ruta de «no encontrado».

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL. Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, que ya estaban antes de T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 79 archivos.
- `dist/index.html`: el `<video … poster="/casos/ita/ita-poster.webp" muted playsInline loop preload="none" aria-label="…">` y el enlace `wa.me/…?text=Hola%2C%20Ayemi.%20Quiero%20platicar%20de%3A%20Otra%20idea.` están en el HTML prerenderizado.
- Navegador: `vite preview` y Chrome sin interfaz por CDP, con `Emulation.setEmulatedMedia` (la misma emulación de DevTools → Rendering → `prefers-reduced-motion`). Cero errores y cero avisos en consola:
  - 390 × 844 y 1440 × 900, sin preferencia: hay `<video>`, `muted`, `currentSrc` `/casos/ita/ita.webm`, y avanza (2,54 s → 5,60 s en 3 s) con decodificación por software. Botones: «Ver proyectos → /proyectos», «Cuéntanos tu idea (abre en una pestaña nueva) → wa.me…», «Pausar el video».
  - 390 × 844 y 1440 × 900, `prefers-reduced-motion: reduce`: no hay `<video>`. Se ve `<img src="/casos/ita/ita-poster.webp">` con el título de la ficha como `alt` (350 px de ancho en móvil) y no hay botón de pausa.
  - 390 px: `scrollWidth` = 390 y ningún elemento del hero sale de la pantalla. Fuera del hero sí se salen botones de carruseles con desplazamiento horizontal que ya existían; la página no se desborda.
  - Las capturas y el script de prueba quedaron en `%TEMP%` y se borraron.
- Fuera del commit, como en T1–T3: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T5 · 2026-11-20 · hecho · `src/pages/Proyectos.jsx`, `src/features/proyectos/TarjetaProyecto.jsx` y `FiltrosProyectos.jsx`: galería con los grupos `#casos` y `#laboratorio` (hoy solo se pinta `#casos`, con ITA), filtros en `?tipo=&stack=` con comas, contador «N proyectos» en `aria-live` y estado vacío con Emi y «Quitar filtros». La ruta `/proyectos` se registra en T7.

## Detalle de T5

### Archivos

- `src/pages/Proyectos.jsx` (nuevo): `Seccion` de nivel 1 (h1), filtros, contador y un `<section id="casos">` / `<section id="laboratorio">` por grupo, cada uno con su h2 y una cuadrícula de 2 columnas desde `md`. Un grupo sin fichas, o sin ninguna que pase los filtros, no se pinta. Si ninguno queda, `EstadoConEmi estado="vacio"` con el botón secundario «Quitar filtros», que deja la URL en `/proyectos`.
- `src/features/proyectos/FiltrosProyectos.jsx` (nuevo): dos grupos (`role="group"` con su etiqueta) de `<button aria-pressed>`, dentro de `role="search"`. El botón activo lleva `IconoComprobacion` a 16 px además del borde de acento (§5.5, independencia del color). Un grupo sin opciones no se pinta.
- `src/features/proyectos/TarjetaProyecto.jsx` (nuevo): primera imagen de la ficha en 16:10 (`object-cover`, con `width`/`height` y `loading="lazy"`), etiqueta «PROYECTO DEMOSTRATIVO» si `laboratorio`, título h3, resumen y chips de stack con el mismo estilo que la pila de `Caso.jsx`. El enlace está en el título y cubre la tarjeta con un pseudoelemento, para que su nombre accesible sea solo el título. Destino: `/casos/<slug>` para `caso-cliente` y `/proyectos/<slug>` para `laboratorio` (design.md, «Rutas»).
- `src/config/proyectos.js`: nueva `slugDeStack(nombre)` («Next.js» → `nextjs`, «Tailwind CSS» → `tailwind-css`).
- `src/config/secciones.js`: nueva constante `RUTA_PROYECTOS = '/proyectos'`.
- `src/i18n.js` (es/en): bloque `proyectos.*` (etiqueta, h1, entradilla, filtros, las cinco categorías, contador en singular y plural, nombres de los grupos, etiqueta de demo, estado vacío y «Quitar filtros»).

### Puntos que T5 no especificaba

Se resolvieron con la opción más conservadora. Ninguno cambia el contrato, y cada uno se cambia sin tocar la API de los componentes:

- **Ruta.** T5 no la nombra y T7 registra en `App.jsx` las rutas de design.md con `lazy()`, así que `App.jsx` no se tocó. Hasta T7, `/proyectos` sigue en «no encontrado». Para las pruebas de navegador se añadió una ruta temporal que se quitó antes del commit.
- **Qué categorías se ofrecen.** Solo las que usa al menos una ficha publicada (`categorias()` de design.md), en el orden del esquema. R4.2 dice «las cinco categorías», pero ofrecer filtros que siempre dan cero resultados choca con R0.5. Como ITA tiene `categorias: []`, hoy no se pinta el grupo «Tipo», solo «Stack» (7 tecnologías). **Para revisión.**
- **Cómo se combinan.** Dentro de un grupo, varios valores se suman (basta con que la ficha tenga uno). Entre grupos, la ficha debe cumplir los dos.
- **Valores en la URL.** `stack` usa `slugDeStack` del nombre de la ficha, porque el ejemplo de R4.2 (`stack=nextjs`) no es el nombre tal cual. Las comas se escriben literales (`?stack=react,vite`), no `%2C`. Un valor que ninguna ficha usa no se descarta: cuenta como filtro, así que un enlace viejo como `?tipo=pagos` lleva al estado vacío con «Quitar filtros» en vez de enseñar resultados que no pidió.
- **Historial.** Cada cambio de filtro reemplaza la entrada del historial (`replace`) y conserva el ancla, para que «atrás» salga de la galería y no deshaga los filtros uno a uno.
- **«Expresión neutral» de Emi.** El catálogo de `EstadoConEmi` no tiene una expresión «neutral»; se usó el estado `vacio` (expresión `vacio`, pose `flotando`), el que el §7 asigna a los estados vacíos.
- **Textos nuevos.** T5 solo fija «Casos de clientes», «Proyectos del Laboratorio», «Proyecto demostrativo» y «Quitar filtros». El resto lo escribió Kiro y **necesita revisión**: etiqueta `PROYECTOS`; h1 «Proyectos que puedes **ver funcionando**.»; entradilla «Trabajo real, con capturas y video de lo que hace. Cada proyecto dice si se hizo para un cliente o si es un proyecto demostrativo de Ayemi.»; etiquetas de filtro `TIPO` / `STACK`; categorías Tiendas, Pagos, IA, Integraciones, Hardware; vacío «Ningún proyecto coincide con estos filtros. Quita alguno para ver más proyectos.» Todo el bloque `en` (Client cases, Lab projects, DEMO PROJECT, Clear filters, etc.) también es de Kiro.
- **Etiqueta de demo.** Va en caja alta con `.ay-etiqueta` («PROYECTO DEMOSTRATIVO», dos palabras), como las etiquetas de `Casos.jsx`. T6 pone la versión larga, «Proyecto demostrativo de Ayemi», arriba de la página de la demo.
- **Cierre de la página.** T5 no pide botón primario ni cierre con WhatsApp, así que la galería no lleva ninguno.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL (T11 añade `/proyectos`).
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 82 archivos.
- Navegador: `vite preview` con la ruta temporal y Chrome sin interfaz por CDP, a 1440 × 900 y 390 × 844, con teclas reales (`Input.dispatchKeyEvent`). Cero errores y cero avisos en consola:
  - Carga: un h1, un h2 «Casos de clientes» en `#casos`, sin `#laboratorio` (no hay demos publicadas), 1 tarjeta → `/casos/ita-2026`, contador «1 proyecto» con `aria-live="polite"`.
  - Teclado: Tab llega al primer filtro (10 pulsaciones en escritorio, 6 en móvil). Enter sobre «React» → `aria-pressed="true"` y URL `/proyectos?stack=react`. Tab + Espacio sobre «Vite» → `?stack=react,vite`. Dos Tab más llegan a «react-router» y Espacio lo suma: `?stack=react,vite,react-router`. Espacio sobre «React» activo lo quita: `?stack=vite,react-router`.
  - `?tipo=pagos&stack=react`: sin h2 ni tarjetas, Emi visible, contador «0 proyectos». Enter sobre «Quitar filtros» deja `/proyectos`, todos los filtros en `false` y el contador en «1 proyecto». El contador solo cambia de texto, y por tanto solo se anuncia, cuando cambia el número; con una sola ficha eso pasa al ir y volver de 0.
  - `/proyectos#casos`: el grupo queda a 64 px del borde superior, bajo la cabecera fija.
  - 390 px: `scrollWidth` = 390 y ningún elemento de la página sale de la pantalla.
  - Inglés (botón «Cambiar idioma»): «Projects you can see working.», «Client cases», «1 project»; con `?tipo=pagos`, «0 projects» y «Clear filters».
  - El script de prueba, el perfil de Chrome y la copia de `App.jsx` quedaron en `%TEMP%` y se borraron.
- Fuera del commit, como en T1–T4: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T6 · 2026-11-20 · bloqueado · sin cambios de código: R5 fija el rótulo «La solución» para el bloque 2 y el manual (§1.11, `ayemi-voz`, R0.1) retira «solución» del léxico (ver Bloqueos). Junto al bloqueo quedan anotados los puntos de T6 que la tarea no especifica, cada uno con su propuesta.

## Detalle de T6

- Se leyeron `requirements.md`, `design.md`, las reglas de `tasks.md`, `src/pages/{Caso,CasoOFicha}.jsx`, `src/config/{casos,proyectos,secciones,sitio}.js`, `src/medicion/medicion.js`, `prerender.mjs`, `vercel.json`, `nginx.conf`, la ficha de ITA, su `diagrama.svg` y el esquema.
- Se empezó por la parte de medios de la Decisión 2026-11-20 (`scripts/copiar-medios.mjs`, `dev` y `build` en `package.json`, `public/proyectos/` en `.gitignore`, `urlMedio(slug, ruta)` y sus llamadas en `casos.js`, `TarjetaProyecto.jsx` y `HeroProyectos.jsx`). Al redactar los rótulos de R5 apareció el choque con el manual y, siguiendo las reglas, **se deshicieron todos esos cambios**, se borraron `scripts/copiar-medios.mjs` y `public/proyectos/`, y el árbol quedó como tras T5. El único cambio de este commit es esta bitácora.
- `python .ayemi/verificar.py` no detecta el choque: el léxico de §1.11 solo se revisa en `.md`, `.mdx` y `.txt`, como aviso. En `src/i18n.js` el rótulo habría pasado los comprobantes sin que nadie lo viera; por eso se para aquí y no se deja a la revisión.
- Comprobantes sobre el estado actual (igual que tras T5):
  - `npm run lint`: código 0.
  - `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
  - `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL.
  - `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 82 archivos.
  - Navegador: `vite preview` (puerto 4173) y Chrome sin interfaz a 1440 px y 390 px. `/casos/ita-2026` responde 200 y se ve como tras T5: etiqueta, h1, aviso de marca independiente, El problema, Qué hicimos, Resultado con sus 4 cifras, Capturas, Pila técnica y cierre con «Hablemos de tu caso». No hay captura antes/después porque la página no cambió. Las capturas y el perfil de Chrome quedaron en `%TEMP%` y se borraron.
- Fuera del commit, como en T1–T5: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T6 · 2026-11-20 · hecho · `src/pages/PaginaProyecto.jsx` con el orden de R5 (El problema · Qué hicimos · Pruébalo · Cómo está hecho · Lo que entregaríamos · ¿Lo quieres para tu negocio?) y `BloquePruebalo`, `DiagramaYStack`, `EntregaConLlaves`, `CierreWhatsapp`; `CasoOFicha` pinta `PaginaProyecto` para los casos de clientes; `scripts/copiar-medios.mjs` + `urlMedio(slug, ruta)` sirven los medios desde `/proyectos/<slug>/`. Bloqueos de T6 resueltos con las Decisiones 2026-11-20 (medios y bloqueos de T6).

## Detalle de T6 · segundo intento (Decisiones 2026-11-20 aplicadas)

### Archivos

- `scripts/copiar-medios.mjs` (nuevo): copia el primer nivel de `contenido/proyectos/<slug>/medios/` a `public/proyectos/<slug>/`, solo de fichas `publicado`. Quita el BOM antes de leer la ficha y se detiene (código 1) si el `slug` no cumple el patrón del esquema. No borra nada de `public/proyectos/`.
- `package.json`: `dev` = `node scripts/copiar-medios.mjs && vite --host`; `build` = `node scripts/validar-proyectos.mjs && node scripts/copiar-medios.mjs && vite build && node prerender.mjs`.
- `.gitignore`: `public/proyectos/` (comprobado con `git check-ignore`).
- `src/config/proyectos.js`: `urlMedio(slug, ruta)` → `/proyectos/<slug>/<archivo>`, la única que compone esas URL; se quitó la tabla `PUBLICO`. `diagramaDe(proyecto)`: el SVG por `import.meta.glob('/contenido/proyectos/*/medios/*.svg', { query: '?raw' })`, saneado (sin `<script>`, `<foreignObject>`, atributos `on…`, `href` con `javascript:` ni declaración XML). `mensajeDeProyecto(proyecto, idioma)` (design.md), con el dominio de `SITIO.url`.
- `src/config/casos.js`: sin tabla `PUBLICO`; las capturas salen de `urlMedio`. Ya no usa `public/casos/ita/` (la carpeta sigue en el repo; se retira en T13). Sigue alimentando `/casos`, `piezas.js` y el prerender.
- `src/features/hero/HeroProyectos.jsx` y `src/features/proyectos/TarjetaProyecto.jsx`: llaman a `urlMedio(proyecto.slug, …)`.
- `src/medicion/medicion.js`: nueva `fijarUtmContenido(slug)`; escribe `utm_content` en `sessionStorage['ayemi:utm']` solo si no había uno. Los `EVENTOS` y el resto no cambian. Efecto aceptado: desde ese momento `conOrigenWhatsapp` añade «Origen: ita-2026» y `rastrear` manda ese `utm_content`.
- `src/pages/PaginaProyecto.jsx` (nuevo): cabecera (etiqueta «Proyecto demostrativo de Ayemi» si `laboratorio`, o «CASO · <cliente>»; h1; «Ayemi no tiene relación con <marca>» por cada `marcasAjenas`; enlace al `sitio`; aviso de marca independiente del `cliente`). Bloque 2 «Qué hicimos»: texto, video con controles (`VideoProyecto controles`) o GIF, y con h3 Capturas, Resultado (cifras, `resultado`, `resultadoNegocio`) y Testimonio. Textos de la ficha en el idioma activo. Sin eventos (T8).
- `src/features/proyectos/BloquePruebalo.jsx` (nuevo): «Abrir la demo» secundario (`target="_blank"`, `rel="noopener"`), usuario y clave en `<code>` con botón «Copiar» / «Copiado» (`navigator.clipboard`, `aria-live`, icono de comprobación además del texto) y «La demo se reinicia cada …». Sin `clic_demo` (T8).
- `src/features/proyectos/DiagramaYStack.jsx` (nuevo): diagrama en línea, stack (h3 «PILA TÉCNICA») y «Ver el código» (terciario) si hay `codigo`.
- `src/features/proyectos/EntregaConLlaves.jsx` (nuevo): los tres puntos fijos más `textos.<idioma>.entregamos[]`.
- `src/features/proyectos/CierreWhatsapp.jsx` (nuevo): «¿Lo quieres para tu negocio?» y el único botón primario, «Escríbenos por WhatsApp», con `mensajeDeProyecto`.
- `src/pages/CasoOFicha.jsx`: `buscarProyecto(slug)?.tipo === 'caso-cliente'` → `PaginaProyecto`; si no, `FichaPieza`. `App.jsx` no se tocó (T7). `src/pages/Caso.jsx` queda sin uso y no se borra, porque T6 no lo nombra.
- `src/i18n.js` (es/en), dentro de `caso.*`: `demostrativo`, `sinRelacion`, `pruebalo`, `abrirDemo`, `usuarioPrueba`, `claveDePrueba`, `copiar`, `copiado`, `seReinicia`, `comoEstaHecho`, `verCodigo`, `entregariamos`, `entrega[]`, `cierreTitulo`, `cierreBoton`, `mensajeProyecto`. Los textos en español son los de la propuesta aceptada. **Para revisión, los de Kiro en inglés que la propuesta no daba:** «Open the demo», «Test user», «Test password», «Copy» / «Copied», «The demo resets every {{cada}}.», «See the code» y los tres puntos de «What we would deliver» («Code in your name: the repository and the infrastructure live in your accounts from day one.» · «Documentation: how to install it, how to run it and how another team picks it up.» · «Handover: a technical handover session and an operations document.»).

### Puntos que T6 no especificaba

Ninguno bloquea. Se resolvieron con la opción más conservadora y se cambian sin tocar la API de los componentes:

- **GIF.** Solo se pinta si la ficha no tiene `video`. Con `prefers-reduced-motion: reduce` no se pinta (un GIF no se puede pausar, §3.13 y WCAG 2.2.2); quedan las capturas. El esquema no da `ancho`/`alto` ni `alt` del GIF, así que va sin `width`/`height` (a revisar en T12) y con el título como `alt`. Hoy ninguna ficha usa GIF.
- **Diagrama en móvil.** A 390 px el SVG de 720 de ancho dejaría su texto a unos 7 px. No baja de 480 px y se desplaza dentro de su caja (`role="region"`, nombre «Cómo está hecho», `tabIndex=0` para recorrerla con el teclado); la página no se desborda. El `<style>` del SVG en línea es global: sus clases (`.caja`, `.flecha`, `.nombre`, `.detalle`) no coinciden con ninguna clase del sitio hoy.
- **`seReinicia`** es una sola cadena en el esquema, no `es`/`en`: se interpola tal cual en los dos idiomas.
- **`/proyectos/:slug`.** `PaginaProyecto` pinta cualquier ficha publicada por su slug, sin mirar si la ruta corresponde a su `tipo`. Que `/proyectos/ita-2026` no duplique `/casos/ita-2026` se decide al registrar las rutas en T7.
- **`pendientes/LEEME.md`** sigue diciendo que las capturas con personal se copian a `public/casos/ita/` y a `medios/`. Desde T6 basta con `medios/`; no se cambió porque T6 no lo nombra y `public/casos/ita/` se retira en T13.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0. «Medios copiados a public/proyectos/: 7 archivo(s) de 1 ficha(s).», «Prerenderizado completo.», sitemap con 9 URL. Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1. `dist/proyectos/ita-2026/` tiene los 7 archivos y `dist/casos/ita-2026/index.html` ya trae el SVG en línea y todas las URL en `/proyectos/ita-2026/`.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 88 archivos. En la primera pasada dio 1 error falso («`<img>` sin atributo alt») por un comentario de `proyectos.js` que decía «cargado con `<img>`»; se reescribió el comentario.
- Navegador: `vite preview` (puerto 4173) y Chrome sin interfaz por CDP en `/casos/ita-2026/`, a 1440 × 900 y 390 × 844, con y sin `prefers-reduced-motion: reduce`. Cero errores y cero avisos en consola:
  - Un h1; h2 en este orden: El problema · Qué hicimos · Cómo está hecho · Lo que entregaríamos · ¿Lo quieres para tu negocio?; h3: Capturas · Resultado · PILA TÉCNICA. Sin «Pruébalo» (ITA es `caso-cliente`) ni avisos de marca ajena (no tiene `marcasAjenas`). Etiqueta «CASO · ITA», enlace a `soluciones-ita.com` y aviso «ITA es una marca independiente».
  - Video: `currentSrc` `/proyectos/ita-2026/ita.webm`, con controles, sin sonido, y avanza (≈ 2,9 s a los 3 s). Con movimiento reducido: sin `<video>`, póster `/proyectos/ita-2026/ita-poster.webp`.
  - Las 3 capturas cargan desde `/proyectos/ita-2026/` con `width`/`height`. El diagrama sale en línea y sigue el tema: `.caja` con `fill` `rgb(26, 29, 33)` en oscuro y `rgb(255, 255, 255)` en claro.
  - Un solo botón primario: «Escríbenos por WhatsApp», con «Hola, vi «Un sitio que explica la rectificación industrial de ITA en dos idiomas» en ayemi.org y quiero algo así para mi negocio.». `sessionStorage['ayemi:utm']` = `{"utm_content":"ita-2026"}`.
  - 390 px: `scrollWidth` = 390 y ningún elemento de la página sale de la pantalla (el diagrama se desplaza dentro de su región: 512 px de contenido en 348 px).
  - Inglés: h1 y h2 en inglés («The problem», «What we did», «How it is built», «What we would deliver», «Want it for your business?»), `alt` en inglés y mensaje de WhatsApp en inglés.
  - `/casos/no-existe` → «Esta página no está.».
  - Las capturas de pantalla completas de escritorio y móvil se revisaron a ojo: sin solapes ni huecos. Se tomaron en `%TEMP%` y se borraron, igual que el script de prueba (estaba en la raíz del repo, fuera del commit) y el perfil de Chrome.
  - Aviso del entorno de prueba: `vite preview` sirve `dist/index.html` (la portada) para las URL sin barra final como `/casos/ita-2026`, y React da el error #418 de hidratación al montar otra página sobre ese HTML. Pasa igual en `/casos` y `/pcb`, que T6 no toca. Con barra final, que sirve el HTML prerenderizado como hacen Vercel y nginx, no hay errores. No se cambió nada por esto.
- Fuera del commit, como en T1–T5: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T7 · 2026-11-20 · hecho · `App.jsx` registra `/proyectos` y `/proyectos/:slug` y carga en diferido (`lazy()` + `Suspense`) las cuatro páginas de design.md; `/casos` y `/portafolio` llevan a `/proyectos#casos`; «Proyectos» sustituye a «Casos» en la cabecera y el pie (es/en) y va primero; `vercel.json` y `nginx.conf` con las 301 nuevas (en nginx no había ninguna y se añadieron todas), comprobadas en un contenedor `nginx:1.27-alpine`.

## Detalle de T7

### Archivos

- `src/App.jsx`: `Inicio`, `Proyectos`, `DemoOCaso` y `CasoOFicha` con `lazy()`, dentro de un único `<Suspense fallback={null}>` alrededor de `<Routes>`. Rutas nuevas `/proyectos` y `/proyectos/:slug`. `/casos` y `/portafolio` pasan de pintar `Casos` / ir a `/casos` a `<Navigate to="/proyectos#casos" replace />`. El resto de rutas no cambia (`/p/:corto` intacta).
- `src/pages/DemoOCaso.jsx` (nuevo): página de `/proyectos/:slug`. Si el slug es un `caso-cliente`, `<Navigate replace>` a `/casos/<slug>`; si no, `PaginaProyecto` (que da «no encontrada» si no hay ficha publicada). Resuelve el punto que T6 dejó para T7: `/proyectos/ita-2026` ya no duplica `/casos/ita-2026`.
- `src/config/secciones.js`: `NAVEGACION` = Proyectos · Qué construimos · Cómo trabajamos · Laboratorio · Contacto (orden de design.md). La entrada `proyectos` lleva `rutas: [RUTA_CASOS]` para que quede señalada también en `/casos/<slug>`. Comentarios de rutas al día.
- `src/components/Navbar.jsx`: una entrada de tipo `ruta` también se marca como actual por sus `rutas` (antes solo las de tipo `ancla`). El pie (`Footer.jsx`) lee `NAVEGACION` y no necesitó cambios.
- `src/i18n.js`: `nav.casos` («Casos» / «Cases») pasa a `nav.proyectos` («Proyectos» / «Projects»). Nadie más usaba `nav.casos`.
- `vercel.json` y `nginx.conf`: tabla de abajo.

### Redirecciones

| Origen | Destino | Código | vercel.json | nginx.conf | En la app (`<Navigate>`) |
|---|---|---|---|---|---|
| `/casos` | `/proyectos#casos` | 301 | nueva | nueva (también `/casos/`) | nueva |
| `/portafolio`, `/piezas` | `/proyectos#casos` (antes `/casos`) | 301 | destino cambiado | nueva | `/portafolio`: destino cambiado; `/piezas` sin barra no tiene ruta en la app |
| `/portafolio/<retirado>`, `/piezas/<retirado>` (`panel-inventario-integradores`, `plataforma-contactos-whatsapp`, `tecnificacion-agricola`) | `/proyectos#casos` (antes `/casos`) | 301 | destino cambiado | nueva | sin cambio: `RedireccionPieza` lleva a `/casos/<slug>`, que da «no encontrada» (ya pasaba antes de T7) |
| `/portafolio/wabot`, `/piezas/wabot` | `/laboratorio#wabot` | 301 | sin cambio | nueva | sin cambio |
| `/portafolio/<slug>`, `/piezas/<slug>` | `/casos/<slug>` | 301 | sin cambio (el destino sigue siendo válido) | nueva | sin cambio |
| `/proyectos/<slug de caso-cliente>` | `/casos/<slug>` | — | — | — | nueva (`DemoOCaso`) |
| `/p/328`, `/p/esp32`, `/p/stm32` | `/pcb#atmega328p`, `/pcb#esp32`, `/pcb#stm32` | 302 | sin tocar | sin tocar | sin tocar |

En nginx las regex se evalúan en orden y gana la primera, así que van de lo concreto a lo general. El ancla va entre comillas porque `#` abre un comentario en nginx.

### Puntos que T7 no especificaba

Ninguno bloquea. Se resolvieron con la opción más conservadora y cada uno se cambia en una línea:

- **Destino de `/portafolio` y de los slugs retirados.** T7 dice «actualizados» sin dar el destino. Antes iban a `/casos`; ahora van directo a `/proyectos#casos`, el nuevo destino de `/casos`, para no encadenar dos 301.
- **nginx no tenía redirecciones de `/portafolio/*` ni `/piezas/*`** (solo las tenían `vercel.json` y la app). Se añadieron las mismas que en Vercel para que R3.2 se cumpla también en el contenedor.
- **Qué va con `lazy()`.** Las cuatro páginas de la tabla de rutas de design.md (`Inicio`, `Proyectos`, `PaginaProyecto` vía `DemoOCaso`, y `CasoOFicha`). Las demás páginas siguen en el paquete principal. El respaldo de `Suspense` es `null`: con HTML prerenderizado la hidratación conserva ese HTML mientras llega el trozo, y en navegación interna el trozo pesa 0,3–24 KB.
- **Enlaces internos que aún apuntan a `/casos`** («Volver a Casos» de `FichaPieza`, botones de `Casos.jsx`): T7 no los nombra y siguen funcionando por el `<Navigate>` (comprobado: «Volver a Casos» lleva a `/proyectos#casos` con el grupo a 64 px del borde). El rótulo «Volver a Casos» queda para revisión.
- **`src/pages/Casos.jsx`** queda sin ruta y no se borra, porque T7 no lo nombra.
- **`/casos/<slug de laboratorio>`** no lleva a `/proyectos/<slug>`: hoy no hay demos publicadas y T7 no lo pide. `CasoOFicha` sigue igual.
- **Barra final en Vercel.** La regla `/casos` de `vercel.json` sigue el estilo de las existentes; Vercel no se puede probar en local (está prohibido correr `vercel`), así que `/casos/` con barra en Vercel queda sin comprobar.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL. Trozos nuevos: `Inicio` 24 KB, `PaginaProyecto` 9 KB, `CasoOFicha` 7 KB, `Proyectos` 5 KB, `DemoOCaso` 0,3 KB. Aviso nuevo esperado: «`<Navigate>` must not be used on the initial render in a `<StaticRouter>`» al prerenderizar `/casos` (ver «Pendiente para T11»). Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 89 archivos.
- nginx: `nginx.conf` y `dist/` montados en `nginx:1.27-alpine` (la imagen del `Dockerfile`). `nginx -t` correcto y `curl` sobre cada fila de la tabla: todos los códigos y destinos coinciden. `/casos/ita-2026/` y `/casos/calculadora-series/` dan 200; `/p/*` siguen en 302; `/healthz` 200. El contenedor y la imagen se borraron al terminar.
- Navegador: Chrome sin interfaz por CDP, cero errores y cero avisos en consola salvo el caso anotado abajo.
  - `vite preview` (HTML prerenderizado): `/`, `/casos/ita-2026/`, `/laboratorio/`, `/pcb/` y `/casos/calculadora-series/` hidratan sin errores. Cabecera y pie: Proyectos · Qué construimos · Cómo trabajamos · Laboratorio · Contacto. «Proyectos» lleva `aria-current="page"` en `/proyectos` y en `/casos/*`; «Laboratorio» en `/laboratorio`; «Qué construimos» en `/pcb`. Clic en «Proyectos» desde la portada → `/proyectos` con la galería; clic en la tarjeta de ITA → `/casos/ita-2026`. En inglés: Projects · What we build · How we work · Lab · Contact.
  - `vite` en desarrollo (sin prerender), cada redirección de la app: `/casos`, `/casos/` y `/portafolio` → `/proyectos#casos` con el grupo a 64 px del borde; `/proyectos/ita-2026` y `/portafolio/ita-2026` → `/casos/ita-2026`; `/piezas/calculadora-series` → `/casos/calculadora-series`; `/piezas/wabot` → `/laboratorio#wabot`; `/proyectos/no-existe` → «Esta página no está.».
  - 390 × 844 en `/proyectos`: `scrollWidth` = 390, ningún elemento fuera de la pantalla; el menú móvil muestra las cinco entradas con «Proyectos» marcado.
  - `vite preview` en `/proyectos` sin barra: React da el error #418 de hidratación, porque aún no existe `dist/proyectos/index.html` y se sirve el HTML de la portada. La página se pinta bien, pero la cabecera conserva el `aria-current` de la portada (React no corrige atributos al recuperarse). Lo resuelve T11.
  - El script de prueba, el perfil de Chrome y los registros quedaron en `%TEMP%` y se borraron.
- Fuera del commit, como en T1–T6: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T8 · 2026-11-20 · hecho · `clic_demo` (GA4 `clic_demo`, Meta `trackCustom ClicDemo`) y `caso_visto` (GA4 `caso_visto`, Meta `ViewContent`) añadidos a `EVENTOS` sin tocar los cuatro existentes; «Abrir la demo» de `BloquePruebalo` dispara `clic_demo` con `proyecto`; `PaginaProyecto` dispara `caso_visto` con `proyecto` y `tipo` una vez por slug, también con StrictMode.

## Detalle de T8

### Archivos

- `src/medicion/medicion.js`: dos entradas nuevas al final de `EVENTOS`, copiadas de design.md, y dos líneas en la tabla del comentario de cabecera. Las cuatro entradas anteriores, `rastrear`, la carga y el escuchador de clics no cambian.
- `src/features/proyectos/BloquePruebalo.jsx`: nueva prop `proyecto` (slug) y `onClick={() => rastrear('clic_demo', { proyecto })}` en el botón «Abrir la demo». El clic no se intercepta: el enlace sigue abriendo la demo en otra pestaña.
- `src/pages/PaginaProyecto.jsx`: pasa `proyecto={proyecto.slug}` a `BloquePruebalo` y añade un `useEffect` con dependencias `[slug, tipo]` que llama a `rastrear('caso_visto', { proyecto, tipo })`. Una `useRef` guarda el último slug enviado.

### Puntos que T8 no especificaba

- **«Una vez por slug» con StrictMode.** En desarrollo React monta, desmonta y vuelve a montar cada efecto; la `ref` se conserva en ese ciclo, así que el segundo efecto no reenvía. Un cambio de idioma tampoco reenvía (las dependencias son slug y tipo). Ir a otra página y volver al caso cuenta como otra vista y sí reenvía, porque la página se vuelve a montar. Ningún estado global: dos casos distintos en la misma visita mandan un evento cada uno.
- **Parámetros extra.** `rastrear` ya añade los UTM de la visita; en la página de caso eso incluye el `utm_content=<slug>` que fija `fijarUtmContenido` (T6). No se añadió nada más.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL. Siguen los avisos ya conocidos: `<Navigate>` en `StaticRouter` al prerenderizar `/casos` (T11) y `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 89 archivos.
- Navegador: Chrome sin interfaz por CDP, con las peticiones a `googletagmanager.com`, `facebook.net` y `clarity.ms` bloqueadas.
  - `vite preview` con IDs vacíos (`.env.local` no define ningún `VITE_*`): `/`, `/casos/ita-2026/` y `/laboratorio/` con la consola limpia, sin errores ni avisos; `window.gtag` y `window.fbq` no existen y no se carga ningún script de terceros. `/proyectos/` da el error #418 de hidratación ya anotado en T7: falta `dist/proyectos/index.html` y se resuelve en T11. No viene de T8.
  - `vite` en desarrollo (StrictMode activo) con IDs de prueba solo en el entorno del proceso (`VITE_GA4_ID=G-PRUEBA`, `VITE_META_PIXEL_ID=000000`), leyendo `window.dataLayer` y `fbq.queue`. En `/casos/ita-2026` hay un solo `caso_visto` con `{"proyecto":"ita-2026","tipo":"caso-cliente","utm_content":"ita-2026"}` en GA4 y un solo `track ViewContent` en Meta. Al cambiar a inglés no se envía otro. Al ir a `/proyectos` y volver con la tarjeta de ITA, llega el segundo (otra vista). `rastrear('clic_demo', { proyecto: 'prueba' })` sale como GA4 `clic_demo` y Meta `trackCustom ClicDemo`. Consola limpia.
  - El clic real en «Abrir la demo» no se pudo probar en el navegador porque no hay ninguna ficha `laboratorio` publicada. El cableado se revisó en el código y la traducción del evento se probó arriba. Queda para cuando llegue la primera demo, o para T13.
  - Visto de paso, no es de T8: con el píxel de Meta activo, la primera carga encola `track PageView` dos veces (una de `prepararMeta` y otra de `vistaDePagina`). R0.8 deja la medición actual como está, así que no se tocó.
  - El script de prueba y el perfil de Chrome quedaron en `%TEMP%` y se borraron; los servidores se cerraron al terminar.
- Fuera del commit, como en T1–T7: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T9 · 2026-11-20 · bloqueado · sin cambios de código: el orden de portada de T9 deja fuera seis secciones que hoy existen, entre ellas `#que-construimos`, destino de la entrada «Qué construimos» de la navegación de design.md; además faltan el criterio de «Proyectos destacados» con una sola ficha publicada, el contenido de Transparencia sin demos publicadas, dónde vive `EntregaConLlaves` (ya existe uno de T6) y tres datos de negocio para las preguntas (ver Bloqueos, con propuesta para cada punto y el borrador de las 8 preguntas es/en).

## Detalle de T9

- Se leyeron `requirements.md`, `design.md`, las reglas de `tasks.md`, `ayemi-voz`, `src/pages/Inicio.jsx`, `src/config/{secciones,proyectos}.js`, `src/features/proyectos/EntregaConLlaves.jsx`, `src/features/pcb/PreguntasPcb.jsx` (patrón `<details>` que se reutilizaría), `src/features/hero/{Hero,HeroProyectos}.jsx` y los bloques `hero.pruebas`, `pcb.preguntas` y `quienes.valores` de `src/i18n.js`.
- No se escribió código: los puntos de «Bloqueos · T9» cambian qué se ve en la portada y qué promete Ayemi, y las reglas piden detenerse. El único cambio de este commit es esta bitácora.
- Comprobantes sobre el estado actual (igual que tras T8):
  - `npm run lint`: código 0.
  - `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
  - `npm run build`: código 0. «Medios copiados a public/proyectos/: 7 archivo(s) de 1 ficha(s).», «Prerenderizado completo.», sitemap con 9 URL.
  - `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 89 archivos.
  - Navegador: `vite preview` (puerto 4173) y Chrome sin interfaz por CDP en `/`, a 1440 × 900 y 390 × 844, recorriendo la página entera para cargar lo diferido. Consola sin errores ni avisos. Un solo h1 («Tienes una idea. La convertimos en algo que funciona.»). Secciones en este orden: `inicio` · `que-construimos` · `capacidad` · `ofertas` · `como-trabajamos` · `alternativas` · `del-laboratorio` · `quienes-somos` · `contacto`. Sin desbordes: `scrollWidth` = ancho de la ventana en los dos tamaños y ningún elemento fuera de la pantalla. La captura completa de escritorio se revisó a ojo: sin solapes ni huecos. El script, las capturas y el perfil de Chrome quedaron en `%TEMP%` y se borraron; el servidor se cerró.
- Fuera del commit, como en T1–T8: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T9 · 2026-11-20 · hecho · portada con Proyectos destacados (hoy 1 tarjeta, ITA), Entrega con llaves, Transparencia (sin pintar: no hay demos publicadas) y las 8 preguntas frecuentes es/en con `<details>`; ninguna sección quitada. Las respuestas 3 y 7 quedan pendientes de Dirección antes de producción.

## Detalle de T9 · segundo intento (Decisión 2026-11-20 aplicada)

### Archivos

- `src/features/proyectos/ProyectosDestacados.jsx` (nuevo): sección `#destacados`, «Proyectos destacados» / «Featured projects», hasta 3 fichas publicadas más recientes por `fecha` (`proyectosPublicados().slice(0, 3)`) con `TarjetaProyecto`, y «Ver todos los proyectos» / «See all projects» → `/proyectos` como botón secundario. Sin fichas, no se pinta. Las piezas no entran.
- `src/features/confianza/EntregaConLlaves.jsx` (nuevo, exporta `SeccionEntregaConLlaves`): sección `#entrega` con `hero.pruebas.llavesTitulo` como h2, `llavesTexto` y un h3 + párrafo con `traspasoTitulo` / `traspasoTexto`. El componente de T6 en `features/proyectos/` no se tocó.
- `src/features/confianza/Transparencia.jsx` (nuevo): sección `#transparencia` con una línea por demo publicada (`porTipo('laboratorio')`): título enlazado a `/proyectos/<slug>`, «Comprobada el» / «Checked on» + `verificadoEl` en `<time>` monoespaciado, y `caso.seReinicia` con `demo.seReinicia`. Sin demos publicadas no se pinta, así que hoy no aparece.
- `src/features/confianza/PreguntasFrecuentes.jsx` (nuevo): sección `#preguntas` con el patrón `<details>/<summary>` de `PreguntasPcb` y la lista `confianza.preguntas.lista` (`p`, `r`), que T11 leerá para `FAQPage`.
- `src/i18n.js`: bloque `confianza` en es y en con los textos del borrador aprobado, tal cual. Las respuestas 3 y 7 van sin «[confirmar]» y con un comentario que remite a esta bitácora. En la respuesta 4, `/pcb` va como texto plano (sin las comillas de código del borrador) para que la misma cadena sirva al JSON-LD.
- `src/pages/Inicio.jsx`: orden de la propuesta 1: Hero · Proyectos destacados · Servicios · TechStack · Ofertas · Método · Posicionamiento · Entrega con llaves · Transparencia · Preguntas · Laboratorio · Quiénes somos · Contacto.
- `src/config/secciones.js`: `entrega`, `transparencia` y `preguntas` entran en `SECCIONES` después de `alternativas`, sin entrada propia en `NAVEGACION`.

### Puntos que T9 no especificaba

Ninguno bloquea. Se resolvieron sin texto nuevo que prometa algo:

- **Fondos.** Destacados en `alterno` (separa el hero de Servicios), Entrega en `alterno`, Transparencia en `profundo` y Preguntas en `lienzo`, para que no queden dos secciones seguidas con el mismo fondo, tampoco cuando Transparencia aparezca.
- **Encabezados sin texto en la propuesta.** Entrega lleva como microetiqueta `hero.panelEtiqueta` («QUÉ RECIBES»), el rótulo del panel del hero de donde salieron esos textos (la propuesta 4 pide microetiqueta y ningún texto nuevo). Transparencia toma como título `quienes.valores.transparencia.nombre` («Transparencia» / «Transparency») y no lleva microetiqueta. Destacados no lleva microetiqueta: «PROYECTOS» sobre «Proyectos destacados» repetiría la palabra.
- **`#destacados` fuera de `SECCIONES`.** La propuesta 1 solo añade las tres secciones de confianza. Al leer los destacados no se marca ninguna entrada, igual que en el hero.
- **Enlace de Transparencia.** Lleva `ay-toque` (§5.3, 44 × 44 px), porque va suelto y no sobre una tarjeta.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL. `dist/index.html` trae `#destacados`, `#entrega`, `#preguntas` y los 8 `<details>`; `#transparencia` no está, como se esperaba. Siguen los avisos ya conocidos: `<Navigate>` en `StaticRouter` (T11) y `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 93 archivos.
- Navegador: `vite preview` (puerto 4173) y Chrome sin interfaz por CDP en `/`, a 1440 × 900 y 390 × 844, con GA4, Meta y Clarity bloqueados y recorriendo la página entera para cargar lo diferido.
  - Un solo h1. Secciones de primer nivel en este orden: `destacados` · `que-construimos` · `capacidad` · `ofertas` · `como-trabajamos` · `alternativas` · `entrega` · `preguntas` · `del-laboratorio` · `quienes-somos` · `contacto`.
  - Destacados: 1 tarjeta (ITA) y el botón «Ver todos los proyectos» → `/proyectos`. Preguntas: 8 `<details>`; al abrir el primero se ve la respuesta. Al cambiar a inglés con el botón de idioma: «Featured projects», «See all projects», «Handed over with the keys», «FAQ», «What people ask us before starting.», «How long does it take?».
  - Sin desbordes: `scrollWidth` = ancho de la ventana a 390 px (a 1440 px, 1425 por la barra de desplazamiento). A 390 px, los únicos elementos fuera de la pantalla son botones del carrusel de `#capacidad` (TechStack), recortados por su propio contenedor con desplazamiento horizontal. Es lo mismo que antes de T9.
  - Capturas de destacados, entrega y preguntas en los dos tamaños, revisadas a ojo: sin solapes ni cortes, y la medida de lectura se respeta.
  - Consola: sin errores de la app. Hay un error de red ajeno a T9: `https://cdn.simpleicons.org/css3/1572B6` responde 404 (logotipo de CSS3 que TechStack pide al CDN). En el comprobante de T8 no salía, así que el cambio parece estar del lado de simpleicons. No se tocó porque está fuera del alcance de T9. Queda anotado para T12/T13.
  - El script, las capturas y el perfil de Chrome quedaron en `%TEMP%` y se borraron; el servidor se cerró.
- Fuera del commit, como en T1–T8: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T10 · 2026-11-20 · hecho · `src/features/quienes/QuienEstaDetras.jsx` recibe la foto o el video breve por props y devuelve `null` mientras `SITIO.mostrarQuienEstaDetras = false` (nuevo en `src/config/sitio.js`); no se monta en ninguna página ni entra en la navegación. Con `false` no aparece en los 9 HTML prerenderizados ni en `sitemap.xml`. Sin foto ni video reales en el repositorio.

## Detalle de T10

### Archivos

- `src/features/quienes/QuienEstaDetras.jsx` (nuevo): sección `#quien-esta-detras` con `Seccion` (h2 «Quién está detrás» / «Who is behind it») y un medio a la izquierda y un párrafo a la derecha en escritorio, apilados en móvil. Props: `foto` (`src`, `ancho`, `alto`, `alt: { es, en }`), `video` (`mp4`, `webm`, `poster`, `ancho`, `alto`, `titulo: { es, en }`) y `texto: { es, en }`. El video usa `VideoProyecto` con controles nativos y sin bucle; la foto, `<img>` con `width`/`height` y `loading="lazy"`. Devuelve `null` si la bandera es `false` o si no llega ni foto ni video (R0.5).
- `src/config/sitio.js`: `SITIO.mostrarQuienEstaDetras: false`, con un comentario que remite a esta bitácora.
- `src/i18n.js`: `quienEstaDetras.titulo` en es y en. Es la única cadena nueva.

### Puntos que T10 no especificaba

Ninguno bloquea T10, porque la sección sigue oculta. Quedan en «Pendiente de Dirección antes de producción»:

- **Dónde se monta.** T10 pide el componente y la bandera, no su sitio en la portada, cuyo orden fijó T9. Por eso no se montó en ninguna página: hoy no está en ningún HTML ni en el bundle (no hay ninguna importación). Propuesta: montarlo en `Inicio.jsx` entre «Quiénes somos» y «Contacto» y añadirlo a `SECCIONES` sin entrada en `NAVEGACION`, en la tarea que lo publique.
- **Textos de la persona.** El texto y el `alt` llegan por props en es y en, porque no hay copia escrita ni aprobada. El componente no inventa ninguna.
- **§1.1.** El manual dice que en público no se citan nombres de personas y que Ayemi es una casa, no una marca personal. Una foto o un video de quién está detrás choca con eso si se nombra a alguien. Lo tiene que decidir Dirección antes de pasar la bandera a `true`.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL. Siguen los avisos ya conocidos: `<Navigate>` en `StaticRouter` (T11) y `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 94 archivos.
- Ausencia en el prerender y en el sitemap (estado que se entrega): 0 coincidencias de `quien-esta-detras`, «Quién está detrás» y «Who is behind it» en los 9 HTML de `dist/`, y 0 de `quien|detras|behind` en `dist/sitemap.xml`. El id tampoco está en `dist/assets/*.js`.
- Prueba de la bandera: como el componente no está montado, la ausencia anterior no prueba la bandera. Se montó de forma temporal en `Inicio.jsx` antes de `Contacto`, con una foto de prueba (el póster de ITA) y un texto «prueba»:
  - con `false`: build código 0, la sección no está en ningún HTML y el sitemap no cambia;
  - con `true`: build código 0, la sección aparece en `dist/index.html` y el sitemap sigue igual (no tiene ruta propia).
  - Después se restauraron `Inicio.jsx` y `sitio.js` desde copia y se volvió a compilar. `git diff` confirma que `Inicio.jsx` no cambió.
- Fuera del commit, como en T1–T9: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T11 · 2026-11-20 · hecho · `prerender.mjs` genera `/proyectos` y una página por ficha publicada con su título, su resumen y su primera imagen (og:image absoluta, con medidas y texto alternativo), JSON-LD `CreativeWork` en cada ficha y `FAQPage` en la portada con las 8 preguntas de `confianza.preguntas.lista`; `/casos` sale del prerender y del sitemap; `/proyectos/<slug de caso-cliente>` recibe un HTML que lleva a `/casos/<slug>/`. En nginx ya no hay 403 en `/proyectos/` ni en `/proyectos/ita-2026/`.

## Detalle de T11

### Archivos

Solo `prerender.mjs`:

- **Rutas.** Sale `/casos` (era un `<Navigate>` y generaba `dist/casos/index.html` vacío). Entra `/proyectos` → `dist/proyectos/index.html`, con título «Proyectos · Ayemi» (`nav.proyectos`) y descripción `proyectos.entradilla`: textos que ya existen, sin copia nueva. Las fichas salen de `proyectosPublicados()` en lugar de `CASOS`: `caso-cliente` en `/casos/<slug>` y `laboratorio` en `/proyectos/<slug>`, las mismas URL que `TarjetaProyecto`. Las piezas sin caso no cambian.
- **Meta por ficha.** `<title>`, `og:title` y `twitter:title` = `textos.es.titulo` + « · Ayemi»; `description`, `og:description` y `twitter:description` = `textos.es.resumen`; `og:image` y `twitter:image` = `SITIO.url` + `urlMedio(slug, imagenes[0].src)`. Además se sustituyen `og:image:width`, `og:image:height`, `og:image:alt` y `twitter:image:alt` por los de esa imagen, porque los de la plantilla describen la imagen del logotipo (1200 × 630). Las demás rutas conservan los de la plantilla.
- **JSON-LD.** Un segundo bloque `application/ld+json` antes de `</head>`, después del de la organización (que no cambia). Portada: `FAQPage` con una `Question` / `Answer` por cada elemento de `confianza.preguntas.lista` en español, la misma lista que pinta `PreguntasFrecuentes`; si la lista llegara vacía, el build falla. Fichas: `CreativeWork` con `name`, `description`, `url` (canónico), `image` (todas las `imagenes`, absolutas), `inLanguage`, `datePublished` (`fecha`), `keywords` (`stack`) y `creator` (Ayemi). Solo datos que la ficha declara. El `<` del JSON va escapado como `\u003c`.
- **Caso de cliente pedido por `/proyectos/<slug>`.** Se escribe `dist/proyectos/<slug>/index.html`, un HTML mínimo con canónico a `/casos/<slug>`, `location.replace('/casos/<slug>/' + search + hash)` (conserva los UTM y el ancla) y `meta refresh` como respaldo sin JavaScript. No entra en el sitemap. Hoy solo existe `/proyectos/ita-2026`.

### Pendiente para T11, cómo quedó

- **Directorio y página con la misma ruta (nginx).** Resuelto por el prerender: cada demo publicada tendrá `dist/proyectos/<slug>/index.html` en la carpeta de sus medios, y `/proyectos/` tiene el suyo. Hoy no hay demos publicadas.
- **`/proyectos/<slug de caso-cliente>`.** La nota dejaba a T11 elegir entre un HTML que redirija o una 301 en servidor. Se eligió el HTML, porque se genera desde las fichas y no hay que añadir una regla en `vercel.json` y otra en `nginx.conf` por cada caso nuevo. Una 301 sería mejor señal para buscadores; si el arquitecto la prefiere, se borra el bloque «Casos de clientes pedidos por /proyectos/<slug>» de `prerender.mjs` y se añaden las reglas. La URL no se enlaza desde ningún sitio: solo se llega a ella escribiéndola.
- **`/proyectos` sin HTML propio.** Resuelto: ya no hay error #418 ni `aria-current` equivocado en `/proyectos/`.
- **`/casos` en el prerender y el sitemap.** Resuelto: no se genera y no está en el sitemap. Desapareció el aviso de `<Navigate>` en `StaticRouter`.
- **Redirecciones absolutas de nginx** (`absolute_redirect off;`). Sigue abierto: T11 no nombra `nginx.conf`. Se ve en las pruebas: `/proyectos` → 301 `http://localhost/proyectos/` sin puerto.

### Puntos que T11 no especificaba

Ninguno bloquea:

- **Título de la ficha.** design.md pide «título» por ficha. El de ITA pasa de «Caso ITA · Ayemi» a «Un sitio que explica la rectificación industrial de ITA en dos idiomas · Ayemi» (78 caracteres; los buscadores suelen cortar hacia los 60). Si se quiere más corto, conviene un campo en la ficha, no un recorte en el prerender.
- **Idioma.** El HTML estático y los dos JSON-LD van en español, como el resto del prerender (`lng: 'es'`).
- **Respuestas 3 y 7.** El `FAQPage` lleva las ocho respuestas tal como se ven, así que las dos de «Pendiente de Dirección antes de producción» también están en el JSON-LD.
- **`npm run prerender` suelto no es idempotente** (anterior a T11): lee `dist/index.html`, que la pasada anterior ya sobrescribió, y duplica el canónico y el JSON-LD. Con `npm run build` no pasa, porque `vite build` vacía `dist/` antes. No se cambió.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL: `/`, `/laboratorio`, `/pcb`, `/enlaces`, `/privacidad`, `/proyectos`, `/casos/ita-2026`, `/casos/calculadora-series`, `/casos/invitacion-boda`. Sin `/casos` y sin `/proyectos/ita-2026`. Sin el aviso de `<Navigate>`. Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 94 archivos.
- HTML prerenderizado (leído de `dist/`, después de un `npm run build` limpio):
  - `dist/proyectos/index.html` existe: `<title>Proyectos · Ayemi</title>`, canónico `https://ayemi.org/proyectos`, un h1 («Proyectos que puedes ver funcionando.») y el grupo `#casos`.
  - `dist/casos/ita-2026/index.html` existe: `<title>Un sitio que explica la rectificación industrial de ITA en dos idiomas · Ayemi</title>`, descripción = resumen, `og:image` `https://ayemi.org/proyectos/ita-2026/problema-escritorio.jpg` (1440 × 900, existe en `dist/`) con su `alt`, canónico `https://ayemi.org/casos/ita-2026`, un h1, JSON-LD `Organization` + `CreativeWork`.
  - `dist/index.html`: un solo canónico, JSON-LD `Organization` + `FAQPage` con 8 preguntas; el HTML tiene 8 `<details>` y las 8 preguntas del JSON-LD aparecen en él. Los dos bloques se leen con `JSON.parse` sin error.
  - `dist/casos/index.html` no existe.
- nginx: `dist/` y `nginx.conf` montados en `nginx:1.27-alpine`. `/proyectos/` 200 (antes 403), `/proyectos/ita-2026/` 200 (antes 403), `/proyectos/ita-2026/problema-escritorio.jpg` 200, `/casos` y `/casos/` 301 → `/proyectos#casos`, `/casos/ita-2026/` 200, `/portafolio` 301, `/piezas/ita-2026` 301 → `/casos/ita-2026`, `/p/328` 302. El contenedor y la imagen se borraron.
- Navegador: `vite preview` (puerto 4173) y Chrome sin interfaz por CDP, con GA4, Meta y Clarity bloqueados, a 1440 × 900 y 390 × 844. `/`, `/proyectos/` y `/casos/ita-2026/`: consola limpia, sin el error #418, título propio en cada una, «Proyectos» con `aria-current` en las dos últimas, sin desbordes. `/proyectos/ita-2026/?utm_source=prueba#cierre` termina en `/casos/ita-2026/?utm_source=prueba#cierre` con la consola limpia y `sessionStorage['ayemi:utm']` con `utm_source=prueba` y `utm_content=ita-2026`. El script y el perfil de Chrome quedaron en `%TEMP%` y se borraron; el servidor se cerró.
- Fuera del commit, como en T1–T10: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T12 · 2026-11-20 · bloqueado · sin cambios de código: Lighthouse móvil no llega a 90 de forma estable en `/proyectos` ni en `/casos/ita-2026` por una causa ajena a lo que T12 nombra (el contenido de `<main>` desaparece al hidratar), y dos `<img>` no tienen de dónde sacar `width`/`height` (ver Bloqueos).

## Detalle de T12

- Se leyeron `requirements.md` (R0.3, R9), `design.md`, las reglas de `tasks.md` y el detalle de T7–T11 de esta bitácora.
- **Lighthouse.** `npx -y lighthouse@13.6.0` (etiqueta `latest`, publicada el 2026-10-27; la `next` 13.6.0-dev.20261119 tiene menos de un día y no se usó), sin tocar `package.json`, con `CHROME_PATH` = Chrome instalado (`C:\Program Files\Google\Chrome\Application\chrome.exe`), `--headless=new`, `--form-factor=mobile` (simulación por defecto), `--only-categories=performance,accessibility,seo`, sobre `vite preview` en el puerto 4173 con el build actual (commit ca56e28). Tres pasadas por ruta, **antes de cualquier cambio de T12**:

  | Ruta | Pasada | Rendimiento | Accesibilidad | SEO | LCP | TBT | CLS |
  |---|---|---|---|---|---|---|---|
  | `/` | 1 | 100 | 97 | 100 | 1.0 s | 30 ms | 0.001 |
  | `/` | 2 | 79 | 97 | 100 | 4.2 s | 320 ms | 0.014 |
  | `/` | 3 | 78 | 97 | 100 | 4.2 s | 330 ms | 0.015 |
  | `/proyectos/` | 1 | 88 | 96 | 100 | 3.3 s | 240 ms | 0.014 |
  | `/proyectos/` | 2 | 87 | 96 | 100 | 3.3 s | 270 ms | 0.014 |
  | `/proyectos/` | 3 | 67 | 96 | 100 | 3.3 s | 100 ms | 0.936 |
  | `/casos/ita-2026/` | 1 | 62 | 100 | 100 | 3.8 s | 150 ms | 0.936 |
  | `/casos/ita-2026/` | 2 | 86 | 100 | 100 | 3.8 s | 160 ms | 0.014 |
  | `/casos/ita-2026/` | 3 | 100 | 100 | 100 | 0.8 s | 40 ms | 0.003 |

  Accesibilidad y SEO cumplen (≥ 90) en las nueve pasadas. Rendimiento oscila entre 62 y 100 en la misma ruta y con el mismo build.
- **Causa de la oscilación.** En las pasadas malas, la auditoría `layout-shifts` culpa al `<footer>` (0.92 de los 0.936). Se reprodujo con Chrome sin interfaz (puppeteer-core del caché de `npx`, 412 × 823, CPU × 4, 1.6 Mbit/s, 150 ms; script en `%TEMP%`, ya borrado): el `<footer>` llega a estar en `y = 64`, justo debajo de la cabecera, con 759 px de alto. Es decir, `<main id="contenido">` se queda vacío durante la carga aunque el HTML prerenderizado lo trae completo. Sin estrangular la red no pasa (CLS 0.03–0.07). Cuando pasa, el LCP es el h1 o la entradilla vueltos a pintar por el cliente (3.3–4.2 s, casi todo «element render delay»); cuando no pasa, el LCP es el del HTML (0.8–1.0 s). La consola queda limpia: no hay error #418, así que no es un desajuste de hidratación.
  Lo que encaja con eso: las cuatro páginas van con `lazy()` dentro de `<Suspense fallback={null}>` en `App.jsx` (T7). Mientras llega el trozo de JavaScript, React conserva el HTML del servidor; si antes de eso llega una actualización que atraviesa esa frontera, React abandona la hidratación de la frontera, pinta el `fallback` (`null`) y vuelve a montar la página en cliente. No se identificó qué actualización la dispara (no hay `changeLanguage`, `navigate` ni `replaceState` al arrancar fuera de `Proyectos.jsx`).
- **Borrado de `src/assets/*`.** `git grep` de `hero.png`, `react.svg`, `vite.svg`, `icono.png`, `logo.png`, `Logos/` y `assets/` fuera de `src/assets/` y de `package-lock.json`: 0 coincidencias en código; solo aparecen en `tasks.md` y `requirements.md`. Los cuatro se pueden borrar. No se borraron porque la tarea quedó bloqueada.
- **Solo `woff2`.** Los `@import` de `@fontsource/*/latin-*.css` declaran `src: url(…woff2) format('woff2'), url(…woff) format('woff')`, así que Vite copia también los `.woff` a `dist/assets/`. Para dejar solo `woff2` hay que escribir en `ayemi-fuentes.css` las 13 `@font-face` (las mismas familias, pesos, subconjuntos, `font-display: swap` y `unicode-range` que hoy) apuntando a `@fontsource/<familia>/files/*.woff2`. No se hizo por el bloqueo.
- **`width`/`height`.** De las 12 `<img>` de `src/`, 10 ya los llevan. Faltan dos, ver Bloqueos.
- **Hallazgo fuera de alcance, anotado:** la auditoría `color-contrast` falla en `/` y `/proyectos` por `--ay-texto-tenue` (#7A8391) sobre `--ay-superficie` (#1A1D21) a 12 px: 4.41:1, por debajo de 4.5:1 (WCAG AA y regla 7 de marca). Afecta a los chips de stack de `TarjetaProyecto` y a un pie de `GuiaEmi` en la portada. Cambiar el valor del token o el rol de esos textos lo decide la dirección de marca. `label-content-name-mismatch` falla en el botón de idioma («EN»): su `aria-label` no contiene el texto visible.
- **Comprobantes (estado actual, sin cambios):**
  - `npm run lint`: código 0.
  - `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
  - `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL.
  - `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 94 archivos, 0 errores.
- El servidor de `vite preview` se cerró y la carpeta temporal (informes JSON, registro y script) se borró. Fuera del commit, como en T1–T11: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T12 · 2026-11-20 · bloqueado · aplicada la Decisión 2026-11-20 (bloqueos de T12) completa: borrados los cinco archivos de `src/assets/`, fuentes solo en `woff2`, `width`/`height` en las 12 `<img>`, chips y pie de Emi en `texto-suave` y la página de la ruta actual resuelta antes de `hydrateRoot`. Accesibilidad y SEO dan 100 en las nueve pasadas, pero Rendimiento sigue por debajo de 90 en las tres rutas (medianas 70, 87 y 85). La causa real está en `prerender.mjs`, fuera del alcance de T12: el HTML estático trae `<main>` vacío y su contenido aparte. El bloqueo anterior queda resuelto y se abre uno nuevo con una propuesta medida (ver Bloqueos).

## Detalle de T12 · segundo intento (Decisión 2026-11-20 aplicada)

### Archivos

- **Borrados** (con `git rm`): `src/assets/hero.png`, `src/assets/Logos/icono.png`, `src/assets/Logos/logo.png`, `src/assets/react.svg` y `src/assets/vite.svg`. Antes se repitió el `git grep` de `hero.png`, `react.svg`, `vite.svg`, `icono.png`, `logo.png`, `Logos/` y `assets/` fuera de `src/assets/` y de `package-lock.json`: 0 coincidencias en código. `src/assets/` ya no existe.
- **`src/styles/ayemi-fuentes.css`.** Los 13 `@import` de `@fontsource/*/latin-*.css` pasan a 13 `@font-face` escritas a mano, con la misma familia, estilo, peso, `font-display: swap` y orden, y `src` solo con el `woff2` de `@fontsource/<familia>/files/`. En `dist/assets/` quedan 13 `.woff2` y 0 `.woff`, y el CSS compilado tiene 13 `@font-face`. Durante la prueba apareció un error propio, ya corregido: un comentario con `*/` dentro de una ruta de ejemplo cerraba el comentario antes de tiempo y se perdía la primera `@font-face`.
- **`src/rutasDiferidas.jsx`** (nuevo, el módulo de rutas compartido de la opción A): guarda el `import()` de las cuatro páginas diferidas (`Inicio`, `Proyectos`, `DemoOCaso`, `CasoOFicha`), los mismos patrones de ruta que `App.jsx` y `precargarPaginaActual(ruta)`. Cada página exporta un componente que pinta la página ya resuelta si se precargó antes de hidratar, y si no, la versión con `lazy()`. Una página precargada se pinta siempre con su componente directo y las demás siempre con `lazy()`, así que ninguna cambia de tipo en vida de la app y no se vuelve a montar por esto. Si la descarga falla, la página queda con `lazy()`, como antes.
- **`src/App.jsx`**: importa las cuatro páginas de `rutasDiferidas.jsx` en lugar de declarar sus `lazy()`. Las rutas no cambian.
- **`src/main.jsx`**: con HTML previo, `precargarPaginaActual(window.location.pathname)` y después `hydrateRoot`. Sin HTML previo (`npm run dev`), `createRoot` como antes. Las demás rutas siguen en diferido (R9).
- **GIF.** En `contenido/proyectos/proyecto.schema.json`, `gif` pasa a objeto `{ src, ancho, alto }` con los tres obligatorios. `src/pages/PaginaProyecto.jsx` pinta `gif.src` con `width={gif.ancho}` y `height={gif.alto}`. **Fuera de lo que la Decisión nombra:** `scripts/validar-proyectos.mjs` comprueba ahora `ficha.gif?.src` en lugar de `ficha.gif`. Sin ese cambio, el validador dejaría de comprobar silenciosamente que el archivo del GIF existe. El importador no necesita cambios: ya reescribe cualquier objeto con `src`.
- **Piezas.** El contrato documentado en `src/config/piezas.js` añade `imagenAncho` e `imagenAlto` (obligatorios con `imagen`). `src/features/piezas/FichaPieza.jsx` solo pinta la `<img>` con `imagen`, `imagenAncho` e `imagenAlto`, y les pasa `width`/`height` y la clase `h-auto`. Ninguna pieza usa `imagen` hoy.
- **Contraste.** Los chips de stack de `src/features/proyectos/TarjetaProyecto.jsx` y el pie del globo de `src/components/marca/GuiaEmi.jsx` pasan de `text-texto-tenue` a `text-texto-suave`. Es el siguiente token de texto existente y el de mayor contraste por debajo de `texto`. Queda en 6.1:1 en oscuro (`#949CA8` sobre `#1A1D21`) y en 11.6:1 en claro (`#333941` sobre `#FFFFFF`). La auditoría `color-contrast` de Lighthouse ya no falla. No se crearon colores ni se tocaron tokens. **Para el manual:** `--ay-texto-tenue` sobre `--ay-superficie` da 4.41:1 en oscuro, así que no sirve como texto de 12 px sobre tarjetas.
- `width`/`height`: las 12 `<img>` de `src/` los llevan (las 10 de antes, el GIF y la de `FichaPieza`).

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL. Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 95 archivos, 0 errores.
- **Lighthouse móvil**, con la misma configuración que el primer intento: `npx -y lighthouse@13.6.0`, Chrome instalado, `--headless=new`, `--form-factor=mobile` (simulación por defecto), `--only-categories=performance,accessibility,seo`, sobre `vite preview` (puerto 4173), con el build de este commit:

  | Ruta | Pasada | Rendimiento | Accesibilidad | SEO | LCP | TBT | CLS |
  |---|---|---|---|---|---|---|---|
  | `/` | 1 | 70 | 100 | 100 | 4.2 s | 650 ms | 0 |
  | `/` | 2 | 67 | 100 | 100 | 4.2 s | 780 ms | 0.015 |
  | `/` | 3 | 71 | 100 | 100 | 4.3 s | 560 ms | 0.015 |
  | `/proyectos/` | 1 | 86 | 100 | 100 | 3.3 s | 290 ms | 0.014 |
  | `/proyectos/` | 2 | 87 | 100 | 100 | 3.4 s | 250 ms | 0.015 |
  | `/proyectos/` | 3 | 88 | 100 | 100 | 3.4 s | 220 ms | 0.014 |
  | `/casos/ita-2026/` | 1 | 85 | 100 | 100 | 3.9 s | 210 ms | 0.014 |
  | `/casos/ita-2026/` | 2 | 64 | 100 | 100 | 3.8 s | 70 ms | 0.937 |
  | `/casos/ita-2026/` | 3 | 100 | 100 | 100 | 0.8 s | 40 ms | 0.003 |

  **Medianas:** `/` 70 · 100 · 100, CLS 0.015; `/proyectos/` 87 · 100 · 100, CLS 0.014; `/casos/ita-2026/` 85 · 100 · 100, CLS 0.014. Accesibilidad y SEO cumplen (≥ 90) en las tres rutas, y la mediana de CLS es < 0.1 en las tres. **Rendimiento no llega a 90 en ninguna.** El comprobante de T12 no se cumple.
- **Causa encontrada.** La precarga funciona: el trozo de la página llega antes de `hydrateRoot` y la consola queda limpia. Pero el CLS de 0.937 volvió a salir. Con Chrome sin interfaz (puppeteer-core del caché de `npx`, 412 × 823, sin estrangular, un `MutationObserver` sobre `<main>`; script en `%TEMP%`, ya borrado) se vio que en 10 de 10 cargas de `/casos/ita-2026/` se quita un `<template>` de `<main>`. El HTML prerenderizado no trae la página dentro de `<main>`: trae `<main id="contenido" class="pt-16"><!--$?--><template id="B:0"></template><!--/$--></main>`, el contenido en un `<div hidden id="S:0">` al final del `<body>` y un guion en línea `$RC` que lo mueve a su sitio. React 19.2 (`react-dom` 19.2.5) hace esto aunque se use `prerenderToNodeStream`: separa ("outlining") toda frontera de `<Suspense>` ya completa que pase de `progressiveChunkSize` (12 800 bytes por defecto, `react-dom-server.node.production.js`, función de volcado de fronteras). La frontera de `App.jsx` envuelve la página entera, así que siempre pasa. Por eso, hasta que corre `$RC`, el pie queda debajo de la cabecera (el `<footer>` en `y = 64` del primer intento). El LCP espera a que se revele el contenido, y en la simulación de Lighthouse eso arrastra la descarga de todo el JavaScript (3.3–4.3 s). Cuando el pintado cae antes de la revelación, el pie salta (CLS 0.937). El diagnóstico del primer intento (la hidratación tira el HTML) era incorrecto. La opción A no toca esta causa.
- **Prueba de la propuesta, ya revertida.** Se añadió `{ progressiveChunkSize: Infinity }` como segundo argumento de `prerenderToNodeStream` en `prerender.mjs`, se reconstruyó y se midió. Los tres HTML salieron sin `<template id="B:…">` ni `$RC`, y en 4 de 4 cargas no se quitó nada de `<main>`. Lighthouse:

  | Ruta | Pasada | Rendimiento | Accesibilidad | SEO | LCP | TBT | CLS |
  |---|---|---|---|---|---|---|---|
  | `/` | 1 | 100 | 100 | 100 | 1.2 s | 20 ms | 0.001 |
  | `/` | 2 | 96 | 100 | 100 | 1.2 s | 240 ms | 0 |
  | `/` | 3 | 96 | 100 | 100 | 1.1 s | 220 ms | 0.001 |
  | `/proyectos/` | 1 | 100 | 100 | 100 | 0.8 s | 70 ms | 0.025 |
  | `/proyectos/` | 2 | 100 | 100 | 100 | 0.8 s | 60 ms | 0.025 |
  | `/proyectos/` | 3 | 100 | 100 | 100 | 0.8 s | 60 ms | 0.025 |
  | `/casos/ita-2026/` | 1 | 96 | 100 | 100 | 0.9 s | 220 ms | 0.003 |
  | `/casos/ita-2026/` | 2 | 98 | 100 | 100 | 0.9 s | 160 ms | 0.003 |
  | `/casos/ita-2026/` | 3 | 98 | 100 | 100 | 0.9 s | 160 ms | 0.003 |

  Medianas: 96 / 100 / 98 en Rendimiento, 100 en Accesibilidad y SEO, CLS 0.001 / 0.025 / 0.003. `prerender.mjs` se restauró desde una copia, `git diff -- prerender.mjs` sale vacío y se volvió a construir: el `dist/` final es el de este commit y sí trae el `<template>`.
- **Puntos sin especificar que no bloquean:**
  - Las `@font-face` de `latin` y `latin-ext` del mismo peso no llevan `unicode-range`, igual que las hojas `latin-*.css` de `@fontsource` que se usaban. El primer intento decía que había que copiar su `unicode-range`, pero esas hojas no lo traen: solo lo traen las hojas por peso (`400.css`…). Así que se mantiene el comportamiento de antes. Añadir el `unicode-range` evitaría descargar el subconjunto `latin-ext` en páginas que no lo usan, pero es otro cambio, que no se pidió.
  - `Inicio.jsx` sigue con `TechStack` en `lazy()`. La precarga solo resuelve el trozo de la página, como dice la Decisión. Con el HTML en línea de la propuesta, la frontera de `TechStack` también llega completa.
  - La precarga se queda aunque no arregle el CLS. Evita que, si una actualización temprana atravesara la frontera antes de que llegue el trozo, React tirara el HTML de la página. Si se acepta la propuesta, conviene conservarla.
- `vite preview` se cerró y la carpeta temporal (informes, scripts, copia de `prerender.mjs`) se borró. Fuera del commit, como en T1–T11: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T12 · 2026-11-20 · hecho · aplicada la Decisión 2026-11-20 (segundo bloqueo de T12): `prerender.mjs` deja cada frontera de Suspense en línea con `progressiveChunkSize: Infinity`, y el build falla si algún `dist/**/index.html` trae `<template id="B:` o `$RC`. Medianas de Lighthouse móvil: Rendimiento 97 en `/`, 98 en `/proyectos/` y 100 en `/casos/ita-2026/`; Accesibilidad y SEO 100 en las tres; CLS 0 / 0.025 / 0.003. El bloqueo queda resuelto.

## Detalle de T12 · tercer intento (Decisión 2026-11-20, segundo bloqueo, aplicada)

### Archivos

- **`prerender.mjs`.** `{ progressiveChunkSize: Infinity }` como segundo argumento de `prerenderToNodeStream`, con un comentario que explica el porqué: React 19.2 (`react-dom` 19.2.5) separa del HTML toda frontera completa de más de 12 800 bytes, y la de `App.jsx` envuelve la página entera. Es el mismo cambio que se midió y se revirtió en el segundo intento. Nada más cambia en el archivo.
- **`scripts/comprobar-prerender.mjs`** (nuevo). Recorre `dist/` y falla con código 1 si algún `index.html` contiene `<template id="B:` o `$RC`, con una línea por archivo y marca. Si todo está bien escribe «HTML sin fronteras separadas: <n>.». Se eligieron las dos formas que da la Decisión a la vez: es un script y también un paso del build.
- **`package.json`.** `build` termina ahora en `… && node prerender.mjs && node scripts/comprobar-prerender.mjs`. Los demás scripts no cambian.
- La precarga de `src/rutasDiferidas.jsx` se conserva, como proponía el segundo intento.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL y «HTML sin fronteras separadas: 10.» (las 9 páginas y la de `/proyectos/ita-2026`, que lleva a `/casos/ita-2026`). Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, que son de antes de T1.
- **Prueba en negativo del comprobante nuevo.** Con un `dist/zz-prueba/index.html` temporal que traía `<template id="B:0">`, el script respondió «dist/zz-prueba/index.html: contiene <template id="B:» y salió con código 1. Se borró la carpeta y volvió a dar código 0 con 10 HTML.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 96 archivos, 0 errores.
- **Lighthouse móvil**, con la misma configuración que los dos intentos anteriores: `npx -y lighthouse@13.6.0`, Chrome instalado (`CHROME_PATH`), `--headless=new`, `--form-factor=mobile` (simulación por defecto), `--only-categories=performance,accessibility,seo`, sobre `vite preview` (`localhost`, puerto 4173), con el build de este commit:

  | Ruta | Pasada | Rendimiento | Accesibilidad | SEO | LCP | TBT | CLS |
  |---|---|---|---|---|---|---|---|
  | `/` | 1 | 97 | 100 | 100 | 1.2 s | 200 ms | 0 |
  | `/` | 2 | 100 | 100 | 100 | 1.1 s | 50 ms | 0.001 |
  | `/` | 3 | 96 | 100 | 100 | 1.2 s | 220 ms | 0 |
  | `/proyectos/` | 1 | 97 | 100 | 100 | 0.9 s | 190 ms | 0.055 |
  | `/proyectos/` | 2 | 100 | 100 | 100 | 0.8 s | 70 ms | 0.025 |
  | `/proyectos/` | 3 | 98 | 100 | 100 | 0.8 s | 170 ms | 0.025 |
  | `/casos/ita-2026/` | 1 | 99 | 100 | 100 | 0.9 s | 140 ms | 0.003 |
  | `/casos/ita-2026/` | 2 | 100 | 100 | 100 | 0.9 s | 80 ms | 0.003 |
  | `/casos/ita-2026/` | 3 | 100 | 100 | 100 | 0.9 s | 70 ms | 0.003 |

  **Medianas:** `/` 97 · 100 · 100, CLS 0; `/proyectos/` 98 · 100 · 100, CLS 0.025; `/casos/ita-2026/` 100 · 100 · 100, CLS 0.003. Las tres rutas pasan de 90 en Rendimiento, Accesibilidad y SEO, y su CLS queda por debajo de 0.1. **El comprobante de T12 se cumple.** Ninguna pasada dio el CLS de 0.937 de los intentos anteriores. El peor CLS suelto fue 0.055, en la primera pasada de `/proyectos/`.
- **Nota de medición.** En PowerShell, `--only-categories=performance,accessibility,seo` sin comillas llega a Lighthouse como «performance accessibility seo» y la ejecución falla con «unrecognized category». Hay que pasar cada argumento entre comillas simples. `vite preview` escucha en `::1`, así que la URL lleva `localhost` y no `127.0.0.1`.
- `vite preview` se cerró y la carpeta temporal de `%TEMP%` (informes JSON y registro) se borró. Fuera del commit, como en T1–T11: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

T13 · 2026-11-20 · hecho · `scripts/auditoria-navegador.mjs` (copia de `../.capturas-tmp/auditoria-tipografica.mjs` sobre `playwright-core` 1.65.1 y el Chrome instalado) audita 11 rutas, entre ellas `/proyectos` y una página por ficha publicada; script `auditar` en `package.json`. `npm run auditar`: 44 páginas (11 rutas × escritorio 1440 × 900 y móvil 390 × 844 × es y en), 0 fallos. Retirada `public/casos/ita/`, como fijó la Decisión 2026-11-20 (medios) de T6.

## Detalle de T13

### Archivos

- `scripts/auditoria-navegador.mjs`: la auditoría de `../.capturas-tmp/` con estos cambios, y nada más:
  - `import { chromium } from 'playwright-core'` en vez de `'playwright'`. Sigue lanzando `chromium.launch({ channel: 'chrome' })`, el Chrome instalado; no se descargó ningún navegador (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` al instalar; `playwright-core` no tiene paso de descarga).
  - Rutas: se añaden `/proyectos` y una ruta por ficha `publicado` de `contenido/proyectos/*/proyecto.json` (`/casos/<slug>` si es `caso-cliente`, `/proyectos/<slug>` si es `laboratorio`), sin duplicados. Hoy solo hay ITA, que ya estaba (`/casos/ita-2026`); una demo nueva entra sola en la auditoría. Se conservan las 10 rutas de antes, también `/casos`, que ahora lleva a `/proyectos#casos` y así queda comprobada la redirección dentro de la app.
  - Sale con código 1 si hay algún fallo, para que sirva de comprobante. Antes siempre salía con 0.
  - El informe JSON solo se escribe si se pasa como segundo argumento (`npm run auditar -- http://localhost:4173 informe.json`). Antes se escribía siempre `auditoria.json` en la carpeta actual, que habría ensuciado el repositorio.
  - Si no responde nada en la base (por defecto `http://localhost:4173`), sale con código 1 y dice que hay que correr `npm run build` y `npm run preview`.
- `package.json`: `"auditar": "node scripts/auditoria-navegador.mjs"` y `playwright-core` `^1.65.1` en `devDependencies` (más `package-lock.json`).
- `public/casos/ita/` (6 archivos: las 3 capturas, `ita.mp4`, `ita.webm`, `ita-poster.webp`): borrada con `git rm`. Desde T6 nada la usaba (búsqueda de `casos/ita`, `ita.mp4`, `ita-poster` y `problema-escritorio` fuera de `.md`: sin resultados); todo sale de `/proyectos/ita-2026/`. Los originales siguen en `contenido/proyectos/ita-2026/medios/`. `dist/casos/ita/` ya no existe tras el build.
- `pendientes/LEEME.md`: el paso 1 apuntaba a `public/casos/ita/`. Ahora dice que los tres `.jpg` van a `contenido/proyectos/ita-2026/medios/` y que el build los copia a `public/proyectos/ita-2026/`.

### Puntos que T13 no especificaba

- **Versión de `playwright-core`.** La estable más reciente con más de un día: `1.65.1`, publicada el 2026-11-13 (`latest` en npm). Las `1.66.0-alpha-*` son prelanzamientos.
- **Servidor.** `npm run auditar` no arranca `vite preview`: lo espera en marcha, como dice la tabla de verificación de design.md («0 fallos (vite preview)»).
- **`/proyectos/<slug>` de un caso de cliente** (por ejemplo `/proyectos/ita-2026`) no se audita aparte: solo lleva a `/casos/<slug>`, que ya está en la lista.

### Comprobantes

- `npm run lint`: código 0.
- `npm run validar`: «Fichas de proyecto válidas: 1.», código 0.
- `npm run build`: código 0. «Prerenderizado completo.», sitemap con 9 URL, «HTML sin fronteras separadas: 10.». Siguen las advertencias `[Ayemi §3.10] … 18 px / 22 px`, anteriores a T1.
- `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 97 archivos revisados, 0 errores.
- `npm run auditar` contra `vite preview` (puerto 4173): 44 páginas, **0 fallos**, código 0. Ningún elemento con una familia o pila fuera del manual, con cursiva o negrita sintética, con glifos de otra fuente ni con Instrument Serif en más de 3 líneas. Instrument Serif aparece en 1 elemento, solo en la portada. Elementos con texto por página (escritorio es): `/` 325 · `/laboratorio` 151 · `/proyectos` 50 · `/casos/ita-2026` 87 · `/casos` 50 · `/casos/calculadora-series` 56 · `/casos/invitacion-boda` 59 · `/pcb` 211 · `/enlaces` 31 · `/privacidad` 99 · `/ruta-que-no-existe` 39.
- Sin servidor, `npm run auditar` sale con código 1 y el aviso de arrancar `vite preview` (comprobado antes de levantarlo).
- `vite preview` se cerró al terminar. No quedan archivos temporales. Fuera del commit, como en T1–T12: `docs/Ayemi_Manual_de_Identidad_v2.0.pdf`.

## Pendiente de Dirección antes de producción

Por la Decisión 2026-11-20 (bloqueos de T9), estas respuestas de las preguntas frecuentes de la portada ya están en la copia (es y en, `confianza.preguntas.lista` en `src/i18n.js`), pero **no se publican en producción** sin que Dirección confirme que Ayemi lo hace:

- **3 · ¿Qué pasa después de la entrega?** / What happens after delivery?: «Si quieres que sigamos a cargo después, lo acordamos por escrito con su propio alcance.»
- **7 · ¿Firmamos confidencialidad?** / Do we sign an NDA?: «Sí. Si tu proyecto lo necesita, firmamos un acuerdo de confidencialidad antes de que nos cuentes los detalles.»

Por T10, «Quién está detrás» sigue con `SITIO.mostrarQuienEstaDetras = false`. Para publicarla hace falta que Dirección decida:

- **La foto o el video y el texto (es/en)** que recibe el componente por props, y cómo encajan con §1.1 (no se citan nombres de personas; Ayemi es una casa, no una marca personal).
- **Dónde se monta.** Propuesta: en la portada, entre «Quiénes somos» y «Contacto», sin entrada en la navegación.

## Pendiente para T11

**Atendido en T11** (ver «Detalle de T11 · Pendiente para T11, cómo quedó»). Solo sigue abierto el último punto, `absolute_redirect off;` en nginx, fuera del alcance de T11.

- **Directorio y página con la misma ruta (nginx).** Una demo tiene su página en `/proyectos/<slug>` y sus medios en `/proyectos/<slug>/<archivo>`. Con `try_files $uri $uri/ /index.html`, pedir `/proyectos/<slug>` encuentra el directorio de medios y, sin `index.html` dentro, nginx responde 403 en vez de la app. Deja de pasar cuando T11 prerenderice cada demo en `dist/proyectos/<slug>/index.html`. Hoy no afecta a ITA, que vive en `/casos/ita-2026`. Por la Decisión 2026-11-20 se resuelve en T11, no en T6.
- **Lo mismo pasa ya con `/proyectos` (comprobado en T7).** Como `dist/proyectos/` existe por los medios, nginx responde `/proyectos` → 301 `/proyectos/` → **403**, y `/proyectos/ita-2026/` → 403 (la app lo habría llevado a `/casos/ita-2026`). Se arregla al prerenderizar `dist/proyectos/index.html`; para `/proyectos/<slug de caso-cliente>` T11 tendrá que decidir si genera un HTML que redirija o añade una 301 en servidor.
- **`/proyectos` sin HTML propio.** En Vercel y en `vite preview` se sirve el de la portada: error #418 de hidratación y `aria-current` equivocado en la cabecera hasta que exista `dist/proyectos/index.html`.
- **`/casos` en el prerender y el sitemap.** `prerender.mjs` sigue generando `dist/casos/index.html` (vacío, porque la ruta es un `<Navigate>`, con el aviso de `StaticRouter`) y lo lista en `sitemap.xml`. Vercel y nginx redirigen antes de servirlo, pero el sitemap no debería listar una URL con 301. T7 no nombra `prerender.mjs`; se quita al añadir `/proyectos` en T11.
- **Redirecciones absolutas de nginx.** `return 301 "/…"` sale como `http://<host>/…` sin puerto (igual que las `/p/*` de antes). Detrás de un proxy con HTTPS conviene `absolute_redirect off;`. No se cambió por estar fuera de T7.

## Bloqueos

Ninguno en T1. Ninguno en T3 (los puntos sin especificar están en «Detalle de T3»). Ninguno en T4 (los puntos sin especificar están en «Detalle de T4»). Ninguno en T5 (los puntos sin especificar están en «Detalle de T5»). Ninguno nuevo en T6 (los puntos sin especificar están en «Detalle de T6 · segundo intento»). Ninguno en T7 (los puntos sin especificar están en «Detalle de T7»; lo que toca a T11, en «Pendiente para T11»). Ninguno en T8 (los puntos sin especificar están en «Detalle de T8»). Ninguno nuevo en T9 (los puntos sin especificar están en «Detalle de T9 · segundo intento»). Ninguno en T10 (los puntos sin especificar están en «Detalle de T10» y en «Pendiente de Dirección antes de producción»). Ninguno en T11 (los puntos sin especificar están en «Detalle de T11»). Ninguno nuevo en T12 (el tercer intento está en «Detalle de T12 · tercer intento»).

### T12 · el HTML prerenderizado trae `<main>` vacío · RESUELTO

**Resuelto el 2026-11-20** con la Decisión 2026-11-20 (segundo bloqueo de T12) de `tasks.md`, aplicada en el tercer intento de T12. `prerender.mjs` usa `{ progressiveChunkSize: Infinity }` y `scripts/comprobar-prerender.mjs`, como último paso de `npm run build`, falla si algún `dist/**/index.html` trae `<template id="B:` o `$RC`. Medianas de Lighthouse móvil: Rendimiento 97 / 98 / 100, Accesibilidad y SEO 100 en las tres rutas, CLS 0 / 0.025 / 0.003.

T12 aplicó toda la Decisión 2026-11-20 (bloqueos de T12), pero Rendimiento no llega a 90. Las medianas son 70 en `/`, 87 en `/proyectos/` y 85 en `/casos/ita-2026/`. Las cifras y la prueba están en «Detalle de T12 · segundo intento».

**Causa.** React 19.2 separa del HTML toda frontera de `<Suspense>` que pase de 12 800 bytes (`progressiveChunkSize`), también con `prerenderToNodeStream`. La frontera de `App.jsx` envuelve la página entera. Por eso `dist/*/index.html` trae `<main>` con un `<template id="B:0">`, el contenido en un `<div hidden>` al final del `<body>` y un guion `$RC` que lo coloca. Hasta que ese guion corre, la página no tiene contenido y el pie queda debajo de la cabecera: el LCP se retrasa a 3.3–4.3 s y a veces el CLS sube a 0.937. Esto está en `prerender.mjs` (T11), que T12 no nombra. La opción A de la Decisión no lo toca.

**Propuesta de Kiro (medida y revertida).** Añadir a `T12` el archivo `prerender.mjs`, con un único cambio: `{ progressiveChunkSize: Infinity }` como segundo argumento de `prerenderToNodeStream`, y un comentario que explique el porqué. Con eso cada frontera completa va en línea, en su sitio. Medido con las mismas tres pasadas por ruta, las medianas fueron 96 / 100 / 98 en Rendimiento, 100 en Accesibilidad y SEO en las tres rutas, y CLS de 0.001 / 0.025 / 0.003. La precarga de `rutasDiferidas.jsx` se conserva. Se propone además añadir un comprobante a T12: ningún `dist/**/index.html` contiene `<template id="B:` ni `$RC`, para que una frontera nueva no vuelva a separarse en silencio.

- Alternativa: subir el límite a un número fijo (por ejemplo `1_000_000`) en lugar de `Infinity`. El efecto hoy es el mismo, pero una página muy grande volvería a separarse sin aviso.
- Alternativa: quitar la frontera de `App.jsx` y poner una por página. No basta: la de `Inicio` sigue pasando de 12 800 bytes. Además, contradice la opción A.

Con la propuesta aceptada, para cerrar T12 basta aplicar ese cambio, reconstruir, medir y hacer el commit.

### T12 · rendimiento (primer intento) · RESUELTO

**Resuelto el 2026-11-20** con la Decisión 2026-11-20 (bloqueos de T12) de `tasks.md`, que se aplicó en el segundo intento de T12: opción A (`App.jsx` y `main.jsx` dentro del alcance, página de la ruta actual resuelta antes de `hydrateRoot`), mediana de tres pasadas como comprobante, `gif` como `{ src, ancho, alto }`, `imagenAncho`/`imagenAlto` en piezas y `texto-suave` en los dos textos de 4.41:1. El diagnóstico del punto 1 resultó incorrecto, ver el bloqueo abierto de arriba.

T12 se detuvo sin cambios de código. Hacen falta dos decisiones; las cifras y el diagnóstico están en «Detalle de T12».

**1 · El contenido de `<main>` desaparece al hidratar (fuera de lo que T12 nombra).** Con la red y la CPU estranguladas de Lighthouse móvil, a veces `<main>` se vacía y la página se monta otra vez en cliente: CLS 0.936 y LCP 3.3–4.2 s. Por eso Rendimiento sale entre 62 y 100 en la misma ruta. Borrar `src/assets/*`, dejar solo `woff2` y poner `width`/`height` no toca esa causa, que está en `App.jsx` / `main.jsx` (T7), archivos que T12 no nombra. Arreglarlo es elegir entre opciones con efectos distintos:

- **A (propuesta).** Antes de `hydrateRoot`, `main.jsx` resuelve el trozo de la ruta actual (la misma función de `import()` que usa `lazy()`, exportada desde un módulo de rutas) y la página se pasa ya resuelta, de modo que la primera hidratación no se suspende. Se conserva la carga diferida de R9 para las demás rutas. Toca `App.jsx` y `main.jsx`.
- **B.** Localizar la actualización que cruza la frontera de `Suspense` antes de que termine de hidratar y envolverla en `startTransition`. Es más pequeño si la causa es una sola, pero no se encontró en esta pasada y otra actualización futura lo volvería a romper.
- **C.** Quitar `lazy()` de las cuatro páginas. Es lo más simple, pero contradice R9 y design.md («Todas las páginas nuevas con `lazy()`»).

Con A, se propone que T12 incluya `src/App.jsx` y `src/main.jsx` en su alcance y que el comprobante sea la mediana de tres pasadas de Lighthouse por ruta (≥ 90 en las tres categorías), porque una sola pasada varía más de 30 puntos.

**2 · Dos `<img>` sin datos para `width`/`height`.** Las dos están en código que hoy no se pinta con ningún dato real, pero T12 pide `width`/`height` en todas las `<img>`:

- `src/pages/PaginaProyecto.jsx`, el GIF del bloque 2: en el esquema, `gif` es solo una ruta (`$defs/ruta`), sin ancho ni alto. **Propuesta:** `gif` pasa a objeto `{ src, ancho, alto }` como `imagenes[]`, en `proyecto.schema.json` y en `PaginaProyecto.jsx` (cambia el contrato de R1.2, aunque ninguna ficha usa `gif` todavía). Alternativa sin tocar el esquema: 1280 × 720, el mismo tamaño fijo que la Decisión 2026-11-20 de T2 da al video y que `VideoProyecto` usa por defecto. Con `h-auto` el GIF no se deforma si mide otra cosa, pero habría un salto de diseño al cargar.
- `src/features/piezas/FichaPieza.jsx`, `pieza.imagen`: el contrato de `src/config/piezas.js` la define como una ruta, sin medidas, y ninguna pieza la usa. **Propuesta:** añadir `imagenAncho` e `imagenAlto` al contrato documentado en `piezas.js` y pasarlos a la `<img>`. Si no se pintan, la `<img>` no se pinta.

**Lo demás de T12 está claro y listo para hacerse al reanudar:** borrar `src/assets/hero.png`, `src/assets/Logos/*`, `src/assets/react.svg` y `src/assets/vite.svg` (sin uso, comprobado con `git grep`) y sustituir los `@import` de `ayemi-fuentes.css` por 13 `@font-face` solo con `woff2`.

**Para Dirección de marca, fuera de T12:** `--ay-texto-tenue` sobre `--ay-superficie` da 4.41:1 (pide 4.5:1) en los chips de stack de las tarjetas y en un pie de la guía de Emi en la portada.

### T9 · portada, confianza y preguntas frecuentes · RESUELTO

**Resuelto el 2026-11-20** con la Decisión 2026-11-20 (bloqueos de T9) de `tasks.md`: se aceptan las propuestas 1–4 tal como están escritas y el borrador de las 8 preguntas tal cual. Las respuestas 3 y 7 van sin «[confirmar]» y quedan en «Pendiente de Dirección antes de producción». Aplicado en el segundo intento de T9.

T9 se detuvo antes de escribir código. Cada punto lleva la propuesta que Kiro aplicaría si el arquitecto la acepta tal como está escrita.

1. **Secciones de la portada que el orden de T9 no nombra. Bloquea.** T9 fija «Hero · Proyectos destacados · Método · Entrega con llaves · Transparencia · Preguntas · Contacto». Hoy la portada tiene además `Servicios` (`#que-construimos`), `TechStack` (`#capacidad`), `OfertasEntrada` (`#ofertas`), `Posicionamiento` (`#alternativas`), `AnticipoLaboratorio` (`#del-laboratorio`) y `QuienesSomos` (`#quienes-somos`). Si la lista es completa, se quitan seis secciones. Entonces la entrada «Qué construimos» de la navegación de design.md (`/#que-construimos`, también marcada en `/pcb`) se queda sin destino, y «Cómo trabajamos» pierde `#alternativas`. T9 tampoco nombra borrar componentes.
   - **Propuesta de Kiro:** no quitar nada. Las siete piezas de T9 conservan su orden relativo y las demás quedan donde están respecto al Método: Hero · Proyectos destacados · Servicios · TechStack · Ofertas · Método · Posicionamiento · Entrega con llaves · Transparencia · Preguntas · Laboratorio · Quiénes somos · Contacto. La navegación y `SECCIONES` no cambian, salvo que las tres secciones nuevas (`entrega`, `transparencia`, `preguntas`) entran en `SECCIONES` sin entrada propia, para que al leerlas no quede marcada «Cómo trabajamos».
   - Alternativa: la lista es completa. Entonces hace falta decidir el destino nuevo de «Qué construimos» y de «Cómo trabajamos › alternativas», y si los componentes que salen se borran o se quedan sin uso.
2. **«Proyectos destacados (3 tarjetas)» con una sola ficha publicada.** Hoy solo ITA está publicada. Las piezas `calculadora-series` e `invitacion-boda` no son fichas. El esquema no tiene un campo `destacado`, y R0.5 impide rellenar huecos.
   - **Propuesta de Kiro:** las 3 fichas publicadas más recientes por `fecha` (de los dos tipos), con `TarjetaProyecto`, en una sección `#destacados` titulada «Proyectos destacados» / «Featured projects», y debajo «Ver todos los proyectos» / «See all projects» → `/proyectos` como botón secundario (el primario de la vista sigue en el hero). Con menos de 3 se pintan las que haya (hoy 1) y con 0 la sección no se pinta. Las piezas no entran.
3. **Contenido de Transparencia.** R7 dice «cada demo muestra `verificadoEl` y «se reinicia cada …»». No hay ninguna ficha `laboratorio` publicada, así que con R0.5 el bloque hoy no tendría datos.
   - **Propuesta de Kiro:** una sección `#transparencia` con una lista de demos publicadas: título (enlace a `/proyectos/<slug>`), «Comprobada el {{fecha}}» / «Checked on {{fecha}}» con la fecha en `font-mono`, y «La demo se reinicia cada {{cada}}.» (`caso.seReinicia`, que ya existe). Si no hay demos publicadas, la sección no se pinta, así que hoy no se vería en la portada. Alternativa: un texto fijo que se pinte siempre, con los textos de `hero.pruebas.rango*` («Estimaciones con rango…»), y la lista de demos debajo cuando existan.
4. **Dónde vive `EntregaConLlaves`.** T6 ya creó `src/features/proyectos/EntregaConLlaves.jsx` (lista con `caso.entrega` + `entregamos[]`, usada en `PaginaProyecto`). T9 pide un `EntregaConLlaves.jsx` con `hero.pruebas.llaves*`, y R7 pide tres temas: código a tu nombre, documentación y traspaso. `llaves*` cubre los dos primeros; el traspaso está en `hero.pruebas.traspaso*`.
   - **Propuesta de Kiro:** no tocar el componente de T6. Crear `src/features/confianza/EntregaConLlaves.jsx` (exporta `SeccionEntregaConLlaves`, para no chocar de nombre), sección `#entrega` con microetiqueta, título `hero.pruebas.llavesTitulo`, `hero.pruebas.llavesTexto` y un segundo párrafo con `hero.pruebas.traspasoTitulo` / `traspasoTexto`. Sin textos nuevos. `hero.pruebas.rango*` se queda para Transparencia si se elige la alternativa del punto 3.
5. **Datos de negocio que el repositorio no tiene.** Tres respuestas comprometen a Ayemi y no hay ningún texto del sitio que las respalde: plazos de software (solo existe el de placas: «Te damos una fecha concreta al cotizar»), qué pasa después de la entrega (no hay nada sobre soporte o mantenimiento) y si se firma confidencialidad (no hay nada). Abajo va el borrador de las 8 preguntas. Las marcadas con **[confirmar]** necesitan que alguien con autoridad diga si Ayemi lo hace. Las demás solo repiten lo que el sitio ya dice. Ninguna lleva precios ni nombres de personas.

#### Borrador de las 8 preguntas (es / en), para aprobar

Componente `src/features/confianza/PreguntasFrecuentes.jsx` con el patrón `<details>/<summary>` de `PreguntasPcb`, sección `#preguntas`, microetiqueta «PREGUNTAS FRECUENTES» / «FAQ», título «Lo que nos preguntan antes de empezar.» / «What people ask us before starting.». Claves en `confianza.preguntas.lista[]` (`p`, `r`), en es y en. El JSON-LD `FAQPage` es de T11 y leerá esa misma lista.

1. **¿Cuánto tarda?** — Te damos una fecha con rango al cotizar: un mínimo, un máximo y los supuestos que sostienen cada uno. Entregamos por pasos cortos, así que ves avances funcionando antes del final.
   **How long does it take?** — We give you a date range with the quote: a minimum, a maximum and the assumptions behind each. We deliver in short steps, so you see working progress before the end.
2. **¿El código es mío?** — Sí. El repositorio, la infraestructura y la documentación quedan a tu nombre desde el primer día. Si mañana otro equipo lo retoma, tiene todo lo que necesita.
   **Is the code mine?** — Yes. The repository, the infrastructure and the documentation are in your name from day one. If another team picks it up tomorrow, it has everything it needs.
3. **¿Qué pasa después de la entrega?** — Cerramos con una sesión de entrega técnica y un documento de operación. **[confirmar]** Si quieres que sigamos a cargo después, lo acordamos por escrito con su propio alcance.
   **What happens after delivery?** — We close with a technical handover session and an operations document. **[confirm]** If you want us to stay in charge afterwards, we agree on it in writing with its own scope.
4. **¿Trabajan con hardware?** — Sí. Diseñamos placas electrónicas y te entregamos el proyecto de KiCad editable y los archivos de fabricación (Gerber, BOM, CPL). En Hardware (`/pcb`) está el detalle.
   **Do you work with hardware?** — Yes. We design electronic boards and hand you the editable KiCad project and the manufacturing files (Gerber, BOM, CPL). Hardware (`/pcb`) has the details.
5. **¿Cómo se cotiza?** — Primero entendemos qué quieres construir. Después te mandamos una estimación con rango y los supuestos que la sostienen; si el alcance cambia, el cambio se escribe antes de hacerlo.
   **How do you quote?** — First we understand what you want to build. Then we send you an estimate with a range and the assumptions behind it; if the scope changes, the change is written down before we make it.
6. **¿Las demos son de clientes?** — No. Los proyectos del Laboratorio son proyectos demostrativos de Ayemi, hechos para que pruebes cómo trabajamos. Los casos de clientes van aparte y rotulados como tales.
   **Are the demos client work?** — No. Lab projects are Ayemi demo projects, built so you can try how we work. Client cases are listed separately and labelled as such.
7. **¿Firmamos confidencialidad?** — **[confirmar]** Sí. Si tu proyecto lo necesita, firmamos un acuerdo de confidencialidad antes de que nos cuentes los detalles.
   **Do we sign an NDA?** — **[confirm]** Yes. If your project needs it, we sign a non-disclosure agreement before you share the details.
8. **¿Cómo empiezo?** — Escríbenos por WhatsApp o desde el formulario con lo que quieres construir. Basta una descripción breve para la primera conversación.
   **How do I start?** — Message us on WhatsApp or through the form with what you want to build. A short description is enough for the first conversation.

Para reanudar T9 basta con aceptar o corregir los puntos 1–5 y el borrador. Con eso no queda nada abierto.

### T6 · rótulo «La solución» contra el léxico del manual · RESUELTO

**Resuelto el 2026-11-20** con la Decisión 2026-11-20 (bloqueos de T6) de `tasks.md`: el bloque 2 se rotula «Qué hicimos» / «What we did» (clave `caso.hicimos`) y «solución» no se usa en copia visible. Aplicado en el segundo intento de T6.

R5.2 nombra el bloque 2 de la página de caso **«La solución»**. El manual retira «solución» del léxico (§1.11; `ayemi-voz`: «solución → sistema, plataforma, herramienta»), y R0.1 dice que ese léxico gobierna todo. Las reglas de `tasks.md` piden detenerse cuando la tarea choca con el manual. El rótulo es copia visible en es y en, así que lo decide el arquitecto:

1. Usar **«Qué hicimos»** / «What we did», la clave `caso.hicimos` que ya existe y que la página de ITA usa hoy para ese mismo contenido (T2 mapeó `hicimos` → `textos.solucion`). Propuesta de Kiro: no inventa copia y no cambia lo que se ve hoy.
2. Otro rótulo nuevo, por ejemplo «Lo que construimos» / «What we built».
3. Mantener «La solución» con una excepción escrita al §1.11 (la aprueba la dirección de marca).

El campo `textos.<idioma>.solucion` del esquema no es visible y puede quedarse como está.

### T6 · puntos sin especificar que también hacen falta para reanudar · RESUELTOS

**Resueltos el 2026-11-20.** La Decisión 2026-11-20 (bloqueos de T6) acepta todas estas propuestas tal como están escritas, y el segundo intento de T6 las aplicó. El último punto (directorio y página en nginx) pasa a «Pendiente para T11».

Ninguno bloquea por sí solo. Para que la siguiente ejecución no se detenga otra vez, cada uno lleva la propuesta que Kiro aplicaría si el arquitecto no dice otra cosa:

- **Datos del caso que R5 no ubica.** El orden de R5 no tiene sitio para `imagenes` (obligatorias en toda ficha publicada), ni para las `cifras`, el `resultado`, el `testimonio`, el `sitio` y el aviso de marca independiente que hoy tiene `/casos/ita-2026`. Propuesta: cabecera con etiqueta, h1, enlace al `sitio` y aviso de `cliente` (solo si existen); `imagenes`, `cifras`, `resultado` y `testimonio` dentro del bloque 2, después del texto y del video, con subtítulos h3. Así el caso no pierde nada y el orden de R5 no cambia.
- **Ruta `/proyectos/:slug`.** T6 dice que las dos rutas usan la misma página; T7 registra las rutas de design.md con `lazy()`. Propuesta, como en T5: `CasoOFicha` pinta `PaginaProyecto` para las fichas `caso-cliente` (y `FichaPieza` para el resto); `PaginaProyecto` acepta las dos rutas, pero `App.jsx` no se toca hasta T7. Hoy no hay demos publicadas, así que no hay nada que ver en `/proyectos/<slug>`.
- **Qué fichas copia `copiar-medios.mjs`.** La decisión dice `contenido/proyectos/<slug>/medios/*`. Copiar también las fichas `en-construccion` o `retirado` publicaría sus archivos en una URL que se puede adivinar. Propuesta: solo las `publicado` (R0.5) y solo el primer nivel de `medios/`, como el importador. No borra nada de `public/proyectos/` (carpeta generada, fuera de git).
- **Diagrama.** Sus clases usan `var(--ay-*)` y con `<img>` no heredan los tokens. Propuesta: pintarlo en línea con `import.meta.glob('…/medios/*.svg', { query: '?raw' })`, que da el mismo texto en el cliente y en el prerender, quitando `<script>`, atributos `on…` y `javascript:`. El archivo se sigue copiando a `public/proyectos/<slug>/`.
- **Enlace a `codigo`.** R5 no dice dónde va. Propuesta: «Ver el código» en «Cómo está hecho», junto al stack.
- **Una sola acción principal.** «Pruébalo» y el cierre de WhatsApp son dos acciones. Propuesta: WhatsApp primario y «Abrir la demo» secundario (§5.3).
- **`clic_demo` y `caso_visto`.** Los nombra T8. Propuesta: T6 deja `BloquePruebalo` y `PaginaProyecto` sin eventos.
- **`utm_content=<slug>`.** design.md lo pone en la página de caso. Propuesta: una función nueva `fijarUtmContenido(slug)` en `medicion.js` que solo escribe si no había `utm_content`, sin tocar los eventos existentes. Efecto que hay que aceptar: desde ese momento `conOrigenWhatsapp` añade «Origen: ita-2026» a cualquier WhatsApp de la visita, y `rastrear` manda ese `utm_content` en todos los eventos.
- **«Lo que entregaríamos».** R5 da los tres temas (código a tu nombre, documentación, traspaso) pero no el texto. Propuesta, para revisión: «Código a tu nombre: el repositorio y la infraestructura quedan en tus cuentas desde el primer día.» · «Documentación: cómo se instala, cómo se opera y cómo lo retoma otro equipo.» · «Traspaso: una sesión de entrega técnica y un documento de operación.», más `entregamos[]` de la ficha.
- **Resto de textos nuevos (es/en), para revisión.** «Proyecto demostrativo de Ayemi» / «Ayemi demo project»; «Ayemi no tiene relación con {{marca}}.» / «Ayemi has no relationship with {{marca}}.»; El problema / The problem; Pruébalo / Try it; Abrir la demo; Usuario de prueba; Clave de prueba; Copiar / Copiado; «La demo se reinicia cada {{cada}}.»; Cómo está hecho / How it is built; Lo que entregaríamos / What we would deliver; «¿Lo quieres para tu negocio?» / «Want it for your business?»; botón «Escríbenos por WhatsApp» / «Message us on WhatsApp»; y el mensaje de design.md, «Hola, vi «{{titulo}}» en ayemi.org y quiero algo así para mi negocio.», con el dominio tomado de `SITIO.url`.
- **Directorio y página con la misma ruta.** Con la decisión, una demo tiene su página en `/proyectos/<slug>` y sus medios en `/proyectos/<slug>/<archivo>`. En nginx (`try_files $uri $uri/ /index.html`), pedir `/proyectos/<slug>` encuentra el directorio de medios y, sin `index.html` dentro, responde 403 en vez de la app. Deja de pasar cuando T11 prerenderice cada demo en `dist/proyectos/<slug>/index.html`. Hoy no afecta a ITA, que vive en `/casos/ita-2026`. Para tener en cuenta en T7/T11.


### T2 · ficha `publicado` sin video ni GIF · RESUELTO

**Resuelto el 2026-11-20** con la Decisión 2026-11-20 de `tasks.md` (T2): el esquema no se relaja y ITA lleva un video hecho solo con sus capturas reales. Aplicado en el segundo intento de T2 (ver «Detalle de T2 · segundo intento»).

T2 pide `estado: publicado` y nombra como medios solo las capturas y `diagrama.svg`. El esquema que fijó T1 (R1.3) exige `video` o `gif` en toda ficha `publicado`, y el validador detiene `npm run build` si faltan. ITA no tiene video ni GIF. T4 («si no hay ninguno, rota capturas de ITA») y R5.2 («un bloque sin datos no se pinta») sugieren que el caso sin video estaba previsto, pero el esquema no lo admite.

Las salidas posibles cambian el contrato o el contenido, así que las decide el arquitecto:

1. Relajar el esquema para `caso-cliente`, de modo que `video`/`gif` solo sea obligatorio en `laboratorio`. Toca `proyecto.schema.json` (T1).
2. Grabar un video o GIF real de soluciones-ita.com y añadirlo a `medios/`. Hace falta saber quién lo graba y con qué contenido: las capturas con personal siguen sin permiso.
3. Dejar la ficha en `en-construccion`. Así no se muestra (R0.5), y `/casos/ita-2026` dejaría de existir al terminar la migración.

### T2 · puntos sin especificar que también hacen falta para reanudar · RESUELTOS

**Resueltos el 2026-11-20.** La Decisión 2026-11-20 no los nombra; como ninguno bloqueaba por sí solo, el segundo intento aplicó la propuesta escrita para cada uno (detalle en «Detalle de T2 · segundo intento»). Si el arquitecto prefiere otra salida, se cambia sin tocar la API de `proyectos.js`. El de los medios quedó resuelto en T6 con la Decisión 2026-11-20 (medios): `scripts/copiar-medios.mjs` y `urlMedio(slug, ruta)`.

Ninguno bloquea por sí solo, pero cada uno obliga a decidir algo:

- **Cómo llegan al navegador los archivos de `medios/`.** El validador exige rutas relativas a la carpeta de la ficha, y `design.md` no dice cómo se sirven. Importarlos con `import.meta.glob(..., { query: '?url' })` da una URL en el build del cliente (`/assets/…-hash.jpg`) y otra en el prerender (que usa el servidor de desarrollo, `/contenido/…`). El HTML estático quedaría con imágenes rotas y la hidratación no coincidiría. Propuesta mínima para T2: `casos.js` sigue sirviendo las copias que ya están en `public/casos/ita/`, y el mecanismo general se decide en T6/T11.
- **`capturasConPersonal`.** Esas tres capturas viven en `pendientes/casos/ita/`, fuera de `public/`, a la espera del permiso de ITA. Si se copian a `medios/` y un glob las incluye, saldrían publicadas. Propuesta: guardar solo sus datos en la ficha (campo extra, con `permisoPersonal: false`) sin copiar los archivos, y cambiar el paso 2 de `pendientes/LEEME.md` para que apunte a `proyecto.json`.
- **`categorias` de ITA.** Ninguna de las cinco (`tiendas`, `pagos`, `ia`, `integraciones`, `hardware`) está asignada a ITA en la especificación. Propuesta: `[]` hasta que se decida.
- **Campos sin sitio en el esquema.** `problema` y `solucion` son cadenas, pero en `casos.js` son listas (2 párrafos y 5 puntos). `cifras`, `resultado`, `resultadoNegocio`, `testimonio`, `cliente`, `sitio`, `pieza` y el `pie` de cada captura no existen en el esquema. Como el esquema no usa `additionalProperties: false`, propuesta: párrafos unidos con `\n\n`, los textos que dependen del idioma dentro de `textos.es`/`textos.en` y el resto en el nivel superior.
- **Textos en inglés.** `src/i18n.js` no tiene la traducción del contenido de ITA, solo los rótulos de la página (`caso.*`) y la tarjeta de `/enlaces`. El bloque `en` habrá que escribirlo completo y quedará marcado aquí para revisión, como pide T2.
