import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Tarjeta } from '../../components/ui/Tarjeta';
import { PresentacionEmi } from './PresentacionEmi';

/**
 * Quiénes somos
 * Manual de Identidad Corporativa Ayemi · Edición 2.2 · §1.1, §1.2, §1.4 y §4
 *
 * Sustituye a la sección «Origen». NORMA (§1.1): en público Ayemi se presenta
 * como empresa familiar con valores firmes; no se explica la composición del
 * nombre ni se citan nombres de personas.
 *
 * §1.4 · Cuatro valores, cada uno con su consecuencia observable. «Un valor que
 * no se puede verificar no es un valor: es un adorno.» Por eso cada valor se
 * presenta con su «cómo se comprueba», no solo con su nombre.
 *
 * §3.6 · La frase de §1.1 va en Instrument Serif: es una declaración de
 * manifiesto, uno de los tres usos que el manual autoriza. Una sola, de menos
 * de tres líneas, y en redonda: el sitio no carga la cursiva.
 *
 * §4 · Emi se presenta al final. Es la parte de Ayemi que habla con la gente,
 * así que su lugar es junto a quién es la empresa.
 */

const VALORES = ['metodo', 'transparencia', 'flujo', 'permanencia'];

export const QuienesSomos = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="quienes-somos"
      etiqueta={t('quienes.etiqueta')}
      titulo={t('quienes.titulo')}
      acento={t('quienes.acento')}
      tituloDespues={t('quienes.tituloDespues')}
      entradilla={t('quienes.entradilla')}
      guia={t('quienes.guiaEmi')}
      fondo="alterno"
    >
      {/* ── Manifiesto y propósito (§1.1 y §1.2) ───────────────────────────── */}
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <blockquote className="max-w-lectura border-l-2 border-acento pl-6">
          <p className="font-serif text-titulo-2 text-texto md:text-titulo-1">
            {t('quienes.manifiesto')}
          </p>
        </blockquote>

        <div className="max-w-lectura">
          <span className="ay-etiqueta">{t('quienes.propositoEtiqueta')}</span>
          <p className="mt-3 text-cuerpo-l text-texto">
            {t('quienes.proposito')}
          </p>
        </div>
      </div>

      {/* ── Valores (§1.4) ─────────────────────────────────────────────────── */}
      <div className="mt-24">
        <h3 className="text-titulo-2">{t('quienes.valoresTitulo')}</h3>
        <p className="mt-3 max-w-lectura text-cuerpo text-texto-suave">
          {t('quienes.valoresEntradilla')}
        </p>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {VALORES.map((valor) => (
            <Tarjeta como="li" key={valor}>
              <h4 className="text-titulo-4">
                {t(`quienes.valores.${valor}.nombre`)}
              </h4>

              <p className="mt-2 text-cuerpo-s text-texto-suave">
                {t(`quienes.valores.${valor}.significa`)}
              </p>

              {/* §1.4 · La consecuencia observable. Sin esto sería un adorno. */}
              <div className="mt-4 border-t border-borde pt-4">
                <span className="ay-etiqueta">
                  {t('quienes.comoSeComprueba')}
                </span>
                <p className="mt-2 font-mono text-micro text-texto-suave">
                  {t(`quienes.valores.${valor}.comprueba`)}
                </p>
              </div>
            </Tarjeta>
          ))}
        </ul>
      </div>

      {/* ── Emi (§4) ───────────────────────────────────────────────────────── */}
      <PresentacionEmi />
    </Seccion>
  );
};
