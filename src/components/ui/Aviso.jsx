import {
  IconoAtencion,
  IconoComprobacion,
  IconoError,
  IconoNucleo,
} from '../marca/Iconos';

/**
 * Aviso
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §5.3
 *
 * TIPO          ICONO      BORDE IZQUIERDO   FONDO
 * Información   nucleo     3 px Cian 500     Cian 950 en oscuro
 * Éxito         check      3 px Verde 500    Verde 900 al 20 %
 * Atención      triángulo  3 px Ámbar 500    Ámbar al 12 %
 * Error         círculo    3 px Rojo 500     Rojo al 12 %
 *
 * NORMA (§5.3). Todo aviso lleva icono además de color, y el texto explica qué
 * hacer, no solo qué pasó.
 *
 * NORMA (§5.5). Independencia del color: el icono y el texto sostienen el
 * mensaje por sí solos, de modo que el aviso se entiende sin percibir el matiz.
 *
 * NORMA (§1.10, regla 3). Nunca se culpa al usuario. Eso corresponde al texto
 * que se pasa como contenido, no al componente, pero queda anotado aquí porque
 * es donde se escriben los mensajes de error.
 */

const TIPOS = {
  info: {
    Icono: IconoNucleo,
    borde: 'border-l-cian-500',
    fondo: 'bg-cian-500/10',
    texto: 'text-info',
  },
  exito: {
    Icono: IconoComprobacion,
    borde: 'border-l-verde-500',
    fondo: 'bg-verde-500/12',
    texto: 'text-exito',
  },
  atencion: {
    Icono: IconoAtencion,
    borde: 'border-l-ambar-500',
    fondo: 'bg-ambar-500/12',
    texto: 'text-atencion',
  },
  error: {
    Icono: IconoError,
    borde: 'border-l-rojo-500',
    fondo: 'bg-rojo-500/12',
    texto: 'text-error',
  },
};

export const Aviso = ({ tipo = 'info', titulo, children, className = '' }) => {
  const config = TIPOS[tipo] ?? TIPOS.info;
  const Pictograma = config.Icono;

  return (
    <div
      /* Los errores se anuncian en cuanto aparecen; el resto no interrumpe. */
      role={tipo === 'error' ? 'alert' : 'status'}
      className={[
        'flex gap-3 rounded-md border-l-[3px] p-4',
        config.borde,
        config.fondo,
        className,
      ].join(' ')}
    >
      <Pictograma tamano={20} className={`mt-0.5 shrink-0 ${config.texto}`} />
      <div className="min-w-0">
        {titulo && (
          <p className={`text-cuerpo-s font-bold ${config.texto}`}>{titulo}</p>
        )}
        <div className="text-cuerpo-s text-texto-suave">{children}</div>
      </div>
    </div>
  );
};
