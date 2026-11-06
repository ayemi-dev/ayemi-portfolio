import { useParams } from 'react-router-dom';
import { buscarCaso } from '../config/casos';
import { FichaPieza } from '../features/piezas/FichaPieza';
import { Caso } from './Caso';

/**
 * `/casos/:slug`
 *
 * Una sola ruta para el trabajo entregado: si el slug tiene caso de estudio
 * escrito (config/casos.js), se enseña el caso; si no, la ficha de la pieza
 * (config/piezas.js). Un slug que no es ninguna de las dos lo resuelve la
 * ficha con la página de no encontrada.
 */
export const CasoOFicha = () => {
  const { slug } = useParams();
  return buscarCaso(slug) ? <Caso /> : <FichaPieza />;
};
