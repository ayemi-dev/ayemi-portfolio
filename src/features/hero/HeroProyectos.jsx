import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Boton } from '../../components/ui/Boton';
import { Microetiqueta } from '../../components/marca/Logotipo';
import { BienvenidaEmi } from '../../components/marca/GuiaEmi';
import { enlaceWhatsapp } from '../../config/sitio';
import { PLACAS } from '../../config/placas';
import { buscarProyecto, proyectosPublicados, urlMedio } from '../../config/proyectos';
import { VideoProyecto } from '../proyectos/VideoProyecto';
import { useMovimientoReducido } from '../../hooks/useMovimientoReducido';

/**
 * Portada con proyectos en movimiento · refactorización 2026-11 (R2, T4)
 *
 * Reemplaza a `Hero.jsx`. El mensaje (etiqueta, h1 y descripción) es el
 * mismo; cambian los botones y la columna derecha:
 *
 *   Ver proyectos ........ primario, a /proyectos (§5.3: una sola acción
 *                          principal por vista)
 *   Cuéntanos tu idea .... secundario, a WhatsApp con el tema «Otra idea» de
 *                          /enlaces. medicion.js añade el origen UTM al texto
 *                          y cuenta el clic como clic_whatsapp.
 *
 * Medios (R2.1): el video sin sonido de cada ficha publicada que lo tenga, en
 * rotación (al terminar uno empieza el siguiente; si solo hay uno, se repite).
 * Si ninguna ficha tiene video, rotan las capturas reales: las de ITA y las
 * vistas de las placas de public/pcb/.
 *
 * R2.4 · §3.13 · Con movimiento reducido: el póster del primer video, o la
 * primera captura, quietos.
 *
 * Emi se queda donde estaba, arriba de la columna derecha (§7, bienvenida).
 * El panel «Qué recibes» sale del hero; sus textos (`hero.pruebas.*`) siguen en
 * i18n para «Entrega con llaves» (T9).
 */

/** El tema «Otra idea» de /enlaces es el último de su lista. */
const mensajeIdea = (t) => {
  const temas = t('enlaces.mensaje.temas', { returnObjects: true });
  return `${t('enlaces.mensaje.saludo')} ${t('enlaces.mensaje.quiero', { tema: temas[temas.length - 1] })}`;
};

const externo = { target: '_blank', rel: 'noopener noreferrer' };

const CADA_MS = 5000;

const idiomaDe = (i18n) => (i18n.resolvedLanguage === 'en' ? 'en' : 'es');

/** Capturas reales para cuando ninguna ficha tiene video. */
const capturasDeRespaldo = (t, idioma) => {
  const ita = buscarProyecto('ita-2026');
  const deIta = (ita?.imagenes ?? []).map((img) => ({
    src: urlMedio(ita, img.src),
    ancho: img.ancho,
    alto: img.alto,
    alt: img.alt[idioma],
  }));
  const dePlacas = PLACAS.filter((p) => p.ficha).flatMap((placa) =>
    ['perspectiva', 'superior', 'inferior'].map((vista) => ({
      src: placa.ficha.imagenes[vista],
      ancho: placa.ficha.dimensiones[vista][0],
      alto: placa.ficha.dimensiones[vista][1],
      alt: t('pcb.placas.alt', {
        nombre: t(`pcb.placas.lista.${placa.slug}.nombre`),
        vista: t(`pcb.placas.vistas.${vista}`),
      }),
    }))
  );
  return [...deIta, ...dePlacas];
};

/** Rotación de capturas con fundido, sin desplazamiento (§3.13). */
const RotacionCapturas = ({ capturas, t }) => {
  const reducido = useMovimientoReducido();
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const rota = !reducido && !pausado && capturas.length > 1;

  useEffect(() => {
    if (!rota) return undefined;
    const id = setInterval(() => setActual((i) => (i + 1) % capturas.length), CADA_MS);
    return () => clearInterval(id);
  }, [rota, capturas.length]);

  const visibles = reducido ? capturas.slice(0, 1) : capturas;

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-md bg-lienzo-profundo">
        {visibles.map((c, i) => (
          <img
            key={c.src}
            src={c.src}
            width={c.ancho}
            height={c.alto}
            alt={c.alt}
            aria-hidden={i === actual ? undefined : true}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-lenta ease-estandar ${
              i === actual ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      {!reducido && capturas.length > 1 && (
        <div className="mt-2 flex justify-end">
          <Boton variante="terciario" tamano="pequeno" onClick={() => setPausado((p) => !p)}>
            {pausado ? t('hero.reanudarCapturas') : t('hero.pausarCapturas')}
          </Boton>
        </div>
      )}
    </div>
  );
};

/** Videos de las fichas publicadas, uno tras otro. */
const RotacionVideos = ({ proyectos, idioma }) => {
  const [actual, setActual] = useState(0);
  const proyecto = proyectos[actual % proyectos.length];
  const { video } = proyecto;
  const titulo = proyecto.textos[idioma].titulo;

  return (
    <figure>
      <VideoProyecto
        key={proyecto.slug}
        mp4={urlMedio(proyecto, video.mp4)}
        webm={urlMedio(proyecto, video.webm)}
        poster={urlMedio(proyecto, video.poster)}
        titulo={titulo}
        loop={proyectos.length === 1}
        onEnded={() => setActual((i) => (i + 1) % proyectos.length)}
        diferido={false}
      />
      <figcaption className="mt-2 text-cuerpo-s text-texto-suave">{titulo}</figcaption>
    </figure>
  );
};

const HeroProyectos = () => {
  const { t, i18n } = useTranslation();
  const idioma = idiomaDe(i18n);
  const conVideo = proyectosPublicados().filter((p) => p.video?.mp4 && p.video?.poster);

  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingBlock: 'var(--ay-esp-24) var(--ay-esp-16)' }}
    >
      {/* §3.11 · Retícula de Nodos por debajo del contenido, al 18 %, en la
          mitad superior y por detrás. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--ay-acento) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      <div className="relative mx-auto max-w-2xl" style={{ paddingInline: 'var(--ay-margen)' }}>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── Mensaje ──────────────────────────────────────────────────── */}
          <div className="min-w-0">
            <Microetiqueta>{t('hero.etiqueta')}</Microetiqueta>

            <h1 className="mt-4 text-display-l md:text-display-xl">
              {t('hero.tituloAntes')}
              <span className="text-acento">{t('hero.tituloAcento')}</span>
              {t('hero.tituloDespues')}
            </h1>

            <p className="mt-6 max-w-lectura text-cuerpo-l text-texto-suave">
              {t('hero.descripcion')}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Boton variante="primario" tamano="grande" to="/proyectos">
                {t('hero.botonPrimario')}
              </Boton>
              <Boton variante="secundario" tamano="grande" href={enlaceWhatsapp(mensajeIdea(t))} {...externo}>
                {t('hero.botonSecundario')}
                <span className="sr-only">{t('contacto.nuevaPestana')}</span>
              </Boton>
            </div>
          </div>

          {/* ── Emi y los proyectos ──────────────────────────────────────── */}
          <div className="flex min-w-0 flex-col gap-8">
            {/* §7 · Bienvenida: saludando, feliz, 240 px. Emi presenta; no
                vende y no está junto a ningún precio. */}
            <BienvenidaEmi alto={240} pie={t('hero.emiPie')}>
              {t('hero.emiSaludo')}
            </BienvenidaEmi>

            {conVideo.length > 0 ? (
              <RotacionVideos proyectos={conVideo} idioma={idioma} />
            ) : (
              <RotacionCapturas capturas={capturasDeRespaldo(t, idioma)} t={t} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroProyectos;
