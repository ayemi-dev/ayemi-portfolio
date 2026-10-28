/**
 * Configuración del sitio
 *
 * ⚠️ RELLENA ESTE ARCHIVO ANTES DE PUBLICAR.
 *
 * Todos los datos de contacto y los perfiles viven aquí y en ningún otro sitio.
 * Los valores marcados con `PENDIENTE` no se han inventado a propósito: el
 * manual pide admitir lo que no se sabe (§1.10, regla 4), y publicar un correo
 * o un teléfono falso es peor que no publicar ninguno.
 *
 * Los componentes comprueban `esPendiente()` y ocultan el canal si no está
 * relleno, así que el sitio funciona igual mientras completas los datos.
 */

const PENDIENTE = 'PENDIENTE';

/** Un valor está pendiente si no se ha rellenado. */
export const esPendiente = (valor) =>
  !valor || valor === PENDIENTE || valor.startsWith(PENDIENTE);

export const SITIO = {
  /**
   * Dominio canónico, sin barra final.
   *
   * De aquí salen el enlace canónico de cada ruta, el sitemap y los datos
   * estructurados, así que es el dato del que dependen los buscadores para no
   * indexar la misma página dos veces.
   *
   * Es la ÚNICA fuente del dominio: prerender.mjs la usa para el canónico,
   * og:url, og:image, twitter:image, el JSON-LD (index.html, __SITIO_URL__),
   * el sitemap y el robots.txt, y el build falla si alguna ruta sale con otro
   * dominio o con una imagen relativa.
   *
   * Canónico: `ayemi.org` (decisión de octubre de 2026, por ser la marca y la
   * dirección más corta para las redes). `www.ayemi.org` y
   * `portafolio.ayemi.org` siguen asignados al proyecto, pero vercel.json los
   * manda con 301 a este dominio conservando la ruta y los parámetros (UTM
   * incluidos). Si cambias esta línea, cambia también esas redirecciones.
   */
  url: 'https://ayemi.org',

  /** §1.11 · Elementos verbales fijos. No se editan aquí. */
  nombre: 'Ayemi',

  /** Ciudad y país. Aparece en la sección de contacto. */
  ubicacion: 'México',

  /** Zona horaria declarada, para fijar expectativas de respuesta. */
  zonaHoraria: 'GMT−6 · Ciudad de México',
};

/**
 * Canales de contacto.
 * `valor` es lo que se muestra; `enlace` lo que se abre.
 */
export const CONTACTO = {
  /**
   * Dirección del dominio, servida por Cloudflare Email Routing: recibe en
   * `contacto@ayemi.org` y reenvía al buzón personal. Probado de extremo a
   * extremo antes de publicarla.
   *
   * Nota de funcionamiento: Email Routing solo reenvía, no envía. Las
   * respuestas salen desde el buzón de destino, no desde esta dirección.
   * Enviar como `contacto@ayemi.org` requiere el plan Workers Paid, así que
   * por ahora se queda en recepción.
   */
  correo: {
    valor: 'contacto@ayemi.org',
    enlace: 'mailto:contacto@ayemi.org',
  },

  /**
   * `valor` es lo que se lee en pantalla; `enlace` lo que abre WhatsApp.
   *
   * El enlace lleva 521, no 52. La FAQ de WhatsApp indica que los números de
   * México (código 52) deben incluir un «1» después del código de país para
   * los enlaces de conversación. Sin ese 1 el enlace puede abrir un chat con
   * un número que no existe, y wa.me responde 200 igual, así que el fallo no
   * se ve hasta que alguien lo pulsa.
   *
   * Se muestra en formato nacional porque es como se lee en México, y va en
   * monoespaciada porque es un dato copiable (§3.6).
   */
  whatsapp: {
    valor: '+52 55 2442 6155',
    enlace: 'https://wa.me/5215524426155',
  },
};

/** WhatsApp con un mensaje prellenado. */
export const enlaceWhatsapp = (mensaje) =>
  `${CONTACTO.whatsapp.enlace}?text=${encodeURIComponent(mensaje)}`;

/**
 * Cuenta de GitHub de Ayemi.
 *
 * ⚠️ PON AQUÍ EL USUARIO cuando crees la cuenta. Es el único sitio donde va.
 *
 * Cada pieza de `piezas.js` declara solo el nombre del repositorio
 * (`repo: 'monitor-temperatura'`), y el enlace completo se compone con este
 * usuario. Así, cuando la cuenta exista, cambias una línea y los enlaces de
 * todas las piezas quedan correctos de golpe.
 *
 * Mientras esté pendiente, los botones de repositorio no se muestran: no se
 * publica un enlace roto (§1.10, regla 4).
 */
export const GITHUB = {
  /**
   * Cuenta desde la que se componen los enlaces de repositorio.
   *
   * `ayemi-dev` es la cuenta de Ayemi: ahí viven las piezas propias y
   * públicas. Una pieza aún puede declarar `repo: 'otra-cuenta/nombre'` y el
   * enlace se respeta tal cual.
   */
  usuario: 'ayemi-dev',
  get url() {
    return this.usuario ? `https://github.com/${this.usuario}` : '';
  },
};

/**
 * Perfiles públicos.
 * Se muestran solo los que tengan URL. Los nombres son de las plataformas, no
 * de la marca, así que no siguen el léxico del §1.11.
 *
 * El de GitHub se compone desde GITHUB.usuario para no repetir el dato.
 */
export const PERFILES = [
  { clave: 'github', nombre: 'GitHub', url: GITHUB.url || PENDIENTE },
  {
    clave: 'linkedin',
    nombre: 'LinkedIn',
    /**
     * La ruta del perfil lleva acentos, y en un atributo `href` tienen que ir
     * porcentaje-codificados (RFC 3986): ú es %C3%BA e í es %C3%AD. Escrito con
     * los acentos en crudo, un navegador suele arreglarlo solo, pero un
     * rastreador o un cliente de correo puede no hacerlo.
     *
     * ⚠️ NO VERIFICADO. LinkedIn responde 999 a las peticiones automatizadas,
     *    así que no se pudo comprobar que el perfil exista en esta forma.
     *    Si el enlace da error, lo más probable es que LinkedIn haya generado
     *    el identificador sin acentos:
     *    .../in/raul-agustin-antonio-de-jesus-94b092211
     */
    url: 'https://www.linkedin.com/in/ra%C3%BAl-agust%C3%ADn-antonio-de-jes%C3%BAs-94b092211',
  },
];

/**
 * Formulario de contacto.
 *
 * El destino por defecto es `/api/contacto`, la función serverless que viaja en
 * este mismo despliegue (ver `api/contacto.js`). Es una ruta del propio origen,
 * así que no hay nada que configurar para que funcione.
 *
 * POR QUÉ NO SALE DE UNA VARIABLE DE ENTORNO
 * Antes era `import.meta.env.VITE_ENDPOINT_CONTACTO ?? ''`, y eso tenía una
 * trampa que costó encontrar: las variables `VITE_` se incrustan en tiempo de
 * COMPILACIÓN. Definir la variable en Vercel no basta, hace falta volver a
 * compilar, y si Vercel reutiliza la compilación en caché el valor no entra
 * aunque el panel diga que la variable existe. El formulario se queda apuntando
 * a vacío sin que nada avise.
 *
 * Una ruta del mismo origen no necesita configuración, así que dejarla fija
 * elimina ese modo de fallo por completo.
 *
 * `VITE_ENDPOINT_CONTACTO` sigue funcionando como anulación, para apuntar a un
 * servicio externo (Formspree, Basin…) sin tocar código. Si se define, manda.
 *
 * Y el respaldo honesto sigue en pie: si el envío falla, el formulario no finge
 * haber enviado. Compone un borrador con los datos y lo abre en el cliente de
 * correo, de modo que el mensaje no se pierde en silencio.
 */
export const FORMULARIO = {
  /* `||` y no `??` a propósito: una variable definida pero vacía también debe
     caer al valor por defecto, y `??` solo atrapa null o undefined. */
  endpoint: import.meta.env.VITE_ENDPOINT_CONTACTO || '/api/contacto',

  /** Tamaño máximo del mensaje, para dar un contador y evitar envíos enormes. */
  maximoMensaje: 1200,
};
