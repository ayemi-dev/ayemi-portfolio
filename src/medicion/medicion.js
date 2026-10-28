/**
 * Medición · GA4, Meta Pixel y Microsoft Clarity
 *
 * Los IDs vienen de variables de entorno (ver .env.example). Si una falta, esa
 * herramienta no se carga y el sitio funciona igual: no hay ID inventado.
 *
 * Sin bloquear el render: las colas (`dataLayer`, `fbq`, `clarity`) se definen
 * al instante para no perder eventos, pero los scripts de terceros se descargan
 * cuando la página ya cargó y el navegador está ocioso.
 *
 * Eventos (un solo nombre propio, traducido a cada herramienta):
 *
 *   clic_whatsapp       GA4 clic_whatsapp      Meta Contact
 *   formulario_enviado  GA4 generate_lead      Meta Lead
 *   clic_agenda         GA4 clic_agenda        Meta Schedule
 *   clic_red_social     GA4 clic_red_social    Meta ClicRedSocial (custom)
 */

import { AGENDA_URL } from '../config/externos';

const IDS = {
  ga4: import.meta.env.VITE_GA4_ID ?? '',
  meta: import.meta.env.VITE_META_PIXEL_ID ?? '',
  clarity: import.meta.env.VITE_CLARITY_ID ?? '',
};


const EVENTOS = {
  clic_whatsapp: { ga4: 'clic_whatsapp', meta: 'Contact' },
  formulario_enviado: { ga4: 'generate_lead', meta: 'Lead' },
  clic_agenda: { ga4: 'clic_agenda', meta: 'Schedule' },
  clic_red_social: { ga4: 'clic_red_social', meta: 'ClicRedSocial', metaPropio: true },
};

const enNavegador = typeof window !== 'undefined';

// ── Carga ───────────────────────────────────────────────────────────────────

const cargarScript = (src) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

const cuandoOcioso = (fn) => {
  const correr = () =>
    'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 1500);
  if (document.readyState === 'complete') correr();
  else window.addEventListener('load', correr, { once: true });
};

function prepararGa4(id) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // Las vistas de página de la SPA las cuenta la medición mejorada de GA4
  // (cambios en el historial del navegador). Debe estar activa en la propiedad.
  window.gtag('config', id);
  return () => cargarScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

function prepararMeta(id) {
  if (window.fbq) return () => {};
  const fbq = function () {
    fbq.callMethod ? fbq.callMethod(...arguments) : fbq.queue.push(arguments);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  fbq('init', id);
  fbq('track', 'PageView');
  return () => cargarScript('https://connect.facebook.net/en_US/fbevents.js');
}

function prepararClarity(id) {
  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
  return () => cargarScript(`https://www.clarity.ms/tag/${encodeURIComponent(id)}`);
}

// ── UTM ─────────────────────────────────────────────────────────────────────

const CLAVES_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_LS = 'ayemi:utm';

/** Guarda los UTM de la URL de entrada para toda la visita (sessionStorage). */
function capturarUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm = Object.fromEntries(CLAVES_UTM.filter((k) => params.get(k)).map((k) => [k, params.get(k)]));
  if (!Object.keys(utm).length) return;
  try {
    sessionStorage.setItem(UTM_LS, JSON.stringify(utm));
  } catch {
    /* Sin almacenamiento: los UTM viven solo en esta vista. */
    window.__ayemiUtm = utm;
  }
}

export function leerUtm() {
  if (!enNavegador) return {};
  try {
    return JSON.parse(sessionStorage.getItem(UTM_LS) ?? 'null') ?? window.__ayemiUtm ?? {};
  } catch {
    return window.__ayemiUtm ?? {};
  }
}

/**
 * WhatsApp no recibe parámetros de campaña, así que el origen viaja en el texto
 * del mensaje: «Origen: instagram / bio / lanzamiento». Quien contesta sabe de
 * dónde llegó la persona y lo puede anotar.
 */
const MARCA_ORIGEN = '\n\nOrigen: ';

export function conOrigenWhatsapp(href) {
  const utm = leerUtm();
  const partes = [utm.utm_source, utm.utm_medium, utm.utm_campaign, utm.utm_content].filter(Boolean);
  if (!partes.length) return href;
  try {
    const url = new URL(href);
    const texto = (url.searchParams.get('text') ?? '').split(MARCA_ORIGEN)[0];
    url.searchParams.set('text', `${texto}${MARCA_ORIGEN}${partes.join(' / ')}`.trimStart());
    return url.toString();
  } catch {
    return href;
  }
}

// ── Eventos ─────────────────────────────────────────────────────────────────

export function rastrear(nombre, parametros = {}) {
  if (!enNavegador) return;
  const evento = EVENTOS[nombre];
  if (!evento) return;
  const datos = { ...parametros, ...leerUtm() };
  if (IDS.ga4 && window.gtag) window.gtag('event', evento.ga4, datos);
  if (IDS.meta && window.fbq) window.fbq(evento.metaPropio ? 'trackCustom' : 'track', evento.meta, datos);
  if (IDS.clarity && window.clarity) window.clarity('event', nombre);
}

/** Meta no detecta los cambios de ruta de una SPA: se le avisa en cada navegación. */
export function vistaDePagina() {
  if (enNavegador && IDS.meta && window.fbq) window.fbq('track', 'PageView');
}

const REDES = {
  'instagram.com': 'instagram',
  'facebook.com': 'facebook',
  'tiktok.com': 'tiktok',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'linkedin.com': 'linkedin',
  'x.com': 'x',
  'twitter.com': 'x',
  'github.com': 'github',
};

const redDe = (host) => Object.entries(REDES).find(([d]) => host === d || host.endsWith(`.${d}`))?.[1];

/** Dónde está el enlace: `data-ubicacion` o, si no, el id de la sección. */
const ubicacionDe = (el) =>
  el.closest('[data-ubicacion]')?.dataset.ubicacion ||
  el.closest('section[id]')?.id ||
  el.closest('footer, header')?.tagName.toLowerCase() ||
  window.location.pathname;

/**
 * Un solo escuchador para todo el sitio: así cualquier botón de WhatsApp,
 * agenda o red social cuenta, también los que se agreguen después, sin tener
 * que acordarse de cablear cada uno.
 */
function escucharClics() {
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      const ubicacion = ubicacionDe(a);

      if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') {
        a.href = conOrigenWhatsapp(a.href); // antes de que el navegador siga el enlace
        rastrear('clic_whatsapp', { ubicacion });
      } else if (a.dataset.evento === 'agenda' || (AGENDA_URL && a.href.startsWith(AGENDA_URL))) {
        rastrear('clic_agenda', { ubicacion });
      } else {
        const red = redDe(url.hostname);
        if (red) rastrear('clic_red_social', { red, ubicacion });
      }
    },
    true
  );
}

// ── Arranque ────────────────────────────────────────────────────────────────

let iniciada = false;

export function iniciarMedicion() {
  if (!enNavegador || iniciada) return;
  iniciada = true;
  capturarUtm();
  escucharClics();
  const cargas = [
    IDS.ga4 && prepararGa4(IDS.ga4),
    IDS.meta && prepararMeta(IDS.meta),
    IDS.clarity && prepararClarity(IDS.clarity),
  ].filter(Boolean);
  if (cargas.length) cuandoOcioso(() => cargas.forEach((cargar) => cargar()));
}
