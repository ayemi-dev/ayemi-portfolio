import { useParams } from 'react-router-dom';
import { buscarProyecto } from '../config/proyectos';
import { FichaPieza } from '../features/piezas/FichaPieza';
import { PaginaProyecto } from './PaginaProyecto';

/**
 * `/casos/:slug`
 *
 * Una sola ruta para el trabajo entregado: si el slug tiene ficha publicada de
 * caso de cliente (`contenido/proyectos/<slug>/proyecto.json`), se enseña su
 * página (`PaginaProyecto`, la misma de `/proyectos/:slug`); si no, la ficha
 * de la pieza (config/piezas.js). Un slug que no es ninguna de las dos lo
 * resuelve la ficha con la página de no encontrada.
 */
export const CasoOFicha = () => {
  const { slug } = useParams();
  return buscarProyecto(slug)?.tipo === 'caso-cliente' ? <PaginaProyecto /> : <FichaPieza />;
};
