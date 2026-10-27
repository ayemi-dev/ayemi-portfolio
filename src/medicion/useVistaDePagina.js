import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { vistaDePagina } from './medicion';

/**
 * Avisa a Meta de cada cambio de ruta. La primera vista ya la cuenta el
 * arranque del píxel; GA4 y Clarity detectan las navegaciones por su cuenta.
 */
export function useVistaDePagina() {
  const { pathname } = useLocation();
  const primera = useRef(true);

  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    vistaDePagina();
  }, [pathname]);
}
