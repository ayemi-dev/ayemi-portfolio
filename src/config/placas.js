/**
 * Galería de PCBs · `/pcb`
 *
 * Tres placas educativas propias de Ayemi, una por familia de microcontrolador:
 * Chispa (ATmega328P), Enlace (ESP32) e Impulso (STM32). Mientras una placa no
 * tiene ficha, la tarjeta lo dice y no muestra cifras (manual §1.10, regla 4:
 * se admite lo que no se sabe).
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
 *     estado: 'disenoCompleto',
 *     ficha: {
 *       ancho_mm: 60, alto_mm: 40, capas: 2, componentes: 48, vias: 120,
 *       imagenes: { perspectiva: '/pcb/esp32/perspectiva.webp', superior: '…', inferior: '…' },
 *       dimensiones: { perspectiva: [1600, 1200], superior: [1600, 1200], inferior: [1600, 1200] },
 *     },
 *   }
 *
 * El nombre y la descripción viven en i18n: `pcb.placas.lista.<slug>`. El
 * nombre se escribe «Chispa por Ayemi»; el micro va aparte, en `micro`.
 *
 * ── ESTADOS ────────────────────────────────────────────────────────────────
 *
 *   null ................ espacio preparado, sin diseño publicado
 *   disenoCompleto ...... ERC y DRC en 0, renders completos y firmware que compila
 *   disenoVerificado .... además, DFM de JLCPCB aprobado: lista para fabricar
 *   fabricadoProbado .... fabricada y probada en banco con su firmware
 *
 * Nunca se marca un peldaño que la placa no alcanzó. Una placa no pasa a
 * `disenoVerificado` sin la captura del DFM aprobado, ni a `fabricadoProbado`
 * sin la foto de la placa física: el render no demuestra que se fabricó.
 */

import { enlaceWhatsapp } from './sitio';

export const ESTADOS_PLACA = ['disenoCompleto', 'disenoVerificado', 'fabricadoProbado'];

export const PLACAS = [
  { slug: 'atmega328p', micro: 'ATmega328P', estado: null, ficha: null },
  { slug: 'esp32', micro: 'ESP32', estado: null, ficha: null },
  { slug: 'stm32', micro: 'STM32', estado: null, ficha: null },
];

/** WhatsApp con el mensaje prellenado del servicio. */
export const enlaceWhatsappPcb = enlaceWhatsapp;
