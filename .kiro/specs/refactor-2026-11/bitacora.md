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

## Bloqueos

Ninguno en T1.
