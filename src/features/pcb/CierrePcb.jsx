import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Boton } from '../../components/ui/Boton';
import { CONTACTO } from '../../config/sitio';
import { enlaceWhatsappPcb } from '../../config/placas';

/**
 * Cierre de `/pcb`
 * design.md §4.7 · Req. 7.2
 *
 * El botón primario ya se usó en la portada; repetirlo aquí rompería la regla
 * de una sola acción primaria por vista (§5.3). Por eso WhatsApp va como
 * secundario y el correo como enlace de texto.
 */
export const CierrePcb = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="cotiza"
      etiqueta={t('pcb.cierre.etiqueta')}
      titulo={t('pcb.cierre.titulo')}
      acento={t('pcb.cierre.acento')}
      tituloDespues={t('pcb.cierre.tituloDespues')}
      guia={t('pcb.cierre.guiaEmi')}
      guiaSituacion="escucha"
      fondo="alterno"
      encabezado="lectura"
    >
      <div className="flex flex-col items-center gap-4">
        <Boton
          variante="secundario"
          tamano="grande"
          href={enlaceWhatsappPcb(t('pcb.whatsapp'))}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('pcb.cierre.whatsapp')}
        </Boton>

        <p className="text-cuerpo-s text-texto-suave">
          {t('pcb.cierre.correo')}{' '}
          <a
            href={CONTACTO.correo.enlace}
            className="font-mono text-texto-suave transition-colors duration-rapida ease-estandar hover:text-acento"
          >
            {CONTACTO.correo.valor}
          </a>
        </p>
      </div>
    </Seccion>
  );
};
