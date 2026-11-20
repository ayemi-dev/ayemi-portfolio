import { useTranslation } from 'react-i18next';
import { Boton } from '../../components/ui/Boton';
import { enlaceWhatsapp } from '../../config/sitio';
import { mensajeDeProyecto } from '../../config/proyectos';

/**
 * «¿Lo quieres para tu negocio?» · cierre de la página de caso (R5.6)
 *
 * §5.3 · La única acción primaria de la página: WhatsApp con el título del
 * caso en el mensaje. El origen UTM (con `utm_content=<slug>`, que fija la
 * página) lo añade `conOrigenWhatsapp` al pulsar.
 */

export const CierreWhatsapp = ({ proyecto, idioma }) => {
  const { t } = useTranslation();

  return (
    <section className="mt-24 rounded-lg border border-borde bg-superficie p-6 md:p-8">
      <h2 className="max-w-lectura text-titulo-2 text-texto">{t('caso.cierreTitulo')}</h2>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Boton
          variante="primario"
          tamano="grande"
          href={enlaceWhatsapp(mensajeDeProyecto(proyecto, idioma))}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('caso.cierreBoton')}
          <span className="sr-only">{t('pie.nuevaPestana')}</span>
        </Boton>
      </div>
    </section>
  );
};

export default CierreWhatsapp;
