/**
 * AYEMI · Emi
 * ===========
 * La mascota, generada desde la misma geometria que los SVG matriz.
 * Lienzo 512 x 600 · modulo C (cabeza) = 246u · altura total 2.23 C
 *
 * Su antena remata en El Nucleo: el mismo circulo cian que corona la letra
 * "i" del logotipo. Es lo que la hace pertenecer al sistema.
 *
 *   <Emi expresion="procesando" alto={200} />
 *   <Emi expresion="celebrando" pose="celebrando" alto={240} />
 *   <Emi variante="avatar" alto={44} />
 *
 * DONDE SI: estados vacios, carga, exito, error, chat, onboarding, 404.
 * DONDE NO: contratos, facturas, propuestas, papeleria, firma de correo.
 */

import { useId } from 'react';
import type { SVGProps } from 'react';

export type ExpresionEmi =
  | 'feliz'
  | 'atento'
  | 'procesando'
  | 'celebrando'
  | 'alerta'
  | 'error'
  | 'vacio'
  | 'reposo';

export type PoseEmi =
  | 'flotando'
  | 'saludando'
  | 'senalando'
  | 'celebrando';

export type VarianteEmi = 'completa' | 'avatar';

export interface EmiProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /** Estado del rostro. Ocho expresiones normativas. */
  expresion?: ExpresionEmi;
  /** Posicion de los brazos. Cuatro poses normativas. */
  pose?: PoseEmi;
  /** `avatar` encuadra solo la cabeza. Obligatorio por debajo de 40px. */
  variante?: VarianteEmi;
  /** Altura en pixeles. */
  alto?: number;
  /** Texto accesible. Usa null si es decorativa. */
  titulo?: string | null;
  /** Anima el flotado y el rostro `procesando`. Respeta prefers-reduced-motion. */
  animada?: boolean;
}

/** Expresion sugerida para cada estado de interfaz. */
export const EXPRESION_POR_ESTADO = {
  bienvenida: { expresion: 'feliz', pose: 'saludando' },
  formulario: { expresion: 'atento', pose: 'flotando' },
  cargando: { expresion: 'procesando', pose: 'flotando' },
  exito: { expresion: 'celebrando', pose: 'celebrando' },
  advertencia: { expresion: 'alerta', pose: 'flotando' },
  error: { expresion: 'error', pose: 'flotando' },
  vacio: { expresion: 'vacio', pose: 'flotando' },
  inactiva: { expresion: 'reposo', pose: 'flotando' },
  tutorial: { expresion: 'atento', pose: 'senalando' },
} as const satisfies Record<string, { expresion: ExpresionEmi; pose: PoseEmi }>;

const PALETA = {
  carcasa: '#F4F7FA',
  visera: '#3B4FE3',
  pantalla: '#0A0D10',
  brillo: '#0BC5EA',
  sensor: '#22C79B',
  nucleo: '#0BC5EA',
  pectoral: '#22C79B',
  brazoAlto: '#3B4FE3',
  brazoBajo: '#BFC6D0',
} as const;

const ROSTROS: Record<ExpresionEmi, React.ReactNode> = {
  // Estado por defecto. Bienvenidas, exito general, onboarding.
  feliz: (
    <>
      <circle cx="212.0" cy="236.0" r="23.0" fill="#0BC5EA"/>
      <circle cx="300.0" cy="236.0" r="23.0" fill="#0BC5EA"/>
      <path d="M 222.0 274.0 Q 256.0 298.0 290.0 274.0" fill="none" stroke="#0BC5EA" strokeWidth="9.0" strokeLinecap="round"/>
    </>
  ),
  // Escuchando. Formularios, chat de soporte, preguntas.
  atento: (
    <>
      <circle cx="212.0" cy="236.0" r="23.0" fill="#0BC5EA"/>
      <circle cx="300.0" cy="236.0" r="23.0" fill="#0BC5EA"/>
      <circle cx="256.0" cy="282.0" r="11" fill="none" stroke="#0BC5EA" strokeWidth="8"/>
    </>
  ),
  // Carga, despliegue en curso, calculo. Animable.
  procesando: (
    <>
      <rect x="192.0" y="230.5" width="40.0" height="11.0" rx="5.5" fill="#0BC5EA"/>
      <rect x="280.0" y="230.5" width="40.0" height="11.0" rx="5.5" fill="#0BC5EA"/>
      <circle cx="236.0" cy="282.0" r="6" fill="#0BC5EA" opacity="1"/>
      <circle cx="256.0" cy="282.0" r="6" fill="#0BC5EA" opacity="0.65"/>
      <circle cx="276.0" cy="282.0" r="6" fill="#0BC5EA" opacity="0.35"/>
    </>
  ),
  // Despliegue correcto, hito alcanzado, pago confirmado.
  celebrando: (
    <>
      <path d="M 190.0 244.0 Q 212.0 214.0 234.0 244.0" fill="none" stroke="#0BC5EA" strokeWidth="11" strokeLinecap="round"/>
      <path d="M 278.0 244.0 Q 300.0 214.0 322.0 244.0" fill="none" stroke="#0BC5EA" strokeWidth="11" strokeLinecap="round"/>
      <path d="M 216.0 271.0 Q 256.0 304.0 296.0 271.0" fill="none" stroke="#0BC5EA" strokeWidth="10" strokeLinecap="round"/>
    </>
  ),
  // Advertencia recuperable. Cuota, aviso, confirmacion.
  alerta: (
    <>
      <circle cx="212.0" cy="236.0" r="23.0" fill="#F5A524"/>
      <circle cx="300.0" cy="236.0" r="23.0" fill="#F5A524"/>
      <path d="M 232.0 282.0 L 280.0 282.0" fill="none" stroke="#F5A524" strokeWidth="9" strokeLinecap="round"/>
    </>
  ),
  // Fallo bloqueante. 500, conexion perdida, build roto.
  error: (
    <>
      <path d="M 197.0 221.0 L 227.0 251.0 M 227.0 221.0 L 197.0 251.0" fill="none" stroke="#F0475E" strokeWidth="11" strokeLinecap="round"/>
      <path d="M 285.0 221.0 L 315.0 251.0 M 315.0 221.0 L 285.0 251.0" fill="none" stroke="#F0475E" strokeWidth="11" strokeLinecap="round"/>
      <path d="M 238.0 282.0 L 274.0 282.0" fill="none" stroke="#F0475E" strokeWidth="9" strokeLinecap="round"/>
    </>
  ),
  // Estado vacio. Sin resultados, bandeja limpia, 404.
  vacio: (
    <>
      <rect x="197.0" y="230.5" width="30" height="11" rx="5.5" fill="#0BC5EA"/>
      <rect x="285.0" y="230.5" width="30" height="11" rx="5.5" fill="#0BC5EA"/>
      <path d="M 240.0 282.0 L 272.0 282.0" fill="none" stroke="#0BC5EA" strokeWidth="9" strokeLinecap="round"/>
    </>
  ),
  // Inactividad, sesion en pausa, modo ahorro.
  reposo: (
    <>
      <rect x="195.0" y="232.0" width="34" height="8" rx="4.0" fill="#0BC5EA"/>
      <rect x="283.0" y="232.0" width="34" height="8" rx="4.0" fill="#0BC5EA"/>
      <path d="M 238.0 278.0 Q 256.0 290.0 274.0 278.0" fill="none" stroke="#0BC5EA" strokeWidth="8" strokeLinecap="round"/>
    </>
  ),
};

const BRAZOS: Record<PoseEmi, { izq: string; der: string }> = {
  // Pose por defecto. Reposo atento, brazos hacia fuera.
  flotando: { izq: 'M 176 458 Q 140 500 132 548', der: 'M 336 458 Q 372 500 380 548' },
  // Bienvenida, onboarding, primer contacto.
  saludando: { izq: 'M 176 458 Q 140 500 132 548', der: 'M 340 452 Q 386 424 392 372' },
  // Guia paso a paso, tooltip, indicacion en pantalla.
  senalando: { izq: 'M 176 458 Q 140 500 132 548', der: 'M 338 462 Q 386 476 428 470' },
  // Exito, hito, despliegue correcto. Ambos brazos en alto.
  celebrando: { izq: 'M 172 452 Q 128 424 120 372', der: 'M 340 452 Q 384 424 392 372' },
};

/**
 * Deteccion de entorno sin depender de @types/node. Ver AyemiLogo.tsx.
 */
const EN_DESARROLLO = (() => {
  try {
    const g = globalThis as { process?: { env?: { NODE_ENV?: string } } };
    return g.process?.env?.NODE_ENV !== 'production';
  } catch {
    return false;
  }
})();

const LIENZO = { ancho: 512, alto: 600 };
// Encuadre del avatar: antena, auriculares y cabeza, con 12u de margen.
const AVATAR = { x: 72, y: 7, ancho: 368, alto: 345 };

export function Emi({
  expresion = 'feliz',
  pose = 'flotando',
  variante = 'completa',
  alto = 200,
  titulo = 'Emi',
  animada = false,
  ...resto
}: EmiProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const esAvatar = variante === 'avatar';

  if (EN_DESARROLLO && !esAvatar && alto < 40) {
    console.warn(
      '[Ayemi] Por debajo de 40px usa <Emi variante="avatar" />: el cuerpo ' +
        'completo a ese tamaño es ilegible.',
    );
  }

  const viewBox = esAvatar
    ? `${AVATAR.x} ${AVATAR.y} ${AVATAR.ancho} ${AVATAR.alto}`
    : `0 0 ${LIENZO.ancho} ${LIENZO.alto}`;
  const proporcion = esAvatar
    ? AVATAR.ancho / AVATAR.alto
    : LIENZO.ancho / LIENZO.alto;

  const brazos = BRAZOS[pose];

  return (
    <svg
      viewBox={viewBox}
      width={Math.round(alto * proporcion * 100) / 100}
      height={alto}
      xmlns="http://www.w3.org/2000/svg"
      role={titulo ? 'img' : 'presentation'}
      aria-hidden={titulo ? undefined : true}
      focusable={false}
      data-emi-expresion={expresion}
      data-emi-pose={pose}
      {...resto}
    >
      {titulo && <title>{titulo}</title>}

      <defs>
        <clipPath id={`emiCabeza${uid}`}>
          <rect
            x="112" y="94"
            width="288" height="246"
            rx="86" ry="86"
          />
        </clipPath>
        <clipPath id={`emiCuerpo${uid}`}>
          <path d="M 256.0 376.0 C 314 376.0 354 414 354 462 C 354 522 310 568.0 256.0 568.0 C 202 568.0 158 522 158 462 C 158 414 198 376.0 256.0 376.0 Z" />
        </clipPath>
        <linearGradient id={`emiBrazo${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETA.brazoAlto} />
          <stop offset="100%" stopColor={PALETA.brazoBajo} />
        </linearGradient>
      </defs>

      {animada && (
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .emiFlota${uid} {
              animation: emiFlota${uid} 3.6s ease-in-out infinite;
            }
            @keyframes emiFlota${uid} {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-10px); }
            }
          }
        `}</style>
      )}

      <g className={animada ? `emiFlota${uid}` : undefined}>
        {!esAvatar && (
          <>
            {/* Brazos, detras del cuerpo */}
            <g
              strokeWidth="40"
              strokeLinecap="round"
              fill="none"
              stroke={`url(#emiBrazo${uid})`}
            >
              <path d={brazos.izq} />
              <path d={brazos.der} />
            </g>

            {/* Cuerpo */}
            <path d="M 256.0 376.0 C 314 376.0 354 414 354 462 C 354 522 310 568.0 256.0 568.0 C 202 568.0 158 522 158 462 C 158 414 198 376.0 256.0 376.0 Z" fill={PALETA.carcasa} />
            <g clipPath={`url(#emiCuerpo${uid})`}>
              <rect
                x="158" y="376"
                width="196" height="94"
                fill={PALETA.visera}
              />
              <circle cx="206" cy="432" r="7" fill={PALETA.carcasa} opacity="0.45" />
              <circle cx="306" cy="432" r="7" fill={PALETA.carcasa} opacity="0.45" />
            </g>
            <circle cx="256" cy="462" r="38" fill={PALETA.carcasa} />
            <circle cx="256" cy="462" r="34" fill={PALETA.pectoral} />
            <circle cx="256" cy="528" r="11" fill={PALETA.pectoral} opacity="0.55" />
          </>
        )}

        {/* Antena · remata en El Nucleo */}
        <path
          d="M 256 96 L 256 56"
          stroke={PALETA.visera}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="256" cy="40" r="21" fill={PALETA.nucleo} />

        {/* Auriculares */}
        <rect x="84" y="176" width="36" height="84" rx="18" fill={PALETA.visera} />
        <rect x="392" y="176" width="36" height="84" rx="18" fill={PALETA.visera} />
        <rect x="91" y="198" width="22" height="40" rx="11" fill={PALETA.sensor} />
        <rect x="399" y="198" width="22" height="40" rx="11" fill={PALETA.sensor} />

        {/* Cabeza */}
        <rect
          x="112" y="94"
          width="288" height="246"
          rx="86" ry="86"
          fill={PALETA.carcasa}
        />
        <g clipPath={`url(#emiCabeza${uid})`}>
          <rect x="112" y="94" width="288" height="62" fill={PALETA.visera} />
        </g>
        <circle cx="256" cy="124" r="15" fill={PALETA.sensor} />

        {/* Pantalla y rostro */}
        <rect
          x="148" y="168"
          width="216" height="148"
          rx="54" ry="54"
          fill={PALETA.pantalla}
        />
        <g fill="none" stroke={PALETA.brillo} strokeWidth="3.5" strokeLinecap="round" opacity="0.5">
          <path d="M 164.0 197.0 L 164.0 184.0 L 177.0 184.0" />
          <path d="M 335.0 184.0 L 348.0 184.0 L 348.0 197.0" />
          <path d="M 164.0 287.0 L 164.0 300.0 L 177.0 300.0" />
          <path d="M 335.0 300.0 L 348.0 300.0 L 348.0 287.0" />
        </g>
        {ROSTROS[expresion]}
      </g>
    </svg>
  );
}

export default Emi;
