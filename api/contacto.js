import { Resend } from 'resend';

/**
 * Endpoint del formulario de contacto
 *
 * Función serverless de Vercel, runtime Node. Recibe el POST del formulario
 * y manda el mensaje por correo con Resend.
 *
 * ── DE DÓNDE SALE ESTE PATRÓN ──────────────────────────────────────────────
 * Es el mismo enfoque que ya funciona en la landing de ITA (`api/contact.js`
 * de ITA_WEB_2026), reducido a lo que este formulario necesita: aquí no hay
 * adjuntos ni reporte paralelo por WhatsApp, que es infraestructura del
 * cliente y no tiene nada que hacer en el portafolio de Ayemi.
 *
 * ── POR QUÉ FUNCIONA SIN TOCAR EL DNS ──────────────────────────────────────
 * `ayemi.org` ya está verificado en Resend, y la verificación es de dominio
 * completo: se puede enviar desde cualquier nombre antes del `@`. Resend puso
 * su SPF en `send.ayemi.org`, así que no choca con el SPF de la raíz que
 * gestiona Cloudflare Email Routing para recibir. Comprobado en el DNS:
 *
 *   resend._domainkey.ayemi.org   DKIM de Resend
 *   send.ayemi.org  TXT           v=spf1 include:amazonses.com ~all
 *   ayemi.org       TXT           v=spf1 include:_spf.mx.cloudflare.net ~all
 *
 * ── LA LLAVE NUNCA LLEVA PREFIJO VITE_ ─────────────────────────────────────
 * `RESEND_API_KEY` se lee de `process.env` y vive solo en el servidor.
 * Cualquier variable con prefijo `VITE_` se empaqueta en el JavaScript que
 * descarga el navegador, y ahí la ve cualquiera con las herramientas de
 * desarrollo abiertas. Esa distinción es la diferencia entre una llave
 * privada y una llave publicada.
 */

const A_CORREO = process.env.CONTACT_TO_EMAIL || 'contacto@ayemi.org';
const DE_CORREO = process.env.CONTACT_FROM_EMAIL || 'portafolio@ayemi.org';

/* Límites de longitud. El formulario ya los aplica, pero este endpoint es
   público y no debe confiar en eso. */
const MAX_CORTO = 100;
const MAX_MEDIO = 200;
const MAX_MENSAJE = 1200;
const MIN_MENSAJE = 20;

/* Paleta del manual, tema claro.
   §5.6 · El tema claro es obligatorio en correo.
   DESVIACIÓN DECLARADA de la regla «colores solo por token»: los clientes de
   correo no soportan propiedades personalizadas de CSS, así que aquí no queda
   más remedio que literales. Son los valores exactos de los roles en claro:
   lienzo, superficie, texto, texto-suave, acento y borde. El acento es Cian
   800 y no Cian 500, porque Cian 500 sobre fondo claro da 2.06:1 y no se usa
   como texto (§7.2). */
const C = {
  lienzo: '#F4F7FA', // ayemi-ok · --ay-lienzo en tema claro
  superficie: '#FFFFFF', // ayemi-ok · --ay-superficie en tema claro
  texto: '#1A1D21', // ayemi-ok · --ay-texto en tema claro
  textoSuave: '#333941', // ayemi-ok · --ay-texto-suave en tema claro
  acento: '#0E6478', // ayemi-ok · --ay-acento en tema claro (Cian 800)
  borde: '#BFC6D0', // ayemi-ok · --ay-borde en tema claro
};

/* La escala tipográfica, por el mismo motivo: en correo no hay `var()`, así que
   los peldaños se interpolan como número. Todos salen de la escala de doce
   (§3.7); ninguno es inventado. Se agrupan aquí porque dentro de una plantilla
   literal no cabe un comentario, y sin comentario no hay justificación. */
const T = {
  etiqueta: 11, // ayemi-ok · --ay-texto-etiqueta
  titulo3: 25, // ayemi-ok · --ay-texto-titulo-3
  cuerpo: 16, // ayemi-ok · --ay-texto-cuerpo
  cuerpoS: 14, // ayemi-ok · --ay-texto-cuerpo-s
};

const recortar = (valor, maximo) =>
  typeof valor === 'string' ? valor.trim().slice(0, maximo) : '';

/* Se escapa todo lo que venga de fuera antes de meterlo en el HTML del correo.
   Sin esto, un mensaje con etiquetas se interpretaría al abrirlo. */
const escapar = (valor) =>
  String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Validación en servidor.
 * §1.10, regla 3 · Los mensajes dicen qué falta, nunca quién se equivocó.
 */
function revisar({ nombre, correo, mensaje }) {
  if (!nombre) return 'Falta el nombre.';
  if (!correo) return 'Falta el correo.';
  if (!correo.includes('@')) return 'Al correo le falta la arroba.';

  const dominio = correo.split('@')[1] ?? '';
  if (!dominio.includes('.') || dominio.endsWith('.')) {
    return 'Al correo le falta el dominio después de la arroba.';
  }

  if (!mensaje) return 'Falta el mensaje.';
  if (mensaje.length < MIN_MENSAJE) {
    return `El mensaje necesita al menos ${MIN_MENSAJE} caracteres.`;
  }

  return null;
}

/* §5.3 · Tabla sin líneas verticales, solo un filete horizontal entre filas.
   §3.6 · El correo de quien escribe es un dato copiable: va en monoespaciada. */
const filas = (campos) =>
  campos
    .filter(([, valor]) => valor)
    .map(
      ([etiqueta, valor, mono]) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid ${C.borde};color:${C.textoSuave};font-weight:600;white-space:nowrap;vertical-align:top;">${escapar(etiqueta)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid ${C.borde};color:${C.texto};${mono ? "font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;" : ''}">${escapar(valor).replace(/\n/g, '<br/>')}</td>
        </tr>`
    )
    .join('');

const cuerpoHtml = (campos) => `
  <div style="background:${C.lienzo};padding:32px 16px;">
    <div style="max-width:600px;margin:0 auto;background:${C.superficie};border:1px solid ${C.borde};border-radius:10px;padding:24px;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
      <p style="margin:0 0 4px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:${T.etiqueta}px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.acento};">Ayemi &middot; portafolio</p>
      <h1 style="margin:0 0 24px;font-size:${T.titulo3}px;font-weight:600;color:${C.texto};">Alguien escribió desde el sitio</h1>
      <table style="width:100%;border-collapse:collapse;font-size:${T.cuerpo}px;line-height:1.65;">
        ${filas(campos)}
      </table>
      <p style="margin:24px 0 0;font-size:${T.cuerpoS}px;color:${C.textoSuave};">
        Puedes responder directo a este correo: la respuesta le llega a quien escribió.
      </p>
    </div>
  </div>`;

const cuerpoTexto = (campos) =>
  [
    'Alguien escribió desde el sitio de Ayemi',
    '',
    ...campos.filter(([, v]) => v).map(([e, v]) => `${e}: ${v}`),
  ].join('\n');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  const cuerpo = req.body || {};

  /* Campo trampa. Está oculto en el formulario, así que una persona no lo ve
     ni lo rellena; los robots rellenan todo lo que encuentran. Se responde
     200 a propósito: si devolviéramos un error, el robot reintentaría. */
  if (recortar(cuerpo.sitioWeb, MAX_MEDIO)) {
    return res.status(200).json({ ok: true });
  }

  const datos = {
    nombre: recortar(cuerpo.nombre, MAX_CORTO),
    correo: recortar(cuerpo.correo, MAX_MEDIO),
    empresa: recortar(cuerpo.empresa, MAX_CORTO),
    mensaje: recortar(cuerpo.mensaje, MAX_MENSAJE),
  };

  const problema = revisar(datos);
  if (problema) {
    return res.status(400).json({ ok: false, error: problema });
  }

  if (!process.env.RESEND_API_KEY) {
    /* §1.10, regla 4 · Se admite lo que no se sabe. Queda en el registro de la
       función con el motivo exacto, y quien envía recibe una respuesta que no
       le echa la culpa. */
    console.error('RESEND_API_KEY no está configurada en este entorno.');
    return res.status(500).json({
      ok: false,
      error: 'El envío de correo no está configurado todavía.',
    });
  }

  const campos = [
    ['Nombre', datos.nombre],
    ['Correo', datos.correo, true],
    ['Empresa', datos.empresa],
    ['Mensaje', datos.mensaje],
  ];

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: `Ayemi · portafolio <${DE_CORREO}>`,
      to: A_CORREO,
      /* Así se responde al visitante desde el propio cliente de correo, sin
         copiar la dirección a mano. */
      replyTo: datos.correo,
      subject: `[Portafolio] ${datos.nombre}${datos.empresa ? ` · ${datos.empresa}` : ''}`,
      html: cuerpoHtml(campos),
      text: cuerpoTexto(campos),
    });

    if (error) {
      console.error('Resend devolvió un error:', error);
      return res.status(502).json({
        ok: false,
        error: 'No se pudo enviar el mensaje. Vuelve a intentarlo.',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Fallo inesperado en el envío:', err);
    return res.status(500).json({
      ok: false,
      error: 'Ocurrió un error inesperado al enviar el mensaje.',
    });
  }
}
