import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { IconoFlechaAbajo } from '../../components/marca/Iconos';

/**
 * Preguntas frecuentes de `/pcb`
 * design.md §4.6 · Req. 7.1
 *
 * `<details>/<summary>` nativo: foco, teclado y lectura de pantalla ya
 * resueltos por el navegador, sin JavaScript propio.
 */
export const PreguntasPcb = () => {
  const { t } = useTranslation();
  const lista = t('pcb.preguntas.lista', { returnObjects: true });

  return (
    <Seccion
      id="preguntas"
      etiqueta={t('pcb.preguntas.etiqueta')}
      titulo={t('pcb.preguntas.titulo')}
      acento={t('pcb.preguntas.acento')}
      tituloDespues={t('pcb.preguntas.tituloDespues')}
      encabezado="ancho"
    >
      <div className="max-w-lectura">
        {(Array.isArray(lista) ? lista : []).map(({ p, r }) => (
          <details key={p} className="group border-b border-borde py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-titulo-4">
              {p}
              <IconoFlechaAbajo
                tamano={20}
                className="shrink-0 transition-transform duration-rapida ease-estandar group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-cuerpo text-texto-suave">{r}</p>
          </details>
        ))}
      </div>
    </Seccion>
  );
};
