import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FirmaVertical } from './marca/Logotipo';
import { DESCRIPTOR } from './marca/verbales';
import { IconoEnlaceExterno } from './marca/Iconos';
import { NAVEGACION, RUTA_PRIVACIDAD } from '../config/secciones';
import { CONTACTO, PERFILES, SITIO, esPendiente } from '../config/sitio';

/**
 * Pie
 * Manual de Identidad Corporativa Ayemi · Edición 2.0
 *
 * §2.6 · Aquí entra la firma vertical: es la versión institucional, prevista
 * para créditos y firmas de cierre. A 40 px de altura de caja, por encima del
 * mínimo del bloque (§2.11).
 *
 * §1.11 · El descriptor «Fábrica de software e innovación» acompaña al nombre
 * cuando hace falta explicar el giro, como en un pie de página.
 *
 * §3.8 · Los datos (año, edición del sistema, correo) van en monoespaciada.
 */
export const Footer = () => {
  const { t } = useTranslation();
  const anio = new Date().getFullYear();
  const perfiles = PERFILES.filter((perfil) => !esPendiente(perfil.url));
  const hayCorreo = !esPendiente(CONTACTO.correo.valor);

  return (
    <footer className="border-t border-borde bg-lienzo-profundo">
      <div
        className="mx-auto max-w-2xl"
        style={{
          paddingInline: 'var(--ay-margen)',
          paddingBlock: 'var(--ay-esp-16)',
        }}
      >
        <div className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-24">
          {/* ── Firma ──────────────────────────────────────────────────────── */}
          <div>
            {/* §6 · La firma vertical tiene 48 px de mínimo porque el lema
                deja de ser legible antes que el logotipo. Aquí va a 64.
                El área de protección la reserva el hueco del contenedor. */}
            <FirmaVertical tamano={64} />

            <p className="mt-6 text-cuerpo-s text-texto-suave">{DESCRIPTOR}</p>
            <p className="mt-1 font-mono text-micro text-texto-tenue">
              {SITIO.ubicacion}
            </p>
          </div>

          {/* ── Navegación y canales ───────────────────────────────────────── */}
          <div className="grid gap-8 sm:grid-cols-2">
            <nav aria-label={t('pie.navegacion')}>
              <h2 className="ay-etiqueta">{t('pie.navegacion')}</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {NAVEGACION.map(({ id, tipo, destino }) => (
                  <li key={id}>
                    <Link
                      to={tipo === 'ruta' ? destino : `/#${id}`}
                      className="rounded-sm text-cuerpo-s text-texto-suave transition-colors duration-rapida ease-estandar hover:text-acento"
                    >
                      {t(`nav.${id}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="ay-etiqueta">{t('pie.contacto')}</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {hayCorreo && (
                  <li>
                    <a
                      href={CONTACTO.correo.enlace}
                      className="rounded-sm font-mono text-cuerpo-s break-words text-texto-suave transition-colors duration-rapida ease-estandar hover:text-acento"
                    >
                      {CONTACTO.correo.valor}
                    </a>
                  </li>
                )}

                {perfiles.map((perfil) => (
                  <li key={perfil.clave}>
                    <a
                      href={perfil.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-sm text-cuerpo-s text-texto-suave transition-colors duration-rapida ease-estandar hover:text-acento"
                    >
                      {perfil.nombre}
                      <IconoEnlaceExterno tamano={16} />
                      <span className="sr-only">{t('pie.nuevaPestana')}</span>
                    </a>
                  </li>
                ))}

                {!hayCorreo && perfiles.length === 0 && (
                  <li className="text-cuerpo-s text-texto-tenue">
                    {t('pie.sinCanales')}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Filete de cierre con el degradado Corriente (§3.5) ───────────── */}
        {/* NORMA · Ningún texto se coloca sobre el degradado. Este filete mide
            2 px y no sostiene nada: es el lema en forma de color. */}
        <div className="ay-corriente mt-16 h-0.5 w-full" aria-hidden="true" />

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-mono text-micro text-texto-tenue">
            <span>© {anio} Ayemi</span>
            <span aria-hidden="true"> · </span>
            <span>{t('pie.derechos')}</span>
            <span aria-hidden="true"> · </span>
            <Link
              to={RUTA_PRIVACIDAD}
              className="rounded-sm transition-colors duration-rapida ease-estandar hover:text-acento"
            >
              {t('pie.privacidad')}
            </Link>
          </p>

          {/* Trazabilidad del sistema aplicado. */}
          <p className="font-mono text-micro text-texto-tenue">
            {t('pie.sistema')}
          </p>
        </div>
      </div>
    </footer>
  );
};
