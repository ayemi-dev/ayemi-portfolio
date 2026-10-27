import { useTranslation } from 'react-i18next';
import { Boton } from '../../components/ui/Boton';
import { Microetiqueta } from '../../components/marca/Logotipo';
import { BienvenidaEmi } from '../../components/marca/GuiaEmi';
import { RUTA_PORTAFOLIO } from '../../config/secciones';
import {
  IconoComprobacion,
  IconoFlujo,
  IconoNucleo,
} from '../../components/marca/Iconos';

/**
 * Portada
 * Manual de Identidad Corporativa Ayemi · Edición 2.0
 *
 * QUÉ SE CORRIGIÓ RESPECTO DE LA VERSIÓN ANTERIOR
 *
 * §3.5 · El titular llevaba un degradado azul→cian sobre el texto. NORMA:
 *   ningún texto se coloca sobre el degradado, porque la luminosidad varía a
 *   lo largo del recorrido y no hay forma de garantizar contraste. §3.8 fija
 *   el recurso correcto: la palabra clave del titular va en cian plano.
 *
 * §5.3 · El botón principal era un degradado con texto blanco. NORMA: el texto
 *   del botón primario sobre Cian 500 va en Grafito 900 (9.12:1). Nunca blanco
 *   sobre cian (2.06:1, insuficiente). Lo resuelve <Boton variante="primario">.
 *
 * §3.12 · La segunda columna era un editor de código simulado con cadenas en
 *   verde. La tabla de fotografía e ilustración lo pone en la columna «NO»:
 *   «pantallas falsas de código verde». En su lugar entran las tres pruebas
 *   concretas de la propuesta de valor (§1.6) y un dato técnico verificable
 *   en monoespaciada (§3.8).
 *
 * §3.13 · Los distintivos flotantes usaban `animate-bounce` y `animate-pulse`.
 *   NORMA: «Nada rebota. Sin bounce, sin elastic, sin sobreimpulso.»
 *
 * §3.7 · Todos los tamaños salen de la escala de doce peldaños.
 * §5.5 · Un solo h1 por vista.
 */

const PRUEBAS = [
  { clave: 'llaves', Icono: IconoNucleo },
  { clave: 'rango', Icono: IconoFlujo },
  { clave: 'traspaso', Icono: IconoComprobacion },
];

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingBlock: 'var(--ay-esp-24) var(--ay-esp-16)' }}
    >
      {/* §3.11 · Textura de marca por debajo del contenido y a opacidad
          reducida. Retícula de Nodos: malla con los nodos encendidos en cian.
          NORMA: entre 10 % y 30 % de opacidad, y nunca bajo bloques de
          lectura, así que se confina a la mitad superior y va por detrás. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--ay-acento) 1px, transparent 0)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      <div
        className="relative mx-auto max-w-2xl"
        style={{ paddingInline: 'var(--ay-margen)' }}
      >
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── Columna de mensaje ───────────────────────────────────────── */}
          <div>
            <Microetiqueta>{t('hero.etiqueta')}</Microetiqueta>

            {/* §3.7 · display-l en móvil, display-xl en escritorio. Ambos
                peldaños traen su propio tracking negativo e interlínea. */}
            <h1 className="mt-4 text-display-l md:text-display-xl">
              {t('hero.tituloAntes')}
              <span className="text-acento">{t('hero.tituloAcento')}</span>
              {t('hero.tituloDespues')}
            </h1>

            {/* §5.2 · Medida de línea entre 60 y 80 caracteres */}
            <p className="mt-6 max-w-lectura text-cuerpo-l text-texto-suave">
              {t('hero.descripcion')}
            </p>

            {/* §5.3 · Una sola acción principal por vista */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Boton variante="primario" tamano="grande" to="/#contacto">
                {t('hero.botonPrimario')}
              </Boton>
              <Boton variante="secundario" tamano="grande" to={RUTA_PORTAFOLIO}>
                {t('hero.botonSecundario')}
              </Boton>
            </div>
          </div>

          {/* ── Columna de Emi ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* §7 · Pantalla de bienvenida: pose `saludando`, expresión
                `feliz`, alto entre 220 y 320 px. El contrato tiene entrada
                propia para este caso, así que Emi aquí no es una licencia.

                Emi presenta; no vende. La promesa la hace el h1 de al lado y la
                firma la lleva el logotipo de la cabecera: Emi nunca sustituye
                al logotipo. */}
            <BienvenidaEmi alto={240} pie={t('hero.emiPie')}>
              {t('hero.emiSaludo')}
            </BienvenidaEmi>

            {/* ── Lo que recibes ─────────────────────────────────────────── */}
            {/* §8 Tarjetas: superficie, borde 1 px, radio 10 px, relleno 24 px,
                sin sombra en reposo. En tema oscuro la jerarquía se construye
                con luminosidad, no con sombras. */}
            <div className="rounded-lg border border-borde bg-superficie p-6">
              {/* §11 · Sin saltos de nivel: la microetiqueta del panel es el h2
                  que encabeza las pruebas, que van en h3. */}
              <h2>
                <Microetiqueta>{t('hero.panelEtiqueta')}</Microetiqueta>
              </h2>

              <ul className="mt-6 flex flex-col gap-6">
                {PRUEBAS.map((prueba) => {
                  const Pictograma = prueba.Icono;
                  const { clave } = prueba;

                  return (
                    <li key={clave} className="flex gap-4">
                      <Pictograma
                        tamano={24}
                        className="mt-1 shrink-0 text-acento"
                      />
                      <div>
                        <h3 className="text-titulo-4">
                          {t(`hero.pruebas.${clave}Titulo`)}
                        </h3>
                        <p className="mt-1 text-cuerpo-s text-texto-suave">
                          {t(`hero.pruebas.${clave}Texto`)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* §8 Tablas y datos · un solo filete horizontal de 1 px.
                  §5 Dato técnico · monoespaciada, en Verde Señal. */}
              <p className="mt-6 flex flex-wrap items-baseline gap-2 border-t border-borde pt-4 font-mono text-micro">
                <span className="text-texto-tenue">{t('hero.datoEstado')}</span>
                <span className="text-exito">{t('hero.datoValor')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
