import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';

/**
 * Entrega con llaves · portada · refactorización 2026-11 (R7, T9)
 *
 * Reutiliza los textos `hero.pruebas.llaves*` (código, archivos e
 * infraestructura a tu nombre, con su documentación) y `hero.pruebas.traspaso*`
 * (el traspaso), los tres temas de R7. Sin textos nuevos.
 *
 * Se exporta como `SeccionEntregaConLlaves` para no chocar con
 * `features/proyectos/EntregaConLlaves.jsx`, la lista de la página de caso.
 */

export const SeccionEntregaConLlaves = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="entrega"
      etiqueta={t('hero.panelEtiqueta')}
      titulo={t('hero.pruebas.llavesTitulo')}
      fondo="alterno"
    >
      <div className="max-w-lectura">
        <p className="text-cuerpo-l text-texto-suave">{t('hero.pruebas.llavesTexto')}</p>

        <h3 className="mt-12 text-titulo-3 text-texto">{t('hero.pruebas.traspasoTitulo')}</h3>
        <p className="mt-3 text-cuerpo text-texto-suave">{t('hero.pruebas.traspasoTexto')}</p>
      </div>
    </Seccion>
  );
};

export default SeccionEntregaConLlaves;
