import { Emi } from './Emi';

/**
 * Guía con Emi
 * Kit de marca Ayemi · AGENTE.md §7 y steering `ayemi-emi`
 *
 * Emi acompaña al visitante por el sitio. No vende y no firma: presenta,
 * orienta y explica. El contrato lo contempla de forma explícita, con entrada
 * propia para la pantalla de bienvenida y para la guía paso a paso:
 *
 *   SITUACIÓN                    POSE         EXPRESIÓN   ALTO
 *   Pantalla de bienvenida       saludando    feliz       220-320 px (mín 160)
 *   Tutorial paso a paso         senalando    atento      —
 *   Formulario o chat            flotando     atento      —
 *   Globo de chat                —            —           48-64 px (mín 40)
 *   Avatar de soporte            —            —           40-48 px (mín 32)
 *
 * Por debajo de 40 px el cuerpo completo es una mancha ilegible, así que el
 * formato de guía usa el avatar, que encuadra solo la cabeza.
 *
 * ── SU VOZ ─────────────────────────────────────────────────────────────────
 * Segunda persona del singular. Máximo dos frases. Sin emojis: su rostro ya es
 * la expresión. Nunca culpa al usuario y no habla de sí misma en tercera
 * persona: dice «te ayudo», no «Emi te ayudará».
 * ───────────────────────────────────────────────────────────────────────────
 *
 * NORMA (§7). Emi nunca sustituye al logotipo. En la portada la firma sigue
 * siendo el logotipo de la cabecera; Emi está al lado, acompañando.
 *
 * NORMA (§2, regla 9). El color no es el único portador de significado: lo que
 * Emi dice va en texto real, y ella queda como decorativa para que el lector de
 * pantalla no anuncie «Emi» antes del mensaje útil.
 */

/** Situaciones admitidas, con su combinación del §7. */
const SITUACIONES = {
  bienvenida: { expresion: 'feliz', pose: 'saludando' },
  guia: { expresion: 'atento', pose: 'senalando' },
  escucha: { expresion: 'atento', pose: 'flotando' },
};

/**
 * Globo de diálogo.
 *
 * Es una tarjeta del sistema (§8): superficie, borde de 1 px, radio de 10 px y
 * relleno de 24 px. Sin sombra, porque en tema oscuro la jerarquía se hace con
 * luminosidad. La cola es un cuadrado de 12 px girado 45°, con dos bordes
 * visibles: apunta hacia arriba en móvil, donde Emi queda encima, y hacia la
 * izquierda en escritorio, donde queda al lado.
 */
const Globo = ({ children, pie }) => (
  <div className="relative rounded-lg border border-borde bg-superficie p-6">
    {/* Cola hacia arriba, cuando Emi queda encima */}
    <span
      aria-hidden="true"
      className="absolute -top-1.5 left-8 h-3 w-3 rotate-45 border-t border-l border-borde bg-superficie xl:hidden"
    />
    {/* Cola hacia la izquierda, cuando Emi queda al lado */}
    <span
      aria-hidden="true"
      className="absolute -left-1.5 top-8 hidden h-3 w-3 rotate-45 border-b border-l border-borde bg-superficie xl:block"
    />

    <p className="text-cuerpo-l text-texto">{children}</p>

    {pie && (
      <p className="mt-3 border-t border-borde pt-3 font-mono text-micro text-texto-tenue">
        {pie}
      </p>
    )}
  </div>
);

/**
 * Bienvenida · Emi de cuerpo completo con su globo.
 * Para la portada. Alto por defecto 240 px, dentro del rango 220-320.
 */
export const BienvenidaEmi = ({ alto = 240, pie, children, className = '' }) => {
  const { expresion, pose } = SITUACIONES.bienvenida;

  /* El paso a fila espera hasta `xl`. Este bloque vive dentro de una columna de
     la portada: a 1024 px esa columna mide unos 460 px, y poner a Emi al lado
     dejaría el globo en 230 px, donde dos frases se rompen en seis líneas.
     Apilado se lee mejor hasta que hay sitio de verdad. */
  return (
    <div className={`flex flex-col items-start gap-6 xl:flex-row ${className}`}>
      <Emi
        expresion={expresion}
        pose={pose}
        alto={alto}
        animada
        titulo={null}
        className="shrink-0 self-center xl:self-start"
      />
      <div className="min-w-0 flex-1 xl:pt-8">
        <Globo pie={pie}>{children}</Globo>
      </div>
    </div>
  );
};

/**
 * Guía de sección · el avatar de Emi con una línea.
 *
 * Va bajo el encabezado de cada sección para que el recorrido tenga alguien que
 * lo conduzca. Usa el avatar a 44 px, que es el rango de «avatar de soporte».
 *
 * @param situacion 'guia' cuando orienta, 'escucha' cuando la sección pide algo
 *                  al visitante.
 */
export const GuiaEmi = ({ situacion = 'guia', children, className = '' }) => {
  const { expresion } = SITUACIONES[situacion] ?? SITUACIONES.guia;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Emi
        variante="avatar"
        expresion={expresion}
        alto={44}
        titulo={null}
        className="shrink-0"
      />
      {/* La cita marca que la voz es de Emi y no de la marca institucional. */}
      <p className="text-cuerpo-s text-texto-suave italic">{children}</p>
    </div>
  );
};
