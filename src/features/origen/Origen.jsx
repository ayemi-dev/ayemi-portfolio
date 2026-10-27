import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Isotipo } from '../../components/marca/Logotipo';
import { NOMBRE } from '../../components/marca/verbales';
import { PresentacionEmi } from './PresentacionEmi';

/**
 * Origen del nombre
 * Kit de marca Ayemi · AGENTE.md §1
 *
 *   A g u s t í n   ·   Y a z m í n   ·   E m i l i o
 *   A                    Y                 E M I
 *
 * «No es un acrónimo decorativo: es la estructura del nombre y explica por qué
 * la marca habla de confluencia, de corriente y de flujo. Tres orígenes que
 * desembocan en uno.»
 *
 * NORMA DE ESCRITURA (§1). El nombre se escribe en una palabra, con A mayúscula
 * inicial y el resto en minúsculas. La constante `NOMBRE` de `marca/verbales`
 * existe para no teclearlo mal; las variantes incorrectas no se transcriben ni
 * en un comentario.
 *
 * §5 · Este es el bloque de manifiesto, uno de los tres casos donde el contrato
 * autoriza Instrument Serif.
 */

/** Los tres nombres y la parte del nombre de marca que aporta cada uno. */
const NOMBRES = [
  { nombre: 'Agustín', aporta: 'A', resto: 'gustín' },
  { nombre: 'Yazmín', aporta: 'Y', resto: 'azmín' },
  { nombre: 'Emilio', aporta: 'Emi', resto: 'lio' },
];

export const Origen = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="origen"
      etiqueta={t('origen.etiqueta')}
      titulo={t('origen.titulo')}
      acento={t('origen.acento')}
      /* Sin guía: esta sección ya trae la presentación completa de Emi al
         final, y ponerla también en el encabezado la duplicaría. */
      fondo="alterno"
    >
      <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
        <div className="max-w-lectura">
          {/* ── La descomposición del nombre ─────────────────────────────── */}
          {/* La letra que cada nombre aporta va en cian; el resto en texto
              tenue. Es el mismo recurso del logotipo: el acento marca lo que
              conduce (§3.8, la palabra clave en cian). */}
          <ul className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            {NOMBRES.map(({ nombre, aporta, resto }) => (
              <li key={nombre}>
                <p className="text-titulo-2">
                  <span className="text-acento">{aporta}</span>
                  <span className="text-texto-tenue">{resto}</span>
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 font-mono text-etiqueta uppercase text-texto-tenue">
            A · Y · EMI
            <span aria-hidden="true"> → </span>
            <span className="text-acento">AYEMI</span>
          </p>

          {/* ── Manifiesto en registro editorial (§3.9) ───────────────────── */}
          <p className="mt-16 font-serif text-titulo-2 text-texto">
            {t('origen.manifiesto')}
          </p>

          {/* ── Cuerpo ───────────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-col gap-4 text-cuerpo-l text-texto-suave">
            <p>{t('origen.parrafoCasa')}</p>
            <p>{t('origen.parrafoFabrica')}</p>
          </div>

          {/* ── Propósito (§1.2) ─────────────────────────────────────────── */}
          <div className="mt-12 border-t border-borde pt-8">
            <span className="ay-etiqueta">{t('origen.propositoEtiqueta')}</span>
            <p className="mt-3 text-cuerpo-l text-texto">
              {t('origen.proposito')}
            </p>
            <p className="mt-3 text-cuerpo-s text-texto-tenue">
              {t('origen.propositoNota')}
            </p>
          </div>
        </div>

        {/* ── El isotipo como ilustración del concepto ────────────────────── */}
        {/* §2.5 · «El travesaño es La Vía en cian: el flujo que atraviesa la
            estructura.» Aquí el isotipo funciona como marca de agua discreta,
            que es uno de sus usos autorizados. */}
        <div
          className="hidden items-start justify-center lg:flex"
          aria-hidden="true"
        >
          <Isotipo tamano={48} titulo={null} className="opacity-25" />
        </div>
      </div>

      {/* ── Norma de escritura ─────────────────────────────────────────────── */}
      {/* Antes este bloque mostraba las grafías prohibidas tachadas, como
          contraejemplo. Se retiraron: publicarlas mete cuatro variantes mal
          escritas del nombre en el HTML indexable, que es justo lo contrario de
          lo que la norma protege. Queda la forma correcta y la pronunciación. */}
      <div className="mt-24 max-w-lectura border-t border-borde pt-8">
        <span className="ay-etiqueta">{t('origen.normaEtiqueta')}</span>
        <p className="mt-3 text-cuerpo-s text-texto-suave">
          {t('origen.norma')}
        </p>
        <p className="mt-3 font-mono text-micro text-texto-tenue">
          <span className="text-exito">{NOMBRE}</span>
          <span aria-hidden="true"> · </span>
          <span>{t('origen.pronunciacion')}</span>
        </p>
      </div>

      {/* ── Emi ────────────────────────────────────────────────────────────── */}
      {/* Emi viene de Emilio, el tercero de los tres nombres, así que su
          presentación pertenece a esta sección y no a una aparte. */}
      <PresentacionEmi />
    </Seccion>
  );
};
