import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logotipo, Microetiqueta } from '../components/marca/Logotipo';
import { Emi } from '../components/marca/Emi';
import {
  IconoEnlaceExterno,
  IconoFlechaDerecha,
  IconoMensaje,
  IconoNucleo,
  IconoDocumento,
  IconoWeb,
  IconoVideo,
  IconoSoporte,
} from '../components/marca/Iconos';
import { enlaceWhatsapp, GITHUB } from '../config/sitio';
import { AGENDA_URL, REDES, urlRed } from '../config/externos';
import { RUTA_CASO_ITA, RUTA_PCB, RUTA_PRIVACIDAD } from '../config/secciones';

/**
 * Enlaces · `/enlaces`
 *
 * La página de la bio de las redes. De arriba abajo:
 *   1. Emi da la bienvenida (§4.5 saludando · §4.6 dos frases, sin emojis).
 *   2. Logotipo, lema como microetiqueta y el claim como titular (§1.11).
 *   3. Todas las redes publicadas (las que tienen URL en VITE_*_URL) y GitHub.
 *   4. Mensaje por WhatsApp: tema + idea + nombre → abre wa.me con el texto
 *      armado. Llega directo al número de Ayemi (VITE_WHATSAPP_NUMERO o el de
 *      sitio.js). medicion.js añade el origen UTM al texto y cuenta el clic
 *      como clic_whatsapp (Contact en Meta).
 *   5. Accesos al resto del sitio en tarjetas.
 *
 * §5.3 · Una sola acción primaria: «Enviar por WhatsApp». §3.13 · Transiciones
 * con los tokens de movimiento; nada rebota. Emi aparece porque la página no
 * tiene precio (§4.7).
 */

const UBICACION = 'enlaces';
const MAX_IDEA = 500;
const externo = { target: '_blank', rel: 'noopener noreferrer' };

/** Icono de red: el SVG oficial (simple-icons, CC0) como máscara en currentColor. */
const MarcaRed = ({ clave }) => (
  <span
    aria-hidden="true"
    className="block h-5 w-5 bg-current"
    style={{
      maskImage: `url(/redes/${clave}.svg)`,
      WebkitMaskImage: `url(/redes/${clave}.svg)`,
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
);

const transicion = 'transition-[color,background-color,border-color,transform] duration-rapida ease-estandar';

export const Enlaces = () => {
  const { t } = useTranslation();
  const temas = t('enlaces.mensaje.temas', { returnObjects: true });
  const [tema, setTema] = useState(0);
  const [idea, setIdea] = useState('');
  const [nombre, setNombre] = useState('');

  const redes = [
    ...REDES.filter((r) => r.url && r.clave !== 'linkedin'),
    GITHUB.url && { clave: 'github', nombre: 'GitHub', url: GITHUB.url },
  ].filter(Boolean);

  const texto = useMemo(() => {
    const partes = [t('enlaces.mensaje.saludo')];
    if (nombre.trim()) partes.push(t('enlaces.mensaje.soy', { nombre: nombre.trim() }));
    partes.push(t('enlaces.mensaje.quiero', { tema: temas[tema] }));
    if (idea.trim()) partes.push(`\n\n${idea.trim()}`);
    return partes.join(' ').replace(' \n\n', '\n\n');
  }, [t, temas, tema, idea, nombre]);

  const youtube = urlRed('youtube');
  const accesos = [
    { clave: 'pcb', to: RUTA_PCB, Icono: IconoNucleo },
    AGENDA_URL && { clave: 'agenda', href: AGENDA_URL, Icono: IconoSoporte, 'data-evento': 'agenda', ...externo },
    youtube && { clave: 'youtube', href: youtube, Icono: IconoVideo, ...externo },
    { clave: 'caso', to: RUTA_CASO_ITA, Icono: IconoDocumento },
    { clave: 'sitio', to: '/', Icono: IconoWeb },
  ].filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-hidden bg-lienzo" data-ubicacion={UBICACION}>
      {/* Resplandor de fondo: Cian Ayemi muy tenue, sin texto encima (§3.5) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--ay-acento) 16%, transparent), transparent 70%)',
        }}
      />

      <main
        className="relative mx-auto flex min-h-screen max-w-md flex-col"
        style={{ paddingInline: 'var(--ay-margen)', paddingBlock: 'var(--ay-esp-12)' }}
      >
        {/* 1 · Emi da la bienvenida */}
        <div className="flex items-end gap-3">
          <Emi expresion="feliz" pose="saludando" alto={88} aria-hidden="true" className="shrink-0" />
          <p className="relative mb-3 rounded-lg border border-borde bg-superficie px-4 py-3 text-cuerpo text-texto">
            {t('enlaces.emi')}
          </p>
        </div>

        {/* 2 · Marca y claim */}
        <header className="mt-8 flex flex-col items-center text-center">
          <Link to="/" aria-label={t('controles.inicio')}>
            <Logotipo tamano={40} />
          </Link>
          <Microetiqueta className="mt-3" />
          <h1 className="mt-6 text-titulo-1 text-texto">
            <span className="block whitespace-nowrap">{t('enlaces.claim')}</span>
            <span className="block whitespace-nowrap text-acento">{t('enlaces.claimAcento')}</span>
          </h1>
          <p className="mt-3 max-w-xs text-cuerpo text-texto-suave">{t('enlaces.entradilla')}</p>
        </header>

        {/* 3 · Redes */}
        {redes.length > 0 && (
          <nav aria-label={t('enlaces.redes')} className="mt-8">
            <ul className="flex flex-wrap justify-center gap-3">
              {redes.map(({ clave, nombre: n, url }) => (
                <li key={clave}>
                  <a
                    href={url}
                    {...externo}
                    aria-label={n}
                    title={n}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-borde bg-superficie text-texto-suave hover:-translate-y-0.5 hover:border-acento hover:text-acento ${transicion}`}
                  >
                    <MarcaRed clave={clave} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* 4 · Mensaje por WhatsApp */}
        <section
          aria-labelledby="enlaces-mensaje"
          className="mt-10 rounded-xl border border-borde bg-superficie p-5"
          data-ubicacion="enlaces-mensaje"
        >
          <div className="flex items-center gap-2">
            <IconoMensaje tamano={20} className="text-acento" />
            <h2 id="enlaces-mensaje" className="text-titulo-4 text-texto">
              {t('enlaces.mensaje.titulo')}
            </h2>
          </div>
          <p className="mt-1 text-cuerpo-s text-texto-suave">{t('enlaces.mensaje.ayuda')}</p>

          <fieldset className="mt-4">
            <legend className="font-mono text-micro uppercase tracking-wider text-texto-tenue">
              {t('enlaces.mensaje.temaEtiqueta')}
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {temas.map((nombreTema, i) => (
                <button
                  key={nombreTema}
                  type="button"
                  aria-pressed={tema === i}
                  onClick={() => setTema(i)}
                  className={`rounded-full border px-3 py-1.5 text-cuerpo-s ${transicion} ${
                    tema === i
                      ? 'border-acento bg-acento text-sobre-acento'
                      : 'border-borde text-texto-suave hover:border-acento hover:text-texto'
                  }`}
                >
                  {nombreTema}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block">
            <span className="font-mono text-micro uppercase tracking-wider text-texto-tenue">
              {t('enlaces.mensaje.ideaEtiqueta')}
            </span>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA))}
              rows={4}
              placeholder={t('enlaces.mensaje.ideaPista')}
              className="mt-2 w-full resize-none rounded-md border border-borde bg-lienzo px-3 py-2 text-cuerpo text-texto placeholder:text-texto-tenue focus:border-acento focus:outline-none"
            />
            <span className="block text-right font-mono text-micro text-texto-tenue">
              {idea.length}/{MAX_IDEA}
            </span>
          </label>

          <label className="mt-2 block">
            <span className="font-mono text-micro uppercase tracking-wider text-texto-tenue">
              {t('enlaces.mensaje.nombreEtiqueta')}
            </span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.slice(0, 60))}
              autoComplete="given-name"
              placeholder={t('enlaces.mensaje.nombrePista')}
              className="mt-2 w-full rounded-md border border-borde bg-lienzo px-3 py-2 text-cuerpo text-texto placeholder:text-texto-tenue focus:border-acento focus:outline-none"
            />
          </label>

          <a
            href={enlaceWhatsapp(texto)}
            {...externo}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-acento px-5 py-3 text-titulo-4 text-sobre-acento hover:bg-acento-hover ${transicion}`}
          >
            {t('enlaces.mensaje.enviar')}
            <IconoFlechaDerecha tamano={20} />
          </a>
          <p className="mt-2 text-center font-mono text-micro text-texto-tenue">
            {t('enlaces.mensaje.nota')}
          </p>
        </section>

        {/* 5 · Accesos */}
        <ul className="mt-6 flex flex-col gap-3">
          {accesos.map(({ clave, Icono, to, href, ...resto }) => {
            const contenido = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lienzo text-acento">
                  <Icono tamano={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-titulo-4 text-texto">{t(`enlaces.accesos.${clave}.titulo`)}</span>
                  <span className="block text-cuerpo-s text-texto-suave">{t(`enlaces.accesos.${clave}.texto`)}</span>
                </span>
                {href ? (
                  <IconoEnlaceExterno tamano={18} className="text-texto-tenue" />
                ) : (
                  <IconoFlechaDerecha tamano={18} className="text-texto-tenue" />
                )}
              </>
            );
            const clase = `group flex items-center gap-4 rounded-xl border border-borde bg-superficie p-4 hover:-translate-y-0.5 hover:border-acento ${transicion}`;
            return (
              <li key={clave}>
                {to ? (
                  <Link to={to} className={clase}>
                    {contenido}
                  </Link>
                ) : (
                  <a href={href} className={clase} {...resto}>
                    {contenido}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <footer className="mt-auto flex flex-col items-center gap-2 pt-12 font-mono text-micro text-texto-tenue">
          <p>
            {t('enlaces.pie')}
          </p>
          <Link to={RUTA_PRIVACIDAD} className="hover:text-acento">
            {t('pie.privacidad')}
          </Link>
        </footer>
      </main>
    </div>
  );
};
