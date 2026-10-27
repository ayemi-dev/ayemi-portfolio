import { useEffect, useState } from 'react';

/**
 * useSeccionActiva
 *
 * Devuelve el id de la sección visible para marcar el enlace correspondiente
 * en la navegación.
 *
 * Se usa IntersectionObserver en lugar de escuchar el scroll: el navegador
 * calcula la intersección fuera del hilo principal, así que la barra no
 * introduce trabajo en cada fotograma. Coherente con §3.13, donde el
 * movimiento del sistema no debe ir a saltos.
 *
 * @param {string[]} ids Ids de las secciones, en orden de aparición.
 */
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(ids[0] ?? null);

  useEffect(() => {
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elementos.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        /* Gana la sección visible más cercana al inicio del viewport. Con
           varias intersecando a la vez, es la que la persona está leyendo. */
        const visibles = entradas
          .filter((entrada) => entrada.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visibles.length > 0) setActiva(visibles[0].target.id);
      },
      {
        /* La cabecera mide 64 px; el margen inferior descarta el tramo que ya
           salió por arriba para que el cambio ocurra al entrar la sección. */
        rootMargin: '-64px 0px -55% 0px',
        threshold: 0,
      }
    );

    elementos.forEach((elemento) => observador.observe(elemento));
    return () => observador.disconnect();
  }, [ids]);

  return activa;
}
