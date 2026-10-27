# Ayemi · portafolio

Sitio de Ayemi, fábrica de software e innovación.

Construido sobre el **Manual de Identidad Corporativa Ayemi · Edición 2.0**
(`docs/Ayemi_Manual_de_Identidad_v2.0.pdf`), que no es una referencia suelta: el
sistema de diseño de este repositorio es la traducción de ese manual a código, y
las reglas están enforzadas por el propio tooling.

React 19 · Vite 8 · Tailwind CSS 4 · react-router 7 · i18next

---

## Arrancar

```bash
npm install
npm run dev
```

| Comando              | Qué hace                                            |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                              |
| `npm run build`      | Compila **y** prerenderiza cada ruta                |
| `npm run build:solo` | Compila sin prerenderizar                           |
| `npm run prerender`  | Prerenderiza sobre un `dist/` ya compilado          |
| `npm run lint`       | ESLint                                              |
| `npm run preview`    | Sirve `dist/` en local                              |

---

## Antes de publicar

Cuatro cosas están deliberadamente sin rellenar. No se inventaron porque §1.10
(regla 4) del manual obliga a admitir lo que no se sabe, y publicar un correo o
una métrica falsa es peor que no publicar ninguno.

**1. Datos de contacto** — `src/config/sitio.js`

Correo, WhatsApp, LinkedIn y el dominio. Los canales sin rellenar no se
muestran, así que el sitio funciona mientras los completas.

**2. Cuenta de GitHub de Ayemi** — `src/config/sitio.js`

```js
export const GITHUB = {
  usuario: 'ayemi-mx', // ← aquí
};
```

Cada pieza declara solo el nombre del repositorio. El enlace completo se compone
con este usuario, así que con una línea quedan correctos todos los enlaces de
todas las piezas. Mientras esté vacío, los botones de repositorio no aparecen.

**3. Envío del formulario** — `.env`

```bash
cp .env.example .env
```

Pon `VITE_ENDPOINT_CONTACTO` con cualquier servicio que reciba un POST con JSON
(Formspree, Basin, una función serverless propia). Si se deja vacío, el
formulario **no finge enviar**: abre un borrador de correo con los datos ya
escritos y lo dice.

**4. Datos estructurados** — `index.html`

Cuando tengas el punto 1, añade `email` y `sameAs` al bloque JSON-LD.

---

## Añadir un trabajo a La Fábrica

Todo vive en **`src/config/piezas.js`**. No hay que tocar ningún componente.

```js
{
  linea: 'pcb',                    // una de las ocho líneas
  slug: 'monitor-temperatura-v2',    // va en la URL: /piezas/<slug>
  titulo: 'Monitor de temperatura v2',
  estado: 'entregada',             // 'entregada' | 'en-curso'
  anio: 2025,
  sector: 'Agricultura protegida',
  resuelve: 'Qué problema quita, en una línea.',
  medidas: [                       // §1.3 · una fábrica tiene medidas
    { que: 'Capas', valor: '4' },
    { que: 'Nodos en bus', valor: '32' },
  ],
  pila: ['KiCad', 'ESP32', 'RS-485'],
  repo: 'monitor-temperatura',       // solo el nombre
  enlaces: [
    { tipo: 'esquematico', url: '/piezas/temperatura-v2.pdf' },
    { tipo: 'render', url: '/piezas/temperatura-v2.png' },
  ],
  imagen: '/piezas/temperatura-v2.png',
}
```

Solo `linea`, `slug`, `titulo` y `estado` son obligatorios. La ficha se adapta a
lo que haya.

**Nunca escribes un placeholder.** Cada línea tiene cinco plazas y el tablero
rellena las que faltan por su cuenta. Así en este archivo solo existen los
trabajos que existen de verdad, y no hay que acordarse de borrar nada. Una plaza
libre dice que hay hueco en la línea; no finge un proyecto.

El contador de producción, el llenado de cada línea, el índice de piezas, el
sitemap y las rutas prerenderizadas se recalculan solos.

### Las ocho líneas

| Hardware               | Software            |
| ---------------------- | ------------------- |
| `pcb` Esquemáticos y PCB | `interfaces` Interfaces |
| `circuitos` Circuitos eléctricos | `landings` Landings |
| `firmware` Firmware    | `paneles` Paneles de control |
| `cad` 3D y CAD         | `tiendas` Tiendas   |

Cuatro y cuatro: eso es «del microcontrolador a la nube».

### Tipos de enlace

`demo` · `repositorio` · `caso` · `esquematico` · `render` · `gerbers` ·
`ficha` · `video`

`repositorio` se compone solo desde `repo`; no hace falta declararlo.

---

## Estructura

```
src/
├── config/          sitio.js · piezas.js · secciones.js   ← lo que se edita
├── styles/
│   ├── ayemi-tokens.css     primitivas, roles, temas (§3, §5)
│   ├── ayemi-fuentes.css    las tres familias, autoalojadas (§3.6)
│   └── global.css           Tailwind, @theme, fotogramas clave
├── components/
│   ├── marca/       Logotipo, Isotipo, Iconos (18 pictogramas del §3.10)
│   ├── ui/          Boton, Tarjeta, Aviso, Campo
│   └── layout/      Seccion
├── features/        una carpeta por sección
├── pages/           Inicio, NoEncontrada
└── hooks/           useTema, useSeccionActiva, useAncla
```

---

## El sistema de diseño

Las reglas del manual no son una convención que haya que recordar: están
enforzadas en `global.css`.

- **`--color-*: initial`** vacía la paleta de Tailwind. `bg-slate-900` no
  compila. Solo existen la paleta de Ayemi y los roles semánticos (§3.1).
- **`--text-*: initial`** vacía la escala tipográfica. `text-sm` y `text-4xl` no
  existen; solo los doce peldaños del §3.7, cada uno con su peso, tracking e
  interlínea.
- **`--radius-*: initial`** deja los siete radios del §5.2.

En el código se consumen **roles**, nunca colores literales: `bg-lienzo`,
`text-texto`, `border-borde`, `text-acento` (§5.1). El cambio de tema es
automático.

Las reglas completas están resumidas en `.kiro/steering/identidad-ayemi.md`.

### Temas

El tema vive en `data-tema` del elemento `<html>`. El oscuro es el
predeterminado, porque es la identidad de Ayemi y no una preferencia (§5.6). Sin
el atributo se respeta `prefers-color-scheme`. Un guion en `index.html` lo
resuelve antes del primer pintado, así que no hay parpadeo.

---

## Prerenderizado

`npm run build` compila y después ejecuta `prerender.mjs`, que escribe el HTML de
cada ruta:

```
dist/index.html
dist/piezas/<slug>/index.html
dist/sitemap.xml
```

Sin esto el servidor entrega un `<div id="root">` vacío y no hay nada que
indexar. Usa `prerenderToNodeStream` de `react-dom/static`, que espera a los
límites de Suspense, así que las secciones que se cargan en diferido también
acaban en el HTML.

Cada ficha lleva su propio `<title>`, su descripción y su enlace canónico.

Tanto la reescritura de Vercel (`vercel.json`) como la de nginx (`nginx.conf`)
sirven un archivo estático si existe antes de caer en `index.html`, así que estas
páginas se entregan tal cual y el navegador solo las hidrata.

---

## Accesibilidad

Objetivo declarado: **WCAG 2.1 nivel AA** (§5.5).

Resuelto en el sistema: anillo de foco de 2 px que no se elimina nunca,
`prefers-reduced-motion` respetado, área de toque de 44 px, etiqueta visible
obligatoria en todo campo, errores en texto con icono además de color, un solo
`h1` por vista y toda la escala en `rem`.

Nota honesta, que es la del propio manual: esto cubre lo verificable por cálculo
y por norma escrita. La conformidad completa exige pruebas manuales con lector de
pantalla, navegación real por teclado y revisión por una persona especializada.
El sistema prepara esa auditoría; no la sustituye.

---

## Licencias

| Activo                                    | Licencia               |
| ----------------------------------------- | ---------------------- |
| Logotipo, isotipo, iconografía, tokens    | Propiedad de Ayemi     |
| Plus Jakarta Sans, Instrument Serif, JetBrains Mono | SIL Open Font License 1.1 |

Los logotipos de terceros que aparecen en la sección de capacidad (React,
Docker, Azure…) son marcas de sus titulares, se sirven desde
[Simple Icons](https://simpleicons.org) y no se recolorean.
