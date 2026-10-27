import { Fabrica } from '../features/piezas/Fabrica';

/**
 * Portafolio
 *
 * El tablero completo, en su propia ruta. Aquí La Fábrica ES la página, así que
 * su titular sube a h1 (§5.5: un solo h1 por vista).
 *
 * POR QUÉ TIENE RUTA PROPIA
 * Vivía dentro de la portada, y ahí competía con siete bloques de landing
 * siendo el más pesado de todos. Con URL propia consigue tres cosas que en un
 * ancla no tenía: se puede referenciar desde un CV, se indexa por separado, y
 * quien entra ve el trabajo sin pasar por la presentación de la empresa.
 *
 * No se carga en diferido como cuando era una sección: aquí es lo único que hay
 * en la página, así que diferirlo solo añadiría un salto.
 */
export const Portafolio = () => <Fabrica nivel={1} />;
