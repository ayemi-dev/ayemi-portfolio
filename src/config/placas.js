/**
 * Galería de PCBs · `/pcb`
 *
 * Tres espacios preparados para las placas propias de Ayemi, uno por familia
 * de microcontrolador. Hoy ninguno tiene diseño publicado: la tarjeta lo dice
 * y no muestra cifras (manual §1.10, regla 4: se admite lo que no se sabe).
 *
 * ── CÓMO SE PUBLICA UNA PLACA ──────────────────────────────────────────────
 *
 * 1. Copia los renders a `public/pcb/<slug>/` (ver `public/pcb/LEEME.md`).
 * 2. Rellena `estado` y `ficha` de su entrada. Nada más que tocar: la tarjeta
 *    pasa sola de «espacio preparado» a ficha completa.
 *
 *   {
 *     slug: 'esp32',
 *     micro: 'ESP32',
 *     estado: 'disenoVerificado',
 *     ficha: {
 *       ancho_mm: 60, alto_mm: 40, capas: 2, componentes: 48, vias: 120,
 *       imagenes: { perspectiva: '/pcb/esp32/perspectiva.webp', superior: '…', inferior: '…' },
 *       dimensiones: { perspectiva: [1600, 1200], superior: [1600, 1200], inferior: [1600, 1200] },
 *     },
 *   }
 *
 * El nombre y la descripción viven en i18n: `pcb.placas.lista.<slug>`.
 *
 * ── ESTADOS ────────────────────────────────────────────────────────────────
 *
 *   null ................ espacio preparado, sin diseño publicado
 *   disenoVerificado .... ERC y DRC sin errores, archivos listos para fabricar
 *   fabricadoProbado .... fabricada y probada en banco con su firmware
 *
 * Una placa no pasa a `fabricadoProbado` hasta que exista la foto de la placa
 * física: el render no demuestra que se fabricó.
 */

import { CONTACTO } from './sitio';

export const ESTADOS_PLACA = ['disenoVerificado', 'fabricadoProbado'];

export const PLACAS = [
  { slug: 'atmega328p', micro: 'ATmega328P', estado: null, ficha: null },
  { slug: 'esp32', micro: 'ESP32', estado: null, ficha: null },
  { slug: 'stm32', micro: 'STM32', estado: null, ficha: null },
];

/** WhatsApp con el mensaje prellenado del servicio. */
export const enlaceWhatsappPcb = (mensaje) =>
  `${CONTACTO.whatsapp.enlace}?text=${encodeURIComponent(mensaje)}`;
