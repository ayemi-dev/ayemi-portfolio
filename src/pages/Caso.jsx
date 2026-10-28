import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Microetiqueta } from '../components/marca/Logotipo';
import { IconoEnlaceExterno } from '../components/marca/Iconos';
import { Aviso } from '../components/ui/Aviso';
import { Boton } from '../components/ui/Boton';
import { buscarCaso } from '../config/casos';
import { rutaDePieza } from '../config/piezas';
import { enlaceWhatsapp } from '../config/sitio';
import { NoEncontrada } from './NoEncontrada';

/**
 * Caso de estudio · `/casos/:slug`
 *
 * Problema, qué hicimos, resultado, capturas y testimonio, en ese orden. Los
 * datos viven en `config/casos.js`; lo que está vacío allí no se pinta aquí.
 *
 * El texto del caso va en español (es contenido, no interfaz); los rótulos
 * salen del i18n.
 *
 * Marca ajena: se repite la atribución de la ficha. Enseñar el trabajo de un
 * cliente sin decir de quién es se lo está apropiando.
 *
 * §5.3 · Una sola acción primaria: hablar de tu caso por WhatsApp.
 */

const Bloque = ({ etiqueta, children }) => (
  <section className="mt-16">
    <h2 className="ay-etiqueta">{etiqueta}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

export const Caso = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const caso = buscarCaso(slug);

  if (!caso) return <NoEncontrada />;

  return (
    <article
      className="mx-auto max-w-2xl"
      style={{ paddingInline: 'var(--ay-margen)', paddingBlock: 'var(--ay-esp-24)' }}
      data-ubicacion={`caso-${caso.slug}`}
    >
      <div className="max-w-lectura">
        <Microetiqueta>{t('caso.etiqueta', { cliente: caso.cliente })}</Microetiqueta>
        <h1 className="mt-4 text-titulo-1 text-texto">{caso.titulo}</h1>
        <a
          href={caso.sitio}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-mono text-cuerpo-s text-texto-suave hover:text-acento"
        >
          {caso.sitio.replace(/^https:\/\//, '')}
          <IconoEnlaceExterno tamano={16} />
          <span className="sr-only">{t('pie.nuevaPestana')}</span>
        </a>

        <Aviso className="mt-8" titulo={t('fabrica.ficha.atribucionTitulo', { cliente: caso.cliente })}>
          {t('fabrica.ficha.atribucionTexto', { cliente: caso.cliente })}
        </Aviso>
      </div>

      <div className="max-w-lectura">
        <Bloque etiqueta={t('caso.problema')}>
          {caso.problema.map((p) => (
            <p key={p} className="mt-4 first:mt-0 text-cuerpo-l text-texto-suave">
              {p}
            </p>
          ))}
        </Bloque>

        <Bloque etiqueta={t('caso.hicimos')}>
          <ul className="flex flex-col gap-3">
            {caso.hicimos.map((punto) => (
              <li key={punto} className="flex gap-3 text-cuerpo text-texto">
                <span className="text-acento" aria-hidden="true">·</span>
                {punto}
              </li>
            ))}
          </ul>
        </Bloque>
      </div>

      <Bloque etiqueta={t('caso.resultado')}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-borde bg-borde md:grid-cols-4">
          {caso.cifras.map(({ que, valor }) => (
            <div key={que} className="bg-lienzo p-4">
              <dt className="text-cuerpo-s text-texto-tenue">{que}</dt>
              <dd className="mt-1 font-mono text-titulo-4 text-texto">{valor}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-lectura text-cuerpo-l text-texto-suave">{caso.resultado}</p>
        {caso.resultadoNegocio && (
          <p className="mt-4 max-w-lectura text-cuerpo-l text-texto-suave">{caso.resultadoNegocio}</p>
        )}
      </Bloque>

      <Bloque etiqueta={t('caso.capturas')}>
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          {caso.capturas.map((c, i) => (
            <figure key={c.src} className={i === 0 ? 'md:col-span-2' : undefined}>
              <img
                src={c.src}
                width={c.ancho}
                height={c.alto}
                alt={c.alt}
                loading="lazy"
                decoding="async"
                className={`w-full rounded-md border border-borde ${c.alto > c.ancho ? 'mx-auto max-h-[600px] w-auto object-contain' : ''}`}
              />
              <figcaption className="mt-2 text-cuerpo-s text-texto-tenue">{c.pie}</figcaption>
            </figure>
          ))}
        </div>
      </Bloque>

      {caso.testimonio && (
        <Bloque etiqueta={t('caso.testimonio')}>
          <blockquote className="max-w-lectura border-l-[3px] border-acento pl-6">
            <p className="font-serif text-titulo-3 text-texto italic">«{caso.testimonio.cita}»</p>
            <footer className="mt-4 text-cuerpo-s text-texto-suave">
              {caso.testimonio.autor}
              {caso.testimonio.cargo && <span>, {caso.testimonio.cargo}</span>}
            </footer>
          </blockquote>
        </Bloque>
      )}

      <section className="mt-24 rounded-lg border border-borde bg-superficie p-6 md:p-8">
        <h2 className="max-w-lectura text-titulo-2 text-texto">{t('fabrica.ficha.cierre')}</h2>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Boton
            variante="primario"
            tamano="grande"
            href={enlaceWhatsapp(t('caso.mensajeWhatsapp', { cliente: caso.cliente }))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('fabrica.ficha.cierreBoton')}
          </Boton>
          <Boton variante="secundario" tamano="grande" to={rutaDePieza(caso.pieza)}>
            {t('caso.ficha')}
          </Boton>
        </div>
      </section>
    </article>
  );
};
