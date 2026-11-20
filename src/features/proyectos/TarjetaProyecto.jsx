import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tarjeta } from '../../components/ui/Tarjeta';
import { urlMedio } from '../../config/proyectos';
import { RUTA_CASOS, RUTA_PROYECTOS } from '../../config/secciones';

/**
 * Tarjeta de un proyecto · refactorización 2026-11 (R4.1, T5)
 *
 * Imagen real 16:10, título, resumen y chips de stack. Las demos del
 * Laboratorio llevan arriba la etiqueta «Proyecto demostrativo» (R0.6): nunca
 * se presentan como trabajo para clientes.
 *
 * Destino: los casos de clientes viven en /casos/<slug>; las demos, en
 * /proyectos/<slug> (design.md, «Rutas»).
 *
 * §5.5 · El enlace está en el título y se estira sobre toda la tarjeta con un
 * pseudoelemento: así el nombre accesible del enlace es solo el título, no el
 * alt de la imagen más el resumen y los chips.
 * §5.3 · Tarjeta sin sombra en reposo; al pasar se eleva el tono.
 */

const idiomaDe = (i18n) => (i18n.resolvedLanguage === 'en' ? 'en' : 'es');

const rutaDeProyecto = (proyecto) =>
  `${proyecto.tipo === 'laboratorio' ? RUTA_PROYECTOS : RUTA_CASOS}/${proyecto.slug}`;

export const TarjetaProyecto = ({ proyecto }) => {
  const { t, i18n } = useTranslation();
  const idioma = idiomaDe(i18n);
  const textos = proyecto.textos[idioma];
  const imagen = proyecto.imagenes?.[0];
  const stack = proyecto.stack ?? [];

  return (
    <Tarjeta
      como="li"
      interactiva
      className="group relative flex h-full flex-col"
    >
      {imagen && (
        <img
          src={urlMedio(proyecto.slug, imagen.src)}
          width={imagen.ancho}
          height={imagen.alto}
          alt={imagen.alt[idioma]}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full rounded-md border border-borde object-cover object-top"
        />
      )}

      {proyecto.tipo === 'laboratorio' && (
        <span className="mt-6 ay-etiqueta">{t('proyectos.demostrativo')}</span>
      )}

      <h3 className={`${proyecto.tipo === 'laboratorio' ? 'mt-3' : 'mt-6'} text-titulo-3 text-texto`}>
        <Link
          to={rutaDeProyecto(proyecto)}
          className="rounded-sm transition-colors duration-rapida ease-estandar after:absolute after:inset-0 after:rounded-lg group-hover:text-acento"
        >
          {textos.titulo}
        </Link>
      </h3>

      <p className="mt-3 text-cuerpo text-texto-suave">{textos.resumen}</p>

      {stack.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
          {stack.map((nombre) => (
            <li
              key={nombre}
              className="rounded-xs border border-borde px-2 py-1 font-mono text-micro text-texto-tenue"
            >
              {nombre}
            </li>
          ))}
        </ul>
      )}
    </Tarjeta>
  );
};
