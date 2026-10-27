import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Emi } from '../../components/marca/Emi';
import { Microetiqueta } from '../../components/marca/Logotipo';
import { IconoComprobacion, IconoCerrar } from '../../components/marca/Iconos';

/**
 * Presentación de Emi
 * Kit de marca Ayemi · AGENTE.md §7 y steering `ayemi-emi`
 *
 * Emi toma su nombre de Emilio, el tercero de los tres que forman Ayemi. Por
 * eso vive dentro de la sección del origen del nombre y no en una sección
 * aparte: no es un añadido simpático, es la tercera sílaba de la marca.
 *
 * ── POR QUÉ UN CATÁLOGO VIVO ───────────────────────────────────────────────
 * El contrato fija ocho expresiones y cuatro poses, y dice «no inventes otras».
 * Un portafolio de una fábrica de software puede describir eso en una tabla, o
 * puede dejar que se pruebe. Aquí se prueba: se eligen la expresión y la pose y
 * Emi responde, con la situación que le corresponde y la frase que diría.
 *
 * Está autorizado: la tabla del §7 pone «documentación de producto» en la
 * columna «Emi sí», y esto es exactamente eso.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * §7 · Su antena remata en El Núcleo, el mismo círculo cian que corona la «i»
 * del logotipo. Ese detalle es lo que la hace pertenecer al sistema, así que se
 * señala en lugar de dejarlo pasar.
 */

/** Las ocho expresiones normativas, en el orden de la tabla del §7. */
const EXPRESIONES = [
  'feliz',
  'atento',
  'procesando',
  'celebrando',
  'alerta',
  'error',
  'vacio',
  'reposo',
];

/** Las cuatro poses normativas. */
const POSES = ['flotando', 'saludando', 'senalando', 'celebrando'];

/** Pose que el §7 recomienda para cada expresión. */
const POSE_RECOMENDADA = {
  feliz: 'saludando',
  atento: 'flotando',
  procesando: 'flotando',
  celebrando: 'celebrando',
  alerta: 'flotando',
  error: 'flotando',
  vacio: 'flotando',
  reposo: 'flotando',
};

const Pastilla = ({ activa, children, ...props }) => (
  <button
    type="button"
    aria-pressed={activa}
    className={[
      'ay-toque rounded-completo border px-3 py-2',
      'font-mono text-etiqueta uppercase',
      'transition-colors duration-rapida ease-estandar',
      activa
        ? 'border-acento bg-acento/12 text-acento'
        : 'border-borde text-texto-tenue hover:border-borde-fuerte hover:text-texto-suave',
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

export const PresentacionEmi = () => {
  const { t } = useTranslation();
  const [expresion, setExpresion] = useState('feliz');
  const [pose, setPose] = useState('saludando');

  /* Al elegir expresión se ajusta la pose a la que el §7 recomienda para ella.
     Sigue pudiéndose cambiar a mano: el catálogo es para recorrerlo. */
  const elegirExpresion = (siguiente) => {
    setExpresion(siguiente);
    setPose(POSE_RECOMENDADA[siguiente]);
  };

  const donde = t('emi.donde', { returnObjects: true });
  const dondeSi = Array.isArray(donde?.si) ? donde.si : [];
  const dondeNo = Array.isArray(donde?.no) ? donde.no : [];

  return (
    <div className="mt-24 border-t border-borde pt-16">
      <Microetiqueta>{t('emi.etiqueta')}</Microetiqueta>

      <h3 className="mt-4 text-titulo-2">{t('emi.titulo')}</h3>

      <div className="mt-4 flex max-w-lectura flex-col gap-4 text-cuerpo-l text-texto-suave">
        <p>{t('emi.quienEs')}</p>
        <p>{t('emi.nucleo')}</p>
      </div>

      {/* ── Catálogo ────────────────────────────────────────────────────── */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
        {/* Emi, con el estado elegido */}
        <div className="flex flex-col items-center">
          <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-borde bg-superficie px-8 py-6">
            <Emi
              expresion={expresion}
              pose={pose}
              alto={240}
              animada
              titulo={t('emi.retratoAlt', {
                expresion: t(`emi.expresiones.${expresion}.nombre`),
              })}
            />
          </div>

          {/* §5 · La combinación activa es un dato: monoespaciada. */}
          <p className="mt-4 font-mono text-micro text-texto-tenue">
            expresion=<span className="text-acento">{expresion}</span>
            {'  '}pose=<span className="text-acento">{pose}</span>
          </p>
        </div>

        {/* Selectores y lectura del estado */}
        <div>
          <div>
            <h4 className="ay-etiqueta">{t('emi.lasExpresiones')}</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {EXPRESIONES.map((clave) => (
                <li key={clave}>
                  <Pastilla
                    activa={clave === expresion}
                    onClick={() => elegirExpresion(clave)}
                  >
                    {t(`emi.expresiones.${clave}.nombre`)}
                  </Pastilla>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h4 className="ay-etiqueta">{t('emi.lasPoses')}</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {POSES.map((clave) => (
                <li key={clave}>
                  <Pastilla
                    activa={clave === pose}
                    onClick={() => setPose(clave)}
                  >
                    {t(`emi.poses.${clave}`)}
                  </Pastilla>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuándo se usa y qué diría. §5.5 · se anuncia el cambio. */}
          <div
            className="mt-8 border-t border-borde pt-6"
            aria-live="polite"
            aria-atomic="true"
          >
            <h4 className="ay-etiqueta">{t('emi.cuando')}</h4>
            <p className="mt-2 text-cuerpo text-texto">
              {t(`emi.expresiones.${expresion}.cuando`)}
            </p>

            <h4 className="ay-etiqueta mt-6">{t('emi.diria')}</h4>
            {/* Su voz: segunda persona, máximo dos frases, sin emojis. */}
            <p className="mt-2 text-cuerpo-l text-acento">
              {t(`emi.expresiones.${expresion}.dice`)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Dónde sí y dónde no ─────────────────────────────────────────── */}
      {/* §7 · Emi nunca firma. Decirlo en el propio portafolio es parte de
          entender la marca, y explica por qué no aparece en la portada. */}
      <div className="mt-24 grid gap-8 border-t border-borde pt-8 md:grid-cols-2">
        <div>
          <h4 className="flex items-center gap-2 text-titulo-4 text-exito">
            <IconoComprobacion tamano={20} />
            {t('emi.dondeSi')}
          </h4>
          <ul className="mt-4 flex flex-col gap-2">
            {dondeSi.map((linea) => (
              <li key={linea} className="text-cuerpo-s text-texto-suave">
                {linea}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-titulo-4 text-texto-tenue">
            <IconoCerrar tamano={20} />
            {t('emi.dondeNo')}
          </h4>
          <ul className="mt-4 flex flex-col gap-2">
            {dondeNo.map((linea) => (
              <li key={linea} className="text-cuerpo-s text-texto-tenue">
                {linea}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 max-w-lectura text-cuerpo-s text-texto-tenue">
        {t('emi.nota')}
      </p>
    </div>
  );
};
