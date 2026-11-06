/**
 * Trabajo entregado · piezas con ficha en /casos/<slug>
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ESTE ES EL ARCHIVO QUE EDITAS PARA AÑADIR TRABAJOS.                     │
 * │ No hace falta tocar ningún componente.                                  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Manual de Identidad Ayemi · Edición 2.2 · §1.3
 * «La Fábrica construye por encargo»: aquí van las piezas entregadas, cada una
 * con su ficha. Se listan en /casos; las que tienen caso de estudio escrito
 * (config/casos.js) salen como caso. Lo que Ayemi construye por iniciativa
 * propia vive en el Laboratorio (config/laboratorio.js y config/placas.js).
 *
 * El tablero de ocho líneas con plazas libres se retiró en la edición 2.2 del
 * sitio: enseñaba huecos. Las líneas se conservan solo como rótulo de la ficha.
 *
 * ── CÓMO AÑADIR UNA PIEZA ──────────────────────────────────────────────────
 *
 * Añade un objeto al array PIEZAS. Solo `linea`, `slug`, `titulo` y `estado`
 * son obligatorios; el resto se omite si no aplica y la ficha se adapta.
 *
 *   {
 *     linea: 'pcb',                    // id de una de las líneas de LINEAS
 *     slug: 'monitor-temperatura-v2',    // va en la URL: /casos/<slug>
 *     titulo: 'Monitor de temperatura v2',
 *     estado: 'entregada',             // 'entregada' | 'en-curso'
 *     anio: 2025,
 *     sector: 'Monitoreo industrial',
 *     cliente: { nombre: 'Acme' },     // ver «MARCAS AJENAS» más abajo
 *     resuelve: 'Qué problema quita, en una línea.',
 *     medidas: [                       // §1.3 · una fábrica tiene medidas
 *       { que: 'Capas', valor: '4' },
 *       { que: 'Nodos en bus', valor: '32' },
 *     ],
 *     pila: ['KiCad', 'ESP32', 'RS-485'],
 *     repo: 'monitor-temperatura',       // solo el nombre; el usuario sale de sitio.js
 *     enlaces: [
 *       { tipo: 'esquematico', url: '/piezas/temperatura-v2.pdf' },
 *       { tipo: 'render', url: '/piezas/temperatura-v2.png' },
 *     ],
 *     imagen: '/piezas/temperatura-v2.png',  // opcional, para la ficha
 *     arquitectura: [                  // opcional · capas, en orden
 *       { capa: 'Firmware', que: 'Qué hace esta capa, en una frase.' },
 *     ],
 *     oferta: {                        // opcional · si se ofrece como servicio
 *       titulo, texto, incluye: [..], nota?, boton,
 *       mensaje: 'Texto prellenado de WhatsApp',
 *     },
 *   }
 *
 * Con `oferta`, la ficha cierra con ese servicio y su botón de WhatsApp en
 * lugar de la llamada genérica: una sola acción primaria por vista (§5.3).
 *
 * ── MARCAS AJENAS ──────────────────────────────────────────────────────────
 *
 * Cuando una pieza se hizo PARA otra marca, esa marca se nombra. Pero se
 * nombra como lo que es: independiente de Ayemi. El campo es
 *
 *   cliente: { nombre: 'Acme' }
 *
 * y con él la ficha añade una fila «Cliente» en la hoja de medidas y, debajo
 * del título, una atribución que dice tres cosas: que la marca es
 * independiente, que Ayemi participó como proveedor de desarrollo, y que
 * nombrarla es una referencia de trabajo y no un respaldo ni una alianza.
 *
 * Por qué se hace así, y no simplemente poniendo el nombre en el título: un
 * portafolio que enseña el trabajo de un cliente sin decir de quién es se lo
 * está apropiando. §1.10, regla 1 pide primero el resultado y después el
 * método, no primero el crédito ajeno.
 *
 * Opcionalmente se puede añadir `aporte` con el alcance exacto de Ayemi
 * («Desarrollo del panel», «Firmware y PCB»…). Se deja fuera si no está
 * confirmado: es peor inventar el alcance que omitirlo.
 *
 * ── TIPOS DE ENLACE ────────────────────────────────────────────────────────
 *
 *   demo .......... está en vivo y se puede visitar
 *   repositorio ... se compone solo desde `repo`, no hace falta ponerlo aquí
 *   caso .......... caso de estudio escrito
 *   esquematico ... PDF del esquema eléctrico o electrónico
 *   render ........ imagen del 3D o de la placa
 *   gerbers ....... archivos de fabricación
 *   ficha ......... hoja de datos o documento técnico
 *   video ......... demostración en vídeo
 */

import { GITHUB } from './sitio';
import { CASOS } from './casos';
import { RUTA_CASO_ITA, RUTA_CASOS } from './secciones';

/**
 * Líneas con que se rotula cada pieza en su ficha y en /casos.
 *
 * `icono` es el nombre de un pictograma del inventario del §3.10. La resolución
 * a componente vive en Iconos.jsx (`Pictograma`) para que este archivo no
 * importe JSX.
 */
export const LINEAS = [
  // ── Hardware ────────────────────────────────────────────────────────────
  { id: 'pcb', naturaleza: 'hardware', icono: 'capas' },
  { id: 'circuitos', naturaleza: 'hardware', icono: 'flujo' },
  { id: 'firmware', naturaleza: 'hardware', icono: 'codigo' },
  { id: 'cad', naturaleza: 'hardware', icono: 'rendimiento' },
  // ── Software ────────────────────────────────────────────────────────────
  { id: 'interfaces', naturaleza: 'software', icono: 'movil' },
  { id: 'landings', naturaleza: 'software', icono: 'web' },
  { id: 'paneles', naturaleza: 'software', icono: 'panel' },
  { id: 'tiendas', naturaleza: 'software', icono: 'integracion' },
];

/**
 * Las piezas.
 *
 * Solo trabajos reales, sin métricas inventadas. Cuando una pieza se hizo
 * para otra marca, se titula por lo entregado y declara el cliente aparte:
 * ver «MARCAS AJENAS» arriba.

 */
export const PIEZAS = [
  {
    linea: 'interfaces',
    slug: 'calculadora-series',
    titulo: 'Calculadora de series',
    estado: 'entregada',
    anio: 2025,
    sector: 'Herramienta de cálculo',
    resuelve:
      'Resuelve una fórmula combinada sobre tres series —primos, Fibonacci y triangulares— y muestra el desarrollo en notación matemática. Lleva pruebas unitarias, así que el resultado se puede auditar en lugar de creerlo.',
    medidas: [
      { que: 'Series', valor: '3' },
      { que: 'Pruebas', valor: 'Vitest' },
      { que: 'Despliegue', valor: 'Vercel' },
    ],
    pila: ['React', 'Vite', 'Tailwind CSS', 'mathjs', 'Vitest'],
    // Público y sin credenciales en el árbol: se puede enlazar sin reparos.
    // Solo el nombre: la cuenta la pone GITHUB.usuario en sitio.js.
    repo: 'math-series-calculator',
    enlaces: [{ tipo: 'demo', url: 'https://math-series-calculator.ayemi.org' }],
  },
  {
    linea: 'landings',
    slug: 'invitacion-boda',
    titulo: 'Invitación de boda',
    estado: 'entregada',
    anio: 2024,
    sector: 'Evento privado',
    resuelve:
      'Diez secciones con cuenta atrás, ubicaciones, código de vestimenta y lista de regalos. Las confirmaciones y los mensajes de los invitados entraban en Firestore, así que quien organizó vio las respuestas en un sitio en lugar de reconstruirlas desde WhatsApp.',
    medidas: [
      { que: 'Secciones', valor: '10' },
      { que: 'Confirmaciones', valor: 'Firestore' },
      { que: 'Despliegue', valor: 'Vercel' },
    ],
    pila: [
      'React',
      'Vite',
      'Tailwind CSS',
      'Firebase',
      'react-router',
      'Lottie',
    ],
    // La demostración es el sitio tal como quedó después del evento: se entra
    // sin contraseña y la invitación se lee completa, pero los formularios que
    // capturaban datos están en solo lectura y lo dicen en pantalla. Las reglas
    // de Firestore lo respaldan del lado del servidor, no solo en la interfaz.
    enlaces: [{ tipo: 'demo', url: 'https://my-wedding-invitation.ayemi.org' }],
    // El árbol actual está limpio de credenciales. Se enlaza porque el
    // repositorio ya es público: quien lo busque lo encuentra desde el perfil
    // de GitHub, así que enlazarlo no cambia lo que está expuesto.
    //
    // ⚠️ SIGUE PENDIENTE restringir por referente la llave de Google Maps en
    //    Cloud Console. Salió del código, pero permanece en el historial de
    //    git, y el historial viaja con el repositorio. Eso no lo arregla un
    //    enlace ni un commit: se arregla en la consola de Google.
    repo: 'wedding-invitation',
  },
  {
    linea: 'landings',
    slug: 'ita-2026',
    titulo: 'Sitio público de ITA',
    estado: 'entregada',
    anio: 2026,
    // ITA es una marca ajena y el título la nombraba como si la pieza fuera
    // suya. Ahora el título describe lo entregado y la atribución va aparte.
    // Hay permiso de ITA para nombrarlos.
    cliente: { nombre: 'ITA' },
    // Tomado del título de su propia página, no inventado:
    // «ITA — Estabilidad, control y continuidad para sistemas de
    //  rectificación industrial».
    sector: 'Rectificación industrial',
    resuelve:
      'Presencia pública de ITA en dos idiomas, con siete secciones y un formulario cuyo mensaje llega al correo de verdad, no a un buzón que nadie revisa.',
    medidas: [
      { que: 'Rutas públicas', valor: '7' },
      { que: 'Idiomas', valor: 'es · en' },
      { que: 'Despliegue', valor: 'Vercel' },
    ],
    pila: [
      'React',
      'Vite',
      'Tailwind CSS',
      'react-router',
      'i18next',
      'Motion',
      'Resend',
    ],
    // ⚠️ El repositorio está PRIVADO, así que su enlace no se publica: daría un
    //    403 a cualquier visitante. Cuando lo hagas público, descomenta esta
    //    línea y el botón aparece solo.
    //    Al publicarlo en la cuenta de Ayemi, pon aquí 'ITA_WEB_2026'.
    //
    // Se enlaza el dominio oficial del cliente, no el subdominio de Ayemi.
    // `ita.ayemi.org` se usó para compartir avances durante el desarrollo y
    // sirve el mismo contenido; enseñar ese en el portafolio daría a entender
    // que la web vive en infraestructura de Ayemi, y no es el caso.
    enlaces: [
      { tipo: 'demo', url: 'https://soluciones-ita.com' },
      { tipo: 'caso', url: RUTA_CASO_ITA },
    ],
  },
];

/* ==========================================================================
   DERIVADOS
   Todo lo que sigue se calcula de los datos de arriba. Nada que editar.
   ========================================================================== */

/**
 * Compone la URL del repositorio de una pieza. Admite tres formas:
 *
 *   repo: 'monitor-temperatura'          se compone con GITHUB.usuario
 *   repo: 'otra-cuenta/nombre'         repositorio de otra cuenta
 *   repo: 'https://github.com/…'       URL completa
 *
 * La forma con barra existe para las piezas cuyo repositorio todavía vive en
 * una cuenta personal y no en la organización de Ayemi. Así el enlace funciona
 * hoy y, cuando el repositorio se traspase, basta acortarlo al nombre.
 *
 * Devuelve null si no hay dato suficiente: un botón de repositorio que lleva a
 * un 404 es peor que no tener botón.
 */
export const urlRepositorio = (repo) => {
  if (!repo) return null;
  if (repo.startsWith('http')) return repo;
  if (repo.includes('/')) return `https://github.com/${repo}`;
  return GITHUB.usuario ? `${GITHUB.url}/${repo}` : null;
};

/** Devuelve la pieza de un slug, o undefined. */
export const buscarPieza = (slug) => PIEZAS.find((p) => p.slug === slug);

/** Devuelve la definición de una línea por id. */
export const buscarLinea = (id) => LINEAS.find((l) => l.id === id);

/** Piezas de una línea, en el orden en que están escritas. */
export const piezasDeLinea = (idLinea) =>
  PIEZAS.filter((pieza) => pieza.linea === idLinea);

/**
 * Pieza anterior y siguiente dentro de su línea, para navegar desde la ficha
 * sin volver a /casos.
 */
export function vecinasDePieza(slug) {
  const pieza = buscarPieza(slug);
  if (!pieza) return { anterior: null, siguiente: null };

  const hermanas = piezasDeLinea(pieza.linea);
  const i = hermanas.findIndex((p) => p.slug === slug);

  return {
    anterior: i > 0 ? hermanas[i - 1] : null,
    siguiente: i < hermanas.length - 1 ? hermanas[i + 1] : null,
  };
}


/**
 * Ruta de la ficha de una pieza.
 *
 * Existe para que ningún componente lleve la ruta escrita: se cambia aquí y se
 * cambia en /casos, en la navegación entre fichas, en el prerenderizado y en el
 * sitemap de una vez.
 *
 * Las fichas viven en `/casos/<slug>` desde la edición 2.2 del sitio. Antes
 * colgaron de `/piezas/<slug>` y de `/portafolio/<slug>`; las dos direcciones
 * viejas redirigen con 301 (vercel.json) y, dentro de la aplicación, con
 * pages/RedireccionPieza.jsx. Si una pieza tiene caso de estudio con el mismo
 * slug, la ruta muestra el caso (pages/CasoOFicha.jsx).
 */
export const rutaDePieza = (slug) => `${RUTA_CASOS}/${slug}`;

/** Slugs con caso de estudio propio: su ruta enseña el caso, no la ficha. */
const SLUGS_CON_CASO = new Set(CASOS.map((c) => c.pieza));

/**
 * Piezas entregadas sin caso de estudio, para /casos. Las que tienen caso ya
 * salen arriba, como caso.
 */
export const piezasSinCaso = () =>
  PIEZAS.filter((p) => p.estado === 'entregada' && !SLUGS_CON_CASO.has(p.slug));

/** Todas las rutas de pieza, para el prerenderizado y el sitemap. */
export const rutasDePiezas = () => PIEZAS.map((p) => rutaDePieza(p.slug));
