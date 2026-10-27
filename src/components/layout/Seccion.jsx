import { Microetiqueta } from '../marca/Logotipo';
import { GuiaEmi } from '../marca/GuiaEmi';

/**
 * Sección
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §5.2
 *
 * Encierra el contenedor, el margen lateral por dispositivo y el respiro
 * vertical, para que ninguna sección invente sus propias medidas.
 *
 * §5.2 · Margen vertical de sección: --ay-esp-24 (96 px).
 * §5.2 · Margen lateral: --ay-margen, que vale 20 px en móvil, 32 en tableta
 *   y 48 en escritorio.
 * §3.2 · `fondo="alterno"` usa Grafito 850, que es el «fondo de sección
 *   alterna» del sistema.
 */

const FONDOS = {
  lienzo: 'bg-lienzo',
  alterno: 'bg-lienzo-alterno',
  profundo: 'bg-lienzo-profundo',
};

export const Seccion = ({
  id,
  /** Microetiqueta de sección (§5). Caja alta, máximo cinco palabras. */
  etiqueta,
  /** Titular. Se compone con `acento` para poner la palabra clave en cian. */
  titulo,
  acento,
  tituloDespues,
  /** Entradilla bajo el titular (§5). */
  entradilla,
  /**
   * Una línea de Emi que orienta sobre la sección (§7, «tutoriales»).
   * Al declararla aquí, el acompañamiento queda igual en todas las secciones y
   * ninguna decide por su cuenta el tamaño ni la expresión.
   */
  guia,
  /** 'guia' cuando Emi orienta; 'escucha' cuando la sección pide algo. */
  guiaSituacion = 'guia',
  /**
   * Nivel del encabezado: 2 por omisión, porque lo normal es que la sección
   * viva dentro de una página cuyo h1 es otro.
   *
   * §5.5 · Un solo h1 por vista y sin saltos de nivel. Cuando una sección ES
   * la página —el portafolio en `/portafolio`— su titular pasa a ser el h1, y
   * sin esta prop habría que duplicar el título o dejar la página sin h1.
   */
  nivel = 2,
  fondo = 'lienzo',
  /** 'lectura' centra el encabezado; 'ancho' lo alinea a la izquierda. */
  encabezado = 'ancho',
  children,
  className = '',
}) => {
  const centrado = encabezado === 'lectura';
  /* Mayúscula inicial para que JSX lo trate como componente y no como etiqueta
     literal. Solo se admiten h1 y h2: cualquier otro valor sería un salto de
     nivel, que es justo lo que §5.5 prohíbe. */
  const Titular = nivel === 1 ? 'h1' : 'h2';

  return (
    <section
      id={id}
      /* §5.2 · El desplazamiento compensa la cabecera fija para que el anclaje
         no deje el título debajo de la barra. */
      className={`scroll-mt-16 ${FONDOS[fondo] ?? FONDOS.lienzo} ${className}`}
      style={{ paddingBlock: 'var(--ay-esp-24)' }}
      aria-labelledby={titulo ? `${id}-titulo` : undefined}
    >
      <div
        className="mx-auto max-w-2xl"
        style={{ paddingInline: 'var(--ay-margen)' }}
      >
        {(etiqueta || titulo) && (
          <header
            className={
              centrado ? 'mx-auto max-w-lectura text-center' : 'max-w-lectura'
            }
          >
            {etiqueta && <Microetiqueta>{etiqueta}</Microetiqueta>}

            {titulo && (
              /* §3.7 · titulo-1 en móvil, display-l en escritorio. Cada
                 peldaño trae su peso, tracking e interlínea. */
              <Titular
                id={`${id}-titulo`}
                className="mt-4 text-titulo-1 md:text-display-l"
              >
                {titulo}
                {acento && <span className="text-acento">{acento}</span>}
                {tituloDespues}
              </Titular>
            )}

            {entradilla && (
              /* §5 · Entradilla: sans regular, texto suave. */
              <p className="mt-4 text-cuerpo-l text-texto-suave">{entradilla}</p>
            )}

            {/* §7 · Emi conduce el recorrido. Aquí va en avatar a 44 px, que es
                el rango de «avatar de soporte»: el cuerpo completo a ese tamaño
                sería una mancha ilegible. */}
            {guia && (
              <GuiaEmi
                situacion={guiaSituacion}
                className={centrado ? 'mt-6 justify-center' : 'mt-6'}
              >
                {guia}
              </GuiaEmi>
            )}
          </header>
        )}

        <div className={etiqueta || titulo ? 'mt-16' : ''}>{children}</div>
      </div>
    </section>
  );
};
