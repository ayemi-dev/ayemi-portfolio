import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { IconoFlechaAbajo } from '../../components/marca/Iconos';

/**
 * Preguntas frecuentes · portada · refactorización 2026-11 (R7, T9)
 *
 * Las ocho preguntas de `confianza.preguntas.lista` (es/en). El JSON-LD
 * `FAQPage` de T11 leerá esta misma lista.
 *
 * `<details>/<summary>` nativo, con el patrón de `PreguntasPcb`: foco, teclado
 * y lectura de pantalla ya resueltos por el navegador, sin JavaScript propio.
 */

export const PreguntasFrecuentes = () => {
  const { t } = useTranslation();
  const lista = t('confianza.preguntas.lista', { returnObjects: true });

  return (
    <Seccion
      id="preguntas"
      etiqueta={t('confianza.preguntas.etiqueta')}
      titulo={t('confianza.preguntas.titulo')}
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

export default PreguntasFrecuentes;
