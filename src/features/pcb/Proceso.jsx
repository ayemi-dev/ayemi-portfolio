import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';

/**
 * El proceso
 *
 * Seis pasos numerados, explicados sin placa de ejemplo. Cada paso dice qué
 * se hace y qué queda en tus manos al terminarlo: la evidencia es el
 * entregable, no una captura. Cada `article` lleva `border-t` salvo el primero
 * (que no tiene paso anterior) y `mt-10` para separarse del previo.
 */

const PASOS = [
  'requisitos',
  'esquematico',
  'ruteo',
  'verificacion',
  'archivos',
  'fabricacion',
];

const Paso = ({ clave, indice, t }) => {
  const puntos =
    t(`pcb.proceso.pasos.${clave}.puntos`, { returnObjects: true }) ?? [];

  return (
    <article
      className={`mt-10 grid gap-8 pt-10 lg:grid-cols-12 ${
        indice > 0 ? 'border-t border-borde' : ''
      }`}
    >
      <div className="lg:col-span-4">
        <span className="font-mono text-micro text-acento">
          {String(indice + 1).padStart(2, '0')}
        </span>
        <h3 className="mt-2 text-titulo-3">
          {t(`pcb.proceso.pasos.${clave}.titulo`)}
        </h3>
        <p className="mt-3 text-cuerpo text-texto-suave">
          {t(`pcb.proceso.pasos.${clave}.texto`)}
        </p>
      </div>

      <div className="lg:col-span-8">
        <p className="font-mono text-micro uppercase text-texto-tenue">
          {t(`pcb.proceso.pasos.${clave}.rotulo`)}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {puntos.map((punto) => (
            <li
              key={punto}
              className="flex gap-2 font-mono text-cuerpo-s text-texto-suave"
            >
              <span className="text-acento" aria-hidden="true">
                ·
              </span>
              <span>{punto}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export const Proceso = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="proceso"
      etiqueta={t('pcb.proceso.etiqueta')}
      titulo={t('pcb.proceso.titulo')}
      acento={t('pcb.proceso.acento')}
      tituloDespues={t('pcb.proceso.tituloDespues')}
      entradilla={t('pcb.proceso.entradilla')}
      guia={t('pcb.proceso.guiaEmi')}
    >
      {PASOS.map((clave, indice) => (
        <Paso key={clave} clave={clave} indice={indice} t={t} />
      ))}
    </Seccion>
  );
};
