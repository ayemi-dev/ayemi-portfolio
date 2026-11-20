import { useSyncExternalStore } from 'react';

/**
 * `true` si la persona pidió menos movimiento (§3.13). En el servidor
 * (prerender) vale `false`; al hidratar, React vuelve a leer la preferencia y
 * repinta si cambió, sin desajuste de hidratación.
 */

const CONSULTA = '(prefers-reduced-motion: reduce)';

const suscribir = (aviso) => {
  const consulta = window.matchMedia(CONSULTA);
  consulta.addEventListener('change', aviso);
  return () => consulta.removeEventListener('change', aviso);
};

export const useMovimientoReducido = () =>
  useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false
  );
