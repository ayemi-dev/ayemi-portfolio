import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { porTipo } from '../../config/proyectos';
import { RUTA_PROYECTOS } from '../../config/secciones';

/**
 * Transparencia · portada · refactorización 2026-11 (R7, T9)
 *
 * Una línea por demo publicada del Laboratorio: su título (enlace a
 * /proyectos/<slug>), cuándo se comprobó por última vez (`verificadoEl`) y
 * cada cuánto se reinicia (`demo.seReinicia`). Lo que la ficha no trae no se
 * pinta; sin demos publicadas, la sección entera no se pinta (R0.5).
 *
 * §3.6 · La fecha es un dato: monoespaciada.
 */

const idiomaDe = (i18n) => (i18n.resolvedLanguage === 'en' ? 'en' : 'es');

export const Transparencia = () => {
  const { t, i18n } = useTranslation();
  const idioma = idiomaDe(i18n);
  const demos = porTipo('laboratorio');

  if (demos.length === 0) return null;

  return (
    <Seccion
      id="transparencia"
      titulo={t('quienes.valores.transparencia.nombre')}
      fondo="profundo"
    >
      <ul className="max-w-lectura">
        {demos.map((demo) => (
          <li key={demo.slug} className="border-b border-borde py-5">
            <h3 className="text-titulo-4 text-texto">
              <Link
                to={`${RUTA_PROYECTOS}/${demo.slug}`}
                className="ay-toque rounded-sm transition-colors duration-rapida ease-estandar hover:text-acento"
              >
                {demo.textos[idioma].titulo}
              </Link>
            </h3>

            {demo.verificadoEl && (
              <p className="mt-2 text-cuerpo-s text-texto-suave">
                {t('confianza.transparencia.comprobada')}{' '}
                <time dateTime={demo.verificadoEl} className="font-mono">
                  {demo.verificadoEl}
                </time>
              </p>
            )}

            {demo.demo?.seReinicia && (
              <p className="mt-1 text-cuerpo-s text-texto-suave">
                {t('caso.seReinicia', { cada: demo.demo.seReinicia })}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Seccion>
  );
};

export default Transparencia;
