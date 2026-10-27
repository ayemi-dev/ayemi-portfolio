import { PortadaPcb } from '../features/pcb/PortadaPcb';
import { Entregables } from '../features/pcb/Entregables';
import { Proceso } from '../features/pcb/Proceso';
import { GaleriaPlacas } from '../features/pcb/GaleriaPlacas';
import { PreguntasPcb } from '../features/pcb/PreguntasPcb';
import { CierrePcb } from '../features/pcb/CierrePcb';

/**
 * Pcb · `/pcb`
 *
 * Servicio de diseño y fabricación de PCBs. Una página corta que explica qué
 * recibes y cómo se trabaja, deja preparados los espacios de las placas
 * propias (ver `config/placas.js`) y lleva a cotizar por WhatsApp.
 *
 * Sin carga diferida: es la página entera, a diferencia de La Fábrica (cuyo
 * tablero y orbital se difieren porque viven dentro de una landing más larga).
 *
 * Fondos alternos, design.md §4: lienzo, alterno, lienzo, alterno, lienzo,
 * alterno.
 */
export const Pcb = () => (
  <>
    <PortadaPcb />
    <Entregables />
    <Proceso />
    <GaleriaPlacas />
    <PreguntasPcb />
    <CierrePcb />
  </>
);
