import { useTranslation } from 'react-i18next';

/**
 * «Lo que entregaríamos» · página de caso (R5.5)
 *
 * Los tres temas fijos (código a tu nombre, documentación, traspaso) y, debajo,
 * los `entregamos[]` de la ficha en el idioma activo.
 */

export const EntregaConLlaves = ({ entregamos = [] }) => {
  const { t } = useTranslation();
  const fijos = t('caso.entrega', { returnObjects: true });

  return (
    <ul className="flex flex-col gap-3">
      {(Array.isArray(fijos) ? fijos : []).map(({ titulo, texto }) => (
        <li key={titulo} className="flex gap-3 text-cuerpo text-texto">
          <span className="text-acento" aria-hidden="true">·</span>
          <span>
            <strong className="font-bold">{titulo}:</strong> <span className="text-texto-suave">{texto}</span>
          </span>
        </li>
      ))}
      {entregamos.map((punto) => (
        <li key={punto} className="flex gap-3 text-cuerpo text-texto">
          <span className="text-acento" aria-hidden="true">·</span>
          {punto}
        </li>
      ))}
    </ul>
  );
};

export default EntregaConLlaves;
