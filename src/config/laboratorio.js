/**
 * Laboratorio · `/laboratorio`
 * Manual de Identidad Ayemi · Edición 2.2 · §1.3 y §1.9
 *
 * «El Laboratorio es lo que Ayemi construye por iniciativa propia y publica
 * abierto: placas educativas, herramientas y servicios que nacen de un problema
 * real. Nada entra al Laboratorio sin un artefacto que se pueda revisar
 * (repositorio, render, demo o cifra), y cada pieza dice en qué estado está.»
 *
 * Hoy hay dos frentes con artefacto revisable:
 *
 *   placas   Chispa, Enlace e Impulso «por Ayemi». Sus datos viven en
 *            config/placas.js, que comparte con /pcb.
 *   wabot    el servicio de avisos por WhatsApp. Aquí van los datos técnicos
 *            (pila y documentación); los textos, en i18n (`laboratorio.wabot`).
 *
 * NORMA (§1.9). WaBot vive en el Laboratorio y hoy se nombra solo «WaBot».
 * Cuando use la API oficial de WhatsApp Business saldrá como «WaBot por Ayemi».
 *
 * LISTA DE ESPERA. No hay backend propio: se usa el canal que ya existe, un
 * WhatsApp con el mensaje prellenado (config/sitio.js · enlaceWhatsapp, que
 * toma el número de VITE_WHATSAPP_NUMERO). El clic lo cuenta medicion.js como
 * `clic_whatsapp`, con `ubicacion` = `wabot`.
 *
 * Una guía o herramienta nueva entra aquí cuando exista, con su artefacto. No
 * se reserva espacio vacío para ella.
 */

export const WABOT = {
  slug: 'wabot',
  /** Documentación pública. El panel y los repositorios son privados. */
  documentacion: 'https://wabot-panel.vercel.app/docs',
  pila: [
    'Node.js 22',
    'Baileys',
    'SQLite',
    'React',
    'Vite',
    'Tailwind CSS',
    'Oracle Cloud',
    'Cloudflare Tunnel',
    'Vercel',
    'systemd',
  ],
};
