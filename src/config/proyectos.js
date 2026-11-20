/**
 * Proyectos del portafolio · fichas `contenido/proyectos/<slug>/proyecto.json`
 *
 * Cada ficha cumple `contenido/proyectos/proyecto.schema.json`. La validación
 * corre en `npm run validar` (al inicio de `npm run build`); en el navegador
 * no se valida.
 *
 * Solo se muestran las fichas con `estado: "publicado"` (R0.5): las demás
 * existen en el repositorio pero ninguna función de aquí las devuelve.
 *
 * Las rutas de medios (`medios/…`) son relativas a la carpeta de la ficha.
 * Llegan al navegador en `/proyectos/<slug>/<archivo>` (ver `urlMedio`).
 */

import i18n from '../i18n';
import { SITIO } from './sitio';

const FICHAS = Object.values(
  import.meta.glob('/contenido/proyectos/*/proyecto.json', { eager: true, import: 'default' })
);

/** Más recientes primero; sin fecha, al final. */
const PUBLICADOS = FICHAS.filter((p) => p.estado === 'publicado').sort((a, b) =>
  (b.fecha ?? '').localeCompare(a.fecha ?? '')
);

const unicos = (listas) => [...new Set(listas.flat())];

export const proyectosPublicados = () => PUBLICADOS;

/** `caso-cliente` | `laboratorio` */
export const porTipo = (tipo) => PUBLICADOS.filter((p) => p.tipo === tipo);

export const buscarProyecto = (slug) => PUBLICADOS.find((p) => p.slug === slug);

/** Categorías que usa al menos una ficha publicada. */
export const categorias = () => unicos(PUBLICADOS.map((p) => p.categorias ?? []));

/** Tecnologías que usa al menos una ficha publicada. */
export const stacks = () => unicos(PUBLICADOS.map((p) => p.stack ?? []));

/**
 * Valor de una tecnología en la URL de la galería (`?stack=nextjs`):
 * minúsculas, sin acentos ni puntos y con guiones en lugar de espacios.
 * «Next.js» → `nextjs` · «Tailwind CSS» → `tailwind-css`.
 */
export const slugDeStack = (nombre) =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * URL pública de una ruta `medios/…` de la ficha: `/proyectos/<slug>/<archivo>`.
 *
 * `scripts/copiar-medios.mjs` copia `contenido/proyectos/<slug>/medios/*` a
 * `public/proyectos/<slug>/` antes de `vite` (dev) y de `vite build`, así que
 * el build del cliente y el prerender dan la misma URL. Es la única función
 * que compone estas URL.
 */
export const urlMedio = (slug, ruta) => `/proyectos/${slug}/${ruta.replace(/^medios\//, '')}`;

/* Diagramas SVG como texto, para pintarlos en línea: sus clases usan los
   tokens `var(--ay-*)`, y un SVG cargado como imagen no los hereda. `?raw` da
   el mismo texto en el cliente y en el prerender. */
const DIAGRAMAS = import.meta.glob('/contenido/proyectos/*/medios/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/** Quita `<script>`, `<foreignObject>`, atributos `on…` y enlaces `javascript:`. */
const sanear = (svg) =>
  svg
    .replace(/<script[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<script[^>]*\/>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject\s*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(?:xlink:)?href\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '')
    .replace(/<\?xml[\s\S]*?\?>/i, '')
    .trim();

/** El SVG del diagrama de la ficha, saneado, o `''` si no tiene. */
export const diagramaDe = (proyecto) => {
  if (!proyecto.diagrama) return '';
  const svg = DIAGRAMAS[`/contenido/proyectos/${proyecto.slug}/${proyecto.diagrama}`];
  return svg ? sanear(svg) : '';
};

/**
 * Mensaje de WhatsApp de la página de caso (design.md): «Hola, vi «<título>»
 * en ayemi.org y quiero algo así para mi negocio.» El dominio sale de
 * `SITIO.url`.
 */
export const mensajeDeProyecto = (proyecto, idioma) =>
  i18n.getFixedT(idioma)('caso.mensajeProyecto', {
    titulo: proyecto.textos[idioma].titulo,
    dominio: SITIO.url.replace(/^https?:\/\//, ''),
  });