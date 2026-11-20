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

## Pendiente para T11

- **Directorio y página con la misma ruta (nginx).** Una demo tiene su página en `/proyectos/<slug>` y sus medios en `/proyectos/<slug>/<archivo>`. Con `try_files $uri $uri/ /index.html`, pedir `/proyectos/<slug>` encuentra el directorio de medios y, sin `index.html` dentro, nginx responde 403 en vez de la app. Deja de pasar cuando T11 prerenderice cada demo en `dist/proyectos/<slug>/index.html`. Hoy no afecta a ITA, que vive en `/casos/ita-2026`. Por la Decisión 2026-11-20 se resuelve en T11, no en T6.
- **Lo mismo pasa ya con `/proyectos` (comprobado en T7).** Como `dist/proyectos/` existe por los medios, nginx responde `/proyectos` → 301 `/proyectos/` → **403**, y `/proyectos/ita-2026/` → 403 (la app lo habría llevado a `/casos/ita-2026`). Se arregla al prerenderizar `dist/proyectos/index.html`; para `/proyectos/<slug de caso-cliente>` T11 tendrá que decidir si genera un HTML que redirija o añade una 301 en servidor.
- **`/proyectos` sin HTML propio.** En Vercel y en `vite preview` se sirve el de la portada: error #418 de hidratación y `aria-current` equivocado en la cabecera hasta que exista `dist/proyectos/index.html`.
- **`/casos` en el prerender y el sitemap.** `prerender.mjs` sigue generando `dist/casos/index.html` (vacío, porque la ruta es un `<Navigate>`, con el aviso de `StaticRouter`) y lo lista en `sitemap.xml`. Vercel y nginx redirigen antes de servirlo, pero el sitemap no debería listar una URL con 301. T7 no nombra `prerender.mjs`; se quita al añadir `/proyectos` en T11.
- **Redirecciones absolutas de nginx.** `return 301 "/…"` sale como `http://<host>/…` sin puerto (igual que las `/p/*` de antes). Detrás de un proxy con HTTPS conviene `absolute_redirect off;`. No se cambió por estar fuera de T7.

## Bloqueos

Ninguno en T1. Ninguno en T3 (los puntos sin especificar están en «Detalle de T3»). Ninguno en T4 (los puntos sin especificar están en «Detalle de T4»). Ninguno en T5 (los puntos sin especificar están en «Detalle de T5»). Ninguno nuevo en T6 (los puntos sin especificar están en «Detalle de T6 · segundo intento»). Ninguno en T7 (los puntos sin especificar están en «Detalle de T7»; lo que toca a T11, en «Pendiente para T11»).

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
