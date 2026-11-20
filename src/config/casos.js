/**
 * Casos de estudio · `/casos/<slug>`
 *
 * Desde la refactorización 2026-11 los datos viven en la ficha
 * `contenido/proyectos/<slug>/proyecto.json` (`tipo: caso-cliente`). Este
 * módulo los reexporta con la misma forma de antes para que la página actual
 * siga igual mientras llega `PaginaProyecto` (T6).
 *
 * Lo que no se sabe todavía queda vacío en la ficha y la página no lo pinta:
 *
 *   resultadoNegocio  '' → sin párrafo de resultado comercial
 *   testimonio        null → sin bloque de testimonio
 *
 * Las capturas se sirven desde public/casos/<carpeta>/ (copias de las que
 * están en `medios/`); se tomaron del sitio en producción el 28 de octubre de
 * 2026. Las que muestran personal del cliente van aparte
 * (capturasConPersonal) y solo salen con permisoPersonal: true; hasta
 * entonces sus archivos viven en pendientes/casos/<carpeta>/ (pasos en
 * pendientes/LEEME.md).
 */

import { porTipo } from './proyectos';

/** Carpeta de public/ que sirve los medios de cada caso. */
const PUBLICO = {
  'ita-2026': '/casos/ita',
};

/** El texto del caso va en español (es contenido, no interfaz). */
const IDIOMA = 'es';

const parrafos = (texto) => (texto ? texto.split('\n\n') : []);

const captura = (slug) => (img) => ({
  src: img.src.replace(/^medios\//, `${PUBLICO[slug] ?? `/casos/${slug}`}/`),
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
