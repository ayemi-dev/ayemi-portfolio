import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useAncla
 *
 * Con enrutado en cliente el navegador ya no resuelve las anclas por su cuenta:
 * al llegar a `/#fabrica` desde otra ruta, el desplazamiento hay que hacerlo a
 * mano. Este hook se encarga de las dos situaciones:
 *
 *   Con ancla ... desplaza hasta la sección. Si el bloque todavía no está en el
 *                 árbol (las secciones diferidas tardan un instante), reintenta
 *                 unas cuantas veces antes de rendirse.
 *   Sin ancla ... sube al principio, que es lo que se espera al abrir una ficha.
 *
 * §3.13 · Se respeta prefers-reduced-motion: con movimiento reducido el salto
 * es instantáneo en lugar de suave.
 */

const INTENTOS = 20;
const ESPERA = 60;

export function useAncla() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reducido =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const comportamiento = reducido ? 'auto' : 'smooth';

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    let intentos = 0;
    let temporizador;

    const intentar = () => {
      const destino = document.getElementById(id);

      if (destino) {
        destino.scrollIntoView({ behavior: comportamiento, block: 'start' });
        return;
      }

      intentos += 1;
      if (intentos < INTENTOS) {
        temporizador = window.setTimeout(intentar, ESPERA);
      }
    };

    intentar();
    return () => window.clearTimeout(temporizador);
  }, [pathname, hash]);
}
