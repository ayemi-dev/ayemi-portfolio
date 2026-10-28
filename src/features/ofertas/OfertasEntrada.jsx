import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Tarjeta } from '../../components/ui/Tarjeta';
import { Boton } from '../../components/ui/Boton';
import { enlaceWhatsapp } from '../../config/sitio';
import { AGENDA_URL, PRECIOS, formatoPrecio } from '../../config/externos';

/**
 * Ofertas de entrada
 *
 * Dos puertas pequeñas antes de un proyecto: la revisión de una PCB a precio
 * cerrado y el diagnóstico de 30 min sin costo. Vive en la portada y en /pcb.
 *
 * El precio sale de VITE_PRECIO_REVISION_PCB (config/externos.js). Sin él, la
 * tarjeta se muestra sin cifra: nunca un precio inventado.
 *
 * El diagnóstico abre la agenda (VITE_AGENDA_URL, evento clic_agenda). Si la
 * agenda aún no existe, el botón pide el diagnóstico por WhatsApp: la oferta
 * sigue en pie y no hay enlace roto.
 *
 * §5.3 · Botones secundarios: la acción primaria es la de cada página.
 */
export const OfertasEntrada = ({ fondo = 'lienzo' }) => {
  const { t } = useTranslation();
  const externo = { target: '_blank', rel: 'noopener noreferrer' };

  const ofertas = [
    {
      clave: 'revisionPcb',
      precio: PRECIOS.revisionPcb ? t('ofertas.desde', { precio: formatoPrecio(PRECIOS.revisionPcb) }) : '',
      boton: { href: enlaceWhatsapp(t('ofertas.revisionPcb.mensaje')), ...externo },
    },
    {
      clave: 'diagnostico',
      precio: t('ofertas.gratis'),
      boton: AGENDA_URL
        ? { href: AGENDA_URL, 'data-evento': 'agenda', ...externo }
        : { href: enlaceWhatsapp(t('ofertas.diagnostico.mensaje')), ...externo },
      textoBoton: AGENDA_URL ? 'botonAgenda' : 'botonWhatsapp',
    },
  ];

  return (
    <Seccion
      id="ofertas"
      etiqueta={t('ofertas.etiqueta')}
      titulo={t('ofertas.titulo')}
      acento={t('ofertas.acento')}
      tituloDespues={t('ofertas.tituloDespues')}
      fondo={fondo}
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {ofertas.map(({ clave, precio, boton, textoBoton = 'boton' }) => (
          <Tarjeta key={clave} como="li" className="flex flex-col">
            <h3 className="text-titulo-4 text-texto">{t(`ofertas.${clave}.titulo`)}</h3>
            {precio && <p className="mt-2 font-mono text-cuerpo text-acento">{precio}</p>}
            <p className="mt-4 text-cuerpo text-texto-suave">{t(`ofertas.${clave}.texto`)}</p>
            <div className="mt-auto pt-6">
              <Boton variante="secundario" {...boton}>
                {t(`ofertas.${clave}.${textoBoton}`)}
              </Boton>
            </div>
          </Tarjeta>
        ))}
      </ul>
    </Seccion>
  );
};
