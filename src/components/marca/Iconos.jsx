/**
 * Iconografía Ayemi
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §3.10
 *
 * ── GENERADO ───────────────────────────────────────────────────────────────
 * El bloque del inventario se genera desde las matrices del kit, en
 * `.ayemi/activos/iconos/`. Esos archivos dicen «no editar contornos», así que
 * los atributos `d` están copiados tal cual y no se retocan a mano.
 *
 * Lo único que cambia respecto de la matriz es el color. Los archivos del kit
 * lo fijan por tema (una copia con la tinta clara y otra con la oscura); aquí
 * la tinta es `currentColor` y el acento sale de `var(--ay-acento)`, que es
 * exactamente lo que hace el AyemiLogo del propio kit para tematizarse solo.
 * Así basta un archivo y el icono sigue al tema sin duplicar activos.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PARÁMETROS DE CONSTRUCCIÓN
 *   Retícula .......... 24 × 24 unidades
 *   Área viva ......... 20 × 20 unidades
 *   Grosor de trazo ... 2 unidades, constante
 *   Remates y uniones . redondos
 *   El Núcleo ......... círculo sólido en cian
 *   Tamaños de uso .... 16 / 20 / 24 / 32 / 48 px
 *
 * NORMA (§3.10). El grosor de trazo es constante en toda la familia y no se
 * escala con el icono: se dibuja en la retícula de 24 y se escala entero.
 *
 * NORMA (§3.10). No se mezclan con iconos de librerías externas: la coherencia
 * de trazo es lo que hace familia a una familia.
 */

import { createElement } from 'react';

const TAMANOS_PERMITIDOS = [16, 20, 24, 32, 48];

/** El acento por defecto. Sigue al tema, igual que en AyemiLogo. */
const ACENTO = 'var(--ay-acento)';

/**
 * Envoltorio común. Centraliza retícula, grosor y remates para que ningún
 * pictograma pueda desviarse de la construcción.
 */
const Icono = ({ tamano = 24, titulo, children, className = '', ...props }) => {
  if (import.meta.env.DEV && !TAMANOS_PERMITIDOS.includes(tamano)) {
    console.warn(
      `[Ayemi §3.10] Tamaño de icono fuera del sistema: ${tamano} px. ` +
        `Usar uno de ${TAMANOS_PERMITIDOS.join(' / ')}.`
    );
  }

  /* §11 · Cuando el icono acompaña a un texto que ya explica la acción, se
     omite el título y se marca como decorativo para no duplicar el anuncio. */
  const accesibilidad = titulo
    ? { role: 'img', 'aria-label': titulo }
    : { 'aria-hidden': true, focusable: 'false' };

  return (
    <svg
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...accesibilidad}
      {...props}
    >
      {titulo ? <title>{titulo}</title> : null}
      {children}
    </svg>
  );
};

/* ==========================================================================
   1. INVENTARIO DE MARCA · los dieciocho pictogramas del §3.10
   Claves y contornos, desde las matrices del kit.
   ========================================================================== */

/** `web` · Desarrollo web */
export const IconoWeb = ({ acento = ACENTO, ...props }) => (
  <Icono {...props}>
    <path d="M 3 5.5 h 18 a 1.5 1.5 0 0 1 1.5 1.5 v 11 a 1.5 1.5 0 0 1 -1.5 1.5 h -18 A 1.5 1.5 0 0 1 1.5 18 V 7 A 1.5 1.5 0 0 1 3 5.5 Z" />
    <path d="M 1.5 9.5 h 21" />
    <circle cx="4.6" cy="7.5" r="1.0" fill={acento} />
  </Icono>
);

/** `codigo` · Codigo */
export const IconoCodigo = (props) => (
  <Icono {...props}>
    <path d="M 8.5 7 L 3.5 12 L 8.5 17" />
    <path d="M 15.5 7 L 20.5 12 L 15.5 17" />
    <path d="M 13.4 5 L 10.6 19" />
  </Icono>
);

/** `movil` · Aplicacion movil */
export const IconoMovil = (props) => (
  <Icono {...props}>
    <path d="M 7.5 2 h 9 a 1.5 1.5 0 0 1 1.5 1.5 v 17 a 1.5 1.5 0 0 1 -1.5 1.5 h -9 A 1.5 1.5 0 0 1 6 20.5 v -17 A 1.5 1.5 0 0 1 7.5 2 Z" />
    <path d="M 10.5 18.5 h 3" />
  </Icono>
);

/** `ramas` · Control de versiones */
export const IconoRamas = (props) => (
  <Icono {...props}>
    <path d="M 6 7.6 v 8.8" />
    <path d="M 18 7.6 v 1.9 a 4 4 0 0 1 -4 4 H 9.2 a 3 3 0 0 0 -3 3" />
    <path d="M 6 2.6 a 2.5 2.5 0 1 1 0 5 a 2.5 2.5 0 0 1 0 -5 Z" />
    <path d="M 18 2.6 a 2.5 2.5 0 1 1 0 5 a 2.5 2.5 0 0 1 0 -5 Z" />
    <path d="M 6 16.4 a 2.5 2.5 0 1 1 0 5 a 2.5 2.5 0 0 1 0 -5 Z" />
  </Icono>
);

/** `panel` · Panel de control */
export const IconoPanel = (props) => (
  <Icono {...props}>
    <path d="M 3.5 3 h 17 a 1.5 1.5 0 0 1 1.5 1.5 v 15 a 1.5 1.5 0 0 1 -1.5 1.5 h -17 A 1.5 1.5 0 0 1 2 19.5 v -15 A 1.5 1.5 0 0 1 3.5 3 Z" />
    <path d="M 9 3 v 18" />
    <path d="M 9 11 h 13" />
  </Icono>
);

/** `despliegue` · Despliegue */
export const IconoDespliegue = (props) => (
  <Icono {...props}>
    <path d="M 12 3 v 12.5" />
    <path d="M 7.4 7.6 L 12 3 L 16.6 7.6" />
    <path d="M 4 20.5 h 16" />
  </Icono>
);

/** `api` · Interfaz de programacion */
export const IconoApi = ({ acento = ACENTO, ...props }) => (
  <Icono {...props}>
    <path d="M 2 12 h 6" />
    <path d="M 16 12 h 6" />
    <path d="M 12 8 a 4 4 0 0 1 0 8 a 4 4 0 0 1 0 -8 Z" />
    <circle cx="12" cy="12" r="1.5" fill={acento} />
  </Icono>
);

/** `monitoreo` · Monitoreo */
export const IconoMonitoreo = ({ acento = ACENTO, ...props }) => (
  <Icono {...props}>
    <path d="M 2 12 h 3.6 l 2.4 -6.4 l 3.6 12.8 l 2.8 -8 l 1.8 1.6 h 3.4" />
    <circle cx="21" cy="12" r="1.5" fill={acento} />
  </Icono>
);

/** `nube` · Infraestructura en la nube */
export const IconoNube = (props) => (
  <Icono {...props}>
    <path d="M 6.8 19 C 4.4 19 2.5 17.1 2.5 14.8 C 2.5 12.7 4 11 6 10.7 C 6.5 7.9 8.9 5.8 11.8 5.8 C 14.4 5.8 16.6 7.5 17.4 9.9 C 19.9 10.2 21.8 12.3 21.8 14.9 C 21.8 17.2 20 19 17.7 19 Z" />
  </Icono>
);

/** `integracion` · Integracion */
export const IconoIntegracion = (props) => (
  <Icono {...props}>
    <path d="M 10.2 14 a 4 4 0 0 1 0 -5.7 l 2.8 -2.8 a 4 4 0 0 1 5.7 5.7 l -1.4 1.4" />
    <path d="M 13.8 10 a 4 4 0 0 1 0 5.7 l -2.8 2.8 a 4 4 0 0 1 -5.7 -5.7 l 1.4 -1.4" />
  </Icono>
);

/** `capas` · Contenedores y capas */
export const IconoCapas = (props) => (
  <Icono {...props}>
    <path d="M 2.5 4.5 h 19 a 1 1 0 0 1 1 1 v 2.5 a 1 1 0 0 1 -1 1 h -19 a 1 1 0 0 1 -1 -1 v -2.5 a 1 1 0 0 1 1 -1 Z" />
    <path d="M 2.5 15 h 19 a 1 1 0 0 1 1 1 v 2.5 a 1 1 0 0 1 -1 1 h -19 a 1 1 0 0 1 -1 -1 V 16 a 1 1 0 0 1 1 -1 Z" />
    <path d="M 5 12 h 14" />
  </Icono>
);

/** `soporte` · Soporte */
export const IconoSoporte = (props) => (
  <Icono {...props}>
    <path d="M 4 14.5 v -2.5 a 8 8 0 0 1 16 0 v 2.5" />
    <path d="M 2.2 13.6 h 2.6 a 1 1 0 0 1 1 1 v 4 a 1 1 0 0 1 -1 1 H 2.2 a 1 1 0 0 1 -1 -1 v -4 a 1 1 0 0 1 1 -1 Z" />
    <path d="M 19.2 13.6 h 2.6 a 1 1 0 0 1 1 1 v 4 a 1 1 0 0 1 -1 1 h -2.6 a 1 1 0 0 1 -1 -1 v -4 a 1 1 0 0 1 1 -1 Z" />
    <path d="M 20.5 19.6 v 0.9 a 2 2 0 0 1 -2 2 H 15" />
  </Icono>
);

/** `automatizacion` · Automatizacion */
export const IconoAutomatizacion = ({ acento = ACENTO, ...props }) => (
  <Icono {...props}>
    <path d="M 20 12 A 8 8 0 1 1 17.2 5.9" />
    <path d="M 17.2 2.5 v 3.6 h -3.6" />
    <circle cx="12" cy="12" r="2.4" fill={acento} />
  </Icono>
);

/** `flujo` · Flujo · La Via */
export const IconoFlujo = ({ acento = ACENTO, ...props }) => (
  <Icono {...props}>
    <path d="M 2 6 h 4.5 q 4.5 0 4.5 6" />
    <path d="M 2 18 h 4.5 q 4.5 0 4.5 -6" />
    <path d="M 11 12 h 6" />
    <circle cx="19.5" cy="12" r="2.0" fill={acento} />
  </Icono>
);

/** `datos` · Base de datos */
export const IconoDatos = (props) => (
  <Icono {...props}>
    <path d="M 4 6 c 0 -1.7 3.6 -3 8 -3 s 8 1.3 8 3 v 12 c 0 1.7 -3.6 3 -8 3 s -8 -1.3 -8 -3 Z" />
    <path d="M 4 6 c 0 1.7 3.6 3 8 3 s 8 -1.3 8 -3" />
    <path d="M 4 12 c 0 1.7 3.6 3 8 3 s 8 -1.3 8 -3" />
  </Icono>
);

/** `nucleo` · Nucleo · nodo emisor */
export const IconoNucleo = ({ acento = ACENTO, ...props }) => (
  <Icono {...props}>
    <path d="M 12 3.5 a 8.5 8.5 0 1 1 0 17 a 8.5 8.5 0 0 1 0 -17 Z" />
    <path d="M 12 1 v 2.5" />
    <path d="M 12 20.5 v 2.5" />
    <path d="M 1 12 h 2.5" />
    <path d="M 20.5 12 h 2.5" />
    <circle cx="12" cy="12" r="3.0" fill={acento} />
  </Icono>
);

/** `seguridad` · Seguridad */
export const IconoSeguridad = (props) => (
  <Icono {...props}>
    <path d="M 12 2.5 L 19.5 5.6 v 5.6 c 0 4.7 -3.2 8.7 -7.5 9.8 C 7.7 19.9 4.5 15.9 4.5 11.2 V 5.6 Z" />
    <path d="M 9 12 l 2.2 2.2 L 15.2 10" />
  </Icono>
);

/** `rendimiento` · Rendimiento */
export const IconoRendimiento = ({ acento = ACENTO, ...props }) => (
  <Icono {...props}>
    <path d="M 3.5 17.5 a 8.5 8.5 0 1 1 17 0" />
    <path d="M 12 17.5 L 16.4 10.9" />
    <circle cx="12" cy="17.5" r="1.6" fill={acento} />
  </Icono>
);

/* ==========================================================================
   2. AFORDANCIAS DE INTERFAZ
   El inventario del §3.10 cubre los conceptos de la marca, no los controles.
   Estos se dibujan con la misma construcción para que no rompan la familia,
   pero no forman parte del inventario y por tanto no requieren aprobación
   como icono nuevo.
   ========================================================================== */

/** Sol · pasar a tema claro */
export const IconoSol = (props) => (
  <Icono {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 5.5V2M12 22v-3.5M5.5 12H2M22 12h-3.5" />
    <path d="M7.4 7.4 4.93 4.93M19.07 19.07 16.6 16.6M16.6 7.4l2.47-2.47M4.93 19.07 7.4 16.6" />
  </Icono>
);

/** Luna · pasar a tema oscuro */
export const IconoLuna = (props) => (
  <Icono {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Icono>
);

/** Idioma */
export const IconoIdioma = (props) => (
  <Icono {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
  </Icono>
);

export const IconoFlechaIzquierda = (props) => (
  <Icono {...props}>
    <path d="M15 4 7 12l8 8" />
  </Icono>
);

export const IconoFlechaDerecha = (props) => (
  <Icono {...props}>
    <path d="M9 4l8 8-8 8" />
  </Icono>
);

export const IconoFlechaAbajo = (props) => (
  <Icono {...props}>
    <path d="M12 4v16M5 13l7 7 7-7" />
  </Icono>
);

/** Enlace externo · sale del área viva hacia la esquina */
export const IconoEnlaceExterno = (props) => (
  <Icono {...props}>
    <path d="M13 3h8v8" />
    <path d="M21 3l-9 9" />
    <path d="M18 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </Icono>
);

export const IconoCerrar = (props) => (
  <Icono {...props}>
    <path d="M5 5l14 14M19 5 5 19" />
  </Icono>
);

export const IconoMenu = (props) => (
  <Icono {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Icono>
);

/** Comprobación · estado de éxito */
export const IconoComprobacion = (props) => (
  <Icono {...props}>
    <path d="M4 12.5 9.5 18 20 6" />
  </Icono>
);

/** Atención · riesgo recuperable */
export const IconoAtencion = (props) => (
  <Icono {...props}>
    <path d="M12 3.5 21.5 20H2.5L12 3.5Z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
  </Icono>
);

/** Error */
export const IconoError = (props) => (
  <Icono {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5" />
    <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
  </Icono>
);

/** Correo */
export const IconoCorreo = (props) => (
  <Icono {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M3 6.5l9 6 9-6" />
  </Icono>
);

/** Mensaje · conversación directa */
export const IconoMensaje = (props) => (
  <Icono {...props}>
    <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 1 1 21 12Z" />
  </Icono>
);

/** Ubicación */
export const IconoUbicacion = (props) => (
  <Icono {...props}>
    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icono>
);

/** Documento · ficha técnica, esquemático, hoja de datos */
export const IconoDocumento = (props) => (
  <Icono {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </Icono>
);

/** Imagen · render de placa, captura, vista del 3D */
export const IconoImagen = (props) => (
  <Icono {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 16l4.5-4.5a2 2 0 0 1 2.8 0L15 16" />
    <path d="M14 15l1.6-1.6a2 2 0 0 1 2.8 0L21 16" />
    <circle cx="15.5" cy="8.5" r="1.5" />
  </Icono>
);

/** Vídeo · demostración grabada */
export const IconoVideo = (props) => (
  <Icono {...props}>
    <rect x="2" y="5" width="14" height="14" rx="2" />
    <path d="M16 10.5 22 7v10l-6-3.5Z" />
  </Icono>
);

/* ==========================================================================
   3. RESOLUCIÓN POR NOMBRE
   Permite que la capa de datos declare un icono con una cadena y no tenga que
   importar JSX. Las claves del inventario son las del §3.10, en minúsculas y
   sin acentos, igual que los nombres de archivo (§0.3).

   El mapa no se exporta: el único acceso es <Pictograma>. Así este archivo
   solo exporta componentes, que es lo que Fast Refresh necesita, y ningún
   consumidor asigna un componente a una variable durante el render.
   ========================================================================== */

const ICONOS = {
  web: IconoWeb,
  codigo: IconoCodigo,
  movil: IconoMovil,
  ramas: IconoRamas,
  panel: IconoPanel,
  despliegue: IconoDespliegue,
  api: IconoApi,
  monitoreo: IconoMonitoreo,
  nube: IconoNube,
  integracion: IconoIntegracion,
  capas: IconoCapas,
  soporte: IconoSoporte,
  automatizacion: IconoAutomatizacion,
  flujo: IconoFlujo,
  datos: IconoDatos,
  nucleo: IconoNucleo,
  seguridad: IconoSeguridad,
  rendimiento: IconoRendimiento,
  // Afordancias y tipos de enlace de La Fábrica
  demo: IconoEnlaceExterno,
  repositorio: IconoRamas,
  caso: IconoDocumento,
  esquematico: IconoDocumento,
  render: IconoImagen,
  gerbers: IconoDespliegue,
  ficha: IconoDocumento,
  video: IconoVideo,
};

/**
 * Pictograma por nombre.
 *
 *   <Pictograma nombre="capas" tamano={32} />
 *
 * Se construye con `createElement` en lugar de asignar el componente a una
 * variable y pintarlo como JSX: es una búsqueda en un mapa estático, no la
 * creación de un componente, y así queda dicho también para el compilador.
 *
 * Si el nombre no está en el inventario, cae al Núcleo: un icono desconocido
 * no debe dejar un hueco en la interfaz.
 */
export const Pictograma = ({ nombre, ...props }) =>
  createElement(ICONOS[nombre] ?? IconoNucleo, props);
