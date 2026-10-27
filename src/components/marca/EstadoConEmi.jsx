import { Emi } from './Emi';

/**
 * Estado con Emi
 * Kit de marca Ayemi · AGENTE.md §7 y steering `ayemi-emi`
 *
 * Emi es la parte de la marca que habla con la gente cuando necesita ayuda.
 * Acompaña, avisa, celebra y explica. Nunca vende y nunca firma.
 *
 * ── POR QUÉ EXISTE ESTE ENVOLTORIO ─────────────────────────────────────────
 * El contrato fija qué expresión y qué pose corresponden a cada estado de
 * interfaz, y dice «no inventes otras». Dejar esa decisión en cada punto de
 * uso invita a equivocarse. Aquí se declara el ESTADO y el componente resuelve
 * la combinación, así que no hay forma de emparejar mal una expresión con una
 * pose ni de usar una que no esté en el catálogo.
 *
 *   <EstadoConEmi estado="vacio" titulo="…">texto</EstadoConEmi>
 *
 * Los estados admitidos son los nueve de la tabla del §7. Cualquier otro es un
 * error de programación y se avisa en desarrollo.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * DÓNDE SÍ (§7). Estados vacíos, carga, éxito, error, chat, onboarding,
 * documentación de producto, 404 y páginas de estado.
 *
 * DÓNDE NO (§7). Contratos, facturas, cotizaciones, propuestas técnicas y
 * económicas, papelería, firma de correo, incidente grave.
 *
 * SU VOZ (§7). Segunda persona del singular. Máximo dos frases. Sin emojis: su
 * rostro ya es la expresión. Nunca culpa al usuario. No habla de sí misma en
 * tercera persona.
 */

/**
 * La tabla del §7, tal cual. Es también el mapa que usa `EXPRESION_POR_ESTADO`
 * del componente del kit; se replica aquí para poder validar el estado y para
 * que el emparejamiento quede a la vista de quien lea este archivo.
 */
const COMBINACIONES = {
  bienvenida: { expresion: 'feliz', pose: 'saludando' },
  formulario: { expresion: 'atento', pose: 'flotando' },
  cargando: { expresion: 'procesando', pose: 'flotando' },
  exito: { expresion: 'celebrando', pose: 'celebrando' },
  advertencia: { expresion: 'alerta', pose: 'flotando' },
  error: { expresion: 'error', pose: 'flotando' },
  vacio: { expresion: 'vacio', pose: 'flotando' },
  inactiva: { expresion: 'reposo', pose: 'flotando' },
  tutorial: { expresion: 'atento', pose: 'senalando' },
};

/**
 * Altos recomendados por contexto (§7).
 *   bloque  estado vacío o página de error · 180-260 px, mínimo 120
 *   aviso   junto a un mensaje en línea · usa el avatar
 */
const ALTOS = { bloque: 200, aviso: 44 };

export const EstadoConEmi = ({
  /** Uno de los nueve estados del §7. */
  estado = 'vacio',
  /** 'bloque' pinta a Emi entera; 'aviso' usa el avatar de la cabeza. */
  formato = 'bloque',
  titulo,
  children,
  /** Contenido extra bajo el texto: un botón, un enlace. */
  accion,
  /** Anima el flotado. Respeta prefers-reduced-motion. */
  animada = true,
  className = '',
}) => {
  const combinacion = COMBINACIONES[estado];

  if (import.meta.env.DEV && !combinacion) {
    console.warn(
      `[Ayemi §7] Estado de Emi fuera del catálogo: "${estado}". ` +
        `Admitidos: ${Object.keys(COMBINACIONES).join(', ')}.`
    );
  }

  const { expresion, pose } = combinacion ?? COMBINACIONES.vacio;

  /* Formato en línea: por debajo de 40 px el cuerpo completo es una mancha
     ilegible, así que el contrato manda usar el avatar, que encuadra solo la
     cabeza. */
  if (formato === 'aviso') {
    return (
      <div className={`flex items-start gap-4 ${className}`}>
        <Emi
          variante="avatar"
          expresion={expresion}
          alto={ALTOS.aviso}
          titulo={null}
          className="shrink-0"
        />
        <div className="min-w-0">
          {titulo && <p className="text-cuerpo-s font-bold text-texto">{titulo}</p>}
          {children && (
            <div className="text-cuerpo-s text-texto-suave">{children}</div>
          )}
          {accion && <div className="mt-4">{accion}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Emi es decorativa cuando el texto de al lado ya dice lo que pasa: así
          el lector de pantalla no anuncia «Emi» antes del mensaje útil. */}
      <Emi
        expresion={expresion}
        pose={pose}
        alto={ALTOS.bloque}
        animada={animada}
        titulo={null}
      />

      {titulo && <p className="mt-8 text-titulo-3 text-texto">{titulo}</p>}

      {children && (
        <div className="mt-3 max-w-lectura text-cuerpo text-texto-suave">
          {children}
        </div>
      )}

      {accion && <div className="mt-8">{accion}</div>}
    </div>
  );
};
