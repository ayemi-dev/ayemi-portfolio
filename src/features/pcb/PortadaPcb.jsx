import { useTranslation } from 'react-i18next';
import { Microetiqueta } from '../../components/marca/Logotipo';
import { Boton } from '../../components/ui/Boton';
import { enlaceWhatsappPcb } from '../../config/placas';

/**
 * Portada de `/pcb`
 *
 * No usa `Seccion` porque lleva el único `h1` de la página (manual §5.5, un
 * solo h1 por vista), pero copia sus medidas (§5.2): `paddingBlock:
 * var(--ay-esp-24)` y el mismo contenedor.
 *
 * Sin imagen ni cifras: vuelven cuando exista una placa propia publicada.
 */
export const PortadaPcb = () => {
  const { t } = useTranslation();

  return (
    <section
      id="pcb"
      className="bg-lienzo"
      style={{ paddingBlock: 'var(--ay-esp-24)' }}
    >
      <div
        className="mx-auto max-w-2xl"
        style={{ paddingInline: 'var(--ay-margen)' }}
      >
        <Microetiqueta>{t('pcb.portada.etiqueta')}</Microetiqueta>

        <h1 className="mt-4 max-w-lectura text-titulo-1 md:text-display-l">
          {t('pcb.portada.titulo')}
          <span className="text-acento">{t('pcb.portada.acento')}</span>
          {t('pcb.portada.tituloDespues')}
        </h1>

        <p className="mt-6 max-w-lectura text-cuerpo-l text-texto-suave">
          {t('pcb.portada.entradilla')}
        </p>

        {/* §5.3 · Una sola acción primaria por vista. */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Boton
            variante="primario"
            tamano="grande"
            href={enlaceWhatsappPcb(t('pcb.whatsapp'))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('pcb.portada.primario')}
          </Boton>
          <Boton variante="secundario" tamano="grande" to="/pcb#proceso">
            {t('pcb.portada.secundario')}
          </Boton>
        </div>
      </div>
    </section>
  );
};
