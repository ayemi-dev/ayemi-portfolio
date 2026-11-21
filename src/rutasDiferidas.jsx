import { lazy } from 'react';
import { matchPath } from 'react-router-dom';
import { RUTA_CASOS, RUTA_PROYECTOS } from './config/secciones';

/**
 * Páginas en diferido (R9) y su precarga antes de hidratar (T12)
 *
 * Las cuatro páginas de design.md se cargan con `lazy()`. El prerenderizado
 * espera a que se resuelvan, así que el HTML estático las trae completas. El
 * problema estaba en el navegador: si la hidratación se suspende en la
 * frontera de `<Suspense>` de `App.jsx` mientras llega el trozo de la página,
 * y antes de eso llega una actualización que la atraviesa, React abandona el
 * HTML del servidor, pinta el respaldo (vacío) y vuelve a montar la página.
 * En Lighthouse móvil eso daba CLS 0.936 y LCP de 3.3 a 4.2 s.
 *
 * Por eso `main.jsx` llama a `precargarPaginaActual()` antes de `hydrateRoot`:
 * resuelve el trozo de la ruta actual con el mismo `import()` que usa `lazy()`
 * y la página se pinta ya resuelta, sin suspender. Las demás rutas siguen en
 * diferido y se descargan al navegar a ellas.
 *
 * Una página resuelta antes de hidratar se pinta siempre con su componente
 * directo, y las demás siempre con `lazy()`: el tipo de cada página no cambia
 * en vida de la app, así que nunca se vuelve a montar por esto.
 */

/** El `import()` de cada página. Lo comparten `lazy()` y la precarga. */
const CARGADORES = {
  inicio: () => import('./pages/Inicio').then((m) => m.Inicio),
  proyectos: () => import('./pages/Proyectos').then((m) => m.Proyectos),
  demoOCaso: () => import('./pages/DemoOCaso').then((m) => m.DemoOCaso),
  casoOFicha: () => import('./pages/CasoOFicha').then((m) => m.CasoOFicha),
};

/** Los mismos patrones que las `<Route>` de `App.jsx` para estas páginas. */
const PATRONES = [
  ['/', 'inicio'],
  [RUTA_PROYECTOS, 'proyectos'],
  [`${RUTA_PROYECTOS}/:slug`, 'demoOCaso'],
  [`${RUTA_CASOS}/:slug`, 'casoOFicha'],
];

/** Páginas resueltas antes de la primera hidratación. Solo se escribe ahí. */
const resueltas = new Map();

/**
 * Descarga el trozo de la página de `ruta`, si es una de las diferidas.
 * Si la descarga falla, la página queda con `lazy()`, como antes.
 */
export async function precargarPaginaActual(ruta) {
  const encontrada = PATRONES.find(([patron]) => matchPath(patron, ruta));
  if (!encontrada) return;
  const clave = encontrada[1];
  try {
    resueltas.set(clave, await CARGADORES[clave]());
  } catch {
    /* Sin red o sin el trozo: `lazy()` lo volverá a pedir al pintar. */
  }
}

function diferida(clave) {
  const Perezosa = lazy(() => CARGADORES[clave]().then((Pagina) => ({ default: Pagina })));

  function PaginaDiferida(props) {
    const Resuelta = resueltas.get(clave);
    return Resuelta ? <Resuelta {...props} /> : <Perezosa {...props} />;
  }
  return PaginaDiferida;
}

export const Inicio = diferida('inicio');
export const Proyectos = diferida('proyectos');
export const DemoOCaso = diferida('demoOCaso');
export const CasoOFicha = diferida('casoOFicha');
