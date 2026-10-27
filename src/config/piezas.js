/**
 * La Fábrica · líneas de producción y piezas
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ ESTE ES EL ARCHIVO QUE EDITAS PARA AÑADIR TRABAJOS.                     │
 * │ No hace falta tocar ningún componente.                                  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Manual de Identidad Ayemi · Edición 2.0 · §1.3
 * «La palabra fábrica es deliberada. Una fábrica tiene procesos, tiene
 * medidas, entrega piezas que encajan y repite resultados.»
 *
 * De ahí el vocabulario: LÍNEAS de producción, PIEZAS, PLAZAS y FICHAS. No
 * «proyectos» ni «portafolio».
 *
 * ── CÓMO AÑADIR UNA PIEZA ──────────────────────────────────────────────────
 *
 * Añade un objeto al array PIEZAS. Solo `linea`, `slug`, `titulo` y `estado`
 * son obligatorios; el resto se omite si no aplica y la ficha se adapta.
 *
 *   {
 *     linea: 'pcb',                    // id de una de las ocho líneas
 *     slug: 'monitor-temperatura-v2',    // va en la URL: /portafolio/<slug>
 *     titulo: 'Monitor de temperatura v2',
 *     estado: 'entregada',             // 'entregada' | 'en-curso'
 *     anio: 2025,
 *     sector: 'Agricultura protegida',
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
 *   }
 *
 * ── PLAZAS LIBRES ──────────────────────────────────────────────────────────
 *
 * NUNCA escribes un placeholder. Cada línea declara cinco plazas y el tablero
 * rellena las que faltan por su cuenta. Así solo existen en este archivo los
 * trabajos que existen de verdad, y no hay que acordarse de borrar nada.
 *
 * Una plaza libre no finge un proyecto: dice que esa línea tiene hueco. Es lo
 * que pide §1.10, regla 4: se admite lo que no se sabe.
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
import { RUTA_PORTAFOLIO } from './secciones';

/** Plazas por línea. Cambiarlo aquí lo cambia en todo el tablero. */
export const PLAZAS_POR_LINEA = 5;

/**
 * Las ocho líneas de producción.
 *
 * Cuatro de hardware y cuatro de software: eso es «del microcontrolador a la
 * nube» dibujado, y es lo que casi nadie cubre completo.
 *
 * `icono` es el nombre de un pictograma del inventario del §3.10. La resolución
 * a componente vive en el tablero para que este archivo no importe JSX.
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

export const NATURALEZAS = ['hardware', 'software'];

/**
 * Las piezas.
 *
 * Solo trabajos reales, sin métricas inventadas. Cuando una pieza se hizo
 * para otra marca, se titula por lo entregado y declara el cliente aparte:
 * ver «MARCAS AJENAS» arriba.
 *
 * Al añadir las tuyas, el contador de producción y el llenado de cada línea se
 * recalculan solos.
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
    repo: 'myWeddingInvitation',
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
    enlaces: [{ tipo: 'demo', url: 'https://soluciones-ita.com' }],
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
 * Las cinco plazas de una línea: primero las piezas reales, después las
 * plazas libres necesarias para completar.
 *
 * Una plaza libre lleva `estado: 'libre'` y un `indice` para poder rotularla.
 */
export function plazasDeLinea(idLinea) {
  const piezas = piezasDeLinea(idLinea);
  const libres = Math.max(0, PLAZAS_POR_LINEA - piezas.length);

  return [
    ...piezas,
    ...Array.from({ length: libres }, (_, i) => ({
      estado: 'libre',
      linea: idLinea,
      indice: piezas.length + i + 1,
    })),
  ];
}

/** Llenado de una línea, para el tablero: { ocupadas, total }. */
export const llenadoDeLinea = (idLinea) => ({
  ocupadas: piezasDeLinea(idLinea).length,
  total: PLAZAS_POR_LINEA,
});

/**
 * Línea con la que abre el tablero: la primera que tenga piezas.
 *
 * Antes abría en `LINEAS[0]`, que es `pcb` y hoy está vacía, así que lo primero
 * que veía alguien al entrar al portafolio era «esta línea todavía no tiene
 * piezas». Cinco de las ocho líneas están abiertas y sin publicar, de modo que
 * la probabilidad de caer en una vacía era alta.
 *
 * Las plazas libres se siguen viendo, que es lo honesto (§1.10, regla 4). Lo
 * que cambia es por dónde se empieza a mirar: primero el trabajo que existe.
 */
export const primeraLineaConPiezas = () =>
  LINEAS.find((linea) => piezasDeLinea(linea.id).length > 0)?.id ?? LINEAS[0].id;

/**
 * Contador de producción de toda la fábrica.
 * §1.10, regla 2 · Cifras concretas. Y salen de los datos, así que no mienten.
 */
export function contadorDeProduccion() {
  const entregadas = PIEZAS.filter((p) => p.estado === 'entregada').length;
  const enCurso = PIEZAS.filter((p) => p.estado === 'en-curso').length;
  const total = LINEAS.length * PLAZAS_POR_LINEA;

  return {
    entregadas,
    enCurso,
    libres: total - entregadas - enCurso,
    lineas: LINEAS.length,
    total,
  };
}

/**
 * Pieza anterior y siguiente dentro de su línea, para navegar desde la ficha
 * sin volver al tablero.
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
 * Piezas para el anticipo de la portada.
 *
 * La landing no lleva el tablero entero: lleva unas pocas piezas y un enlace al
 * portafolio completo. Se toman las entregadas, en el orden en que están
 * escritas, así que para cambiar el escaparate basta reordenar el array de
 * arriba. No hay una bandera `destacada` que mantener sincronizada.
 */
export const piezasDestacadas = (cuantas = 3) =>
  PIEZAS.filter((p) => p.estado === 'entregada').slice(0, cuantas);

/**
 * Ruta de la ficha de una pieza.
 *
 * Existe para que ningún componente lleve la ruta escrita: se cambia aquí y se
 * cambia en el tablero, en el índice, en la navegación entre fichas, en el
 * prerenderizado y en el sitemap de una vez.
 *
 * Las fichas colgaban de `/piezas/<slug>` cuando La Fábrica vivía dentro de la
 * portada. Al bajar el portafolio a su propia ruta, quedan debajo de ella: así
 * quien navega no salta de vocabulario a mitad de camino. Las direcciones
 * viejas redirigen, ver vercel.json.
 */
export const rutaDePieza = (slug) => `${RUTA_PORTAFOLIO}/${slug}`;

/** Todas las rutas de pieza, para el prerenderizado y el sitemap. */
export const rutasDePiezas = () => PIEZAS.map((p) => rutaDePieza(p.slug));
