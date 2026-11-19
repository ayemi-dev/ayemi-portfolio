# Refactorización 2026-11 · requisitos

Rama: `refactor-2026-11` (sale de `landing-2-2`, que aún no está en `main`).
Arquitecto y validador: Claude. Ejecutor: Kiro. Kiro ejecuta tareas cerradas de
`tasks.md`; **no explora, no decide, no despliega a producción**.

## Por qué

GA4, 20/10–19/11/2026: 30 usuarios en 30 días; de redes llegan unas 16 personas
y la mayoría se va en menos de 10 s; ningún `clic_whatsapp` vino de redes. El
sitio no da una razón para quedarse. El portafolio pasa a ser el protagonista.

## Reglas que gobiernan todo

- R0.1 Manual 2.2: tokens `--ay-*`, escala tipográfica de 12 peldaños, espaciado
  múltiplo de 4, Emi solo donde el steering `ayemi-emi` lo permite, léxico de
  `ayemi-voz`. `python .ayemi/verificar.py . --solo-errores` = **0 errores**.
- R0.2 Auditoría con navegador real (`scripts/auditoria-navegador.mjs`) = **0 fallos**
  en todas las rutas, escritorio 1440×900 y móvil 390×844, es y en.
- R0.3 Lighthouse móvil ≥ 90 en Rendimiento, Accesibilidad y SEO en `/`,
  `/proyectos` y una página de caso.
- R0.4 Bilingüe: toda cadena visible nueva existe en `es` y en `en` (`src/i18n.js`).
- R0.5 Nunca espacios vacíos ni «próximamente»: si un dato no existe, el bloque
  no se pinta. Solo se muestran fichas con `estado: "publicado"`.
- R0.6 Las demos se presentan siempre como **Proyecto demostrativo de Ayemi**,
  nunca como trabajo para clientes. Si usan una marca ajena: «Ayemi no tiene
  relación con <marca>».
- R0.7 Sin precios escritos a mano; Emi nunca junto a un precio.
- R0.8 Medición GA4 / Meta Pixel / Clarity intacta (eventos actuales sin cambios).
- R0.9 Nada se publica en producción: ni `main`, ni `vercel --prod`, ni `git push`.

## Requisitos funcionales

### R1 · Contrato de proyectos (`proyecto.json`)
1. Cada proyecto del portafolio se describe con una ficha `proyecto.json` que
   cumple `contenido/proyectos/proyecto.schema.json` (JSON Schema 2020-12).
2. Campos: `slug`, `tipo` (`caso-cliente` | `laboratorio`), `estado`
   (`en-construccion` | `publicado` | `retirado`), `fecha`, `categorias[]`
   (`tiendas` `pagos` `ia` `integraciones` `hardware`), `stack[]`,
   `textos.es` y `textos.en` (`titulo`, `resumen`, `problema`, `solucion`,
   `entregamos[]`), `imagenes[]` (`src`, `ancho`, `alto`, `alt.es`, `alt.en`),
   `video` (`mp4`, `webm`, `poster`, `duracionSeg`) o `gif`, `demo`
   (`url`, `usuarioPrueba`, `claveDePrueba`, `seReinicia`), `codigo` (URL),
   `diagrama` (SVG), `marcasAjenas[]`, `verificadoEl` (fecha de la última
   comprobación de la demo).
3. Una ficha `publicado` sin `imagenes`, sin `video`/`gif`, sin `diagrama` o
   (si es `laboratorio`) sin `demo` y `codigo` **hace fallar el build** con un
   mensaje que dice qué falta.
4. `npm run importar-proyecto -- <ruta-al-repo>` copia `ayemi/proyecto.json` y
   `ayemi/medios/*` de un repo de `ayemi-dev` a `contenido/proyectos/<slug>/`,
   valida contra el esquema y convierte imágenes a WebP ≤ 1600 px.
5. El caso ITA se migra a este formato (`tipo: caso-cliente`) sin perder datos
   de `src/config/casos.js`, incluido `permisoPersonal`.

### R2 · Portada
1. Hero con proyectos reales en movimiento: video sin sonido de las fichas
   publicadas (rotación); si ninguna tiene video, capturas reales (ITA y placas).
2. Propuesta de valor clara en una frase (texto en `tasks.md`, tarea 4).
3. Dos botones: «Ver proyectos» (primario → `/proyectos`) y «Cuéntanos tu idea»
   (secundario → WhatsApp con tema «idea» y UTM vigente).
4. `prefers-reduced-motion`: sin video, se muestra el póster.

### R3 · Casos de clientes vs Proyectos del Laboratorio
1. `/proyectos` muestra dos grupos separados y rotulados: «Casos de clientes» y
   «Proyectos del Laboratorio» (estos con la etiqueta «Proyecto demostrativo»).
2. `/casos/:slug` es la página de un caso de cliente; `/proyectos/:slug`, la de
   una demo. Las rutas actuales (`/casos`, `/portafolio/*`, `/piezas/*`) siguen
   funcionando con redirecciones 301 a su destino nuevo.

### R4 · Galería
1. Tarjetas grandes con imagen real, título, resumen y chips de stack.
2. Filtros por tipo (las cinco categorías) y por stack; combinables; reflejados
   en la URL (`?tipo=pagos&stack=nextjs`) para compartir; accesibles con teclado
   y lector de pantalla (`aria-pressed`, contador de resultados con `aria-live`).
3. Sin resultados: mensaje con Emi (estado vacío) y botón para quitar filtros.

### R5 · Página de caso (misma estructura para todos)
Orden fijo; un bloque sin datos no se pinta:
1. **El problema.** 2. **La solución** (video o GIF, con póster y controles).
3. **Pruébalo** (solo `laboratorio`): botón a la demo, usuario y clave de prueba
   copiables, «se reinicia cada …». Dispara `clic_demo`.
4. **Cómo está hecho:** diagrama SVG y stack.
5. **Lo que entregaríamos:** código a tu nombre, documentación, traspaso (más
   `entregamos[]` de la ficha).
6. **¿Lo quieres para tu negocio?:** WhatsApp con el tema del caso preseleccionado
   y UTM (`utm_content=<slug>`).
Al abrir la página se dispara `caso_visto` una sola vez por vista.

### R6 · «Quién está detrás» (preparada, sin publicar)
Componente listo con foto o video breve, detrás de `SITIO.mostrarQuienEstaDetras = false`.
Con `false` no se pinta, no se enlaza, no se prerenderiza y no entra al sitemap.

### R7 · Señales de confianza
En portada: Método (lo existente), «Entrega con llaves» (código a tu nombre,
documentación, traspaso), Transparencia (cada demo muestra `verificadoEl` y
«se reinicia cada …») y Preguntas frecuentes (6–8, con JSON-LD `FAQPage`).

### R8 · Medición nueva
- `clic_demo` → GA4 `clic_demo` (parámetro `proyecto`), Meta `trackCustom ClicDemo`.
- `caso_visto` → GA4 `caso_visto` (parámetro `proyecto`, `tipo`), Meta `ViewContent`.
- Se agregan a `EVENTOS` de `src/medicion/medicion.js` sin cambiar los existentes.

### R9 · Rendimiento
Lighthouse móvil ≥ 90 (R0.3): rutas con `lazy()`, video con `preload="none"` y
reproducción al entrar en pantalla, póster WebP, solo `woff2`, sin assets
huérfanos (`src/assets/*` sin uso), imágenes con `width`/`height`.

### R10 · Hosting (solo propuesta)
`docs/hosting-cloudflare-pages.md`: comparación con Vercel (uso comercial),
equivalente de `vercel.json` en `_redirects`/`_headers`, `api/contacto.js` como
Pages Function, variables de entorno, DNS y plan de reversa. **No se migra.**
