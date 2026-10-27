import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Tarjeta } from '../../components/ui/Tarjeta';

/**
 * Método
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §1.4 y §1.6
 *
 * §1.4 · Cuatro valores, cada uno con su consecuencia observable. «Un valor que
 * no se puede verificar no es un valor: es un adorno.» Por eso cada valor se
 * presenta con la columna «cómo se comprueba», no solo con su nombre.
 *
 * §1.6 · Las tres pruebas concretas que respaldan la promesa se muestran ya en
 * la portada; aquí se desarrolla el proceso que las hace posibles.
 *
 * §1.10, regla 1 · Primero el resultado, después el método. El titular dice
 * qué obtienes; los pasos explican cómo.
 */

const PASOS = ['entender', 'disenar', 'construir', 'entregar'];
const VALORES = ['metodo', 'transparencia', 'flujo', 'permanencia'];

export const Metodo = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="metodo"
      etiqueta={t('metodo.etiqueta')}
      titulo={t('metodo.titulo')}
      acento={t('metodo.acento')}
      tituloDespues={t('metodo.tituloDespues')}
      entradilla={t('metodo.entradilla')}
      guia={t('metodo.guiaEmi')}
      fondo="alterno"
    >
      {/* ── Proceso ───────────────────────────────────────────────────────── */}
      <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {PASOS.map((paso, indice) => (
          <li key={paso} className="flex flex-col">
            {/* §3.8 · El número del paso es un dato: monoespaciada, cian. */}
            <span className="font-mono text-etiqueta text-acento">
              {String(indice + 1).padStart(2, '0')}
            </span>

            <h3 className="mt-3 text-titulo-4">
              {t(`metodo.pasos.${paso}.titulo`)}
            </h3>

            <p className="mt-2 text-cuerpo-s text-texto-suave">
              {t(`metodo.pasos.${paso}.texto`)}
            </p>

            {/* Lo que se entrega al cerrar el paso. Dato verificable. */}
            <p className="mt-4 border-t border-borde pt-3 font-mono text-micro text-texto-tenue">
              {t(`metodo.pasos.${paso}.entrega`)}
            </p>
          </li>
        ))}
      </ol>

      {/* ── Valores ───────────────────────────────────────────────────────── */}
      <div className="mt-24">
        <h3 className="text-titulo-2">{t('metodo.valoresTitulo')}</h3>
        <p className="mt-3 max-w-lectura text-cuerpo text-texto-suave">
          {t('metodo.valoresEntradilla')}
        </p>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {VALORES.map((valor) => (
            <Tarjeta como="li" key={valor}>
              <h4 className="text-titulo-4">
                {t(`metodo.valores.${valor}.nombre`)}
              </h4>

              <p className="mt-2 text-cuerpo-s text-texto-suave">
                {t(`metodo.valores.${valor}.significa`)}
              </p>

              {/* §1.4 · La consecuencia observable. Sin esto sería un adorno. */}
              <div className="mt-4 border-t border-borde pt-4">
                <span className="ay-etiqueta">
                  {t('metodo.comoSeComprueba')}
                </span>
                <p className="mt-2 font-mono text-micro text-texto-suave">
                  {t(`metodo.valores.${valor}.comprueba`)}
                </p>
              </div>
            </Tarjeta>
          ))}
        </ul>
      </div>
    </Seccion>
  );
};
