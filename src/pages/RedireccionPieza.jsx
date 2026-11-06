import { Navigate, useParams } from 'react-router-dom';
import { rutaDePieza } from '../config/piezas';
import { RUTA_CASOS, RUTA_LABORATORIO } from '../config/secciones';

/** Piezas que salieron de /casos: su ficha vieja lleva a su sitio nuevo. */
const MUDADAS = { wabot: `${RUTA_LABORATORIO}#wabot` };

/**
 * Redirección de las fichas antiguas
 *
 * Las fichas colgaron de `/piezas/<slug>` y después de `/portafolio/<slug>`.
 * Desde la edición 2.2 del sitio viven en `/casos/<slug>`.
 *
 * Las redirecciones de verdad son las 301 de `vercel.json`, que es lo que ve un
 * buscador y lo que resuelve una dirección compartida por fuera. Este
 * componente cubre el caso que el servidor no puede: una navegación interna ya
 * dentro de la aplicación, donde no hay petición HTTP que redirigir.
 *
 * `replace` evita dejar la dirección vieja en el historial: si alguien pulsa
 * atrás, no debe volver a una redirección y rebotar otra vez.
 */
export const RedireccionPieza = () => {
  const { slug } = useParams();
  const destino = MUDADAS[slug] ?? (slug ? rutaDePieza(slug) : RUTA_CASOS);
  return <Navigate to={destino} replace />;
};
