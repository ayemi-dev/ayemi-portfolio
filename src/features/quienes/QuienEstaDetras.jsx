import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { SITIO } from '../../config/sitio';
import { VideoProyecto } from '../proyectos/VideoProyecto';

/**
 * Quién está detrás · refactorización 2026-11 (R6, T10)
 *
 * Preparada, sin publicar. Mientras `SITIO.mostrarQuienEstaDetras` sea
 * `false`, el componente devuelve `null`: no se pinta, no se enlaza (no está en
 * `SECCIONES` ni en `NAVEGACION`), no sale en el HTML prerenderizado y no tiene
 * ruta propia, así que tampoco entra en `sitemap.xml`.
 *
 * El medio llega por props, nunca desde el repositorio: una foto o un video
 * breve. Si llegan los dos, manda el video y la foto no se usa. Sin ninguno de
 * los dos, la sección no se pinta (R0.5).
 *
 * Los textos que dependen de la persona también llegan por props, en es y en
 * (`{ es, en }`), porque son copia que aún no está escrita ni aprobada.
 *
 * §1.1 · Antes de pasar la bandera a `true`, Dirección tiene que decidir cómo
 * encaja con «no se citan nombres de personas» (ver bitácora de T10).
 *
 *   <QuienEstaDetras
 *     foto={{ src, ancho, alto, alt: { es, en } }}
 *     video={{ mp4, webm, poster, ancho, alto, titulo: { es, en } }}
 *     texto={{ es, en }}
 *   />
 */

const enIdioma = (valor, idioma) =>
  valor && typeof valor === 'object' ? (valor[idioma] ?? valor.es) : valor;

export const QuienEstaDetras = ({ foto, video, texto }) => {
  const { t, i18n } = useTranslation();

  if (!SITIO.mostrarQuienEstaDetras) return null;
  if (!video?.mp4 && !foto?.src) return null;

  const idioma = i18n.language?.startsWith('en') ? 'en' : 'es';
  const parrafo = enIdioma(texto, idioma);

  return (
    <Seccion
      id="quien-esta-detras"
      titulo={t('quienEstaDetras.titulo')}
      fondo="lienzo"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        {video?.mp4 ? (
          <VideoProyecto
            mp4={video.mp4}
            webm={video.webm}
            poster={video.poster}
            ancho={video.ancho}
            alto={video.alto}
            titulo={enIdioma(video.titulo, idioma) ?? t('quienEstaDetras.titulo')}
            loop={false}
            controles
          />
        ) : (
          <img
            src={foto.src}
            width={foto.ancho}
            height={foto.alto}
            alt={enIdioma(foto.alt, idioma) ?? ''}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-lg bg-lienzo-profundo"
          />
        )}

        {parrafo && (
          <p className="max-w-lectura text-cuerpo-l text-texto">{parrafo}</p>
        )}
      </div>
    </Seccion>
  );
};

export default QuienEstaDetras;
