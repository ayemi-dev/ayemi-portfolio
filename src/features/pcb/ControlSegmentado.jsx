/**
 * Control segmentado
 *
 * Grupo de botones excluyentes para cambiar de vista (capa de cobre de una
 * placa, o perspectiva/superior/inferior de la galería). Usa `aria-pressed` en
 * lugar de radios nativos porque el estilo visual que pide §5.3 es el de un
 * segmentado, no el de radios con etiqueta.
 *
 * §5.4 · El anillo de foco global ya cubre este botón; no se le quita.
 */
export const ControlSegmentado = ({ etiqueta, opciones, valor, onCambio }) => (
  <div
    role="group"
    aria-label={etiqueta}
    className="inline-flex rounded-md border border-borde p-0.5"
  >
    {opciones.map((opcion) => (
      <button
        key={opcion.valor}
        type="button"
        aria-pressed={opcion.valor === valor}
        onClick={() => onCambio(opcion.valor)}
        className="ay-toque h-8 rounded-sm px-3 font-mono text-micro text-texto-tenue transition-colors duration-rapida ease-estandar aria-pressed:bg-superficie-elevada aria-pressed:text-texto hover:text-texto"
      >
        {opcion.texto}
      </button>
    ))}
  </div>
);
