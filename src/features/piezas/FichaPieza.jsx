import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Boton } from '../../components/ui/Boton';
import { Aviso } from '../../components/ui/Aviso';
import { Microetiqueta } from '../../components/marca/Logotipo';
import {
  IconoFlechaIzquierda,
  IconoFlechaDerecha,
  Pictograma,
} from '../../components/marca/Iconos';
import {
  buscarLinea,
  buscarPieza,
  rutaDePieza,
  urlRepositorio,
  vecinasDePieza,
} from '../../config/piezas';
import { RUTA_PORTAFOLIO } from '../../config/secciones';
import { enlaceWhatsapp } from '../../config/sitio';
import { NoEncontrada } from '../../pages/NoEncontrada';

/**
 * Ficha de pieza
 * Manual de Identidad Ayemi · Edición 2.0
 *
 * §1.3 · «Una fábrica tiene medidas.» Por eso esto es una hoja de
 * especificación, no una tarjeta de proyecto: los datos van en monoespaciada,
 * en una tabla sin líneas verticales (§5.3).
 *
 * §3.6 · Los datos que alguien podría copiar (año, línea, pila, medidas) van
 * siempre en monoespaciada.
 *
 * §5.5 · Un solo h1 por vista: aquí es el título de la pieza, porque la ficha
 * es su propia página con su propia URL.
 */

/* Orden de aparición de los enlaces. Los de más valor primero. */
const ORDEN_ENLACES = [
  'demo',
  'repositorio',
  'caso',
  'video',
  'render',
  'esquematico',
  'gerbers',
  'ficha',
];

const Enlace = ({ tipo, url }) => {
  const { t } = useTranslation();
  const externo = url.startsWith('http');

  return (
    <li>
      <a
        href={url}
        {...(externo
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className="ay-toque inline-flex h-10 items-center gap-2 rounded-md border border-borde-fuerte px-4 text-cuerpo-s font-bold text-texto transition-colors duration-rapida ease-estandar hover:border-acento hover:text-acento"
      >
        <Pictograma nombre={tipo} tamano={16} />
        {t(`fabrica.enlaces.${tipo}`)}
        {externo && (
          <span className="sr-only">{t('contacto.nuevaPestana')}</span>
        )}
      </a>
    </li>
  );
};

export const FichaPieza = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const pieza = buscarPieza(slug);

  /* Un slug que no existe no es un error del visitante: es una página que no
     está. Se responde con la vista de no encontrada, no con un fallo. */
  if (!pieza) return <NoEncontrada />;

  const linea = buscarLinea(pieza.linea);
  const { anterior, siguiente } = vecinasDePieza(slug);

  /* El repositorio se compone del usuario configurado. Si la cuenta todavía no
     existe, el botón no aparece: no se publica un enlace roto. */
  const repo = urlRepositorio(pieza.repo);
  const enlaces = [
    ...(repo ? [{ tipo: 'repositorio', url: repo }] : []),
    ...(pieza.enlaces ?? []),
  ].sort(
    (a, b) => ORDEN_ENLACES.indexOf(a.tipo) - ORDEN_ENLACES.indexOf(b.tipo)
  );

  /* Medidas de la ficha. Las propias de la pieza más las que salen del sistema.
     El cliente va aquí arriba, junto a la línea y el año: es un dato de la
     pieza, no una nota al pie. */
  const medidas = [
    { que: t('fabrica.ficha.linea'), valor: t(`fabrica.lineas.${pieza.linea}.nombre`) },
    ...(pieza.anio ? [{ que: t('fabrica.ficha.anio'), valor: String(pieza.anio) }] : []),
    { que: t('fabrica.ficha.estado'), valor: t(`fabrica.estados.${pieza.estado}`) },
    ...(pieza.cliente ? [{ que: t('fabrica.ficha.cliente'), valor: pieza.cliente.nombre }] : []),
    ...(pieza.cliente?.aporte
      ? [{ que: t('fabrica.ficha.aporte'), valor: pieza.cliente.aporte }]
      : []),
    ...(pieza.sector ? [{ que: t('fabrica.ficha.sector'), valor: pieza.sector }] : []),
    ...(pieza.medidas ?? []),
  ];

  return (
    <article
      className="mx-auto max-w-2xl"
      style={{
        paddingInline: 'var(--ay-margen)',
        paddingBlock: 'var(--ay-esp-16)',
      }}
    >
      {/* ── Volver ──────────────────────────────────────────────────────────── */}
      <Link
        to={RUTA_PORTAFOLIO}
        className="inline-flex items-center gap-2 rounded-sm text-cuerpo-s text-texto-suave transition-colors duration-rapida ease-estandar hover:text-acento"
      >
        <IconoFlechaIzquierda tamano={16} />
        {t('fabrica.ficha.volver')}
      </Link>

      {/* ── Encabezado ──────────────────────────────────────────────────────── */}
      <header className="mt-8 max-w-lectura">
        <div className="flex items-center gap-2">
          <Pictograma
            nombre={linea?.icono}
            tamano={20}
            className="text-acento"
          />
          <Microetiqueta>
            {t(`fabrica.lineas.${pieza.linea}.nombre`)}
          </Microetiqueta>
        </div>

        <h1 className="mt-4 text-display-l">{pieza.titulo}</h1>

        {pieza.resuelve && (
          <p className="mt-6 text-cuerpo-l text-texto-suave">{pieza.resuelve}</p>
        )}
      </header>

      {/* ── Atribución de marca ajena ───────────────────────────────────────── */}
      {/* Va antes de los enlaces, no al final: quien llega a esta ficha tiene
          que saber de quién es el trabajo antes de ver la demostración, no
          después. Enseñar el trabajo de un cliente sin decir de quién es se lo
          apropia, y el §1.10 pide el resultado por delante, no el crédito
          ajeno. */}
      {pieza.cliente && (
        <div className="mt-8 max-w-lectura">
          <Aviso
            tipo="info"
            titulo={t('fabrica.ficha.atribucionTitulo', {
              cliente: pieza.cliente.nombre,
            })}
          >
            {t('fabrica.ficha.atribucionTexto', {
              cliente: pieza.cliente.nombre,
            })}
          </Aviso>
        </div>
      )}

      {/* ── Enlaces directos ────────────────────────────────────────────────── */}
      {enlaces.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-3">
          {enlaces.map((enlace) => (
            <Enlace key={enlace.tipo} {...enlace} />
          ))}
        </ul>
      ) : (
        /* §1.10, regla 4 · Se dice que todavía no hay enlaces públicos. */
        <div className="mt-8 max-w-lectura">
          <Aviso tipo="info" titulo={t('fabrica.ficha.sinEnlacesTitulo')}>
            {t('fabrica.ficha.sinEnlacesTexto')}
          </Aviso>
        </div>
      )}

      {/* ── Imagen, si la hay ───────────────────────────────────────────────── */}
      {pieza.imagen && (
        /* §3.12 · Sin filtros de época, sin viñeteo y sin degradados sobre la
           imagen. Solo el borde y el radio del sistema. */
        <figure className="mt-16 overflow-hidden rounded-lg border border-borde">
          <img
            src={pieza.imagen}
            alt={pieza.titulo}
            className="block w-full"
            loading="lazy"
          />
        </figure>
      )}

      {/* ── Hoja de medidas ─────────────────────────────────────────────────── */}
      <section className="mt-16" aria-labelledby="medidas">
        <h2 id="medidas" className="ay-etiqueta">
          {t('fabrica.ficha.medidas')}
        </h2>

        {/* §5.3 · Sin líneas verticales. Solo un filete horizontal entre filas. */}
        <dl className="mt-4 max-w-lectura">
          {medidas.map(({ que, valor }) => (
            <div
              key={que}
              className="grid grid-cols-2 gap-4 border-t border-borde py-3"
            >
              <dt className="text-cuerpo-s text-texto-tenue">{que}</dt>
              <dd className="font-mono text-cuerpo-s text-texto">{valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Pila técnica ───────────────────────────────────────────────────── */}
      {pieza.pila?.length > 0 && (
        <section className="mt-12" aria-labelledby="pila">
          <h2 id="pila" className="ay-etiqueta">
            {t('fabrica.ficha.pila')}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {pieza.pila.map((pieceza) => (
              <li
                key={pieceza}
                className="rounded-xs border border-borde px-2 py-1 font-mono text-micro text-texto-tenue"
              >
                {pieceza}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Arquitectura ───────────────────────────────────────────────────── */}
      {/* Capa por capa, primero lo que hace y después con qué (§1.10, regla 1). */}
      {pieza.arquitectura?.length > 0 && (
        <section className="mt-12" aria-labelledby="arquitectura">
          <h2 id="arquitectura" className="ay-etiqueta">
            {t('fabrica.ficha.arquitectura')}
          </h2>
          <ol className="mt-4 max-w-lectura">
            {pieza.arquitectura.map(({ capa, que }, i) => (
              <li
                key={capa}
                className="grid grid-cols-[2rem_1fr] gap-x-4 border-t border-borde py-4"
              >
                <span className="font-mono text-micro text-acento">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-cuerpo font-bold text-texto">{capa}</h3>
                  <p className="mt-1 text-cuerpo-s text-texto-suave">{que}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Anterior y siguiente de la misma línea ─────────────────────────── */}
      {(anterior || siguiente) && (
        <nav
          className="mt-24 grid gap-4 border-t border-borde pt-8 sm:grid-cols-2"
          aria-label={t('fabrica.ficha.masDeLaLinea')}
        >
          {anterior ? (
            <Link
              to={rutaDePieza(anterior.slug)}
              className="group rounded-md border border-borde bg-superficie p-4 transition-colors duration-media ease-estandar hover:border-borde-fuerte"
            >
              <span className="flex items-center gap-2 font-mono text-micro text-texto-tenue">
                <IconoFlechaIzquierda tamano={16} />
                {t('fabrica.ficha.anterior')}
              </span>
              <span className="mt-1 block text-cuerpo-s text-texto group-hover:text-acento">
                {anterior.titulo}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {siguiente && (
            <Link
              to={rutaDePieza(siguiente.slug)}
              className="group rounded-md border border-borde bg-superficie p-4 text-right transition-colors duration-media ease-estandar hover:border-borde-fuerte sm:col-start-2"
            >
              <span className="flex items-center justify-end gap-2 font-mono text-micro text-texto-tenue">
                {t('fabrica.ficha.siguiente')}
                <IconoFlechaDerecha tamano={16} />
              </span>
              <span className="mt-1 block text-cuerpo-s text-texto group-hover:text-acento">
                {siguiente.titulo}
              </span>
            </Link>
          )}
        </nav>
      )}

      {/* ── Servicio que se puede contratar ────────────────────────────────── */}
      {/* Si la pieza se ofrece como servicio, su llamada sustituye a la de
          cierre: §5.3 pide una sola acción primaria por vista. */}
      {pieza.oferta ? (
        <section
          className="mt-24 rounded-lg border border-borde bg-superficie p-6 md:p-8"
          aria-labelledby="oferta"
        >
          <Microetiqueta>{t('fabrica.ficha.servicio')}</Microetiqueta>
          <h2 id="oferta" className="mt-3 max-w-lectura text-titulo-2">
            {pieza.oferta.titulo}
          </h2>
          <p className="mt-4 max-w-lectura text-cuerpo-l text-texto-suave">
            {pieza.oferta.texto}
          </p>
          <h3 className="mt-8 ay-etiqueta">{t('fabrica.ficha.incluye')}</h3>
          <ul className="mt-3 flex max-w-lectura flex-col gap-2">
            {pieza.oferta.incluye.map((punto) => (
              <li key={punto} className="flex gap-3 text-cuerpo text-texto">
                <span className="text-acento" aria-hidden="true">·</span>
                {punto}
              </li>
            ))}
          </ul>
          {pieza.oferta.nota && (
            <p className="mt-6 max-w-lectura text-cuerpo-s text-texto-tenue">
              {pieza.oferta.nota}
            </p>
          )}
          <div className="mt-8">
            <Boton
              variante="primario"
              tamano="grande"
              href={enlaceWhatsapp(pieza.oferta.mensaje)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pieza.oferta.boton}
            </Boton>
          </div>
        </section>
      ) : (
      <div className="mt-24 border-t border-borde pt-8">
        <p className="max-w-lectura text-cuerpo-l text-texto">
          {t('fabrica.ficha.cierre')}
        </p>
        <div className="mt-6">
          <Boton variante="primario" tamano="grande" to="/#contacto">
            {t('fabrica.ficha.cierreBoton')}
          </Boton>
        </div>
      </div>
      )}
    </article>
  );
};
