import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logotipo } from './marca/Logotipo';
import { IconoCerrar, IconoMenu } from './marca/Iconos';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { useSeccionActiva } from '../hooks/useSeccionActiva';
import { NAVEGACION, SECCIONES } from '../config/secciones';

/**
 * Cabecera
 * Manual de Identidad Corporativa Ayemi · Edición 2.0
 *
 * §2.4 · Versión principal del logotipo. La tinta y el acento los resuelve el
 * rol del logotipo, que cambia con el tema (§2.12).
 *
 * NORMA (§2.15, n.º 6). Sin sombras, biseles, 3D ni resplandor. La versión
 * anterior aplicaba un `drop-shadow` de brillo blanco al logotipo; se retiró.
 *
 * NORMA (§2.10). Área de protección de 4 X. Con el logotipo a 26 px de altura
 * de caja, X mide 4.58 px y la reserva son 18.3 px: el relleno del contenedor
 * y la altura de la barra la superan.
 *
 * NORMA (§5.3). Área mínima de toque 44 × 44 px en todo control.
 * NORMA (§5.4). El anillo de foco no se elimina.
 */

export const Navbar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const seccionActiva = useSeccionActiva(SECCIONES);
  const botonCerrar = useRef(null);

  /* Fuera de inicio no hay secciones que observar, así que ningún enlace se
     marca como actual: señalar «Servicios» desde la ficha de una pieza sería
     información falsa. */
  const enInicio = pathname === '/';

  /* §5.5 · Navegación real por teclado: Escape cierra el menú y el foco entra
     en él al abrirse. Además se bloquea el scroll de fondo. */
  useEffect(() => {
    if (!menuAbierto) return;

    const alPulsar = (evento) => {
      if (evento.key === 'Escape') setMenuAbierto(false);
    };

    document.addEventListener('keydown', alPulsar);
    document.body.style.overflow = 'hidden';
    botonCerrar.current?.focus();

    return () => {
      document.removeEventListener('keydown', alPulsar);
      document.body.style.overflow = '';
    };
  }, [menuAbierto]);

  /* Un ancla y una ruta no se enlazan igual ni se marcan igual como actuales.
     El ancla lleva la barra delante para que funcione también desde otra ruta;
     la ruta se compara contra la URL, así que el portafolio queda señalado
     tanto en su tablero como en la ficha de cualquier pieza. */
  const enlaces = NAVEGACION.map(({ id, tipo, destino }) => ({
    id,
    texto: t(`nav.${id}`),
    destino: tipo === 'ruta' ? destino : `/#${id}`,
    activo:
      tipo === 'ruta'
        ? pathname === destino || pathname.startsWith(`${destino}/`)
        : enInicio && seccionActiva === id,
  }));

  return (
    <header className="fixed top-0 z-50 w-full border-b border-borde bg-lienzo/85 backdrop-blur-md">
      <div
        className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-6"
        style={{ paddingInline: 'var(--ay-margen)' }}
      >
        {/* ── Logotipo ─────────────────────────────────────────────────────── */}
        <Link
          to="/"
          className="inline-flex shrink-0 items-center rounded-sm transition-opacity duration-rapida ease-estandar hover:opacity-80"
          aria-label={t('controles.inicio')}
        >
          <Logotipo tamano={26} />
        </Link>

        {/* ── Navegación en escritorio ─────────────────────────────────────── */}
        <nav
          className="hidden flex-1 justify-center lg:flex"
          aria-label={t('controles.navegacion')}
        >
          <ul className="flex items-center gap-1">
            {enlaces.map(({ id, texto, destino, activo }) => (
              <li key={id}>
                <Link
                  to={destino}
                  aria-current={activo ? 'page' : undefined}
                  className={[
                    'rounded-md px-3 py-2 text-cuerpo-s',
                    'transition-colors duration-rapida ease-estandar',
                    activo
                      ? 'text-acento'
                      : 'text-texto-suave hover:text-texto',
                  ].join(' ')}
                >
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Controles ────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="ay-toque inline-flex h-10 w-10 items-center justify-center rounded-md border border-borde bg-superficie text-texto-suave transition-colors duration-rapida ease-estandar hover:border-borde-fuerte hover:text-texto lg:hidden"
            aria-label={t('controles.abrirMenu')}
            aria-expanded={menuAbierto}
          >
            <IconoMenu tamano={20} />
          </button>
        </div>
      </div>

      {/* ══ Menú móvil ═════════════════════════════════════════════════════ */}
      {menuAbierto && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          {/* §2.14, recurso 2 · Velo de Grafito 950. */}
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-grafito-950/70 backdrop-blur-sm"
            onClick={() => setMenuAbierto(false)}
            aria-label={t('controles.cerrar')}
          />

          {/* §5.2 · Panel grande: radio 16 px, relleno 24 px. */}
          <nav
            className="ay-anim-hoja-sube relative w-full rounded-t-xl border-t border-borde bg-superficie-elevada p-6"
            aria-label={t('controles.navegacion')}
          >
            <div className="flex items-center justify-between">
              <span className="ay-etiqueta">{t('controles.navegacion')}</span>
              <button
                ref={botonCerrar}
                type="button"
                onClick={() => setMenuAbierto(false)}
                className="ay-toque inline-flex h-10 w-10 items-center justify-center rounded-md border border-borde text-texto-suave transition-colors duration-rapida ease-estandar hover:border-borde-fuerte hover:text-texto"
                aria-label={t('controles.cerrar')}
              >
                <IconoCerrar tamano={20} />
              </button>
            </div>

            <ul className="mt-6 flex flex-col">
              {enlaces.map(({ id, texto, destino, activo }) => (
                <li key={id} className="border-t border-borde">
                  <Link
                    to={destino}
                    onClick={() => setMenuAbierto(false)}
                    aria-current={activo ? 'page' : undefined}
                    className={[
                      'flex items-center justify-between py-4 text-titulo-4',
                      'transition-colors duration-rapida ease-estandar',
                      activo ? 'text-acento' : 'text-texto',
                    ].join(' ')}
                  >
                    {texto}
                    {/* §5.5 · El estado no depende solo del color. */}
                    {activo && (
                      <span
                        className="font-mono text-etiqueta"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
