import { Navigate, useParams } from 'react-router-dom';
import { buscarProyecto } from '../config/proyectos';
import { RUTA_CASOS } from '../config/secciones';
import { PaginaProyecto } from './PaginaProyecto';

/**
 * `/proyectos/:slug`
 *
 * La página de una demo del Laboratorio (design.md, «Rutas»). Un caso de
 * cliente tiene su página en `/casos/<slug>`: si se pide por aquí, se lleva
 * allí con `replace`, para que la misma página no viva en dos URL. Un slug sin
 * ficha publicada lo resuelve `PaginaProyecto` con la página de no encontrada.
 */
export const DemoOCaso = () => {
  const { slug } = useParams();
  return buscarProyecto(slug)?.tipo === 'caso-cliente' ? (
    <Navigate to={`${RUTA_CASOS}/${slug}`} replace />
  ) : (
    <PaginaProyecto />
  );
};
