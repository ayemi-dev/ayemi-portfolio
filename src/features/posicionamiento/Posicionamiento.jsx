import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';

/**
 * Posicionamiento
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §1.7 y §1.8
 *
 * §1.8 · La declaración de posicionamiento y las tres comparaciones: frente al
 * freelance, frente a la agencia grande y frente al software de estantería.
 *
 * §1.7 · A quién servimos, con lo que le duele a cada público. Consecuencia
 * para la comunicación: ninguno de los tres públicos es programador, así que el
 * qué y el para qué se dicen en el idioma del negocio.
 *
 * NORMA (§5.3). Las tablas no llevan líneas verticales. Solo un filete
 * horizontal de 1 px en --ay-borde entre filas.
 *
 * §3.9 · La declaración entra en registro editorial con Instrument Serif: es
 * una declaración de propósito, uno de los tres casos que el manual autoriza.
 */

const FRENTES = ['freelance', 'agencia', 'estanteria'];
const PUBLICOS = ['primario', 'secundario', 'terciario'];

export const Posicionamiento = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="posicionamiento"
      etiqueta={t('posicionamiento.etiqueta')}
      titulo={t('posicionamiento.titulo')}
      acento={t('posicionamiento.acento')}
      tituloDespues={t('posicionamiento.tituloDespues')}
      guia={t('posicionamiento.guiaEmi')}
    >
      {/* ── Declaración en registro editorial (§3.9) ───────────────────────── */}
      {/* NORMA §3.9 · El serif no se mezcla con la sans en la misma línea ni en
          el mismo titular: se alternan por bloques. Este es su bloque.
          RECOMENDACIÓN §3.9 · Un titular en serif pide más aire alrededor. */}
      <blockquote className="max-w-lectura border-l-2 border-acento pl-6">
        <p className="font-serif text-titulo-2 text-texto md:text-titulo-1">
          {t('posicionamiento.declaracion')}
        </p>
      </blockquote>

      {/* ── Frente a qué (§1.8) ────────────────────────────────────────────── */}
      <div className="mt-24">
        <h3 className="text-titulo-2">{t('posicionamiento.frenteTitulo')}</h3>

        <dl className="mt-8">
          {FRENTES.map((frente) => (
            <div
              key={frente}
              /* §5.3 · Solo filete horizontal entre filas, sin verticales. */
              className="grid gap-2 border-t border-borde py-6 md:grid-cols-3 md:gap-8"
            >
              <dt className="font-mono text-etiqueta uppercase text-texto-tenue">
                {t(`posicionamiento.frente.${frente}.quien`)}
              </dt>
              <dd className="text-cuerpo text-texto md:col-span-2">
                {t(`posicionamiento.frente.${frente}.ventaja`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── A quién servimos (§1.7) ────────────────────────────────────────── */}
      <div className="mt-24">
        <h3 className="text-titulo-2">{t('posicionamiento.publicoTitulo')}</h3>
        <p className="mt-3 max-w-lectura text-cuerpo text-texto-suave">
          {t('posicionamiento.publicoEntradilla')}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {PUBLICOS.map((publico) => (
            <div key={publico}>
              <div className="h-px w-12 bg-acento" />

              <h4 className="mt-6 text-titulo-4">
                {t(`posicionamiento.publico.${publico}.quien`)}
              </h4>

              <div className="mt-4">
                <span className="ay-etiqueta">
                  {t('posicionamiento.queLeDuele')}
                </span>
                <p className="mt-1 text-cuerpo-s text-texto-suave">
                  {t(`posicionamiento.publico.${publico}.duele`)}
                </p>
              </div>

              <div className="mt-4">
                <span className="ay-etiqueta">
                  {t('posicionamiento.queEspera')}
                </span>
                <p className="mt-1 text-cuerpo-s text-texto-suave">
                  {t(`posicionamiento.publico.${publico}.espera`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Seccion>
  );
};
