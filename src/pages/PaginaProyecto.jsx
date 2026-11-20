import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Microetiqueta } from '../components/marca/Logotipo';
import { IconoEnlaceExterno } from '../components/marca/Iconos';
import { Aviso } from '../components/ui/Aviso';
import { buscarProyecto, diagramaDe, urlMedio } from '../config/proyectos';
import { fijarUtmContenido } from '../medicion/medicion';
import { useMovimientoReducido } from '../hooks/useMovimientoReducido';
import { VideoProyecto } from '../features/proyectos/VideoProyecto';
import { BloquePruebalo } from '../features/proyectos/BloquePruebalo';
import { DiagramaYStack } from '../features/proyectos/DiagramaYStack';
import { EntregaConLlaves } from '../features/proyectos/EntregaConLlaves';
import { CierreWhatsapp } from '../features/proyectos/CierreWhatsapp';
import { NoEncontrada } from './NoEncontrada';

/**
 * Página de un proyecto · `/casos/:slug` y `/proyectos/:slug` (R5, T6)
 *
 * La misma plantilla para casos de clientes y demos del Laboratorio. Orden
 * fijo de R5; un bloque sin datos no se pinta (R0.5):
 *
 *   cabecera   «Proyecto demostrativo de Ayemi» (laboratorio) o «CASO · <cliente>»,
 *              h1, «Ayemi no tiene relación con <marca>» por cada `marcasAjenas`,
 *              enlace al `sitio` y aviso de marca independiente del `cliente`
 *   1          El problema
 *   2          Qué hicimos: texto, video (o GIF) y, con h3, capturas,
 *              resultado (cifras) y testimonio
 *   3          Pruébalo (solo laboratorio)
 *   4          Cómo está hecho: diagrama, stack y «Ver el código»
 *   5          Lo que entregaríamos
 *   6          ¿Lo quieres para tu negocio? (WhatsApp, la única acción primaria)
 *
 * Los textos salen de la ficha en el idioma activo; los rótulos, del i18n.
 * Al abrirla fija `utm_content=<slug>` si la visita no traía uno.
 * `caso_visto` lo cablea T8.
 */

const idiomaDe = (i18n) => (i18n.resolvedLanguage === 'en' ? 'en' : 'es');

const parrafos = (texto) => (texto ? texto.split('\n\n').filter(Boolean) : []);

const Bloque = ({ etiqueta, children }) => (
  <section className="mt-16">
    <h2 className="ay-etiqueta">{etiqueta}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

const Subtitulo = ({ children }) => <h3 className="mt-12 text-titulo-4 text-texto">{children}</h3>;

/** Las capturas que se pueden publicar hoy según el permiso del cliente. */
const capturasDe = (proyecto) =>
  proyecto.permisoPersonal === true && (proyecto.capturasConPersonal ?? []).length > 0
    ? proyecto.capturasConPersonal
    : proyecto.imagenes ?? [];

export const PaginaProyecto = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const reducido = useMovimientoReducido();
  const proyecto = buscarProyecto(slug);

  useEffect(() => {
    if (proyecto) fijarUtmContenido(proyecto.slug);
  }, [proyecto]);

  if (!proyecto) return <NoEncontrada />;

  const idioma = idiomaDe(i18n);
  const textos = proyecto.textos?.[idioma] ?? {};
  const esDemo = proyecto.tipo === 'laboratorio';
  const media = (ruta) => urlMedio(proyecto.slug, ruta);

  const problema = parrafos(textos.problema);
  const hicimos = parrafos(textos.solucion);
  const { video, gif, cliente, sitio, testimonio } = proyecto;
  const conGif = !video && gif && !reducido;
  const capturas = capturasDe(proyecto);
  const cifras = textos.cifras ?? [];
  const hayResultado = cifras.length > 0 || textos.resultado || textos.resultadoNegocio;
  const hayBloque2 = hicimos.length > 0 || video || conGif || capturas.length > 0 || hayResultado || testimonio;
  const hayComo = diagramaDe(proyecto) || (proyecto.stack ?? []).length > 0 || proyecto.codigo;

  return (
    <article
      className="mx-auto max-w-2xl"
      style={{ paddingInline: 'var(--ay-margen)', paddingBlock: 'var(--ay-esp-24)' }}
      data-ubicacion={`caso-${proyecto.slug}`}
    >
      <div className="max-w-lectura">
        {esDemo ? (
          <Microetiqueta>{t('caso.demostrativo')}</Microetiqueta>
        ) : (
          cliente && <Microetiqueta>{t('caso.etiqueta', { cliente })}</Microetiqueta>
        )}
        <h1 className="mt-4 text-titulo-1 text-texto">{textos.titulo}</h1>

        {(proyecto.marcasAjenas ?? []).length > 0 && (
          <ul className="mt-4 flex flex-col gap-1">
            {proyecto.marcasAjenas.map((marca) => (
              <li key={marca} className="text-cuerpo-s text-texto-suave">
                {t('caso.sinRelacion', { marca })}
              </li>
            ))}
          </ul>
        )}

        {sitio && (
          <a
            href={sitio}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-mono text-cuerpo-s text-texto-suave hover:text-acento"
          >
            {sitio.replace(/^https?:\/\//, '')}
            <IconoEnlaceExterno tamano={16} />
            <span className="sr-only">{t('pie.nuevaPestana')}</span>
          </a>
        )}

        {cliente && !esDemo && (
          <Aviso className="mt-8" titulo={t('trabajos.ficha.atribucionTitulo', { cliente })}>
            {t('trabajos.ficha.atribucionTexto', { cliente })}
          </Aviso>
        )}
      </div>

      {problema.length > 0 && (
        <div className="max-w-lectura">
          <Bloque etiqueta={t('caso.problema')}>
            {problema.map((p) => (
              <p key={p} className="mt-4 first:mt-0 text-cuerpo-l text-texto-suave">
                {p}
              </p>
            ))}
          </Bloque>
        </div>
      )}

      {hayBloque2 && (
        <Bloque etiqueta={t('caso.hicimos')}>
          {hicimos.length > 0 && (
            <ul className="flex max-w-lectura flex-col gap-3">
              {hicimos.map((punto) => (
                <li key={punto} className="flex gap-3 text-cuerpo text-texto">
                  <span className="text-acento" aria-hidden="true">·</span>
                  {punto}
                </li>
              ))}
            </ul>
          )}

          {video && (
            <VideoProyecto
              className="mt-8"
              mp4={media(video.mp4)}
              webm={video.webm ? media(video.webm) : undefined}
              poster={media(video.poster)}
              titulo={textos.titulo}
              controles
            />
          )}
          {conGif && (
            <img
              src={media(gif)}
              alt={textos.titulo}
              loading="lazy"
              decoding="async"
              className="mt-8 block h-auto w-full rounded-md border border-borde"
            />
          )}

          {capturas.length > 0 && (
            <>
              <Subtitulo>{t('caso.capturas')}</Subtitulo>
              <div className="mt-4 grid gap-6 md:grid-cols-[2fr_1fr]">
                {capturas.map((c, i) => (
                  <figure key={c.src} className={i === 0 ? 'md:col-span-2' : undefined}>
                    <img
                      src={media(c.src)}
                      width={c.ancho}
                      height={c.alto}
                      alt={c.alt?.[idioma] ?? ''}
                      loading="lazy"
                      decoding="async"
                      className={`w-full rounded-md border border-borde ${c.alto > c.ancho ? 'mx-auto max-h-[600px] w-auto object-contain' : ''}`}
                    />
                    {c.pie?.[idioma] && (
                      <figcaption className="mt-2 text-cuerpo-s text-texto-tenue">{c.pie[idioma]}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </>
          )}

          {hayResultado && (
            <>
              <Subtitulo>{t('caso.resultado')}</Subtitulo>
              {cifras.length > 0 && (
                <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-borde bg-borde md:grid-cols-4">
                  {cifras.map(({ que, valor }) => (
                    <div key={que} className="bg-lienzo p-4">
                      <dt className="text-cuerpo-s text-texto-tenue">{que}</dt>
                      <dd className="mt-1 font-mono text-titulo-4 font-bold text-texto">{valor}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {textos.resultado && (
                <p className="mt-6 max-w-lectura text-cuerpo-l text-texto-suave">{textos.resultado}</p>
              )}
              {textos.resultadoNegocio && (
                <p className="mt-4 max-w-lectura text-cuerpo-l text-texto-suave">{textos.resultadoNegocio}</p>
              )}
            </>
          )}

          {testimonio && (
            <>
              <Subtitulo>{t('caso.testimonio')}</Subtitulo>
              <blockquote className="mt-4 max-w-lectura border-l-[3px] border-acento pl-6">
                {/* §3.6 · Instrument Serif en redonda: el sitio no carga su cursiva. */}
                <p className="font-serif text-titulo-3 font-normal text-texto">«{testimonio.cita}»</p>
                <footer className="mt-4 text-cuerpo-s text-texto-suave">
                  {testimonio.autor}
                  {testimonio.cargo && <span>, {testimonio.cargo}</span>}
                </footer>
              </blockquote>
            </>
          )}
        </Bloque>
      )}

      {esDemo && proyecto.demo?.url && (
        <Bloque etiqueta={t('caso.pruebalo')}>
          <BloquePruebalo demo={proyecto.demo} />
        </Bloque>
      )}

      {hayComo && (
        <Bloque etiqueta={t('caso.comoEstaHecho')}>
          <DiagramaYStack proyecto={proyecto} />
        </Bloque>
      )}

      <div className="max-w-lectura">
        <Bloque etiqueta={t('caso.entregariamos')}>
          <EntregaConLlaves entregamos={textos.entregamos ?? []} />
        </Bloque>
      </div>

      <CierreWhatsapp proyecto={proyecto} idioma={idioma} />
    </article>
  );
};

export default PaginaProyecto;
