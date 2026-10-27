import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { rutaDePieza } from '../../config/piezas';

/**
 * El Tablero
 * Manual de Identidad Ayemi · Edición 2.0 · §2.1, §2.2 y §3.11
 *
 * §3.11 define el patrón «Vías»: traza en escalera con nodos en cada codo. Es,
 * literalmente, una pista de circuito impreso. Aquí deja de ser textura y pasa
 * a ser estructura: cada línea de producción es una Vía y cada plaza es un
 * Núcleo sobre ella.
 *
 * §2.1 · «La energía entra por el Núcleo, recorre la Vía y la palabra queda
 * encendida.» El tablero lo aplica: la Vía va encendida en cian hasta la última
 * plaza ocupada y tenue a partir de ahí. El avance de la línea se lee sin
 * necesidad de un porcentaje.
 *
 * ESTADOS DE PLAZA
 *   entregada  Núcleo sólido en cian. §2.2: círculo sólido, nunca un anillo.
 *   en-curso   Anillo en cian con el pulso del núcleo.
 *   libre      Contorno tenue en grafito. No es interactivo y se rotula como
 *              plaza libre: no finge un proyecto (§1.10, regla 4).
 *
 * ARQUITECTURA
 * La Vía se dibuja en SVG y es decorativa (aria-hidden). Los Núcleos son
 * elementos HTML: así los rótulos usan la escala tipográfica real y las plazas
 * ocupadas son enlaces de verdad, con su anillo de foco (§5.4).
 *
 * En escritorio la Vía corre horizontal en escalera. En móvil corre vertical y
 * las plazas se leen como una cola de producción, que es lo que funciona en una
 * pantalla estrecha.
 */

/* ── Geometría de la traza (§3.11) ─────────────────────────────────────────── */

const LIENZO = { ancho: 1000, alto: 200 };
const FILA_ALTA = 60;
const FILA_BAJA = 140;
/** Tramo horizontal antes de que la traza suba o baje. */
const ANTES_DEL_CODO = 60;

/** Coordenada de cada plaza. Las filas alternan, de ahí la escalera. */
const coordenadaDePlaza = (indice, total) => {
  const paso = LIENZO.ancho / total;
  return {
    x: paso * (indice + 0.5),
    y: indice % 2 === 0 ? FILA_ALTA : FILA_BAJA,
  };
};

/**
 * Traza en escalera con codos a 45°, como se rutea una pista real.
 * Entre dos plazas: tramo recto, diagonal de 45° y tramo recto hasta la
 * siguiente.
 */
function trazarVia(puntos, hastaElBorde = true) {
  if (puntos.length === 0) return '';

  let d = `M 0 ${puntos[0].y} L ${puntos[0].x} ${puntos[0].y}`;

  for (let i = 0; i < puntos.length - 1; i += 1) {
    const a = puntos[i];
    const b = puntos[i + 1];
    const salto = Math.abs(b.y - a.y);
    const inicioDiagonal = a.x + ANTES_DEL_CODO;
    const finDiagonal = inicioDiagonal + salto; // dx = dy → 45°

    d += ` L ${inicioDiagonal} ${a.y} L ${finDiagonal} ${b.y} L ${b.x} ${b.y}`;
  }

  if (hastaElBorde) {
    d += ` L ${LIENZO.ancho} ${puntos[puntos.length - 1].y}`;
  }

  return d;
}

/* ── Núcleo de una plaza ───────────────────────────────────────────────────── */

const DIAMETRO = { entregada: 26, 'en-curso': 26, libre: 18 };

const NucleoPlaza = ({ estado }) => {
  const lado = DIAMETRO[estado] ?? DIAMETRO.libre;

  if (estado === 'entregada') {
    /* §2.2 · El Núcleo es un círculo sólido. Un anillo con hueco se cierra por
       debajo de 24 px y produce una mancha sucia. */
    return (
      <span
        className="block rounded-completo bg-acento transition-transform duration-rapida ease-estandar group-hover:scale-125"
        style={{ width: lado, height: lado }}
      />
    );
  }

  if (estado === 'en-curso') {
    return (
      <span
        className="relative block rounded-completo border-2 border-acento bg-lienzo transition-transform duration-rapida ease-estandar group-hover:scale-125"
        style={{ width: lado, height: lado }}
      >
        <span
          className="ay-anim-nucleo-pulso absolute -inset-2 rounded-completo border border-acento"
          style={{ animationDuration: '2.4s' }}
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span
      className="block rounded-completo border border-dashed border-borde-fuerte bg-lienzo"
      style={{ width: lado, height: lado }}
    />
  );
};

/* ── Plaza: enlace si está ocupada, rótulo si está libre ───────────────────── */

const Plaza = ({ plaza, className = '', style, orientacion = 'vertical' }) => {
  const { t } = useTranslation();
  const libre = plaza.estado === 'libre';

  const rotulo = libre
    ? t('fabrica.plazaLibre')
    : plaza.titulo;

  const contenido = (
    <>
      <NucleoPlaza estado={plaza.estado} />

      <span
        className={
          orientacion === 'vertical'
            ? 'mt-3 flex flex-col items-center text-center'
            : 'flex flex-col'
        }
      >
        <span
          className={[
            'text-micro',
            libre ? 'font-mono text-texto-tenue' : 'font-sans text-texto',
            orientacion === 'vertical' && 'max-w-32',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {rotulo}
        </span>

        {/* §5.5 · El estado no depende solo del color: va rotulado. */}
        {plaza.estado === 'en-curso' && (
          <span className="font-mono text-micro text-acento">
            {t('fabrica.estados.en-curso')}
          </span>
        )}

        {/* Marca ajena. Se rotula ya en el tablero, no solo dentro de la ficha:
            quien lo escanea sin abrir nada no debe suponer que la pieza es de
            Ayemi. La atribución completa está en la ficha. */}
        {!libre && plaza.cliente && (
          <span className="font-mono text-micro text-texto-tenue">
            {t('fabrica.paraCliente', { cliente: plaza.cliente.nombre })}
          </span>
        )}

        {!libre && plaza.sector && orientacion === 'horizontal' && (
          <span className="font-mono text-micro text-texto-tenue">
            {plaza.sector}
          </span>
        )}
      </span>
    </>
  );

  const clasesComunes = [
    'group flex',
    orientacion === 'vertical' ? 'flex-col items-center' : 'items-center gap-4',
    className,
  ].join(' ');

  if (libre) {
    return (
      <div className={clasesComunes} style={style}>
        {contenido}
      </div>
    );
  }

  return (
    <Link
      to={rutaDePieza(plaza.slug)}
      className={`${clasesComunes} rounded-md`}
      style={style}
    >
      {contenido}
    </Link>
  );
};

/* ── Escritorio: la Vía en escalera ────────────────────────────────────────── */

const TrazaHorizontal = ({ plazas }) => {
  const puntos = plazas.map((_, i) => coordenadaDePlaza(i, plazas.length));

  /* La Vía va encendida hasta la última plaza ocupada (§2.1). */
  const ultimaOcupada = plazas.reduce(
    (ultima, plaza, i) => (plaza.estado !== 'libre' ? i : ultima),
    -1
  );
  const encendida = ultimaOcupada >= 0 ? puntos.slice(0, ultimaOcupada + 1) : [];

  return (
    <div className="relative w-full" style={{ aspectRatio: '1000 / 200' }}>
      <svg
        viewBox={`0 0 ${LIENZO.ancho} ${LIENZO.alto}`}
        className="absolute inset-0 h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {/* Tramo por recorrer */}
        <path
          d={trazarVia(puntos)}
          stroke="var(--ay-borde-fuerte)"
          strokeWidth={3}
        />
        {/* Tramo encendido: la corriente que ya pasó */}
        {encendida.length > 0 && (
          <path
            d={trazarVia(encendida, false)}
            stroke="var(--ay-acento)"
            strokeWidth={3}
          />
        )}
      </svg>

      {plazas.map((plaza, i) => {
        const { x, y } = coordenadaDePlaza(i, plazas.length);
        const lado = DIAMETRO[plaza.estado] ?? DIAMETRO.libre;

        return (
          <Plaza
            key={plaza.slug ?? `libre-${plaza.indice}`}
            plaza={plaza}
            orientacion="vertical"
            className="absolute -translate-x-1/2"
            /* El desplazamiento vertical de medio Núcleo deja su centro
               exactamente sobre la traza. */
            style={{
              left: `${(x / LIENZO.ancho) * 100}%`,
              top: `calc(${(y / LIENZO.alto) * 100}% - ${lado / 2}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ── Móvil: la Vía vertical, como cola de producción ──────────────────────── */

const TrazaVertical = ({ plazas }) => (
  <ol className="relative flex flex-col gap-8">
    {/* La Vía: un conductor recto que atraviesa la cola. Se sitúa en el eje de
        los Núcleos, cuyo diámetro mayor es 26 px. */}
    <span
      aria-hidden="true"
      className="absolute top-0 bottom-0 w-px bg-borde-fuerte"
      style={{ left: 13 }}
    />

    {plazas.map((plaza) => {
      const lado = DIAMETRO[plaza.estado] ?? DIAMETRO.libre;

      return (
        <li key={plaza.slug ?? `libre-${plaza.indice}`} className="relative">
          <Plaza
            plaza={plaza}
            orientacion="horizontal"
            /* Centra el Núcleo sobre la Vía sea cual sea su diámetro. */
            style={{ paddingLeft: (26 - lado) / 2 }}
          />
        </li>
      );
    })}
  </ol>
);

/* ── Componente público ───────────────────────────────────────────────────── */

export const Tablero = ({ plazas }) => (
  <>
    <div className="hidden lg:block">
      <TrazaHorizontal plazas={plazas} />
    </div>
    <div className="lg:hidden">
      <TrazaVertical plazas={plazas} />
    </div>
  </>
);
