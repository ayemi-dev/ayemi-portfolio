/**
 * Casos de estudio · `/casos/<slug>`
 *
 * Desde la refactorización 2026-11 los datos viven en la ficha
 * `contenido/proyectos/<slug>/proyecto.json` (`tipo: caso-cliente`). Este
 * módulo los reexporta con la forma de antes para `/casos` (`Casos.jsx`), las
 * piezas y el prerender. La página de cada caso lee la ficha directamente
 * (`PaginaProyecto`, T6).
 *
 * Lo que no se sabe todavía queda vacío en la ficha y la página no lo pinta:
 *
 *   resultadoNegocio  '' → sin párrafo de resultado comercial
 *   testimonio        null → sin bloque de testimonio
 *
 * Las capturas se sirven desde `/proyectos/<slug>/` (`urlMedio`; las copia
 * de `medios/` `scripts/copiar-medios.mjs`); se tomaron del sitio en
 * producción el 28 de octubre de 2026. Las que muestran personal del cliente van aparte
 * (capturasConPersonal) y solo salen con permisoPersonal: true; hasta
 * entonces sus archivos viven en pendientes/casos/<carpeta>/ (pasos en
 * pendientes/LEEME.md).
 */

import { porTipo, urlMedio } from './proyectos';

/** El texto del caso va en español (es contenido, no interfaz). */
const IDIOMA = 'es';

const parrafos = (texto) => (texto ? texto.split('\n\n') : []);

const captura = (slug) => (img) => ({
  src: urlMedio(slug, img.src),
  ancho: img.ancho,
  alto: img.alto,
  alt: img.alt[IDIOMA],
  pie: img.pie?.[IDIOMA] ?? '',
});

const comoCaso = (ficha) => {
  const textos = ficha.textos[IDIOMA];
  return {
    slug: ficha.slug,
    /** Pieza de La Fábrica que cuenta. La ficha enlaza de vuelta aquí. */
    pieza: ficha.pieza,
    cliente: ficha.cliente,
    titulo: textos.titulo,
    sitio: ficha.sitio,
    problema: parrafos(textos.problema),
    hicimos: parrafos(textos.solucion),
    cifras: textos.cifras ?? [],
    resultado: textos.resultado ?? '',
    resultadoNegocio: textos.resultadoNegocio ?? '',
    permisoPersonal: ficha.permisoPersonal === true,
    capturas: ficha.imagenes.map(captura(ficha.slug)),
    capturasConPersonal: (ficha.capturasConPersonal ?? []).map(captura(ficha.slug)),
    testimonio: ficha.testimonio ?? null,
  };
};

export const CASOS = porTipo('caso-cliente').map(comoCaso);

export const buscarCaso = (slug) => CASOS.find((c) => c.slug === slug);

/** Las capturas que se pueden publicar hoy según el permiso del cliente. */
export const capturasDe = (caso) =>
  caso.permisoPersonal && caso.capturasConPersonal.length > 0 ? caso.capturasConPersonal : caso.capturas;
