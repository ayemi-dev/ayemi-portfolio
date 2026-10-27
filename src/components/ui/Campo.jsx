import { useId } from 'react';
import { IconoError } from '../marca/Iconos';

/**
 * Campo de formulario
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §5.3 y §5.4
 *
 * ESTADOS NORMATIVOS
 *   Reposo        1 px --ay-borde-fuerte   fondo --ay-superficie
 *   Hover         1 px --ay-texto-tenue
 *   Foco          2 px --ay-acento         más outline-offset 2 px
 *   Error         2 px Rojo 500            con mensaje de texto debajo
 *   Inhabilitado  1 px --ay-borde          texto al 50 %, cursor not-allowed
 *
 * NORMA (§5.3). Todo campo lleva etiqueta visible. El texto de sugerencia
 * (placeholder) no sustituye a la etiqueta: desaparece al escribir y deja al
 * usuario sin referencia. Por eso `etiqueta` es obligatoria y no hay prop
 * `placeholder` para textos que deberían ser etiqueta.
 *
 * NORMA (§5.3). Los mensajes de error se colocan debajo del campo, en texto,
 * con icono. Nunca solo con color de borde.
 *
 * NORMA (§5.4). El anillo de foco no se elimina. Lo aporta la regla
 * :focus-visible de los tokens.
 */
export const Campo = ({
  etiqueta,
  /** 'text' | 'email' | 'textarea' | … */
  tipo = 'text',
  valor,
  onChange,
  error,
  /** Ayuda breve bajo la etiqueta. No sustituye a la etiqueta. */
  ayuda,
  requerido = false,
  filas = 5,
  /** Contador de caracteres. Requiere `maximo`. */
  maximo,
  autoComplete,
  className = '',
}) => {
  const id = useId();
  const idError = `${id}-error`;
  const idAyuda = `${id}-ayuda`;

  const descrito =
    [error && idError, ayuda && idAyuda].filter(Boolean).join(' ') || undefined;

  const clasesControl = [
    'w-full rounded-md bg-superficie px-3 py-3',
    'font-sans text-cuerpo text-texto',
    'transition-colors duration-rapida ease-estandar',
    'placeholder:text-texto-tenue',
    error
      ? 'border-2 border-rojo-500'
      : 'border border-borde-fuerte hover:border-texto-tenue',
  ].join(' ');

  const propsComunes = {
    id,
    value: valor,
    onChange,
    required: requerido,
    'aria-describedby': descrito,
    'aria-invalid': error ? true : undefined,
    autoComplete,
    className: clasesControl,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-cuerpo-s font-bold text-texto">
        {etiqueta}
        {requerido && (
          <span className="text-acento" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      {ayuda && (
        <p id={idAyuda} className="mt-1 text-cuerpo-s text-texto-tenue">
          {ayuda}
        </p>
      )}

      <div className="mt-2">
        {tipo === 'textarea' ? (
          <textarea {...propsComunes} rows={filas} maxLength={maximo} />
        ) : (
          <input {...propsComunes} type={tipo} maxLength={maximo} />
        )}
      </div>

      {/* §3.8 · El contador es un dato, así que va en monoespaciada. */}
      {maximo && (
        <p className="mt-1 text-right font-mono text-micro text-texto-tenue">
          {(valor ?? '').length} / {maximo}
        </p>
      )}

      {/* §5.3 · El error va debajo, en texto, con icono. */}
      {error && (
        <p
          id={idError}
          className="mt-2 flex items-start gap-2 text-cuerpo-s text-error"
        >
          <IconoError tamano={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
