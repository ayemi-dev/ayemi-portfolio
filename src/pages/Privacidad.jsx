import { useTranslation } from 'react-i18next';
import { Microetiqueta } from '../components/marca/Logotipo';
import { Aviso } from '../components/ui/Aviso';
import { CONTACTO, SITIO } from '../config/sitio';
import { RESPONSABLE } from '../config/externos';

/**
 * Aviso de privacidad integral · `/privacidad`
 *
 * Conforme a la LFPDPPP (México). Cubre el formulario de contacto, WhatsApp,
 * la agenda de 30 min, GA4, Meta Pixel y Microsoft Clarity.
 *
 * El texto legal va solo en español, que es el idioma del aviso ante la ley
 * mexicana; en inglés se muestra una nota que lo explica.
 *
 * §1.10 · Claro y sin legalismos: frases cortas, segunda persona, primero qué
 * pasa con tus datos y después el fundamento.
 *
 * Los datos del responsable salen de `config/externos.js`. Mientras falten, la
 * página lo dice en lugar de inventarlos.
 */

/** Fecha de la última actualización. Cámbiala con cada cambio del aviso. */
const ACTUALIZADO = '28 de octubre de 2026';

const PENDIENTE = '(dato pendiente de publicar)';

const HERRAMIENTAS = [
  {
    nombre: 'Google Analytics 4',
    empresa: 'Google LLC',
    para: 'Contar visitas, páginas vistas y clics en WhatsApp, la agenda y las redes, y saber de qué campaña llegaste.',
    desactivar: 'Complemento de inhabilitación de Google Analytics para navegadores, o bloqueo de cookies de terceros.',
  },
  {
    nombre: 'Meta Pixel',
    empresa: 'Meta Platforms, Inc.',
    para: 'Medir qué anuncios de Facebook e Instagram traen contactos y mostrar anuncios a quien ya visitó el sitio.',
    desactivar: 'Configuración de anuncios de tu cuenta de Facebook o Instagram, o bloqueo de cookies de terceros.',
  },
  {
    nombre: 'Microsoft Clarity',
    empresa: 'Microsoft Corporation',
    para: 'Ver mapas de calor y grabaciones anónimas de la navegación (movimientos, clics, desplazamiento) para corregir lo que no se entiende. No graba lo que escribes en los campos.',
    desactivar: 'Bloqueo de cookies de terceros o la función «no rastrear» de tu navegador.',
  },
];

const Bloque = ({ titulo, children }) => (
  <section className="mt-12">
    <h2 className="text-titulo-3 text-texto">{titulo}</h2>
    <div className="mt-4 flex flex-col gap-4 text-cuerpo text-texto-suave">{children}</div>
  </section>
);

const Lista = ({ elementos }) => (
  <ul className="flex list-disc flex-col gap-2 pl-6">
    {elementos.map((e) => (
      <li key={e}>{e}</li>
    ))}
  </ul>
);

export const Privacidad = () => {
  const { t, i18n } = useTranslation();
  const correo = RESPONSABLE.correo || CONTACTO.correo.valor;
  const enlaceCorreo = (
    <a href={`mailto:${correo}`} className="font-mono text-acento hover:text-acento-hover">
      {correo}
    </a>
  );

  return (
    <article
      className="mx-auto max-w-2xl"
      style={{ paddingInline: 'var(--ay-margen)', paddingBlock: 'var(--ay-esp-24)' }}
    >
      <div className="mx-auto max-w-lectura">
        <Microetiqueta>{t('privacidad.etiqueta')}</Microetiqueta>
        <h1 className="mt-4 text-titulo-1 text-texto">Aviso de privacidad</h1>
        <p className="mt-4 text-cuerpo-l text-texto-suave">
          Qué datos tuyos usamos, para qué, con quién los compartimos y cómo nos pides que los
          corrijamos o los borremos.
        </p>
        <p className="mt-2 font-mono text-micro text-texto-tenue">
          Última actualización: {ACTUALIZADO}
        </p>

        {i18n.language !== 'es' && (
          <Aviso className="mt-8">{t('privacidad.soloEspanol')}</Aviso>
        )}

        <Bloque titulo="1. Quién es responsable de tus datos">
          <p>
            <strong className="text-texto">{RESPONSABLE.nombre || PENDIENTE}</strong>, persona física
            que opera la marca Ayemi en México, es responsable del tratamiento de tus datos
            personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares (LFPDPPP).
          </p>
          <p>Domicilio: {RESPONSABLE.domicilio || PENDIENTE}.</p>
          <p>Contacto para todo lo relacionado con este aviso: {enlaceCorreo}.</p>
        </Bloque>

        <Bloque titulo="2. Qué datos usamos">
          <p>Solo los que nos das o los que genera tu visita. No pedimos datos sensibles.</p>
          <Lista
            elementos={[
              'Formulario de contacto: nombre, correo, empresa (opcional) y tu mensaje.',
              'WhatsApp: tu número, tu nombre de perfil y lo que nos escribes. Si llegaste desde un anuncio o una publicación, el mensaje incluye el origen («Origen: instagram / bio»).',
              'Agenda de 30 min: nombre, correo, la fecha que eliges y lo que quieras contarnos antes de la llamada.',
              'Navegación: dirección IP, tipo de dispositivo y navegador, páginas que ves, clics, desplazamiento y la campaña de la que llegaste (parámetros UTM).',
            ]}
          />
        </Bloque>

        <Bloque titulo="3. Para qué los usamos">
          <p>
            <strong className="text-texto">Finalidades necesarias</strong>, sin ellas no podemos
            atenderte:
          </p>
          <Lista
            elementos={[
              'Responder tu mensaje y darte una cotización.',
              'Agendar y dar el diagnóstico de 30 min.',
              'Prestar el servicio que contrates y darle seguimiento.',
            ]}
          />
          <p>
            <strong className="text-texto">Finalidades secundarias</strong>, puedes negarte sin que
            cambie la atención que recibes:
          </p>
          <Lista
            elementos={[
              'Medir qué páginas, publicaciones y anuncios funcionan.',
              'Mejorar el sitio con mapas de calor y grabaciones anónimas de navegación.',
              'Mostrarte anuncios de Ayemi en Facebook e Instagram después de tu visita.',
            ]}
          />
          <p>
            Para negarte a las secundarias, escríbenos a {enlaceCorreo} con el asunto «No a
            finalidades secundarias», o desactiva las herramientas como se explica en el punto 4.
          </p>
        </Bloque>

        <Bloque titulo="4. Cookies y herramientas de medición">
          <p>
            El sitio usa cookies y tecnologías parecidas de tres empresas. Se cargan después de que
            la página termina de abrir y solo para lo que se describe aquí.
          </p>
          <div className="flex flex-col gap-4">
            {HERRAMIENTAS.map((h) => (
              <div key={h.nombre} className="rounded-md border border-borde p-4">
                <p className="font-bold text-texto">
                  {h.nombre} <span className="font-mono text-micro text-texto-tenue">· {h.empresa}</span>
                </p>
                <p className="mt-2 text-cuerpo-s">{h.para}</p>
                <p className="mt-2 text-cuerpo-s">
                  <span className="text-texto">Cómo desactivarla:</span> {h.desactivar}
                </p>
              </div>
            ))}
          </div>
          <p>
            Además, el sitio guarda en tu navegador el tema, el idioma, que ya viste el aviso de
            cookies y, durante la visita, la campaña de la que llegaste. Esos datos no salen de tu
            equipo, salvo el origen que viaja en el mensaje de WhatsApp.
          </p>
          <p>
            Puedes borrar o bloquear las cookies desde la configuración de tu navegador. El sitio
            sigue funcionando igual.
          </p>
        </Bloque>

        <Bloque titulo="5. Con quién compartimos tus datos">
          <p>No vendemos tus datos. Los comparten solo los servicios que hacen funcionar el sitio:</p>
          <Lista
            elementos={[
              'Vercel: hospeda el sitio y el formulario.',
              'Resend y Cloudflare: entregan los correos del formulario.',
              'WhatsApp (Meta): transporta los mensajes que nos envías por ese canal.',
              'El servicio de agenda: guarda la cita que reservas.',
              'Google, Meta y Microsoft: reciben los datos de navegación del punto 4.',
            ]}
          />
          <p>
            Algunos de estos servicios guardan datos fuera de México, principalmente en Estados
            Unidos. Meta puede usar los datos del Pixel también conforme a su propia política de
            privacidad. Si después de ver el aviso de cookies sigues navegando y no te opones,
            entendemos que lo aceptas; puedes oponerte en cualquier momento como se explica en el
            punto 3.
          </p>
        </Bloque>

        <Bloque titulo="6. Tus derechos ARCO">
          <p>
            Puedes <strong className="text-texto">acceder</strong> a tus datos,{' '}
            <strong className="text-texto">rectificarlos</strong>,{' '}
            <strong className="text-texto">cancelarlos</strong> u{' '}
            <strong className="text-texto">oponerte</strong> a su uso. También puedes revocar tu
            consentimiento o limitar el uso de tus datos.
          </p>
          <p>Escríbenos a {enlaceCorreo} con:</p>
          <Lista
            elementos={[
              'Tu nombre y un correo para responderte.',
              'Una copia de una identificación oficial, o la de tu representante con el documento que lo acredite.',
              'Qué derecho quieres ejercer y sobre qué datos.',
            ]}
          />
          <p>Te respondemos por correo dentro de los plazos que fija la LFPDPPP.</p>
        </Bloque>

        <Bloque titulo="7. Cambios a este aviso">
          <p>
            Si cambia, publicamos la versión nueva en esta misma página (
            <span className="font-mono">{SITIO.url}/privacidad</span>) con su fecha de
            actualización.
          </p>
          <p>
            Si crees que tus datos no se trataron conforme a la ley, puedes acudir a la autoridad
            de protección de datos personales.
          </p>
        </Bloque>
      </div>
    </article>
  );
};
