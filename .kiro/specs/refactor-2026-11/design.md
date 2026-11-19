# Refactorización 2026-11 · diseño

Solo lo que cambia. Lo que no se nombra aquí se queda como está.

## Mapa del código actual (referencia para Kiro)

| Qué | Dónde |
|---|---|
| Rutas | `src/App.jsx:72-89`, constantes en `src/config/secciones.js` |
| Textos es/en | `src/i18n.js` (`es` l.33, `en` l.1012) |
| Caso ITA | `src/config/casos.js`; página `src/pages/CasoOFicha.jsx` → `Caso` |
| Piezas | `src/config/piezas.js`, `src/features/piezas/FichaPieza.jsx` |
| Hero | `src/features/hero/Hero.jsx` (Emi en l.111) |
| Medición | `src/medicion/medicion.js` (`EVENTOS` l.28-33, `conOrigenWhatsapp` l.124) |
| WhatsApp | `enlaceWhatsapp(texto)` usado en `src/pages/Enlaces.jsx:219` |
| Prerender | `prerender.mjs` (rutas, meta por ruta l.213-251, sitemap) |
| Redirecciones | `vercel.json`, `nginx.conf` |
| UI base | `src/components/ui/{Boton,Tarjeta,Campo,Aviso}.jsx`, `layout/Seccion.jsx` |
| Emi | `src/components/marca/{Emi.tsx,EstadoConEmi.jsx,GuiaEmi.jsx}` |

## Datos

```
contenido/proyectos/
  proyecto.schema.json
  ita-2026/proyecto.json + medios/
  <slug>/proyecto.json + medios/        ← llegan con npm run importar-proyecto
src/config/proyectos.js                 ← carga y valida (import.meta.glob, eager)
scripts/importar-proyecto.mjs
scripts/validar-proyectos.mjs           ← corre al inicio de `npm run build`
```

`src/config/proyectos.js` expone `proyectosPublicados()`, `porTipo(tipo)`,
`buscarProyecto(slug)`, `categorias()`, `stacks()`. La validación usa `ajv`
(devDependency) en el script; en el navegador no se valida.
`src/config/casos.js` y las piezas `ita-2026` pasan a leer de la ficha; las
piezas `calculadora-series` e `invitacion-boda` se quedan como están.

## Rutas

| Ruta | Página | Nota |
|---|---|---|
| `/` | `Inicio.jsx` | hero nuevo + confianza + FAQ |
| `/proyectos` | `Proyectos.jsx` (nueva) | galería con dos grupos y filtros |
| `/proyectos/:slug` | `PaginaProyecto.jsx` (nueva) | demos del Laboratorio |
| `/casos/:slug` | `PaginaProyecto.jsx` | casos de clientes (misma plantilla) |
| `/casos` | 301 → `/proyectos#casos` | |
| `/portafolio`, `/portafolio/:slug`, `/piezas/:slug` | 301 como hoy, destino nuevo | |

Navegación (es/en): Proyectos · Qué construimos · Cómo trabajamos · Laboratorio · Contacto.
Todas las páginas nuevas con `lazy()` + `Suspense`.

## Componentes nuevos

- `features/proyectos/TarjetaProyecto.jsx` — imagen 16:10, título, resumen, chips de stack, etiqueta «Proyecto demostrativo» si `laboratorio`.
- `features/proyectos/FiltrosProyectos.jsx` — botones `aria-pressed`, estado en `useSearchParams`.
- `features/proyectos/VideoProyecto.jsx` — `<video muted playsinline loop preload="none" poster>`; reproduce con `IntersectionObserver`; con `prefers-reduced-motion` solo póster.
- `features/proyectos/BloquePruebalo.jsx` — enlace a la demo (`rel="noopener"`, `target="_blank"`), usuario/clave con botón copiar, dispara `clic_demo`.
- `features/proyectos/DiagramaYStack.jsx`, `EntregaConLlaves.jsx`, `CierreWhatsapp.jsx`.
- `features/hero/HeroProyectos.jsx` — reemplaza al hero actual; Emi se queda donde ya está permitido (bienvenida), nunca junto a un precio.
- `features/confianza/{Transparencia,PreguntasFrecuentes}.jsx`.
- `features/quienes/QuienEstaDetras.jsx` — detrás de `SITIO.mostrarQuienEstaDetras`.

## WhatsApp con tema y UTM

`enlaceWhatsapp(texto)` no cambia. Nuevo helper `mensajeDeProyecto(proyecto, idioma)`
devuelve «Hola, vi «<título>» en ayemi.org y quiero algo así para mi negocio.»
`conOrigenWhatsapp` ya agrega el origen UTM; además, la página de caso fija
`utm_content=<slug>` en `sessionStorage['ayemi:utm']` si no había uno.

## Medición

```js
clic_demo:  { ga4: 'clic_demo',  meta: 'ClicDemo', metaPropio: true }
caso_visto: { ga4: 'caso_visto', meta: 'ViewContent' }
```
Ambos llevan `proyecto` (slug); `caso_visto`, además, `tipo`. `caso_visto` se
dispara en un `useEffect` por `slug` (una vez por vista, también con StrictMode).

## Prerender y SEO

`prerender.mjs` agrega `/proyectos` y cada ficha publicada; meta por ficha
(título, resumen, `og:image` = primera imagen absoluta); JSON-LD `CreativeWork`
por proyecto y `FAQPage` en la portada. Sitemap sin rutas ocultas.

## Verificación (lo que Claude corre al validar cada tarea)

```bash
npm run lint && npm run build
python .ayemi/verificar.py . --solo-errores           # 0 errores
node scripts/auditoria-navegador.mjs                  # 0 fallos (vite preview)
npx lighthouse http://localhost:4173/ --form-factor=mobile --only-categories=performance,accessibility,seo
```
