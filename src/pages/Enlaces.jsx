import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logotipo, Microetiqueta } from '../components/marca/Logotipo';
import { Boton } from '../components/ui/Boton';
import { enlaceWhatsapp } from '../config/sitio';
import { AGENDA_URL, urlRed } from '../config/externos';
import { RUTA_CASO_ITA, RUTA_PCB, RUTA_PRIVACIDAD } from '../config/secciones';

/**
 * Enlaces · `/enlaces`
 *
 * La página de la bio de las redes: logotipo, el claim y los
 * botones, sin cabecera ni pie para que nada compita con ellos.
 *
 * Medición: todos llevan `data-ubicacion="enlaces"`, y el escuchador global
 * de medicion.js ya cuenta WhatsApp, la agenda y YouTube. Los UTM de la bio
 * (?utm_source=instagram&utm_medium=bio) viajan al mensaje de WhatsApp.
 *
 * Un botón cuyo destino no existe todavía (agenda, YouTube) no se pinta.
 *
 * §5.3 · Una sola acción primaria: WhatsApp. El resto, secundarias.
 */

const UBICACION = 'enlaces';

export const Enlaces = () => {
  const { t } = useTranslation();
  const youtube = urlRed('youtube');

  const externo = { target: '_blank', rel: 'noopener noreferrer' };

  const botones = [
    {
      clave: 'whatsapp',
      variante: 'primario',
      href: enlaceWhatsapp(t('enlaces.mensajeWhatsapp')),
      ...externo,
    },
    { clave: 'pcb', to: RUTA_PCB },
    AGENDA_URL && { clave: 'agenda', href: AGENDA_URL, 'data-evento': 'agenda', ...externo },
    youtube && { clave: 'youtube', href: youtube, ...externo },
    { clave: 'caso', to: RUTA_CASO_ITA },
    { clave: 'sitio', to: '/' },
  ].filter(Boolean);

  return (
    <div
      className="mx-auto flex min-h-screen max-w-sm flex-col items-center"
      style={{ paddingInline: 'var(--ay-margen)', paddingBlock: 'var(--ay-esp-16)' }}
      data-ubicacion={UBICACION}
    >
      <Link to="/" aria-label={t('controles.inicio')}>
        <Logotipo tamano={40} />
      </Link>
      <Microetiqueta className="mt-4" />

      <h1 className="mt-8 text-center text-titulo-1 text-texto">
        {t('enlaces.claim')} <span className="block text-acento">{t('enlaces.claimAcento')}</span>
      </h1>

      <ul className="mt-10 flex w-full flex-col gap-3">
        {botones.map(({ clave, variante = 'secundario', ...destino }) => (
          <li key={clave}>
            <Boton variante={variante} tamano="grande" className="w-full" {...destino}>
              {t(`enlaces.botones.${clave}`)}
            </Boton>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-16 font-mono text-micro text-texto-tenue">
        <Link to={RUTA_PRIVACIDAD} className="hover:text-acento">
          {t('pie.privacidad')}
        </Link>
      </p>
    </div>
  );
};
