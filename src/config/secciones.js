/**
 * Navegación del sitio.
 *
 * Vive aparte de los componentes a propósito: la cabecera, el pie y el hook de
 * sección activa consumen estas listas, y así no hay dos ordenaciones que
 * puedan desincronizarse.
 *
 * El texto de cada entrada se resuelve por i18n en `nav.<id>`.
 *
 * ── DOS CARAS, UN DESPLIEGUE ───────────────────────────────────────────────
 *
 * La portada es la landing: presenta Ayemi y conduce al resto. El portafolio
 * es un apartado con profundidad propia, así que tiene ruta y no ancla:
 *
 *   /              la landing, con el anticipo del portafolio
 *   /portafolio    el tablero completo, con las ocho líneas
 *   /pcb           el servicio de diseño de PCBs, destino del anuncio de Facebook
 *
 * Antes La Fábrica vivía entera dentro de la portada y se la comía: de ocho
 * bloques, uno solo era portafolio y era además el más pesado. Bajarla a su
 * propia ruta deja la landing legible y le da al trabajo una URL que se puede
 * poner en un CV.
 */

/** Ruta del portafolio. De aquí sale todo enlace hacia él. */
export const RUTA_PORTAFOLIO = '/portafolio';

/** Ruta del servicio de PCBs. De aquí sale todo enlace hacia él. */
export const RUTA_PCB = '/pcb';

/** Aviso de privacidad (LFPDPPP). Lo enlazan el pie y el aviso de cookies. */
export const RUTA_PRIVACIDAD = '/privacidad';

/** Página de la bio de las redes: un logotipo y botones, sin cabecera ni pie. */
export const RUTA_ENLACES = '/enlaces';

/** Casos de estudio: `/casos/<slug>`. Los datos viven en config/casos.js. */
export const RUTA_CASOS = '/casos';

/** Caso de ITA. De aquí sale todo enlace hacia él (/enlaces, la ficha). */
export const RUTA_CASO_ITA = `${RUTA_CASOS}/ita-2026`;

/**
 * Secciones que SÍ son ancla dentro de la portada.
 *
 * Es la lista que observa `useSeccionActiva`. La Fábrica no está: su entrada de
 * navegación es un enlace de ruta, y su estado actual sale de la URL, no de lo
 * que se vea en pantalla.
 */
export const SECCIONES = [
  'servicios',
  'metodo',
  'capacidad',
  'posicionamiento',
  'origen',
  'contacto',
];

/**
 * La navegación tal como se pinta, en orden.
 *
 * `tipo` distingue las dos naturalezas, porque un ancla y una ruta no se
 * enlazan igual ni se marcan como actuales igual:
 *
 *   ancla  destino `/#<id>`, activo cuando esa sección se está leyendo
 *   ruta   destino propio, activo cuando la URL coincide
 */
export const NAVEGACION = [
  { id: 'servicios', tipo: 'ancla' },
  { id: 'pcb', tipo: 'ruta', destino: RUTA_PCB },
  { id: 'metodo', tipo: 'ancla' },
  { id: 'fabrica', tipo: 'ruta', destino: RUTA_PORTAFOLIO },
  { id: 'capacidad', tipo: 'ancla' },
  { id: 'posicionamiento', tipo: 'ancla' },
  { id: 'origen', tipo: 'ancla' },
  { id: 'contacto', tipo: 'ancla' },
];
