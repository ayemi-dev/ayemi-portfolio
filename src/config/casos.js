/**
 * Casos de estudio · `/casos/<slug>`
 *
 * Un caso cuenta una pieza de La Fábrica con más detalle: problema, qué se
 * hizo, resultado, capturas y, si existe, el testimonio del cliente.
 *
 * Todo lo escrito aquí se puede comprobar: sale del repositorio del proyecto
 * (fechas, rutas, cambios) o del sitio publicado. Lo que no se sabe todavía
 * queda vacío y la página no lo pinta:
 *
 *   resultadoNegocio  '' → sin párrafo de resultado comercial
 *   testimonio        null → sin bloque de testimonio
 *
 * Las capturas viven en public/casos/<slug>/ y se tomaron del sitio en
 * producción el 28 de octubre de 2026.
 */

export const CASOS = [
  {
    slug: 'ita-2026',
    /** Pieza de La Fábrica que cuenta. La ficha enlaza de vuelta aquí. */
    pieza: 'ita-2026',
    cliente: 'ITA',
    titulo: 'Un sitio que explica la rectificación industrial de ITA en dos idiomas',
    sitio: 'https://soluciones-ita.com',

    problema: [
      'ITA (Ingeniería y Tecnología Apolo) mantiene y recupera líneas de recubrimiento metálico en plantas industriales de México. El contenido de su oferta estaba en documentos de trabajo y había que convertirlo en un sitio público.',
      'Necesitaban explicar sus cuatro líneas de solución en español y en inglés, enseñar casos reales y recibir solicitudes de evaluación sin que se perdieran en un buzón.',
    ],

    hicimos: [
      'Llevamos el contenido de sus documentos (el PDF «Contenido Web 2026» y su documento V2.0) al sitio sin reescribir su mensaje.',
      'Siete páginas públicas en español e inglés: inicio, soluciones con preguntas frecuentes, casos de éxito, sobre ITA, contacto y las dos páginas legales.',
      'Formularios que envían desde el servidor al correo de ITA, con confirmación por WhatsApp.',
      'Fotografía real de su operación y un mapa con los estados donde tienen presencia.',
      'Su aviso de privacidad oficial, publicado tal como lo entregó el cliente.',
    ],

    cifras: [
      { que: 'Páginas públicas', valor: '7' },
      { que: 'Idiomas', valor: 'es · en' },
      { que: 'Del primer commit a producción', valor: '12 semanas' },
      { que: 'Commits hasta producción', valor: '86' },
    ],

    resultado:
      'El sitio está en producción en su propio dominio, soluciones-ita.com, desde el 10 de septiembre de 2026.',

    /** Resultado comercial (solicitudes recibidas, tiempo de respuesta…). */
    resultadoNegocio: '',

    capturas: [
      {
        src: '/casos/ita/inicio-escritorio.jpg',
        ancho: 1440,
        alto: 900,
        alt: 'Portada del sitio de ITA en escritorio: técnicos con casco en planta y el titular «Estabilidad, control y continuidad para sistemas de rectificación industrial».',
        pie: 'Portada en escritorio.',
      },
      {
        src: '/casos/ita/contacto-escritorio.jpg',
        ancho: 1440,
        alto: 900,
        alt: 'Página de contacto de ITA con el formulario «Cuéntanos sobre tu caso» y la foto de un técnico frente a un tablero.',
        pie: 'Contacto: el formulario llega al correo de ITA.',
      },
      {
        src: '/casos/ita/inicio-movil.jpg',
        ancho: 780,
        alto: 1688,
        alt: 'Portada del sitio de ITA en un teléfono, con los botones «Solicitar evaluación técnica» y «Conocer nuestras soluciones».',
        pie: 'La misma portada en el teléfono.',
      },
    ],

    /** { cita, autor, cargo }. null hasta tener el permiso de ITA. */
    testimonio: null,
  },
];

export const buscarCaso = (slug) => CASOS.find((c) => c.slug === slug);
