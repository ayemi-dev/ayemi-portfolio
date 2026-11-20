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

## Detalle de T2

- Se leyeron `requirements.md`, `design.md`, las reglas de `tasks.md`, `src/config/casos.js`, `src/config/piezas.js`, `src/pages/Caso.jsx`, `src/pages/Casos.jsx`, `prerender.mjs` y `pendientes/LEEME.md`.
- Se buscó un video o GIF de ITA en el repositorio (`*.mp4`, `*.webm`, `*.gif`, `*.mov`, fuera de `node_modules`): no hay ninguno. Las grabaciones de `../.capturas-tmp/` son de otros temas (placas, código, Laboratorio), no del sitio de ITA.
- No se creó ningún archivo de T2 y no se tocó el código. El único cambio de este commit es esta bitácora.
- Comprobantes base sobre el estado actual (igual que tras T1):
  - `npm run lint`: código 0.
  - `npm run build`: código 0, «Prerenderizado completo.», sitemap con 9 URL.
  - `python .ayemi/verificar.py . --solo-errores`: «Sin hallazgos», 0 errores.
- No hay captura antes/después de `/casos/ita-2026` porque la página no cambió.

## Bloqueos

Ninguno en T1.

### T2 · ficha `publicado` sin video ni GIF

T2 pide `estado: publicado` y nombra como medios solo las capturas y `diagrama.svg`. El esquema que fijó T1 (R1.3) exige `video` o `gif` en toda ficha `publicado`, y el validador detiene `npm run build` si faltan. ITA no tiene video ni GIF. T4 («si no hay ninguno, rota capturas de ITA») y R5.2 («un bloque sin datos no se pinta») sugieren que el caso sin video estaba previsto, pero el esquema no lo admite.

Las salidas posibles cambian el contrato o el contenido, así que las decide el arquitecto:

1. Relajar el esquema para `caso-cliente`, de modo que `video`/`gif` solo sea obligatorio en `laboratorio`. Toca `proyecto.schema.json` (T1).
2. Grabar un video o GIF real de soluciones-ita.com y añadirlo a `medios/`. Hace falta saber quién lo graba y con qué contenido: las capturas con personal siguen sin permiso.
3. Dejar la ficha en `en-construccion`. Así no se muestra (R0.5), y `/casos/ita-2026` dejaría de existir al terminar la migración.

### T2 · puntos sin especificar que también hacen falta para reanudar

Ninguno bloquea por sí solo, pero cada uno obliga a decidir algo:

- **Cómo llegan al navegador los archivos de `medios/`.** El validador exige rutas relativas a la carpeta de la ficha, y `design.md` no dice cómo se sirven. Importarlos con `import.meta.glob(..., { query: '?url' })` da una URL en el build del cliente (`/assets/…-hash.jpg`) y otra en el prerender (que usa el servidor de desarrollo, `/contenido/…`). El HTML estático quedaría con imágenes rotas y la hidratación no coincidiría. Propuesta mínima para T2: `casos.js` sigue sirviendo las copias que ya están en `public/casos/ita/`, y el mecanismo general se decide en T6/T11.
- **`capturasConPersonal`.** Esas tres capturas viven en `pendientes/casos/ita/`, fuera de `public/`, a la espera del permiso de ITA. Si se copian a `medios/` y un glob las incluye, saldrían publicadas. Propuesta: guardar solo sus datos en la ficha (campo extra, con `permisoPersonal: false`) sin copiar los archivos, y cambiar el paso 2 de `pendientes/LEEME.md` para que apunte a `proyecto.json`.
- **`categorias` de ITA.** Ninguna de las cinco (`tiendas`, `pagos`, `ia`, `integraciones`, `hardware`) está asignada a ITA en la especificación. Propuesta: `[]` hasta que se decida.
- **Campos sin sitio en el esquema.** `problema` y `solucion` son cadenas, pero en `casos.js` son listas (2 párrafos y 5 puntos). `cifras`, `resultado`, `resultadoNegocio`, `testimonio`, `cliente`, `sitio`, `pieza` y el `pie` de cada captura no existen en el esquema. Como el esquema no usa `additionalProperties: false`, propuesta: párrafos unidos con `\n\n`, los textos que dependen del idioma dentro de `textos.es`/`textos.en` y el resto en el nivel superior.
- **Textos en inglés.** `src/i18n.js` no tiene la traducción del contenido de ITA, solo los rótulos de la página (`caso.*`) y la tarjeta de `/enlaces`. El bloque `en` habrá que escribirlo completo y quedará marcado aquí para revisión, como pide T2.
