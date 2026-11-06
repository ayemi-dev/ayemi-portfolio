import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seccion } from '../components/layout/Seccion';
import { Tarjeta } from '../components/ui/Tarjeta';
import { Boton } from '../components/ui/Boton';
import {
  IconoEnlaceExterno,
  IconoFlechaDerecha,
  Pictograma,
} from '../components/marca/Iconos';
import { CASOS, capturasDe } from '../config/casos';
import { buscarLinea, piezasSinCaso, rutaDePieza } from '../config/piezas';
import { RUTA_CASOS } from '../config/secciones';

/**
 * Casos · `/casos`
 * Manual de Identidad Ayemi · Edición 2.2 · §1.10, reglas 2 y 4
 *
 * Lo que la entrada «Casos» de la navegación enseña: solo trabajo entregado
 * que existe. Arriba, los casos de estudio escritos (hoy, el sitio de ITA);
 * debajo, las piezas entregadas que no tienen caso propio, cada una con su
 * ficha. No hay plazas vacías ni casos de relleno: si mañana hay otro caso,
 * entra en `config/casos.js` y aparece aquí solo.
 *
 * Marca ajena: el caso de ITA se presenta con su crédito y con el enlace a su
 * sitio, igual que en la página del caso. Enseñar el trabajo de un cliente sin
 * decir de quién es se lo apropia.
 *
 * §5.3 · Una sola acción primaria: contar tu idea.
 * §5.5 · Esta sección ES la página, así que su titular es el h1.
 */

const TarjetaCaso = ({ caso, t }) => {
  const portada = capturasDe(caso)[0];

  return (
    <Tarjeta como="li" className="grid gap-8 md:grid-cols-[3fr_2fr] md:items-center">
      <div>
        <span className="ay-etiqueta">{t('casos.estudioEtiqueta', { cliente: caso.cliente })}</span>
        <h3 className="mt-3 text-titulo-3 text-texto">{caso.titulo}</h3>
        <p className="mt-3 text-cuerpo text-texto-suave">{caso.resultado}</p>

        {/* Crédito y enlace visible al sitio del cliente. */}
        <p className="mt-4 text-cuerpo-s text-texto-tenue">
          {t('casos.credito', { cliente: caso.cliente })}
        </p>
        <a
          href={caso.sitio}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded-sm font-mono text-cuerpo-s text-texto-suave transition-colors duration-rapida ease-estandar hover:text-acento"
        >
          {caso.sitio.replace(/^https:\/\//, '')}
          <IconoEnlaceExterno tamano={16} />
          <span className="sr-only">{t('pie.nuevaPestana')}</span>
        </a>

        <div className="mt-6">
          <Boton variante="secundario" to={`${RUTA_CASOS}/${caso.slug}`}>
            {t('casos.leerCaso')}
            <IconoFlechaDerecha tamano={16} />
          </Boton>
        </div>
      </div>

      {portada && (
        <img
          src={portada.src}
          width={portada.ancho}
          height={portada.alto}
          alt={portada.alt}
          loading="lazy"
          decoding="async"
          className="w-full rounded-md border border-borde"
        />
      )}
    </Tarjeta>
  );
};

const TarjetaPieza = ({ pieza, t }) => {
  const linea = buscarLinea(pieza.linea);

  return (
    <li>
      <Link
        to={rutaDePieza(pieza.slug)}
        className="group flex h-full flex-col rounded-lg border border-borde bg-superficie p-6 transition-colors duration-media ease-estandar hover:border-borde-fuerte"
      >
        <span className="flex items-center gap-2">
          <Pictograma nombre={linea?.icono} tamano={16} className="text-acento" />
          <span className="font-mono text-micro text-texto-tenue">
            {t(`trabajos.lineas.${pieza.linea}.nombre`)}
            {pieza.anio ? ` · ${pieza.anio}` : ''}
          </span>
        </span>

        <span className="mt-3 text-titulo-4 text-texto group-hover:text-acento">
          {pieza.titulo}
        </span>

        {pieza.resuelve && (
          <span className="mt-3 text-cuerpo-s text-texto-suave">{pieza.resuelve}</span>
        )}

        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-cuerpo-s font-bold text-acento">
          {t('casos.verFicha')}
          <IconoFlechaDerecha tamano={16} />
        </span>
      </Link>
    </li>
  );
};

export const Casos = () => {
  const { t } = useTranslation();
  const piezas = piezasSinCaso();

  return (
    <>
      <Seccion
        id="casos"
        nivel={1}
        etiqueta={t('casos.etiqueta')}
        titulo={t('casos.titulo')}
        acento={t('casos.acento')}
        tituloDespues={t('casos.tituloDespues')}
        entradilla={t('casos.entradilla')}
      >
        <ul className="flex flex-col gap-6">
          {CASOS.map((caso) => (
            <TarjetaCaso key={caso.slug} caso={caso} t={t} />
          ))}
        </ul>

        {piezas.length > 0 && (
          <div className="mt-24">
            <h2 className="text-titulo-2">{t('casos.otrosTitulo')}</h2>
            <p className="mt-3 max-w-lectura text-cuerpo text-texto-suave">
              {t('casos.otrosEntradilla')}
            </p>
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {piezas.map((pieza) => (
                <TarjetaPieza key={pieza.slug} pieza={pieza} t={t} />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-24 border-t border-borde pt-8">
          <p className="max-w-lectura text-cuerpo-l text-texto">{t('casos.cierre')}</p>
          <div className="mt-6">
            <Boton variante="primario" tamano="grande" to="/#contacto">
              {t('hero.botonPrimario')}
            </Boton>
          </div>
        </div>
      </Seccion>
    </>
  );
};
