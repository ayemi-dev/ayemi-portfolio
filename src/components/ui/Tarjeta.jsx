/**
 * Tarjeta
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §5.3
 *
 * PROPIEDADES NORMATIVAS
 *   Fondo ................... --ay-superficie
 *   Borde ................... 1 px --ay-borde
 *   Radio ................... --ay-radio-lg (10 px)
 *   Relleno ................. --ay-esp-6 (24 px)
 *   Sombra en reposo ........ ninguna
 *   Sombra al pasar ......... solo si es interactiva
 *
 * NORMA (§5.3). En tema oscuro la jerarquía se construye con luminosidad, no
 * con sombras: una sombra sobre fondo oscuro apenas se ve. Lo que funciona es
 * elevar el tono de la superficie, y eso es lo que hace el hover aquí.
 */
export const Tarjeta = ({
  /** Etiqueta de elemento. `article` para casos de estudio, `li` en listas. */
  como: Como = 'div',
  /** Marca la tarjeta como interactiva: eleva el tono y refuerza el borde. */
  interactiva = false,
  /** Resalta la tarjeta con el borde de acento, sin cambiar el fondo. */
  destacada = false,
  className = '',
  children,
  ...props
}) => (
  <Como
    className={[
      'rounded-lg bg-superficie p-6',
      'border',
      destacada ? 'border-acento' : 'border-borde',
      interactiva &&
        'transition-colors duration-media ease-estandar hover:border-borde-fuerte hover:bg-superficie-elevada',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    {children}
  </Como>
);
