import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Isotipo, Microetiqueta } from '../../components/marca/Logotipo';
import { GuiaEmi } from '../../components/marca/GuiaEmi';
import {
  IconoCerrar,
  IconoFlechaDerecha,
  IconoFlechaIzquierda,
} from '../../components/marca/Iconos';

/**
 * Capacidad técnica · sistema orbital
 * Manual de Identidad Corporativa Ayemi · Edición 2.0
 *
 * QUÉ SE CORRIGIÓ RESPECTO DE LA VERSIÓN ANTERIOR
 *
 * §3.1 · Cada categoría tenía un color propio inventado, fuera de la paleta.
 *   NORMA: «Todos los colores salen de la paleta», y el
 *   reparto cromático de referencia es 60 % grafito, 30 % grises y 10 % cian
 *   como acento. Siete colores simultáneos son exactamente el «carnaval» que
 *   el manual advierte. El acento pasa a ser uno solo: Cian Ayemi. La
 *   categoría activa se distingue por texto, borde y fondo, no por matiz, lo
 *   que además satisface la independencia del color (§5.5).
 *
 * §2.5 · El núcleo central usaba el isotipo de circuito, que es la Opción A
 *   descartada en la edición 1.0. Ahora usa el monograma monolineal vigente.
 *
 * §3.7 · Había tamaños de 8, 9 y 11 px y utilidades text-4xl/text-xs. NORMA:
 *   «No se usa ningún tamaño fuera de esta escala». Las etiquetas de nodo
 *   suben al peldaño `micro` (12 px) en escritorio; en móvil los nodos van sin
 *   texto, con nombre accesible por aria-label y detalle al tocar.
 *
 * §5.3 · Los halos de color desenfocado detrás de cada tarjeta se retiran: en
 *   tema oscuro la jerarquía se construye con luminosidad, no con sombras. El
 *   hover eleva el tono de la superficie.
 *
 * §3.13 · Se respeta prefers-reduced-motion: las órbitas se detienen del todo,
 *   resuelto en global.css.
 *
 * NOTA · Los pictogramas de cada tecnología son marcas de terceros servidas
 * desde Simple Icons. No forman parte de la familia iconográfica de Ayemi
 * (§3.10) ni se recolorean: son logotipos ajenos y se reproducen como son.
 */

/* ── Catálogo ─────────────────────────────────────────────────────────────── */

/** La clave de i18n vive en `stack.categorias.<id>` (§1.10). */
const CATEGORIAS = [
  { id: 'frontend' },
  { id: 'backend' },
  { id: 'datos' },
  { id: 'nube' },
  { id: 'embebido' },
  { id: 'electronica' },
  { id: 'cad' },
];

const TECNOLOGIAS = [
  // Interfaz
  { nombre: 'React', slug: 'react', hex: '61DAFB', cat: 'frontend' },
  { nombre: 'Next.js', slug: 'nextdotjs', hex: 'E2E8F0', cat: 'frontend' },
  { nombre: 'TypeScript', slug: 'typescript', hex: '3178C6', cat: 'frontend' },
  { nombre: 'JavaScript', slug: 'javascript', hex: 'F7DF1E', cat: 'frontend' },
  { nombre: 'HTML5', slug: 'html5', hex: 'E34F26', cat: 'frontend' },
  { nombre: 'CSS3', slug: 'css3', hex: '1572B6', cat: 'frontend' },
  { nombre: 'Tailwind CSS', slug: 'tailwindcss', hex: '06B6D4', cat: 'frontend' },
  // Servicios y APIs
  { nombre: 'Node.js', slug: 'nodedotjs', hex: '339933', cat: 'backend' },
  { nombre: 'Express', slug: 'express', hex: 'C8D6E5', cat: 'backend' },
  { nombre: 'Python', slug: 'python', hex: '3776AB', cat: 'backend' },
  { nombre: 'FastAPI', slug: 'fastapi', hex: '009688', cat: 'backend' },
  { nombre: 'MQTT', slug: 'eclipsemosquitto', hex: '3C5280', cat: 'backend' },
  { nombre: 'WebSockets', slug: 'socketdotio', hex: '25C2A0', cat: 'backend' },
  { nombre: 'REST', slug: 'openapiinitiative', hex: '6BA539', cat: 'backend' },
  // Bases de datos
  { nombre: 'MySQL', slug: 'mysql', hex: '4479A1', cat: 'datos' },
  { nombre: 'PostgreSQL', slug: 'postgresql', hex: '4169E1', cat: 'datos' },
  { nombre: 'MongoDB', slug: 'mongodb', hex: '47A248', cat: 'datos' },
  { nombre: 'Redis', slug: 'redis', hex: 'DC382D', cat: 'datos' },
  // Nube y despliegue
  { nombre: 'Azure', slug: 'microsoftazure', hex: '0078D4', cat: 'nube' },
  { nombre: 'AWS', slug: 'amazonwebservices', hex: 'FF9900', cat: 'nube' },
  { nombre: 'GCP', slug: 'googlecloud', hex: '4285F4', cat: 'nube' },
  { nombre: 'Oracle Cloud', slug: 'oracle', hex: 'F80000', cat: 'nube' },
  { nombre: 'Docker', slug: 'docker', hex: '2496ED', cat: 'nube' },
  { nombre: 'Git', slug: 'git', hex: 'F05032', cat: 'nube' },
  { nombre: 'GitHub', slug: 'github', hex: 'E2E8F0', cat: 'nube' },
  { nombre: 'Vite', slug: 'vite', hex: '646CFF', cat: 'nube' },
  { nombre: 'Vercel', slug: 'vercel', hex: 'E2E8F0', cat: 'nube' },
  { nombre: 'VS Code', slug: 'visualstudiocode', hex: '007ACC', cat: 'nube' },
  // Embebido e IoT
  { nombre: 'ESP32', slug: 'espressif', hex: 'E7352C', cat: 'embebido' },
  { nombre: 'ESP8266', slug: 'espressif', hex: 'E7352C', cat: 'embebido' },
  { nombre: 'Arduino', slug: 'arduino', hex: '00979D', cat: 'embebido' },
  { nombre: 'STM32', slug: 'stmicroelectronics', hex: '03234B', cat: 'embebido' },
  { nombre: 'AVR / ATmega', slug: 'microchip', hex: 'EE3233', cat: 'embebido' },
  { nombre: 'PlatformIO', slug: 'platformio', hex: 'F5822A', cat: 'embebido' },
  { nombre: 'C / C++', slug: 'cplusplus', hex: '00599C', cat: 'embebido' },
  { nombre: 'MicroPython', slug: 'micropython', hex: '2B2728', cat: 'embebido' },
  { nombre: 'LoRaWAN', slug: 'loraw', hex: '0A7F98', cat: 'embebido' },
  { nombre: 'Modbus / RS-485', slug: 'modbus', hex: '006F9E', cat: 'embebido' },
  { nombre: 'Raspberry Pi', slug: 'raspberrypi', hex: 'A22846', cat: 'embebido' },
  { nombre: 'FreeRTOS', slug: 'freertos', hex: '00A896', cat: 'embebido' },
  // Electrónica
  { nombre: 'KiCad', slug: 'kicad', hex: '314CB0', cat: 'electronica' },
  { nombre: 'Altium', slug: 'altiumdesigner', hex: 'A5915F', cat: 'electronica' },
  { nombre: 'Diseño PCB', slug: 'hackster', hex: '2E9FE6', cat: 'electronica' },
  { nombre: 'Analógica', slug: 'electron', hex: '47848F', cat: 'electronica' },
  { nombre: 'I2C / SPI / UART', slug: 'uart', hex: 'EB0443', cat: 'electronica' },
  { nombre: 'Sensores', slug: 'homeassistant', hex: '18BCF2', cat: 'electronica' },
  // Diseño 3D y CAD
  { nombre: 'Fusion 360', slug: 'autodesk', hex: '0696D7', cat: 'cad' },
  { nombre: 'Impresión 3D', slug: 'ultimaker', hex: '2AAFE4', cat: 'cad' },
  { nombre: 'Blender', slug: 'blender', hex: 'E87D0D', cat: 'cad' },
  { nombre: 'Modelado', slug: 'sketchup', hex: '005F9E', cat: 'cad' },
  { nombre: 'Figma', slug: 'figma', hex: 'F24E1E', cat: 'cad' },
];

/* ── Órbitas ──────────────────────────────────────────────────────────────── */

/**
 * Configuración de los tres anillos. Los diámetros se expresan en píxeles
 * porque son medidas de lienzo, no de maquetación, así que no están sujetos a
 * la escala de espaciado de 4 px.
 */
const ANILLOS = [
  { capacidad: 6, escritorio: 340, movil: 168, duracion: '28s', inverso: false },
  { capacidad: 9, escritorio: 540, movil: 264, duracion: '50s', inverso: true },
  { capacidad: 12, escritorio: 740, movil: 360, duracion: '72s', inverso: false },
];

const CAPACIDAD_TOTAL = ANILLOS.reduce((suma, a) => suma + a.capacidad, 0);

/**
 * Reparte las tecnologías en anillos.
 * El reparto es proporcional a la capacidad de cada anillo, de modo que no
 * queden anillos con un solo nodo mientras el interior va lleno.
 */
function repartirEnAnillos(tecnologias) {
  const total = tecnologias.length;
  if (total === 0) return [];

  const numeroDeAnillos = total <= 6 ? 1 : total <= 14 ? 2 : 3;
  const usados = ANILLOS.slice(0, numeroDeAnillos);
  const capacidadUsada = usados.reduce((suma, a) => suma + a.capacidad, 0);

  const restantes = [...tecnologias];
  return usados.map((anillo, indice) => {
    const esUltimo = indice === usados.length - 1;
    const cuantos = esUltimo
      ? restantes.length
      : Math.max(1, Math.round((total * anillo.capacidad) / capacidadUsada));

    const tramo = restantes.splice(0, cuantos);
    const paso = 360 / tramo.length;
    return tramo.map((tecnologia, j) => ({ ...tecnologia, angulo: j * paso }));
  });
}

/** Estrellas deterministas: la secuencia no debe cambiar entre renders. */
const ESTRELLAS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  left: `${(i * 137.508) % 100}%`,
  top: `${(i * 97.314) % 100}%`,
  lado: i % 6 === 0 ? 2 : 1,
  retardo: `${(i * 0.41) % 5}s`,
  duracion: `${2.5 + (i % 4) * 0.5}s`,
}));

const urlPictograma = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`;

/* ── Nodo ─────────────────────────────────────────────────────────────────── */

/**
 * Nodo del sistema orbital.
 * §5.3 Tarjetas · fondo de superficie, borde de 1 px, radio de tarjeta. El
 * hover eleva el tono en lugar de proyectar sombra.
 */
function NodoTecnologia({ tecnologia, conEtiqueta, onClick }) {
  const Elemento = onClick ? 'button' : 'div';

  return (
    <Elemento
      {...(onClick
        ? { type: 'button', onClick, 'aria-label': tecnologia.nombre }
        : {})}
      className={[
        'flex flex-col items-center gap-1 rounded-lg border border-borde',
        'bg-superficie/85 backdrop-blur-sm',
        'transition-colors duration-rapida ease-estandar',
        'hover:border-borde-fuerte hover:bg-superficie-elevada',
        conEtiqueta ? 'px-3 py-2' : 'p-2',
      ].join(' ')}
    >
      <img
        src={urlPictograma(tecnologia.slug, tecnologia.hex)}
        alt={conEtiqueta ? '' : tecnologia.nombre}
        width={conEtiqueta ? 24 : 20}
        height={conEtiqueta ? 24 : 20}
        loading="lazy"
        className={conEtiqueta ? 'h-6 w-6' : 'h-5 w-5'}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
      {conEtiqueta && (
        /* §3.7 · peldaño `micro`, el menor de la escala con texto corrido */
        <span className="font-sans text-micro whitespace-nowrap text-texto-suave">
          {tecnologia.nombre}
        </span>
      )}
    </Elemento>
  );
}

/** Un anillo con sus nodos, que se mantienen siempre a nivel. */
function AnilloOrbital({ tecnologias, anillo, diametro, conEtiqueta, onNodo }) {
  const claseAnillo = anillo.inverso
    ? 'ay-anim-orbita-inversa'
    : 'ay-anim-orbita';
  const claseNodo = anillo.inverso
    ? 'ay-anim-nodo-antihorario'
    : 'ay-anim-nodo-horario';

  return (
    <div
      className={`absolute rounded-completo border border-dashed ${claseAnillo}`}
      style={{
        width: diametro,
        height: diametro,
        animationDuration: anillo.duracion,
        borderColor: 'color-mix(in oklab, var(--ay-acento) 22%, transparent)',
      }}
    >
      {tecnologias.map((tecnologia) => (
        <div
          key={tecnologia.nombre}
          className="absolute top-0 left-1/2 flex h-full w-0 justify-center"
          style={{ transform: `translateX(-50%) rotate(${tecnologia.angulo}deg)` }}
        >
          <div
            className={`absolute top-0 ${claseNodo}`}
            style={{ animationDuration: anillo.duracion }}
          >
            {/* Cancela el ángulo estático del brazo para que el nodo se lea
                horizontal, igual que la marca (§2.15: nunca inclinada). */}
            <div style={{ transform: `rotate(${-tecnologia.angulo}deg)` }}>
              <NodoTecnologia
                tecnologia={tecnologia}
                conEtiqueta={conEtiqueta}
                onClick={onNodo ? () => onNodo(tecnologia) : undefined}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Núcleo central (§2.2 y §2.5).
 * El Núcleo reaparece aquí como nodo emisor, que es exactamente lo que el
 * manual prescribe: el círculo es la firma geométrica de todo el sistema.
 */
function NucleoAyemi({ grande = true }) {
  const anillos = grande
    ? [
        { lado: 'h-36 w-36', dur: '4s', retardo: '0s' },
        { lado: 'h-24 w-24', dur: '2.8s', retardo: '0.7s' },
        { lado: 'h-16 w-16', dur: '2s', retardo: '0.3s' },
      ]
    : [
        { lado: 'h-24 w-24', dur: '4s', retardo: '0s' },
        { lado: 'h-16 w-16', dur: '2.8s', retardo: '0.7s' },
        { lado: 'h-11 w-11', dur: '2s', retardo: '0.3s' },
      ];

  return (
    <div className="absolute z-30 flex items-center justify-center">
      {anillos.map((anillo) => (
        <div
          key={anillo.lado}
          aria-hidden="true"
          className={`ay-anim-nucleo-pulso absolute rounded-completo border border-acento/25 ${anillo.lado}`}
          style={{ animationDuration: anillo.dur, animationDelay: anillo.retardo }}
        />
      ))}
      {/* §2.15 · La marca no lleva resplandor ni sombra: solo el borde de
          acento y la superficie elevada la separan del lienzo. */}
      <div
        className={`relative flex items-center justify-center rounded-completo border border-acento bg-superficie-elevada ${
          grande ? 'h-16 w-16' : 'h-11 w-11'
        }`}
      >
        <Isotipo tamano={grande ? 32 : 24} />
      </div>
    </div>
  );
}

/* ── Hoja de detalle (móvil) ──────────────────────────────────────────────── */

function HojaDetalle({ tecnologia, categoria, onCerrar }) {
  const { t } = useTranslation();
  const botonCerrar = useRef(null);

  /* §5.5 · Navegación real por teclado: Escape cierra y el foco entra en la
     hoja al abrirse. */
  useEffect(() => {
    if (!tecnologia) return;
    const alPulsar = (evento) => {
      if (evento.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', alPulsar);
    botonCerrar.current?.focus();
    return () => document.removeEventListener('keydown', alPulsar);
  }, [tecnologia, onCerrar]);

  if (!tecnologia) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Velo (§2.14 recurso 2): Grafito 950 a opacidad alta. */}
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-grafito-950/70 backdrop-blur-sm"
        onClick={onCerrar}
        aria-label={t('controles.cerrar')}
      />

      {/* §5.2 · Modal: radio 16 px, relleno 24 px. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tecnologia.nombre}
        className="ay-anim-hoja-sube relative w-full rounded-t-xl border-t border-borde bg-superficie-elevada p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-borde bg-superficie">
            <img
              src={urlPictograma(tecnologia.slug, tecnologia.hex)}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-titulo-4 text-texto">{tecnologia.nombre}</h3>
            <Microetiqueta>{categoria}</Microetiqueta>
          </div>
        </div>

        <button
          ref={botonCerrar}
          type="button"
          onClick={onCerrar}
          className="ay-toque mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-borde-fuerte font-sans text-cuerpo-s font-bold text-texto transition-colors duration-rapida ease-estandar hover:bg-superficie"
        >
          <IconoCerrar tamano={16} />
          {t('controles.cerrar')}
        </button>
      </div>
    </div>
  );
}

/* ── Control de carrusel ──────────────────────────────────────────────────── */

function BotonCarrusel({ direccion, onClick, etiqueta, compacto = false }) {
  const Flecha =
    direccion === 'anterior' ? IconoFlechaIzquierda : IconoFlechaDerecha;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className={`ay-toque z-40 flex shrink-0 items-center justify-center rounded-completo border border-borde-fuerte bg-superficie text-acento transition-colors duration-rapida ease-estandar hover:bg-superficie-elevada ${
        compacto ? 'h-10 w-10' : 'absolute h-11 w-11'
      } ${!compacto && direccion === 'anterior' ? 'left-0' : ''} ${
        !compacto && direccion === 'siguiente' ? 'right-0' : ''
      }`}
    >
      <Flecha tamano={20} />
    </button>
  );
}

/* ── Componente principal ─────────────────────────────────────────────────── */

export const TechStack = () => {
  const { t } = useTranslation();
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  /* Los nodos giran mientras se intenta pulsarlos, y eso es un defecto, no un
     detalle. La órbita se detiene en cuanto alguien entra con el teclado o toca
     el lienzo, y se reanuda al salir. En escritorio ya se pausaba al pasar el
     puntero, resuelto por CSS en .ay-pausa-grupo. */
  const [detenida, setDetenida] = useState(false);

  const categoriaActiva = CATEGORIAS[indiceActivo];
  const nombreCategoria = t(`stack.categorias.${categoriaActiva.id}`);

  const tecnologiasCategoria = useMemo(
    () => TECNOLOGIAS.filter((tec) => tec.cat === categoriaActiva.id),
    [categoriaActiva.id]
  );

  const anillos = useMemo(
    () => repartirEnAnillos(tecnologiasCategoria),
    [tecnologiasCategoria]
  );

  const ultimo = Math.max(anillos.length - 1, 0);
  const lienzoEscritorio = ANILLOS[ultimo].escritorio + 220;
  const lienzoMovil = ANILLOS[ultimo].movil + 140;

  const anterior = useCallback(
    () =>
      setIndiceActivo((i) => (i - 1 + CATEGORIAS.length) % CATEGORIAS.length),
    []
  );
  const siguiente = useCallback(
    () => setIndiceActivo((i) => (i + 1) % CATEGORIAS.length),
    []
  );

  return (
    <section
      id="capacidad"
      /* §3.2 · Grafito 850 es el «fondo de sección alterna» del sistema. */
      className="relative flex flex-col items-center overflow-hidden bg-lienzo-alterno"
      style={{ paddingBlock: 'var(--ay-esp-24)' }}
    >
      {/* §3.11 · Textura por debajo del contenido y a opacidad reducida. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {ESTRELLAS.map((estrella) => (
          <span
            key={estrella.id}
            className="ay-anim-destello absolute rounded-completo bg-texto-tenue"
            style={{
              left: estrella.left,
              top: estrella.top,
              width: estrella.lado,
              height: estrella.lado,
              animationDelay: estrella.retardo,
              animationDuration: estrella.duracion,
            }}
          />
        ))}
        <div
          className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-completo"
          style={{
            background:
              'radial-gradient(ellipse, color-mix(in oklab, var(--ay-acento) 7%, transparent) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <div
        className="relative z-20 mx-auto max-w-lectura text-center"
        style={{ paddingInline: 'var(--ay-margen)' }}
      >
        <Microetiqueta>{t('stack.etiqueta')}</Microetiqueta>
        <h2 className="mt-4 text-titulo-1 md:text-display-l">
          {t('stack.tituloAntes')}
          <span className="text-acento">{t('stack.tituloAcento')}</span>
        </h2>
        <p className="mt-4 text-cuerpo text-texto-suave">{t('stack.subtitulo')}</p>

        {/* §7 · Emi conduce también esta sección. Esta no usa <Seccion>, que es
            donde vive la guía en el resto, así que se monta a mano. */}
        <GuiaEmi className="mt-6 justify-center">{t('stack.guiaEmi')}</GuiaEmi>
      </div>

      {/* ── Selector de categoría ──────────────────────────────────────────── */}
      {/* §5.4 · Seleccionado: fondo con el acento al 12 % y borde de acento. */}
      <div
        className="ay-sin-barra relative z-20 mt-12 flex max-w-full gap-2 overflow-x-auto"
        style={{ paddingInline: 'var(--ay-margen)' }}
        role="tablist"
        aria-label={t('stack.etiqueta')}
      >
        {CATEGORIAS.map((categoria, i) => {
          const activa = i === indiceActivo;
          return (
            <button
              key={categoria.id}
              type="button"
              role="tab"
              aria-selected={activa}
              onClick={() => setIndiceActivo(i)}
              className={[
                'ay-toque shrink-0 rounded-completo border px-4 py-2',
                'font-mono text-etiqueta uppercase',
                'transition-colors duration-rapida ease-estandar',
                activa
                  ? 'border-acento bg-acento/12 text-acento'
                  : 'border-borde text-texto-tenue hover:border-borde-fuerte hover:text-texto-suave',
              ].join(' ')}
            >
              {t(`stack.categorias.${categoria.id}`)}
            </button>
          );
        })}
      </div>

      {/* ══ Escritorio ═════════════════════════════════════════════════════ */}
      <div className="relative mt-16 hidden shrink-0 items-center justify-center lg:flex">
        <BotonCarrusel
          direccion="anterior"
          onClick={anterior}
          etiqueta={t('controles.anterior')}
        />

        <div
          className={`ay-pausa-grupo relative flex shrink-0 items-center justify-center ${
            detenida ? 'ay-detenida' : ''
          }`}
          style={{ width: lienzoEscritorio, height: lienzoEscritorio }}
          /* El foco de teclado detiene la órbita: no se puede pedir a nadie que
             acierte a un objetivo en movimiento. */
          onFocusCapture={() => setDetenida(true)}
          onBlurCapture={(evento) => {
            if (!evento.currentTarget.contains(evento.relatedTarget)) {
              setDetenida(false);
            }
          }}
        >
          {anillos.map((tecnologias, i) => (
            <AnilloOrbital
              key={`${categoriaActiva.id}-${i}`}
              tecnologias={tecnologias}
              anillo={ANILLOS[i]}
              diametro={ANILLOS[i].escritorio}
              conEtiqueta
            />
          ))}
          <NucleoAyemi grande />
        </div>

        <BotonCarrusel
          direccion="siguiente"
          onClick={siguiente}
          etiqueta={t('controles.siguiente')}
        />
      </div>

      {/* ══ Móvil ══════════════════════════════════════════════════════════ */}
      <div className="mt-12 flex w-full flex-col items-center lg:hidden">
        <div className="flex w-full items-center justify-center gap-3">
          <BotonCarrusel
            direccion="anterior"
            onClick={anterior}
            etiqueta={t('controles.anterior')}
            compacto
          />

          <div
            className={`relative flex shrink-0 items-center justify-center ${
              detenida ? 'ay-detenida' : ''
            }`}
            style={{ width: lienzoMovil, height: lienzoMovil }}
            /* En táctil no hay hover: el primer toque detiene la órbita para
               que se pueda apuntar, y el segundo abre la pieza. */
            onPointerDown={() => setDetenida(true)}
          >
            {anillos.map((tecnologias, i) => (
              <AnilloOrbital
                key={`movil-${categoriaActiva.id}-${i}`}
                tecnologias={tecnologias}
                anillo={ANILLOS[i]}
                diametro={ANILLOS[i].movil}
                conEtiqueta={false}
                onNodo={setSeleccionada}
              />
            ))}
            <NucleoAyemi grande={false} />
          </div>

          <BotonCarrusel
            direccion="siguiente"
            onClick={siguiente}
            etiqueta={t('controles.siguiente')}
            compacto
          />
        </div>

        <p className="mt-8 font-mono text-micro text-texto-tenue">
          {t('stack.pista')}
        </p>
      </div>

      {/* ── Estado del carrusel ────────────────────────────────────────────── */}
      {/* §3.8 · Dato técnico en monoespaciada. §5.5 · aria-live para anunciar
          el cambio de categoría a quien no lo ve. */}
      <p
        className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-micro text-texto-tenue"
        aria-live="polite"
      >
        <span>
          {t('stack.contadorPosicion', {
            actual: indiceActivo + 1,
            total: CATEGORIAS.length,
          })}
        </span>
        <span aria-hidden="true">·</span>
        <span className="text-acento">{nombreCategoria}</span>
        <span aria-hidden="true">·</span>
        <span>
          {t('stack.contador', { count: tecnologiasCategoria.length })}
        </span>
      </p>

      <HojaDetalle
        tecnologia={seleccionada}
        categoria={nombreCategoria}
        onCerrar={() => {
          setSeleccionada(null);
          /* Cerrada la ficha, la interacción terminó y la órbita se reanuda. */
          setDetenida(false);
        }}
      />
    </section>
  );
};
