import { Navigate, useParams } from 'react-router-dom';
import { rutaDePieza } from '../config/piezas';
import { RUTA_PORTAFOLIO } from '../config/secciones';

/**
 * Redirección de las fichas antiguas
 *
 * Las fichas colgaban de `/piezas/<slug>` cuando La Fábrica vivía dentro de la
 * portada. Al bajar el portafolio a su propia ruta pasaron a
 * `/portafolio/<slug>`.
 *
 * Las redirecciones de verdad son las 308 de `vercel.json`, que es lo que ve un
 * buscador y lo que resuelve una dirección compartida por fuera. Este
 * componente cubre el caso que el servidor no puede: una navegación interna ya
 * dentro de la aplicación, donde no hay petición HTTP que redirigir.
 *
 * `replace` evita dejar la dirección vieja en el historial: si alguien pulsa
 * atrás, no debe volver a una redirección y rebotar otra vez.
 */
export const RedireccionPieza = () => {
  const { slug } = useParams();
  return <Navigate to={slug ? rutaDePieza(slug) : RUTA_PORTAFOLIO} replace />;
};
