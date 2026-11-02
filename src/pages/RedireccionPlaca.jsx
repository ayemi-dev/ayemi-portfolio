import { Navigate, useParams } from 'react-router-dom';
import { destinoCorto } from '../config/placas';

/**
 * Redirección de las direcciones cortas de los QR
 *
 * El QR de cada placa apunta a `ayemi.org/p/<corto>` (`/p/328`, `/p/esp32`,
 * `/p/stm32`). Las redirecciones de verdad son las de `vercel.json` y
 * `nginx.conf`, que responden antes de cargar la aplicación. Este componente
 * cubre el resto: el servidor de desarrollo y una navegación interna.
 *
 * Un código que no existe lleva a la galería, no a «no encontrada»: quien
 * escanea una placa siempre llega a algo útil.
 */
export const RedireccionPlaca = () => {
  const { corto } = useParams();
  return <Navigate to={destinoCorto(corto)} replace />;
};
