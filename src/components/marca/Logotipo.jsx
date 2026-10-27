/**
 * Logotipo y firmas Ayemi · adaptador
 * Kit de marca Ayemi · AGENTE.md §6
 *
 * ── QUÉ CAMBIÓ Y POR QUÉ ───────────────────────────────────────────────────
 * Antes este archivo reconstruía el logotipo con Plus Jakarta Sans, porque las
 * matrices no estaban en el repositorio. Ya están, y con ellas el componente
 * oficial `AyemiLogo`, cuyos contornos vienen vectorizados por el generador de
 * marca.
 *
 * La regla absoluta 5 del contrato es clara: «Nunca recompongas el logotipo
 * con la fuente instalada. Usa el SVG de .ayemi/activos/logotipo/». Así que la
 * reconstrucción se retiró por completo y este archivo pasó a ser un
 * adaptador delgado sobre `AyemiLogo`.
 *
 * Se conserva la API que ya consume el sitio (`Logotipo`, `Isotipo`,
 * `FirmaVertical`, `tamano`) para no tocar ocho componentes por un cambio de
 * nombre de propiedad. Lo que hace este archivo es traducir esa API a la del
 * kit y nada más: no dibuja.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * MÍNIMOS NORMATIVOS (§6). Logotipo 20 px · firma 48 px · isotipo 16 px.
 * `AyemiLogo` avisa por consola en desarrollo si se baja de ahí.
 *
 * NORMA (§2). El logotipo no se deforma, no se rota, no se recuadra y no lleva
 * sombras, biseles ni resplandor. La proporción 3.018 la fija el propio
 * componente del kit, así que no hay forma de romperla desde aquí.
 */

import { AyemiLogo } from './AyemiLogo';
import { MICROETIQUETA } from './verbales';

/**
 * Versión principal del logotipo (§6).
 * Es la que se usa siempre que no exista una razón normativa para otra.
 *
 * @param tamano Altura en píxeles. Mínimo 20.
 */
export const Logotipo = ({ tamano = 28, ...props }) => (
  <AyemiLogo alto={tamano} {...props} />
);

/**
 * Isotipo · monograma de la A (§6).
 *
 * NORMA. Es firma reducida, no una alternativa libre: solo favicon, avatar,
 * icono de aplicación, sello y marca de agua. Nunca encabeza un documento.
 */
export const Isotipo = ({ tamano = 24, ...props }) => (
  <AyemiLogo variante="isotipo" alto={tamano} {...props} />
);

/**
 * Firma vertical · logotipo con el lema debajo (§6).
 * Versión institucional: portadas, créditos, firmas de cierre.
 *
 * El lema va dentro del propio SVG matriz, con su tracking y su escala ya
 * resueltos, así que aquí no hay nada que calcular.
 */
export const FirmaVertical = ({ tamano = 64, ...props }) => (
  <AyemiLogo variante="firma" alto={tamano} {...props} />
);

/**
 * Microetiqueta (§5 y §10)
 * Caja alta, tipografía técnica, tracking amplio. Es un recurso gráfico, nunca
 * la grafía del nombre en texto corrido.
 *
 * NORMA. La caja alta nunca se usa en textos de más de cinco palabras.
 */
export const Microetiqueta = ({ children = MICROETIQUETA, className = '' }) => (
  <span className={`ay-etiqueta ${className}`}>{children}</span>
);
