import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';

/**
 * Método
 * Manual de Identidad Corporativa Ayemi · Edición 2.2 · §1.6 y §1.10
 *
 * Los cuatro valores (§1.4) con su «cómo se comprueba» viven en «Quiénes
 * somos»: son lo que la empresa familiar sostiene, no un paso del proceso.
 *
 * §1.6 · Las tres pruebas concretas que respaldan la promesa se muestran ya en
 * la portada; aquí se desarrolla el proceso que las hace posibles.
 *
 * §1.10, regla 1 · Primero el resultado, después el método. El titular dice
 * qué obtienes; los pasos explican cómo.
 */

const PASOS = ['entender', 'disenar', 'construir', 'entregar'];

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

    </Seccion>
  );
};
