/**
 * Navegación del sitio.
 *
 * Vive aparte de los componentes a propósito: la cabecera, el pie y el hook de
 * sección activa consumen estas listas, y así no hay dos ordenaciones que
 * puedan desincronizarse.
 *
 * El texto de cada entrada se resuelve por i18n en `nav.<id>`.
 *
 * ── RUTAS ──────────────────────────────────────────────────────────────────
 *
 *   /              la landing
 *   /laboratorio   placas abiertas y WaBot (manual 2.2, §1.3)
 *   /proyectos     galería: casos de clientes y proyectos del Laboratorio
 *   /casos/<slug>  caso de cliente o ficha de una pieza (/casos redirige a
 *                  /proyectos#casos)
 *   /pcb           la línea Hardware, destino del anuncio de Facebook
 */

/**
 * Ruta vieja del portafolio (el tablero de La Fábrica). Se retiró en la edición
 * 2.2 del sitio. Desde la refactorización 2026-11, `/portafolio` redirige a
 * `/proyectos#casos` y `/portafolio/<slug>` a `/casos/<slug>`, con 301 en
 * vercel.json y nginx.conf y con <Navigate> dentro de la app.
 */
export const RUTA_PORTAFOLIO = '/portafolio';

/** Laboratorio: placas abiertas y servicios propios (manual 2.2, §1.3). */
export const RUTA_LABORATORIO = '/laboratorio';

/** Ruta del servicio de PCBs. De aquí sale todo enlace hacia él. */
export const RUTA_PCB = '/pcb';

/** Aviso de privacidad (LFPDPPP). Lo enlazan el pie y el aviso de cookies. */
export const RUTA_PRIVACIDAD = '/privacidad';

/** Página de la bio de las redes: un logotipo y botones, sin cabecera ni pie. */
export const RUTA_ENLACES = '/enlaces';

/**
 * Casos: `/casos/<slug>` es un caso de cliente (su ficha en
 * contenido/proyectos/) o la ficha de una pieza (config/piezas.js). `/casos`
 * solo redirige a `/proyectos#casos` (301 en vercel.json y nginx.conf).
 */
export const RUTA_CASOS = '/casos';

/**
 * Galería del portafolio (refactorización 2026-11): `/proyectos` agrupa los
 * casos de clientes y los proyectos del Laboratorio; `/proyectos/<slug>` es
 * la página de una demo. Un caso de cliente pedido por `/proyectos/<slug>`
 * lleva a `/casos/<slug>`, para que cada página tenga una sola URL.
 */
export const RUTA_PROYECTOS = '/proyectos';

/** Caso de ITA. De aquí sale todo enlace hacia él (/enlaces, la ficha). */
export const RUTA_CASO_ITA = `${RUTA_CASOS}/ita-2026`;

/**
 * La navegación tal como se pinta, en orden (refactorización 2026-11,
 * design.md; «Proyectos» sustituye a «Casos»):
 *
 *   Proyectos · Qué construimos · Cómo trabajamos · Laboratorio · Contacto
 *
 * `tipo` distingue las dos naturalezas, porque un ancla y una ruta no se
 * enlazan igual ni se marcan como actuales igual:
 *
 *   ancla  destino `/#<ancla>`; activo cuando se lee alguna de sus `secciones`
 *   ruta   destino propio; activo cuando la URL coincide
 *
 * `rutas` marca además una entrada como actual en otras páginas: /pcb es la
 * línea Hardware, así que cuenta como «Qué construimos», y /casos/<slug> es
 * un proyecto, así que cuenta como «Proyectos».
 *
 * Qué va dentro de cada entrada:
 *   Qué construimos ... las cuatro líneas (§1.9), la capacidad técnica y las
 *                       ofertas de entrada; Hardware enlaza a /pcb.
 *   Cómo trabajamos ... el método y «Frente a las alternativas» (§1.7, §1.8).
 * «Quiénes somos» vive en la portada, entre el Laboratorio y el contacto, sin
 * entrada propia.
 */
export const NAVEGACION = [
  /* `rutas`: un caso de cliente vive en /casos/<slug> y también es un
     proyecto, así que la entrada queda señalada ahí. */
  { id: 'proyectos', tipo: 'ruta', destino: RUTA_PROYECTOS, rutas: [RUTA_CASOS] },
  {
    id: 'queConstruimos',
    tipo: 'ancla',
    ancla: 'que-construimos',
    secciones: ['que-construimos', 'capacidad', 'ofertas'],
    rutas: [RUTA_PCB],
  },
  {
    id: 'comoTrabajamos',
    tipo: 'ancla',
    ancla: 'como-trabajamos',
    secciones: ['como-trabajamos', 'alternativas'],
  },
  { id: 'laboratorio', tipo: 'ruta', destino: RUTA_LABORATORIO },
  { id: 'contacto', tipo: 'ancla', ancla: 'contacto', secciones: ['contacto'] },
];

/** Destino de una entrada: la ruta, o el ancla con la barra delante para que
    funcione también desde otra página. */
export const destinoDe = ({ tipo, destino, ancla }) =>
  tipo === 'ruta' ? destino : `/#${ancla}`;

/**
 * Secciones de la portada que observa `useSeccionActiva`, en orden. Incluye
 * las que no tienen entrada propia (el Laboratorio y «Quiénes somos») para que,
 * al leerlas, no quede marcada la entrada anterior.
 */
export const SECCIONES = [
  'que-construimos',
  'capacidad',
  'ofertas',
  'como-trabajamos',
  'alternativas',
  'del-laboratorio',
  'quienes-somos',
  'contacto',
];
