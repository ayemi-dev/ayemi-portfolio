# Refactorización 2026-11 · tareas

## Reglas para Kiro (léelas en cada tarea)

- Ejecuta **solo la tarea que se te indique**. No adelantes otras ni «mejores» código fuera de su alcance.
- No decidas: si algo no está especificado o choca con el manual, **detente** y escríbelo en
  `.kiro/specs/refactor-2026-11/bitacora.md` bajo «Bloqueos».
- No instales dependencias que la tarea no nombre. No borres archivos que la tarea no nombre.
- Prohibido: `git push`, `git merge`, cambiar de rama, `vercel`, tocar `main`, tocar `.ayemi/`, `.env*`.
- Antes de terminar, corre los comprobantes de la tarea; los que fallen, corrígelos dentro del alcance.
- Termina con **un commit** en español, una frase descriptiva, sin prefijos (`feat:` no).
- Añade a `bitacora.md` una línea: `T<n> · <fecha> · hecho | bloqueado · <qué quedó>`.

Comprobantes base (siempre): `npm run lint` · `npm run build` ·
`python .ayemi/verificar.py . --solo-errores` (0 errores).

---

- [ ] **T1 · Esquema del contrato de proyectos**
  - Crea `contenido/proyectos/proyecto.schema.json` (JSON Schema 2020-12) con los campos de R1.2.
    `required` para `publicado`: si `tipo=laboratorio` → `demo`, `codigo`; siempre → `imagenes` (≥1),
    `video` o `gif`, `diagrama`, `textos.es`, `textos.en`. Usa `if/then` para lo condicional.
  - Agrega `ajv` y `ajv-formats` como devDependencies.
  - Crea `scripts/validar-proyectos.mjs`: valida cada `contenido/proyectos/*/proyecto.json`, comprueba que
    cada ruta de `medios/` exista y falla con «<slug>: falta <campo>» (código 1).
  - `package.json`: `"validar": "node scripts/validar-proyectos.mjs"` y `build` = `node scripts/validar-proyectos.mjs && vite build && node prerender.mjs`.
  - Comprobantes: base + una ficha de prueba inválida en un directorio temporal hace fallar `npm run validar` (bórrala al terminar).

- [ ] **T2 · Migrar ITA a ficha**
  - Crea `contenido/proyectos/ita-2026/proyecto.json` (`tipo: caso-cliente`, `estado: publicado`) con todo lo de
    `CASOS[0]` de `src/config/casos.js` (problema, hicimos→solucion, cifras, resultado, testimonio,
    `permisoPersonal`). Textos `en`: tradúcelos de `src/i18n.js` donde existan; si no existen, escribe el
    bloque `en` y márcalo en `bitacora.md` para revisión.
  - **Decisión 2026-11-20 (bloqueo de T2):** el esquema no se relaja. ITA lleva `video` hecho **solo con sus
    capturas reales** (sin nada inventado): ffmpeg (ya instalado, sin dependencias npm nuevas) con desplazamiento
    lento vertical de 3–4 capturas, 10–14 s, sin audio, 1280×720, `medios/ita.mp4` (H.264, `-movflags +faststart`,
    ≤ 2 MB) + `medios/ita.webm` (VP9) + `medios/ita-poster.webp` (la primera captura) y `duracionSeg`. Deja el
    comando ffmpeg exacto en `bitacora.md` para repetirlo con otros casos.
  - Copia las capturas de ITA a `contenido/proyectos/ita-2026/medios/`. Diagrama: crea `diagrama.svg` sencillo
    (sitio estático → formulario → correo) usando solo tokens de la paleta en `fill`/`stroke` vía clases.
  - Crea `src/config/proyectos.js` (API de design.md) con `import.meta.glob('/contenido/proyectos/*/proyecto.json', { eager: true })`.
  - `casos.js` pasa a reexportar desde `proyectos.js` para que la página actual siga igual.
  - Comprobantes: base + `/casos/ita-2026` se ve igual que antes (captura antes/después en `bitacora.md`).

- [ ] **T3 · Importador**
  - `scripts/importar-proyecto.mjs <ruta-repo>`: copia `ayemi/proyecto.json` y `ayemi/medios/*` a
    `contenido/proyectos/<slug>/`; convierte PNG/JPG a WebP ≤ 1600 px con `sharp` (devDependency); valida.
  - `package.json`: `"importar-proyecto": "node scripts/importar-proyecto.mjs"`.
  - Comprobantes: base + importar una carpeta de prueba creada en un temporal produce la ficha válida (bórrala después).

- [ ] **T4 · Hero con proyectos en movimiento**
  - Crea `features/hero/HeroProyectos.jsx` y `features/proyectos/VideoProyecto.jsx` (design.md).
  - Textos: conserva `hero.etiqueta`, `tituloAntes/Acento/Despues` y `descripcion`.
    `botonPrimario` = «Ver proyectos» / «See projects» → `/proyectos`.
    `botonSecundario` = «Cuéntanos tu idea» / «Tell us your idea» → WhatsApp con tema «idea» (mismo texto que hoy usa el botón).
  - Medios: videos de fichas publicadas; si no hay ninguno, rota capturas de ITA y vistas de placas de `public/pcb/*`.
  - Emi: mantener `BienvenidaEmi` donde está hoy.
  - Comprobantes: base + `prefers-reduced-motion` muestra póster (verificar en DevTools) + sin desbordes a 390 px.

- [ ] **T5 · Galería `/proyectos`**
  - `pages/Proyectos.jsx`, `TarjetaProyecto.jsx`, `FiltrosProyectos.jsx`.
  - Dos grupos con ancla: `#casos` («Casos de clientes») y `#laboratorio` («Proyectos del Laboratorio»).
    Un grupo sin fichas publicadas no se pinta.
  - Filtros por `categorias` y `stack` en `?tipo=&stack=` (valores múltiples separados por coma).
  - Estado vacío con `EstadoConEmi` (expresión neutral) y botón «Quitar filtros».
  - Comprobantes: base + teclado (Tab/Enter/Espacio) recorre filtros + `aria-live` anuncia «N proyectos».

- [ ] **T6 · Página de caso**
  - `pages/PaginaProyecto.jsx` y los componentes de design.md; orden fijo de R5; bloques sin datos no se pintan.
  - `/proyectos/:slug` y `/casos/:slug` usan la misma página. `CasoOFicha.jsx` sigue resolviendo piezas.
  - Etiqueta «Proyecto demostrativo de Ayemi» arriba si `laboratorio`; «Ayemi no tiene relación con X» por cada `marcasAjenas`.
  - **Decisión 2026-11-20 (medios, pregunta abierta en la bitácora de T2):** `scripts/copiar-medios.mjs` copia
    `contenido/proyectos/<slug>/medios/*` a `public/proyectos/<slug>/` y corre antes de `vite` en `dev` y antes de
    `vite build` en `build` (después del validador). `public/proyectos/` va en `.gitignore`. En la app, una función
    única `urlMedio(slug, ruta)` convierte la ruta relativa de la ficha en `/proyectos/<slug>/<archivo>`; así el
    build del cliente y el prerender dan la misma URL. `casos.js` deja de usar `public/casos/ita/` cuando ITA se
    pinte desde su ficha (no borres esa carpeta en T6; se retira en T13).
  - **Decisión 2026-11-20 (bloqueos de T6):** el rótulo del bloque 2 es **«Qué hicimos» / «What we did»** (clave
    `caso.hicimos`); «solución» no se usa en copia visible (§1.11). Se aceptan **todas** las propuestas de Kiro de
    «puntos sin especificar» de la bitácora de T6, tal como están escritas: ubicación de imágenes/cifras/resultado/
    testimonio dentro del bloque 2; `CasoOFicha` → `PaginaProyecto` sin tocar `App.jsx` hasta T7; copiar solo medios de
    fichas `publicado` y solo el primer nivel; diagrama en línea con `?raw` saneado; «Ver el código» en «Cómo está
    hecho»; WhatsApp primario y «Abrir la demo» secundario; sin eventos hasta T8; `fijarUtmContenido(slug)` (se acepta
    el efecto en `conOrigenWhatsapp`); los textos de «Lo que entregaríamos» y el resto de textos nuevos es/en tal cual.
    El choque directorio/página en nginx se resuelve en T11 (anótalo allí, no en T6).

- [ ] **T7 · Rutas, navegación y redirecciones**
  - `App.jsx`: rutas de design.md con `lazy()`. Navbar/Footer: «Proyectos» sustituye a «Casos» (es/en).
  - `vercel.json` y `nginx.conf`: `/casos` → `/proyectos#casos` (301); destinos de `/portafolio/*`, `/piezas/*` actualizados; no tocar `/p/*`.
  - Comprobantes: base + tabla en `bitacora.md` con cada redirección y su destino.

- [ ] **T8 · Medición nueva**
  - `medicion.js`: agrega `clic_demo` y `caso_visto` (design.md) sin modificar los existentes.
  - `BloquePruebalo` dispara `clic_demo`; `PaginaProyecto` dispara `caso_visto` una vez por slug.
  - Comprobantes: base + en `vite preview` con IDs de prueba vacíos no hay errores en consola.

- [ ] **T9 · Confianza y preguntas frecuentes**
  - `Transparencia.jsx`, `PreguntasFrecuentes.jsx` (8 preguntas, es/en, con `<details>`), `EntregaConLlaves.jsx`
    reutilizando `hero.pruebas.llaves*`. Orden en portada: Hero · Proyectos destacados (3 tarjetas) · Método ·
    Entrega con llaves · Transparencia · Preguntas · Contacto.
  - Preguntas (redáctalas con la voz de `ayemi-voz`): ¿Cuánto tarda? · ¿El código es mío? · ¿Qué pasa después
    de la entrega? · ¿Trabajan con hardware? · ¿Cómo se cotiza? (sin cifras) · ¿Las demos son de clientes? (no:
    son proyectos demostrativos) · ¿Firmamos confidencialidad? · ¿Cómo empiezo?
  - Comprobantes: base.

- [ ] **T10 · «Quién está detrás» (oculta)**
  - `QuienEstaDetras.jsx` con foto o video breve (props), `SITIO.mostrarQuienEstaDetras = false` en `src/config/sitio.js`.
  - Comprobantes: base + con `false` no aparece en el HTML prerenderizado ni en `sitemap.xml`.

- [ ] **T11 · Prerender y SEO**
  - `prerender.mjs`: `/proyectos` y cada ficha publicada; meta por ficha; JSON-LD `CreativeWork` y `FAQPage`.
  - Comprobantes: base + `dist/proyectos/index.html` y `dist/casos/ita-2026/index.html` existen con su `<title>` propio.

- [ ] **T12 · Rendimiento**
  - Borra `src/assets/hero.png`, `src/assets/Logos/*`, `src/assets/react.svg`, `src/assets/vite.svg` (no se usan;
    verifícalo con búsqueda antes). `ayemi-fuentes.css`: solo `woff2`. `width`/`height` en todas las `<img>`.
  - Comprobantes: base + Lighthouse móvil ≥ 90 (rendimiento, accesibilidad, SEO) en `/`, `/proyectos`, `/casos/ita-2026`; anota cifras en `bitacora.md`.

- [ ] **T13 · Auditoría con navegador en el repo**
  - Copia `../.capturas-tmp/auditoria-tipografica.mjs` a `scripts/auditoria-navegador.mjs`; agrega las rutas nuevas;
    `playwright-core` como devDependency (usa el Chrome instalado, sin descargar navegadores).
  - `package.json`: `"auditar": "node scripts/auditoria-navegador.mjs"`.
  - Comprobantes: base + `npm run auditar` = 0 fallos.

- [ ] **T14 · Propuesta de hosting**
  - Escribe `docs/hosting-cloudflare-pages.md` (R10). Verifica en la documentación oficial de Cloudflare y de
    Vercel, con fecha de consulta y enlace, cada afirmación de planes y límites. No cambies configuración.
  - Comprobantes: el documento cita fuentes con fecha.
