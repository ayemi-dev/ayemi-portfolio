import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Boton } from '../../components/ui/Boton';
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido';

/**
 * Video de un proyecto · refactorización 2026-11 (design.md)
 *
 * `<video muted playsinline loop preload="none" poster>`: no descarga nada
 * hasta que entra en pantalla, y entonces se reproduce sin sonido. Al salir de
 * pantalla se pausa.
 *
 * §3.13 · Con `prefers-reduced-motion: reduce` no hay video: solo el póster,
 * como imagen. El prerender no conoce la preferencia, así que pinta el video
 * (que sin JavaScript tampoco se reproduce: `preload="none"` y sin autoplay) y
 * la hidratación lo cambia por el póster si hace falta.
 *
 * WCAG 2.2.2 · Algo que se mueve solo más de 5 s se puede detener. Sin
 * `controles`, el componente pinta su propio botón «Pausar el video».
 */

export const VideoProyecto = ({
  mp4,
  webm,
  poster,
  ancho = 1280,
  alto = 720,
  /** Nombre accesible del video y `alt` del póster. */
  titulo,
  loop = true,
  onEnded,
  /** Controles nativos (página de caso). Sin ellos, botón propio de pausa. */
  controles = false,
  /** `false` en el primer pantallazo: el póster no espera a `loading=lazy`. */
  diferido = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const reducido = useMovimientoReducido();
  const video = useRef(null);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el || reducido) return undefined;

    /* React no siempre fija la propiedad `muted` al hidratar, y sin ella el
       navegador bloquea la reproducción automática. */
    el.muted = true;
    el.defaultMuted = true;

    if (pausado) {
      el.pause();
      return undefined;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [reducido, pausado, mp4, webm]);

  const medio = 'block h-auto w-full rounded-md bg-lienzo-profundo';

  if (reducido) {
    return (
      <img
        src={poster}
        width={ancho}
        height={alto}
        alt={titulo}
        loading={diferido ? 'lazy' : 'eager'}
        decoding="async"
        className={`${medio} ${className}`}
      />
    );
  }

  return (
    <div className={className}>
      <video
        ref={video}
        className={medio}
        width={ancho}
        height={alto}
        poster={poster}
        muted
        playsInline
        loop={loop}
        preload="none"
        controls={controles}
        aria-label={titulo}
        onEnded={onEnded}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>

      {!controles && (
        <div className="mt-2 flex justify-end">
          <Boton
            variante="terciario"
            tamano="pequeno"
            onClick={() => setPausado((p) => !p)}
          >
            {pausado ? t('video.reproducir') : t('video.pausar')}
          </Boton>
        </div>
      )}
    </div>
  );
};

export default VideoProyecto;
