import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Boton } from '../../components/ui/Boton';
import { TarjetaProyecto } from './TarjetaProyecto';
import { proyectosPublicados } from '../../config/proyectos';
import { RUTA_PROYECTOS } from '../../config/secciones';

/**
 * Proyectos destacados · portada · refactorización 2026-11 (T9)
 *
 * Las tres fichas publicadas más recientes por `fecha`, de los dos tipos
 * (`proyectosPublicados()` ya las da en ese orden). Con menos de tres se pintan
 * las que haya; sin ninguna, la sección no se pinta (R0.5). Las piezas de
 * `config/piezas.js` no entran: no son fichas.
 *
 * §5.3 · «Ver todos los proyectos» es secundario: el primario de la portada es
 * el del hero.
 */

const MAXIMO = 3;

export const ProyectosDestacados = () => {
  const { t } = useTranslation();
  const destacados = proyectosPublicados().slice(0, MAXIMO);

  if (destacados.length === 0) return null;

  return (
    <Seccion id="destacados" titulo={t('confianza.destacados.titulo')} fondo="alterno">
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {destacados.map((proyecto) => (
          <TarjetaProyecto key={proyecto.slug} proyecto={proyecto} />
        ))}
      </ul>

      <div className="mt-12">
        <Boton variante="secundario" to={RUTA_PROYECTOS}>
          {t('confianza.destacados.verTodos')}
        </Boton>
      </div>
    </Seccion>
  );
};

export default ProyectosDestacados;
