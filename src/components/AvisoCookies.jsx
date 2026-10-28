import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Boton } from './ui/Boton';
import { RUTA_PRIVACIDAD } from '../config/secciones';

/**
 * Aviso de cookies
 *
 * Informativo: no bloquea la navegación ni tapa el contenido con un velo. Se
 * muestra abajo hasta que lo aceptas, y se recuerda en este navegador.
 *
 * Aparece después de montar, nunca en el HTML prerenderizado: así la página
 * no parpadea para quien ya lo aceptó y la hidratación no difiere.
 */

const CLAVE = 'ayemi:aviso-cookies';

const yaAceptado = () => {
  try {
    return localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
};

export const AvisoCookies = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Diferido un tic: react-hooks pide no fijar estado en el cuerpo del efecto. */
    const id = setTimeout(() => setVisible(!yaAceptado()), 0);
    return () => clearTimeout(id);
  }, []);

  if (!visible) return null;

  const aceptar = () => {
    try {
      localStorage.setItem(CLAVE, '1');
    } catch {
      /* Sin almacenamiento: se oculta solo en esta vista. */
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label={t('cookies.region')}
      className="fixed inset-x-0 bottom-0 z-40 p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md"
    >
      <div className="rounded-lg border border-borde bg-superficie-elevada p-4 shadow-lg">
        <p className="text-cuerpo-s text-texto-suave">
          {t('cookies.texto')}{' '}
          <Link to={RUTA_PRIVACIDAD} className="text-acento hover:text-acento-hover">
            {t('cookies.enlace')}
          </Link>
          .
        </p>
        <div className="mt-3 flex justify-end">
          <Boton variante="primario" tamano="pequeno" onClick={aceptar}>
            {t('cookies.aceptar')}
          </Boton>
        </div>
      </div>
    </div>
  );
};
