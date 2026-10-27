import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Boton } from '../../components/ui/Boton';
import {
  IconoAutomatizacion,
  IconoFlechaDerecha,
  IconoIntegracion,
  IconoNucleo,
  IconoPanel,
} from '../../components/marca/Iconos';
import { RUTA_PCB } from '../../config/secciones';

/**
 * Líneas de servicio
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §1.9
 *
 * Ayemi opera con marca única monolítica: todo se firma Ayemi y las líneas de
 * servicio son descriptores, no marcas.
 *
 * NORMA (§1.9). Las líneas de servicio se escriben como texto descriptivo con
 * la tipografía corporativa. Nunca se les construye logotipo propio, ni se
 * encierran en una caja, ni se les asigna un color distinto del sistema.
 *
 * Por eso esta sección NO usa tarjetas: cada línea se separa con un filete
 * superior y vive como texto, no como pieza enmarcada. El acento es el mismo
 * cian del sistema en las tres, sin diferenciarlas por matiz.
 */

const LINEAS = [
  { clave: 'plataformas', Icono: IconoPanel },
  { clave: 'automatizacion', Icono: IconoAutomatizacion },
  { clave: 'integraciones', Icono: IconoIntegracion },
  { clave: 'hardware', Icono: IconoNucleo, enlace: RUTA_PCB },
];

export const Servicios = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="servicios"
      etiqueta={t('servicios.etiqueta')}
      titulo={t('servicios.titulo')}
      acento={t('servicios.acento')}
      tituloDespues={t('servicios.tituloDespues')}
      entradilla={t('servicios.entradilla')}
      guia={t('servicios.guiaEmi')}
    >
      <div className="grid gap-12 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
        {LINEAS.map(({ clave, Icono, enlace }) => {
          const entregables = t(`servicios.lineas.${clave}.entregables`, {
            returnObjects: true,
          });

          return (
            <div key={clave}>
              {/* Filete de acento en lugar de caja: la línea se anuncia sin
                  enmarcarse (§1.9). */}
              <div className="h-px w-12 bg-acento" />

              <Icono tamano={32} className="mt-6 text-texto-suave" />

              {/* El nombre de la línea va en la tipografía corporativa, sin
                  tratamiento gráfico propio. */}
              <h3 className="mt-4 text-titulo-3">
                Ayemi{' '}
                <span className="font-normal text-texto-suave">
                  {t(`servicios.lineas.${clave}.nombre`)}
                </span>
              </h3>

              <p className="mt-3 text-cuerpo text-texto-suave">
                {t(`servicios.lineas.${clave}.descripcion`)}
              </p>

              {/* §3.8 · Los entregables son datos concretos: monoespaciada. */}
              <ul className="mt-6 flex flex-col gap-2">
                {(Array.isArray(entregables) ? entregables : []).map(
                  (entregable) => (
                    <li
                      key={entregable}
                      className="flex gap-2 font-mono text-micro text-texto-tenue"
                    >
                      <span className="text-acento" aria-hidden="true">
                        ·
                      </span>
                      <span>{entregable}</span>
                    </li>
                  )
                )}
              </ul>

              {enlace && (
                <Boton
                  variante="terciario"
                  tamano="pequeno"
                  to={enlace}
                  className="-ml-3 mt-6"
                >
                  {t(`servicios.lineas.${clave}.enlace`)}
                  <IconoFlechaDerecha tamano={16} />
                </Boton>
              )}
            </div>
          );
        })}
      </div>

      {/* §1.9 · Emi no es submarca y las líneas no son marcas. Se deja dicho. */}
      <p className="mt-16 max-w-lectura border-t border-borde pt-6 text-cuerpo-s text-texto-tenue">
        {t('servicios.nota')}
      </p>
    </Seccion>
  );
};
