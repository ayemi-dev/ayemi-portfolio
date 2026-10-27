import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';

/**
 * Entregables de `/pcb`
 * design.md §4.2 · Req. 4.1
 *
 * Mismo patrón que la lista de entregables de `Servicios.jsx`: sin tarjetas,
 * punto cian + texto monoespaciado, porque son datos concretos (§3.8).
 */
export const Entregables = () => {
  const { t } = useTranslation();
  const lista = t('pcb.entregables.lista', { returnObjects: true });

  return (
    <Seccion
      id="entregables"
      etiqueta={t('pcb.entregables.etiqueta')}
      titulo={t('pcb.entregables.titulo')}
      acento={t('pcb.entregables.acento')}
      tituloDespues={t('pcb.entregables.tituloDespues')}
      entradilla={t('pcb.entregables.entradilla')}
      fondo="alterno"
    >
      <ul className="grid gap-x-12 gap-y-3 md:grid-cols-2">
        {(Array.isArray(lista) ? lista : []).map((entregable) => (
          <li
            key={entregable}
            className="flex gap-2 font-mono text-cuerpo-s text-texto-suave"
          >
            <span className="text-acento" aria-hidden="true">
              ·
            </span>
            <span>{entregable}</span>
          </li>
        ))}
      </ul>
    </Seccion>
  );
};
