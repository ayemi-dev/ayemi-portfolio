import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Boton } from '../../components/ui/Boton';
import { IconoComprobacion, IconoEnlaceExterno } from '../../components/marca/Iconos';

/**
 * «Pruébalo» · página de una demo del Laboratorio (R5.3)
 *
 * Enlace a la demo en otra pestaña, usuario y clave de prueba copiables y
 * «La demo se reinicia cada …». Lo que la ficha no trae no se pinta.
 *
 * §5.3 · El botón es secundario: la acción principal de la página es el
 * WhatsApp del cierre. §3.6 · Usuario y clave en monoespaciada.
 *
 * `clic_demo` lo cablea T8.
 */

const DatoCopiable = ({ etiqueta, valor }) => {
  const { t } = useTranslation();
  const id = useId();
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return undefined;
    const reloj = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(reloj);
  }, [copiado]);

  const copiar = () => {
    navigator.clipboard
      ?.writeText(valor)
      .then(() => setCopiado(true))
      .catch(() => {});
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <dt id={id} className="w-full text-cuerpo-s text-texto-tenue sm:w-40">
        {etiqueta}
      </dt>
      <dd className="flex items-center gap-2">
        <code className="rounded-xs border border-borde bg-lienzo px-2 py-1 font-mono text-cuerpo-s text-texto">
          {valor}
        </code>
        <Boton variante="terciario" tamano="pequeno" onClick={copiar} aria-describedby={id}>
          {copiado && <IconoComprobacion tamano={16} />}
          <span aria-live="polite">{copiado ? t('caso.copiado') : t('caso.copiar')}</span>
        </Boton>
      </dd>
    </div>
  );
};

export const BloquePruebalo = ({ demo }) => {
  const { t } = useTranslation();
  if (!demo?.url) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Boton variante="secundario" tamano="grande" href={demo.url} target="_blank" rel="noopener">
          {t('caso.abrirDemo')}
          <IconoEnlaceExterno tamano={16} />
          <span className="sr-only">{t('pie.nuevaPestana')}</span>
        </Boton>
      </div>

      {(demo.usuarioPrueba || demo.claveDePrueba) && (
        <dl className="flex flex-col gap-3">
          {demo.usuarioPrueba && <DatoCopiable etiqueta={t('caso.usuarioPrueba')} valor={demo.usuarioPrueba} />}
          {demo.claveDePrueba && <DatoCopiable etiqueta={t('caso.claveDePrueba')} valor={demo.claveDePrueba} />}
        </dl>
      )}

      {demo.seReinicia && (
        <p className="text-cuerpo-s text-texto-suave">{t('caso.seReinicia', { cada: demo.seReinicia })}</p>
      )}
    </div>
  );
};

export default BloquePruebalo;
