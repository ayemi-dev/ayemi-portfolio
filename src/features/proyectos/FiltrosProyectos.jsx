import { useTranslation } from 'react-i18next';
import { IconoComprobacion } from '../../components/marca/Iconos';

/**
 * Filtros de la galería · refactorización 2026-11 (R4.2, T5)
 *
 * Dos grupos de botones conmutables: tipo (las `categorias` de las fichas) y
 * stack. Cada botón es un `<button aria-pressed>`, así que Tab llega a cada
 * uno y Enter o Espacio lo activan sin código extra. El estado no vive aquí:
 * lo guarda la página en la URL (`?tipo=…&stack=…`) y llega por props.
 *
 * Solo se pintan las opciones que usa al menos una ficha publicada; un grupo
 * sin opciones no se pinta (R0.5).
 *
 * §5.5 · Independencia del color: el botón activo lleva además la marca de
 * comprobación, no solo el borde de acento.
 * §5.4 · El anillo de foco global cubre estos botones; no se le quita.
 */

const Grupo = ({ id, etiqueta, opciones, activos, onCambiar }) => (
  <div role="group" aria-labelledby={id} className="flex flex-col gap-3">
    <span id={id} className="ay-etiqueta">
      {etiqueta}
    </span>
    <ul className="flex flex-wrap gap-2">
      {opciones.map(({ valor, texto }) => {
        const activo = activos.includes(valor);
        return (
          <li key={valor}>
            <button
              type="button"
              aria-pressed={activo}
              onClick={() => onCambiar(valor)}
              className="ay-toque inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-borde-fuerte px-3 font-mono text-micro text-texto-suave transition-colors duration-rapida ease-estandar hover:border-texto-tenue hover:text-texto active:bg-superficie aria-pressed:border-acento aria-pressed:bg-superficie-elevada aria-pressed:text-texto"
            >
              {activo && <IconoComprobacion tamano={16} className="text-acento" />}
              {texto}
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

export const FiltrosProyectos = ({
  /** [{ valor, texto }] de las categorías en uso. */
  tipos,
  /** [{ valor, texto }] de las tecnologías en uso. */
  stacks,
  /** Valores activos de cada grupo, tal como vienen de la URL. */
  tiposActivos,
  stacksActivos,
  /** (grupo: 'tipo' | 'stack', valor) → activa o desactiva el valor. */
  onCambiar,
}) => {
  const { t } = useTranslation();

  if (tipos.length === 0 && stacks.length === 0) return null;

  return (
    <div
      role="search"
      aria-label={t('proyectos.filtros')}
      className="flex flex-col gap-6"
    >
      {tipos.length > 0 && (
        <Grupo
          id="filtro-tipo"
          etiqueta={t('proyectos.filtroTipo')}
          opciones={tipos}
          activos={tiposActivos}
          onCambiar={(valor) => onCambiar('tipo', valor)}
        />
      )}
      {stacks.length > 0 && (
        <Grupo
          id="filtro-stack"
          etiqueta={t('proyectos.filtroStack')}
          opciones={stacks}
          activos={stacksActivos}
          onCambiar={(valor) => onCambiar('stack', valor)}
        />
      )}
    </div>
  );
};
