import { useTranslation } from 'react-i18next';
import { Boton } from '../../components/ui/Boton';
import { IconoEnlaceExterno } from '../../components/marca/Iconos';
import { diagramaDe } from '../../config/proyectos';

/**
 * «Cómo está hecho» · diagrama SVG, stack y enlace al código (R5.4)
 *
 * El diagrama va en línea (`diagramaDe`, texto saneado) para que sus clases
 * hereden los tokens `var(--ay-*)` y cambie con el tema. El SVG trae su propio
 * `role="img"`, `<title>` y `<desc>` (§5.5).
 *
 * Lo que la ficha no trae no se pinta. Si no queda nada, la página no pinta
 * el bloque.
 */

export const DiagramaYStack = ({ proyecto }) => {
  const { t } = useTranslation();
  const svg = diagramaDe(proyecto);
  const stack = proyecto.stack ?? [];

  return (
    <div className="flex flex-col gap-8">
      {svg && (
        /* En móvil el diagrama no se encoge por debajo de 480 px (su texto
           quedaría ilegible): se desplaza dentro de su caja, que recibe el foco
           para poder recorrerla con el teclado. */
        <div
          role="region"
          aria-label={t('caso.comoEstaHecho')}
          tabIndex={0}
          className="overflow-x-auto rounded-lg border border-borde bg-lienzo-profundo p-4 [&>svg]:h-auto [&>svg]:w-full [&>svg]:min-w-[480px]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}

      {stack.length > 0 && (
        <div>
          <h3 className="ay-etiqueta">{t('caso.pila')}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {stack.map((pieza) => (
              <li
                key={pieza}
                className="rounded-xs border border-borde px-2 py-1 font-mono text-micro text-texto-tenue"
              >
                {pieza}
              </li>
            ))}
          </ul>
        </div>
      )}

      {proyecto.codigo && (
        <div>
          <Boton variante="terciario" href={proyecto.codigo} target="_blank" rel="noopener noreferrer">
            {t('caso.verCodigo')}
            <IconoEnlaceExterno tamano={16} />
            <span className="sr-only">{t('pie.nuevaPestana')}</span>
          </Boton>
        </div>
      )}
    </div>
  );
};

export default DiagramaYStack;
