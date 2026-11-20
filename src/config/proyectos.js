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
 * Cómo llegan al navegador se decide más adelante (T6/T11); mientras tanto,
 * `casos.js` sirve las copias de `public/casos/<carpeta>/`.
 */

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
 * Carpeta de public/ que sirve los medios de cada ficha, la misma que usa
 * `casos.js`. Mientras T6/T11 no decidan el mecanismo general, los archivos de
 * `medios/` que se pintan se copian a esta carpeta.
 */
const PUBLICO = {
  'ita-2026': '/casos/ita',
};

/** URL pública de una ruta `medios/…` de la ficha. */
export const urlMedio = (proyecto, ruta) =>
  ruta.replace(/^medios\//, `${PUBLICO[proyecto.slug] ?? `/casos/${proyecto.slug}`}/`);
