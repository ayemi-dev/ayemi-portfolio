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
 * ── DIRECCIÓN CORTA (QR) ───────────────────────────────────────────────────
 *
 * El QR de la serigrafía apunta a `ayemi.org/p/<corto>`, que redirige a la
 * tarjeta de la placa (`/pcb#<slug>`). La dirección corta es permanente porque
 * está impresa en cobre; el destino puede cambiar. Por eso la redirección es
 * temporal (307/302): si la ficha se muda, se cambia el destino y los QR
 * fabricados siguen funcionando. Vive en tres sitios que deben coincidir:
 * `corto` aquí, `vercel.json` y `nginx.conf`.
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
  {
    slug: 'atmega328p',
    corto: '328',
    micro: 'ATmega328P',
    // Diseño completo: ERC y DRC en 0, firmware compilado (pcbAyemi, cierre 2026-11-02).
    estado: 'disenoCompleto',
    ficha: {
      ancho_mm: 90, alto_mm: 60, capas: 2, componentes: 71, vias: 436,
      imagenes: {
        perspectiva: '/pcb/atmega328p/perspectiva.webp',
        superior: '/pcb/atmega328p/superior.webp',
        inferior: '/pcb/atmega328p/inferior.webp',
      },
      dimensiones: { perspectiva: [1600, 1203], superior: [1600, 1105], inferior: [1600, 1105] },
    },
  },
  { slug: 'esp32', corto: 'esp32', micro: 'ESP32', estado: null, ficha: null },
  { slug: 'stm32', corto: 'stm32', micro: 'STM32', estado: null, ficha: null },
];

/** Prefijo de las direcciones cortas de los QR: `/p/<corto>`. */
export const RUTA_CORTA_PLACA = '/p';

/** Destino de una dirección corta, o la galería si el código no existe. */
export const destinoCorto = (corto) => {
  const placa = PLACAS.find((p) => p.corto === corto);
  return placa ? `/pcb#${placa.slug}` : '/pcb#placas';
};

/** WhatsApp con el mensaje prellenado del servicio. */
export const enlaceWhatsappPcb = enlaceWhatsapp;
