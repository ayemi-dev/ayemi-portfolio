import { Link } from 'react-router-dom';

/**
 * Botón
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §5.3 y §5.4
 *
 * VARIANTES (§5.3)
 *   primario     fondo --ay-acento, texto --ay-sobre-acento, sin borde
 *   secundario   transparente, texto --ay-texto, borde 1 px --ay-borde-fuerte
 *   terciario    transparente, texto --ay-acento, sin borde
 *   destructivo  fondo Rojo 500, texto Grafito 950. Siempre con confirmación.
 *
 * TAMAÑOS (§5.3)
 *   pequeno  alto 32 px · relleno horizontal 12 px · cuerpo-s 14 px
 *   medio    alto 40 px · relleno horizontal 16 px · cuerpo   16 px
 *   grande   alto 48 px · relleno horizontal 24 px · cuerpo-l 18 px
 *
 * NORMA (§5.3). El texto del botón primario sobre Cian 500 va en Grafito 900:
 * 9.12:1 de contraste. Nunca blanco sobre cian (2.06:1, insuficiente). Esa
 * decisión está resuelta en el rol --ay-sobre-acento y por eso no se puede
 * equivocar desde aquí.
 *
 * NORMA (§5.3). El área mínima de toque es 44 × 44 px aunque el botón se vea
 * más pequeño. Los tamaños «pequeno» y «medio» la alcanzan con la utilidad
 * .ay-toque, que añade una zona transparente centrada.
 *
 * NORMA (§5.4). Todo elemento interactivo cubre los siete estados y el anillo
 * de foco nunca se elimina.
 *
 * NORMA (§5.3). Una sola acción principal por vista: un único botón primario.
 */

const VARIANTES = {
  primario: 'bg-acento text-sobre-acento hover:bg-acento-hover active:bg-acento-activo',
  secundario:
    'bg-transparent text-texto border border-borde-fuerte hover:border-texto-tenue active:bg-superficie',
  terciario:
    'bg-transparent text-acento hover:text-acento-hover active:text-acento-activo',
  destructivo: 'bg-rojo-500 text-grafito-950 hover:opacity-90 active:opacity-80',
};

const TAMANOS = {
  pequeno: 'h-8 px-3 text-cuerpo-s ay-toque',
  medio: 'h-10 px-4 text-cuerpo ay-toque',
  grande: 'h-12 px-6 text-cuerpo-l',
};

export const Boton = ({
  variante = 'secundario',
  tamano = 'medio',
  /**
   * Destino dentro del sitio. Usa el enrutado en cliente, así que no recarga.
   * Admite ancla: to="/#contacto".
   */
  to,
  /** Destino externo o descarga. Renderiza un <a> normal. */
  href,
  cargando = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const Elemento = to ? Link : href ? 'a' : 'button';

  /* §5.4 · Inhabilitado: opacidad 50 %, cursor not-allowed, sin hover. */
  const inactivo = disabled || cargando;

  const clases = [
    'inline-flex items-center justify-center gap-2',
    'font-sans font-bold whitespace-nowrap',
    'rounded-md', // §5.2 · 6 px, valor por defecto de botones y campos
    'transition-colors duration-rapida ease-estandar', // §3.13
    'cursor-pointer no-underline',
    VARIANTES[variante] ?? VARIANTES.secundario,
    TAMANOS[tamano] ?? TAMANOS.medio,
    inactivo && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const esEnlace = Boolean(to || href);

  return (
    <Elemento
      className={clases}
      {...(to ? { to } : {})}
      {...(href ? { href } : {})}
      /* §5.4 · Cargando: el elemento no responde a clic y lo anuncia. */
      aria-busy={cargando || undefined}
      aria-disabled={inactivo || undefined}
      {...(esEnlace
        ? {}
        : { type: props.type ?? 'button', disabled: inactivo })}
      {...props}
    >
      {children}
    </Elemento>
  );
};
