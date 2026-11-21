# Hosting de ayemi.org · propuesta de Cloudflare Pages frente a Vercel

Propuesta de R10 (refactorización 2026-11, tarea T14). **No se migra nada.** Este
documento no cambia ninguna configuración: `vercel.json`, `nginx.conf`, el DNS y
los paneles siguen como están. Los archivos `_redirects`, `_headers` y
`functions/api/contacto.js` que aparecen abajo son borradores para copiar el día
que se decida, no existen en el repositorio.

Todas las fuentes se consultaron el **2026-11-20** (hora de México, UTC−6). Cada
afirmación sobre planes, límites o comportamiento lleva entre corchetes el
número de su fuente en la sección [Fuentes](#fuentes). Lo que no pudimos
confirmar en la documentación oficial está marcado como **por comprobar** y
entra en la lista de pruebas de la sección 10.

## Recomendación

**Pasar ayemi.org a Cloudflare Pages en el plan Free, después de validar una
vista previa en `*.pages.dev`, y conservar el proyecto de Vercel sin borrar
durante 30 días como reversa.**

Por qué:

1. **El plan gratuito de Vercel no admite uso comercial.** Los Términos de
   Vercel dicen que el plan Hobby solo se usa «for your personal or
   non-commercial use» [V1, §4]. Ayemi es una casa comercial, así que seguir en
   Vercel de forma correcta exige el plan Pro: 20 USD al mes de cuota de
   plataforma, con 1 asiento y 20 USD de crédito de uso incluidos [V3]. Desde el
   repositorio no sabemos en qué plan está hoy la cuenta; si es Hobby, el
   incumplimiento ya existe.
2. **Cloudflare cubre este sitio sin costo.** En Pages, las peticiones a
   archivos estáticos son gratis y sin límite en todos los planes [C5]; el plan
   Free da 500 builds al mes [C1] y 100 000 peticiones diarias a Functions [C5].
   Con 30 usuarios en 30 días (GA4, 20/10–19/11/2026, `requirements.md`), el
   formulario de contacto queda varios órdenes de magnitud por debajo. En los
   términos de Cloudflare no encontramos una cláusula que limite los servicios
   gratuitos a uso personal o no comercial [C20, §2.6].
3. **El DNS ya vive en Cloudflare.** La zona `ayemi.org` usa los servidores de
   nombres `justin.ns.cloudflare.com` y `nancy.ns.cloudflare.com` (consulta DNS
   del 2026-11-20), y Cloudflare Email Routing ya recibe el correo. Un dominio
   raíz en Pages exige justo eso: que la zona esté en la misma cuenta de
   Cloudflare [C11].

Riesgos principales (detalle en la sección 9):

- **Cloudflare ya no recomienda Pages para proyectos nuevos.** La portada de su
  documentación dice: «Start new projects with Workers» [C12]. Pages sigue
  disponible en todos los planes, y `_redirects` y `_headers` funcionan igual
  en Workers con archivos estáticos [C13], pero la función de contacto habría
  que reescribirla si un día se pasa a Workers. Si Dirección prefiere no empezar
  en un producto secundario, esta misma propuesta vale para Workers con
  archivos estáticos; cambia el punto 6 y se añade un `wrangler.jsonc`.
- **La barra final.** Pages redirige `/proyectos/index.html` a `/proyectos/`
  [C3]. El canónico y el sitemap del prerender usan URL sin barra. Si Pages
  responde `/proyectos` con una redirección a `/proyectos/` (**por comprobar**;
  así se comporta Workers por defecto [C4]), cada URL del sitemap respondería
  con una redirección. Hay que decidirlo antes de cambiar el DNS (sección 4).
- **Parte de la configuración sale del repositorio.** Las redirecciones de
  `www.ayemi.org` y `portafolio.ayemi.org` no caben en `_redirects` y viven en
  el panel de Cloudflare como reglas de redirección [C2, C14].

Si no se acepta la migración, la alternativa correcta es **Vercel Pro** (20 USD
al mes [V3]), sin cambios en el código.

## 1. Lo que hay hoy

Datos tomados del repositorio en la rama `refactor-2026-11` el 2026-11-20.

| Pieza | Estado actual |
| --- | --- |
| `vercel.json` | 2 redirecciones por host (`www`, `portafolio` → `ayemi.org`), 5 reglas de ruta con `statusCode: 301`, 3 reglas `/p/*` con `permanent: false` y 1 reescritura SPA `/((?!api/).*)` → `/index.html`. |
| `nginx.conf` | Las mismas reglas de ruta para Docker, con barra final opcional. Las `/p/*` salen como 302. |
| `api/contacto.js` | Función de Vercel en Node. Lee `req.body` (JSON ya interpretado), valida, y envía con `resend` 6.17.2. Lee `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` de `process.env`. |
| Build | `npm run build` = `validar-proyectos` → `copiar-medios` → `vite build` → `prerender.mjs` → `comprobar-prerender`. Salida en `dist/`. |
| `dist/` | 127 archivos, 4.2 MiB en total. El mayor es `proyectos/ita-2026/ita.mp4` con 0.69 MiB. 10 HTML prerenderizados: `/`, `/laboratorio`, `/pcb`, `/enlaces`, `/privacidad`, `/proyectos`, `/casos/ita-2026`, `/casos/calculadora-series`, `/casos/invitacion-boda` y `/proyectos/ita-2026` (este solo lleva a `/casos/ita-2026/`). No hay `404.html`. |
| DNS | Zona en Cloudflare. `ayemi.org` tiene registros A `216.198.79.1` y `64.29.17.1`; `www` y `portafolio` son CNAME a `9e6cad1802cb5cf0.vercel-dns-017.com`. Consulta con `Resolve-DnsName` el 2026-11-20. Los A deberían ser los de Vercel: confírmalo en el panel antes de tocarlos. |
| Correo | Recepción con Cloudflare Email Routing (SPF de la raíz). Envío con Resend: DKIM en `resend._domainkey` y SPF en `send.ayemi.org`. Nada de esto cambia con el hosting. |

## 2. Planes y límites

Solo las cifras que afectan a este sitio. «—» quiere decir que no lo
consultamos porque no cambia la decisión.

| Concepto | Vercel Hobby | Vercel Pro | Cloudflare Pages Free |
| --- | --- | --- | --- |
| Uso comercial | No: «personal or non-commercial use» [V1, §4] | Sí | Sin restricción encontrada en los términos [C20, §2.6] |
| Precio | 0 USD | 20 USD/mes, con 1 asiento y 20 USD de crédito; asiento extra 20 USD/mes [V3] | 0 USD. Si Functions supera el plan Free, Workers Paid desde 5 USD/mes por cuenta [C6] |
| Tráfico estático | 100 GB de Fast Data Transfer y 1 000 000 de peticiones CDN al mes [V2] | Flat Rate CDN: 1 000 000 de peticiones y 1 TB al mes incluidos [V3] | Gratis y sin límite [C5, C6] |
| Builds | 100 despliegues al día, 2 vCPU, 8 GB [V2] | 6 000 al día, 4 vCPU o más [V2] | 500 al mes, 1 a la vez, máximo 20 min cada uno [C1] |
| Funciones | 1 000 000 de invocaciones, 4 h de CPU activa, 360 GB-h; hasta 300 s por invocación [V2] | Por uso, con el crédito [V3, V4] | 100 000 peticiones al día, se reinicia a medianoche UTC [C5]; 10 ms de CPU por petición, sin contar la espera de red [C7] |
| Archivos | — | — | 20 000 por sitio, 25 MiB por archivo [C1]. Hoy usamos 127 y el mayor pesa 0.69 MiB |
| Redirecciones en archivo | 2 048 en `redirects`, 4 096 caracteres por `source`/`destination` [V6] | Igual [V6] | `_redirects`: 2 000 estáticas + 100 dinámicas, 1 000 caracteres por línea [C2] |
| Redirecciones por host | En `vercel.json` con `has` de tipo `host` [V5, V7] | Igual | No en `_redirects` [C2]. Reglas de zona: 10 Single Redirects en Free, con comodines y sin regex [C14] |
| Cabeceras en archivo | — | — | `_headers`: 100 reglas, 2 000 caracteres por línea [C1, C8] |
| Dominios | 50 por proyecto [V2] | Ilimitados [V2] | 100 por proyecto [C1] |
| Reversa de despliegues | Solo al despliegue inmediatamente anterior [V9] | A cualquier despliegue que estuvo en producción [V9] | A cualquier despliegue de producción no borrado; se conservan 30 días y siempre los 100 más recientes [C1, C15] |
| Registros de ejecución | 1 hora [V2] | 1 día [V2] | — |
| Entrenamiento de modelos con tu contenido | Activo por defecto en Hobby y en la prueba de Pro [V1, §3] | Desactivado por defecto en Pro pagado [V1, §3] | — |
| Servicio gratuito retirable | Sí, «with or without notice» [V1, §4] | — | Sí, «in our sole discretion» [C20, §2.6] |

## 3. Cómo se sirven las redirecciones 301 de `vercel.json`

### En Vercel (hoy)

- Las reglas de `redirects` se evalúan en el CDN de Vercel, en todas las
  regiones, antes que las reescrituras [V5, V7]. Por eso `/casos` responde 301
  aunque exista la reescritura SPA.
- `statusCode: 301` se respeta tal cual: `statusCode` existe para usar un
  código distinto del 307/308 que da `permanent` [V7]. Las reglas `/p/*` usan
  `permanent: false`, que en Vercel sale como **307** [V7]; en `nginx.conf`
  salen como 302.
- `source` acepta grupos de expresión regular, como `:base(portafolio|piezas)`,
  y `has` con tipo `host` para `www` y `portafolio` [V7].
- La cadena de consulta pasa al destino [V6]. Las UTM de redes sobreviven a la
  redirección.
- El destino puede llevar ancla (`/proyectos#casos`); el navegador la conserva
  al seguir la redirección.

### En Cloudflare Pages

- `_redirects` va en la carpeta de salida; como Vite copia `public/` a `dist/`,
  el archivo iría en `public/_redirects` [C2].
- El formato es una regla por línea: `origen destino código`. Sin código, Pages
  usa **302**, así que el 301 se escribe siempre [C2].
- No hay expresiones regulares: solo comodín `*` (uno por regla) y marcadores
  `:nombre` que no cruzan `/` [C2]. Las alternativas `(portafolio|piezas)` y la
  lista de slugs retirados se expanden en líneas estáticas.
- Si dos reglas tienen el mismo origen gana la de más arriba, y las estáticas
  deben ir antes que las dinámicas [C2].
- Las redirecciones se aplican **aunque exista un archivo** en esa ruta [C2],
  igual que en Vercel.
- El destino admite ancla y cadena de consulta [C2]. La documentación no dice
  si la cadena de consulta **del origen** pasa al destino: **por comprobar**,
  porque de eso dependen las UTM.
- No hay redirecciones por dominio en `_redirects` [C2]. `www` y `portafolio`
  se resuelven con dos reglas de Single Redirects en la zona (2 de las 10 del
  plan Free) [C14], que corren antes de llegar a Pages [C11, C14] y necesitan
  registros DNS con proxy [C14, C16].
- `_redirects` no se aplica a las peticiones que atiende una Function [C2]. Solo
  afecta a `/api/contacto`, que no tiene redirecciones.

### Tabla de equivalencias

| Regla de `vercel.json` | Código en Vercel | Cloudflare Pages | Código |
| --- | --- | --- | --- |
| host `www.ayemi.org`, `/:ruta*` → `https://ayemi.org/:ruta*` | 301 | Single Redirect en la zona, conservando la consulta | 301 |
| host `portafolio.ayemi.org`, `/:ruta*` → `https://ayemi.org/:ruta*` | 301 | Single Redirect en la zona, conservando la consulta | 301 |
| `/:base(portafolio\|piezas)/:slug(panel-inventario-integradores\|plataforma-contactos-whatsapp\|tecnificacion-agricola)` → `/proyectos#casos` | 301 | 6 líneas estáticas en `_redirects` | 301 |
| `/:base(portafolio\|piezas)/wabot` → `/laboratorio#wabot` | 301 | 2 líneas estáticas | 301 |
| `/:base(portafolio\|piezas)/:slug` → `/casos/:slug` | 301 | 2 líneas dinámicas con `:slug`, al final | 301 |
| `/:base(portafolio\|piezas)` → `/proyectos#casos` | 301 | 2 líneas estáticas (más 2 con barra final, como nginx) | 301 |
| `/casos` → `/proyectos#casos` | 301 | 1 línea estática (más 1 con barra final) | 301 |
| `/p/328`, `/p/esp32`, `/p/stm32` → `/pcb#…` | 307 | 3 líneas estáticas | 307, para no cambiar lo que hoy sirve producción |
| reescritura `/((?!api/).*)` → `/index.html` | 200 | Ninguna línea: sin `404.html` en la raíz, Pages sirve `/` en cualquier ruta sin archivo [C3] | 200 |

### Borrador de `public/_redirects`

```txt
# Equivalente de vercel.json y nginx.conf. Los tres deben coincidir.
# Estáticas primero, dinámicas al final. Sin código, Pages usa 302.

/casos                                      /proyectos#casos     301
/casos/                                     /proyectos#casos     301
/portafolio                                 /proyectos#casos     301
/portafolio/                                /proyectos#casos     301
/piezas                                     /proyectos#casos     301
/piezas/                                    /proyectos#casos     301
/portafolio/panel-inventario-integradores   /proyectos#casos     301
/portafolio/plataforma-contactos-whatsapp   /proyectos#casos     301
/portafolio/tecnificacion-agricola          /proyectos#casos     301
/piezas/panel-inventario-integradores       /proyectos#casos     301
/piezas/plataforma-contactos-whatsapp       /proyectos#casos     301
/piezas/tecnificacion-agricola              /proyectos#casos     301
/portafolio/wabot                           /laboratorio#wabot   301
/piezas/wabot                               /laboratorio#wabot   301

# QR impresos de las placas: temporales a propósito.
/p/328                                      /pcb#atmega328p      307
/p/esp32                                    /pcb#esp32           307
/p/stm32                                    /pcb#stm32           307

/portafolio/:slug                           /casos/:slug         301
/piezas/:slug                               /casos/:slug         301
```

17 reglas estáticas y 2 dinámicas, lejos de las 2 000 y 100 permitidas [C2].
Pendiente de comprobar: si `/portafolio/wabot/` (con barra) entra en alguna
regla. nginx lo acepta; en Pages el marcador `:slug` no cruza `/` [C2].

### Reglas de zona para `www` y `portafolio`

Dos reglas de **Single Redirects** en la zona `ayemi.org` [C16]:

| Nombre | Patrón de URL de la petición | URL de destino | Código | Conservar consulta |
| --- | --- | --- | --- | --- |
| `www → raíz` | `http*://www.ayemi.org/*` | `https://ayemi.org/${2}` | 301 | Sí |
| `portafolio → raíz` | `http*://portafolio.ayemi.org/*` | `https://ayemi.org/${2}` | 301 | Sí |

`${1}` es lo que cubre el primer `*` (la «s» de https o nada) y `${2}`, la ruta
[C16]. Los dos nombres necesitan un registro DNS con proxy de Cloudflare para que
la regla los vea [C14, C16]. Estas reglas no se versionan en git: anótalas en
este documento si cambian.

## 4. Cómo se sirve el prerender

El prerender es un paso del build, así que en los dos proveedores se ejecuta el
mismo `npm run build` y se publica la misma carpeta `dist/`. Cloudflare indica
`npm run build` y `dist` como valores para React con Vite [C10, C9].

| Aspecto | Vercel | Cloudflare Pages |
| --- | --- | --- |
| Node del build | Ajuste del proyecto en Vercel (no consultado) | 22.23.4 por defecto en la imagen v3; se fija con `NODE_VERSION` o `.node-version` [C9]. El `Dockerfile` usa Node 20: conviene fijar una versión en los dos |
| Archivo antes que reescritura | Sí: el sistema de archivos tiene prioridad sobre `rewrites` [V7]. `/proyectos` sirve `dist/proyectos/index.html` | Sí: si hay un HTML que coincide con la ruta, se sirve [C3] |
| Barra final | `trailingSlash` no está definido: `/proyectos` y `/proyectos/` sirven lo mismo, sin redirigir [V7] | `/proyectos/index.html` redirige a `/proyectos/` [C3]. Qué pasa con `/proyectos` sin barra: **por comprobar**. Workers, con su ajuste por defecto, responde 307 hacia `/proyectos/` [C4] |
| Rutas sin HTML | La reescritura SPA sirve `index.html` (200) | Sin `404.html` en la raíz, Pages sirve `/` (200) [C3]. Mismo resultado que hoy |
| Caché | — | Cada despliegue queda en caché hasta el siguiente; Pages envía `Cache-Control: public, max-age=0, must-revalidate` y `ETag` [C3] |
| Cabeceras por defecto | — | Pages ya añade `X-Content-Type-Options: nosniff` y `Referrer-Policy: strict-origin-when-cross-origin` [C3] |

**Decisión pendiente por la barra final.** `prerender.mjs` escribe cada página
como `<ruta>/index.html` y pone el canónico y el sitemap sin barra
(`https://ayemi.org/proyectos`). Si Pages redirige `/proyectos` a `/proyectos/`,
el canónico apuntaría a una URL que redirige. Salidas posibles, a decidir por el
arquitecto antes de cambiar el DNS:

1. Canónico y sitemap con barra final en las páginas que salen de carpeta. Es
   el cambio más pequeño, pero cambia las URL que Google ya conoce.
2. Escribir esas páginas como `<ruta>.html` (por ejemplo `dist/proyectos.html`).
   Pages las serviría sin barra [C3], pero nginx necesitaría `$uri.html` en
   `try_files` y Vercel `cleanUrls` [V7].
3. Pasar a Workers con `html_handling: "drop-trailing-slash"`, que sirve
   `/folder` desde `folder/index.html` sin redirigir [C4].

## 5. Borrador de `public/_headers`

`vercel.json` no define cabeceras. `nginx.conf` añade `X-Frame-Options`,
`X-Content-Type-Options` y `Referrer-Policy`, y un año de caché para los
recursos. Pages ya pone las dos segundas [C3], así que basta con esto:

```txt
# Recursos de Vite con hash en el nombre: se pueden guardar un año.
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Frame-Options: SAMEORIGIN

# El subdominio de producción de Pages no debe indexarse: el canónico es ayemi.org.
# Las vistas previas ya llevan X-Robots-Tag: noindex por defecto.
https://:project.pages.dev/*
  X-Robots-Tag: noindex
```

El patrón de recursos con hash y el de `pages.dev` son los ejemplos de la
documentación [C8]. Los medios de `/proyectos/<slug>/` no llevan hash en el
nombre, por eso no entran en la regla de un año. `_headers` no se aplica a las
respuestas de Functions [C8]: si `/api/contacto` necesita cabeceras, las pone su
código.

## 6. `api/contacto.js` como Pages Function

Qué cambia en la plataforma:

- Las funciones viven en `functions/` en la raíz del proyecto, no dentro de
  `dist/`. `functions/api/contacto.js` atiende `/api/contacto`, con barra final
  o sin ella [C17, C18].
- El manejador recibe un `context` y devuelve un `Response`. `onRequestPost`
  atiende solo `POST`; `onRequest` atiende el resto si no hay uno más
  específico [C19].
- Las variables y los secretos llegan en `context.env` [C21]. `process.env`
  también funciona con compatibilidad Node y fecha de compatibilidad
  2025-04-01 o posterior [C22], pero `context.env` no depende de esos ajustes.
- El cuerpo no llega interpretado: se lee con `request.json()`. El formulario
  manda `Content-Type: application/json` (`src/features/contact/Contacto.jsx`).
- Resend documenta su SDK de Node dentro de Cloudflare Workers [R1], y Pages
  Functions corre sobre el mismo motor [C17].
- Al detectar `functions/`, Pages genera `_routes.json` para que el resto del
  sitio siga como estático gratuito [C18].
- Con Functions no vale subir `dist/` a mano desde el panel (Direct Upload): el
  despliegue tiene que ir por la integración con Git o por Wrangler [C17].
- Si se agota la cuota diaria del plan Free, el ajuste «Fail open» sigue
  sirviendo los estáticos y solo falla la función [C18].

Propuesta para no duplicar la lógica: mover validación, plantilla y envío a un
módulo común, por ejemplo `servidor/contacto.js`, con una función
`atenderContacto(cuerpo, entorno)` que devuelva `{ estado, datos }`. Así
`api/contacto.js` (Vercel) y `functions/api/contacto.js` (Pages) quedan como
envoltorios de pocas líneas y la validación sigue siendo una sola.

```js
// functions/api/contacto.js · borrador, no existe en el repositorio
import { atenderContacto } from '../../servidor/contacto.js';

export async function onRequestPost({ request, env }) {
  const cuerpo = await request.json().catch(() => ({}));
  const { estado, datos } = await atenderContacto(cuerpo, env);
  return Response.json(datos, { status: estado });
}

export function onRequest() {
  return Response.json(
    { ok: false, error: 'Método no permitido.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
```

```js
// api/contacto.js en Vercel, con el mismo módulo
import { atenderContacto } from '../servidor/contacto.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }
  const { estado, datos } = await atenderContacto(req.body || {}, process.env);
  return res.status(estado).json(datos);
}
```

Por comprobar en la vista previa: que el empaquetado de Functions resuelva el
import de `servidor/`, fuera de `functions/`, y que el envío con Resend se quede
dentro de los 10 ms de CPU del plan Free. La espera de red no cuenta como CPU
[C7]; si se pasa, Cloudflare responde con el error 1102 [C7] y la salida es
Workers Paid (5 USD/mes [C6]).

## 7. Variables de entorno

En Cloudflare se definen en el proyecto de Pages, en **Settings → Variables and
Secrets**, por separado para producción y vista previa, y valen en el build y en
la ejecución [C21]. Las llaves se guardan con **Encrypt**, que las convierte en
secretos que ya no se pueden leer, y tienen que existir antes del despliegue que
las usa [C21]. En Vercel, un cambio solo aplica a despliegues nuevos [V8].

| Variable | Se lee en | Tipo en Cloudflare |
| --- | --- | --- |
| `RESEND_API_KEY` | Función, en ejecución | Secreto (Encrypt) |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Función, en ejecución | Variable de texto |
| `VITE_ENDPOINT_CONTACTO` | Build (Vite la incrusta en el JS) | Variable de texto. Puede quedarse vacía: el valor por defecto es `/api/contacto`, que existe igual en Pages |
| `VITE_GA4_ID`, `VITE_META_PIXEL_ID`, `VITE_CLARITY_ID`, `VITE_AGENDA_URL` | Build | Variable de texto |
| `VITE_RESPONSABLE_NOMBRE`, `VITE_RESPONSABLE_DOMICILIO`, `VITE_PRIVACIDAD_CORREO` | Build | Variable de texto |
| `VITE_INSTAGRAM_URL`, `VITE_FACEBOOK_URL`, `VITE_TIKTOK_URL`, `VITE_YOUTUBE_URL`, `VITE_LINKEDIN_URL`, `VITE_X_URL` | Build | Variable de texto |
| `VITE_WHATSAPP_NUMERO`, `VITE_PRECIO_REVISION_PCB` | Build | Variable de texto |
| `NODE_VERSION` (nueva) | Build | Variable de texto [C9] |

La lista sale de `.env.example`. Los valores se copian del panel de Vercel
(**Settings → Environment Variables**), no del repositorio. Las variables
`VITE_*` no son secretos: terminan en el JavaScript público.

## 8. DNS

Orden propuesto, sin tocar nada hasta que la vista previa pase la sección 10:

1. Crear el proyecto de Pages conectado al repositorio, con `npm run build`,
   salida `dist` y las variables de la sección 7. Rama de producción: la que
   Dirección decida; hoy nada de `refactor-2026-11` está en `main`.
2. Probar todo en `<proyecto>.pages.dev` (sección 10).
3. **Anotar los registros DNS actuales** de `ayemi.org`, `www` y `portafolio`
   (tipo, valor, proxy) antes de cambiarlos. Son la reversa.
4. Añadir `ayemi.org` como dominio personalizado del proyecto de Pages. Como la
   zona está en la misma cuenta, Pages crea el registro por sí mismo [C11].
5. Cambiar `www` y `portafolio` de CNAME a Vercel por registros con proxy de
   Cloudflare y crear las dos reglas de la sección 3 [C14, C16].
6. No tocar MX, SPF, DKIM ni `send.ayemi.org`: son de Email Routing y Resend.
7. Si la zona tiene registros CAA, deben permitir que Cloudflare emita el
   certificado [C11].
8. Mantener el dominio en el proyecto de Vercel sin borrarlo durante 30 días.

## 9. Riesgos

| Riesgo | Efecto | Qué hacemos |
| --- | --- | --- |
| Cloudflare recomienda Workers para proyectos nuevos [C12] | Pages puede recibir menos novedades | `_redirects` y `_headers` sirven igual en Workers [C13]. Solo habría que reescribir la función. Decisión de Dirección: Pages o Workers |
| Barra final y canónico (sección 4) | URL del sitemap que responden con redirección | Comprobar en la vista previa y elegir una de las tres salidas antes de cambiar el DNS |
| Consulta de origen en `_redirects` no documentada | Se perderían UTM en `/casos`, `/portafolio/*` y `/p/*` | Probar con `?utm_source=prueba`; si se pierde, mover esas reglas a Single Redirects con «conservar consulta» [C16] |
| Reglas de `www` y `portafolio` en el panel | Configuración fuera de git | Documentarlas aquí (sección 3) |
| Tres copias de las mismas redirecciones (`vercel.json`, `nginx.conf`, `_redirects`) | Se desincronizan | Comentario en los tres, como ya tienen los dos primeros, y retirar `vercel.json` cuando se dé de baja Vercel |
| 10 ms de CPU por petición en Functions Free [C7] | El formulario fallaría con error 1102 | Medir en la vista previa; Workers Paid desde 5 USD/mes [C6] |
| 100 000 peticiones diarias a Functions [C5] | Sin margen ante abuso del formulario | «Fail open» mantiene el sitio en pie [C18]; el campo trampa sigue en el código |
| Node 22 por defecto en el build [C9] frente a Node 20 en Docker | Builds distintos | Fijar `NODE_VERSION` |
| Servicio gratuito retirable [C20, §2.6] | Cloudflare puede terminarlo a su discreción. Vercel Hobby también [V1, §4] | La reversa a Vercel Pro está escrita (sección 11) |
| Volver a Pages después de sacar el DNS de Pages | El dominio queda inactivo y da errores hasta reactivarse [C11] | Para desvíos temporales, Cloudflare recomienda reglas de origen o de redirección en lugar de cambiar el DNS [C11] |
| `_redirects` y `_headers` en `dist/` mientras siga Vercel | Vercel los serviría como archivos públicos (**por comprobar**) | Su contenido no es sensible; se retiran si se vuelve a Vercel |

## 10. Pruebas en la vista previa antes de cambiar el DNS

Contra `https://<proyecto>.pages.dev`:

- Cada fila de la tabla de equivalencias con `curl -I`: código y `Location`
  exactos, también con barra final y con `?utm_source=prueba`.
- `/proyectos`, `/proyectos/`, `/casos/ita-2026` y `/casos/ita-2026/`: qué
  responde cada una y si hay redirección de barra.
- `/proyectos/ita-2026` lleva a `/casos/ita-2026/` conservando la consulta.
- `/ruta-que-no-existe` responde la app con su página de «no encontrada».
- `POST /api/contacto` con datos válidos, con datos inválidos (400) y con
  `GET` (405); el correo llega a `CONTACT_TO_EMAIL`; CPU de la invocación en el
  panel.
- Cabeceras de `_headers` en `/`, en `/assets/*` y en `pages.dev`.
- `npm run auditar -- https://<proyecto>.pages.dev` = 0 fallos.
- Lighthouse móvil, mediana de 3 pasadas en `/`, `/proyectos` y
  `/casos/ita-2026`: ≥ 90 en rendimiento, accesibilidad y SEO (R0.3).
- Que Vercel no intente desplegar `functions/` como función propia
  (**por comprobar** en un despliegue de vista previa de Vercel).

## 11. Plan de reversa

- **Fallo dentro de Pages** (un despliegue malo): reversa desde **Deployments**
  a cualquier despliegue de producción anterior que no se haya borrado [C15].
- **Volver a Vercel** en los primeros 30 días:
  1. Restaurar los registros DNS anotados en el paso 3 de la sección 8
     (A de la raíz, CNAME de `www` y `portafolio`).
  2. Desactivar las dos reglas de Single Redirects, porque `vercel.json` ya hace
     esas redirecciones.
  3. El proyecto de Vercel sigue con su último despliegue y sus variables; no
     hace falta desplegar de nuevo. En Hobby la reversa interna solo llega al
     despliegue anterior [V9].
- **Antes de dar de baja Vercel**: 30 días sin incidencias, el formulario
  probado en producción y Search Console sin errores nuevos de redirección.
- **Disparadores de la reversa**: el formulario no envía, alguna redirección no
  coincide con la tabla, o Lighthouse baja de 90 en alguna de las tres rutas.

## Fuentes

Todas consultadas el **2026-11-20**. Entre paréntesis, la fecha de última
modificación que muestra la propia página cuando la publica.

**Cloudflare**

- [C1] Pages · Limits. <https://developers.cloudflare.com/pages/platform/limits/> (2026-11-19)
- [C2] Pages · Redirects. <https://developers.cloudflare.com/pages/configuration/redirects/> (2026-08-25)
- [C3] Pages · Serving Pages. <https://developers.cloudflare.com/pages/configuration/serving-pages/> (2026-11-11)
- [C4] Workers · Static assets · HTML handling. <https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/> (2026-04-23)
- [C5] Pages Functions · Pricing. <https://developers.cloudflare.com/pages/functions/pricing/> (2026-09-08)
- [C6] Workers · Pricing. <https://developers.cloudflare.com/workers/platform/pricing/> (2026-11-18)
- [C7] Workers · Limits. <https://developers.cloudflare.com/workers/platform/limits/>
- [C8] Pages · Headers. <https://developers.cloudflare.com/pages/configuration/headers/> (2026-11-12)
- [C9] Pages · Build image. <https://developers.cloudflare.com/pages/configuration/build-image/> (2026-10-26)
- [C10] Pages · Build configuration. <https://developers.cloudflare.com/pages/configuration/build-configuration/> (2026-09-18)
- [C11] Pages · Custom domains. <https://developers.cloudflare.com/pages/configuration/custom-domains/> (2026-11-11)
- [C12] Cloudflare Pages (portada de la documentación). <https://developers.cloudflare.com/pages/> (2026-08-25)
- [C13] Workers · Migrate from Pages to Workers. <https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/>
- [C14] Rules · Redirects (disponibilidad por plan y orden de ejecución). <https://developers.cloudflare.com/rules/url-forwarding/> (2026-08-14)
- [C15] Pages · Rollbacks. <https://developers.cloudflare.com/pages/configuration/rollbacks/> (2026-11-19)
- [C16] Rules · Create a redirect rule in the dashboard. <https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/> (2026-05-05)
- [C17] Pages Functions · Get started. <https://developers.cloudflare.com/pages/functions/get-started/> (2026-04-21)
- [C18] Pages Functions · Routing. <https://developers.cloudflare.com/pages/functions/routing/> (2026-09-18)
- [C19] Pages Functions · API reference. <https://developers.cloudflare.com/pages/functions/api-reference/>
- [C20] Cloudflare · Terms (§2.6 Free & Trial Services). <https://www.cloudflare.com/terms/>
- [C21] Pages Functions · Bindings (Environment variables, Secrets). <https://developers.cloudflare.com/pages/functions/bindings/> (2026-11-12)
- [C22] Workers · Node.js `process`. <https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/> (2026-04-23)

**Vercel**

- [V1] Terms of Service (§3 Your Content, §4 Hobby Plan). <https://vercel.com/legal/terms>
- [V2] Vercel Hobby Plan. <https://vercel.com/docs/plans/hobby> (2026-11-12)
- [V3] Vercel Pro Plan. <https://vercel.com/docs/plans/pro-plan>
- [V4] Fair Use Guidelines. <https://vercel.com/docs/limits/fair-use-guidelines> (2026-11-12)
- [V5] Redirects. <https://vercel.com/docs/routing/redirects> (2026-09-18)
- [V6] Configuration Redirects (consulta y límites). <https://vercel.com/docs/routing/redirects/configuration-redirects> (2026-08-11)
- [V7] Static Configuration with vercel.json (`redirects`, `rewrites`, `trailingSlash`, `cleanUrls`). <https://vercel.com/docs/project-configuration/vercel-json> (2026-08-14)
- [V8] Environment variables. <https://vercel.com/docs/environment-variables> (2026-09-17)
- [V9] Instant Rollback. <https://vercel.com/docs/instant-rollback>

**Resend**

- [R1] Send emails with Cloudflare Workers. <https://resend.com/docs/send-with-cloudflare-workers>
