/**
 * Datos externos · un solo archivo
 *
 * Todo lo que depende de cuentas o decisiones que aún no existen vive aquí y
 * sale de variables de entorno `VITE_*` (ver .env.example). No hay valores
 * inventados: una variable vacía vale '' y quien la consume oculta su botón,
 * enlace o línea. El sitio nunca enseña un enlace roto.
 *
 * Las variables `VITE_` se incrustan al COMPILAR: después de cambiarlas en
 * Vercel hay que volver a desplegar.
 */

const env = (clave) => (import.meta.env[clave] ?? '').trim();

/** Aviso de privacidad (LFPDPPP). */
export const RESPONSABLE = {
  /** Nombre legal completo de la persona física responsable. */
  nombre: env('VITE_RESPONSABLE_NOMBRE'),
  /** Domicilio para oír y recibir notificaciones. */
  domicilio: env('VITE_RESPONSABLE_DOMICILIO'),
  /** Correo para derechos ARCO. Si falta, se usa el de contacto del sitio. */
  correo: env('VITE_PRIVACIDAD_CORREO'),
};

/**
 * Redes sociales de Ayemi. Alimentan el pie, /enlaces y el `sameAs` del
 * JSON-LD. Cada una aparece solo cuando su URL existe.
 */
export const REDES = [
  { clave: 'instagram', nombre: 'Instagram', url: env('VITE_INSTAGRAM_URL') },
  { clave: 'facebook', nombre: 'Facebook', url: env('VITE_FACEBOOK_URL') },
  { clave: 'tiktok', nombre: 'TikTok', url: env('VITE_TIKTOK_URL') },
  { clave: 'youtube', nombre: 'YouTube', url: env('VITE_YOUTUBE_URL') },
  { clave: 'linkedin', nombre: 'LinkedIn', url: env('VITE_LINKEDIN_URL') },
  { clave: 'x', nombre: 'X', url: env('VITE_X_URL') },
];

/** URL de una red, o '' si no está publicada. */
export const urlRed = (clave) => REDES.find((r) => r.clave === clave)?.url ?? '';

/**
 * Número de WhatsApp Business, en formato internacional y solo dígitos, con
 * el 1 de México después del 52 (5215512345678). Vacío: se usa el número
 * actual de `sitio.js`, que funciona hoy.
 */
export const WHATSAPP_NEGOCIO = env('VITE_WHATSAPP_NUMERO').replace(/\D/g, '');

/** Agenda del diagnóstico de 30 min (Cal.com, Calendly…). Vacía: sin botón. */
export const AGENDA_URL = env('VITE_AGENDA_URL');

/**
 * Precios «desde», en pesos mexicanos y solo el número (1500). Vacío: la
 * oferta se muestra sin precio, nunca con uno inventado.
 */
export const PRECIOS = {
  revisionPcb: Number(env('VITE_PRECIO_REVISION_PCB').replace(/[^\d.]/g, '')) || 0,
};

/** «$1,500 MXN». */
export const formatoPrecio = (pesos) =>
  `${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(pesos)} MXN`;
