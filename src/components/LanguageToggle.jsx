import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Conmutador de idioma
 * Manual de Identidad Corporativa Ayemi · Edición 2.0
 *
 * §3.6 · El código de idioma es un dato técnico de dos letras, así que va en
 * la monoespaciada, en caja alta y con el tracking de microetiqueta (§3.7).
 *
 * NORMA (§5.3). Área mínima de toque 44 × 44 px.
 * NORMA (§5.5). El atributo lang del documento se mantiene sincronizado con el
 * idioma activo: los lectores de pantalla eligen la voz a partir de él.
 */
export const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const idiomaActual = i18n.resolvedLanguage === 'en' ? 'en' : 'es';
  const idiomaSiguiente = idiomaActual === 'es' ? 'en' : 'es';

  useEffect(() => {
    document.documentElement.setAttribute('lang', idiomaActual);
  }, [idiomaActual]);

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(idiomaSiguiente)}
      className="ay-toque inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-borde bg-superficie px-3 font-mono text-etiqueta text-texto-suave uppercase transition-colors duration-rapida ease-estandar hover:border-borde-fuerte hover:text-texto"
      aria-label={t('controles.idioma')}
      title={t('controles.idioma')}
      lang={idiomaSiguiente}
    >
      {idiomaSiguiente}
    </button>
  );
};
