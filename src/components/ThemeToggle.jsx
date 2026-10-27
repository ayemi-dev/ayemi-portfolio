import { useTranslation } from 'react-i18next';
import { useTema } from '../hooks/useTema';
import { IconoLuna, IconoSol } from './marca/Iconos';

/**
 * Conmutador de tema
 * Kit de marca Ayemi · AGENTE.md §4 y §9
 *
 * NORMA. El tema oscuro es el predeterminado: es la identidad de Ayemi, no una
 * preferencia. Este control permite forzar el claro, que es obligatorio en
 * vistas pensadas para imprimirse.
 *
 * La gestión la hace el `useTema` del kit, que guarda en `ayemi:tema` y admite
 * tres valores: oscuro, claro y sistema. El guión antidestello de `index.html`
 * lo aplica antes del primer pintado.
 *
 * ── POR QUÉ LOS DOS ICONOS SE PINTAN SIEMPRE ───────────────────────────────
 * El build prerenderiza el HTML, así que el primer render tiene que dar lo
 * mismo en el servidor y en el navegador. Elegir el icono en JavaScript a
 * partir del tema activo rompía eso: el servidor no sabe qué tema tiene el
 * visitante, y React avisaba de un desajuste de hidratación.
 *
 * Se resuelve dejando el marcado fijo y pasando la decisión al CSS, con las
 * variantes `dark:` que ya cuelgan de `data-tema`. El icono correcto aparece
 * en el primer pintado, sin JavaScript y sin desajuste.
 *
 * NORMA (§8). Área mínima de toque 44 × 44 px.
 * NORMA (§2, regla 4). El anillo de foco no se elimina. Lo aporta la regla
 * :focus-visible de los tokens del kit.
 * NORMA (§2, regla 9). El color no es el único portador de significado: el
 * control lleva icono y etiqueta accesible.
 */
export const ThemeToggle = () => {
  const { t } = useTranslation();
  const { alternar } = useTema();

  return (
    <button
      type="button"
      onClick={alternar}
      className="ay-toque inline-flex h-10 w-10 items-center justify-center rounded-md border border-borde bg-superficie text-texto-suave transition-colors duration-rapida ease-estandar hover:border-borde-fuerte hover:text-texto"
      /* La etiqueta genérica es la que se anuncia; el destino concreto lo
         aportan los dos textos de abajo, conmutados por CSS. */
      aria-label={t('controles.tema')}
    >
      {/* En oscuro se ofrece pasar a claro, así que se muestra el sol. */}
      <IconoSol tamano={20} className="hidden dark:block" />
      <IconoLuna tamano={20} className="block dark:hidden" />

      <span className="sr-only hidden dark:inline">
        {t('controles.temaClaro')}
      </span>
      <span className="sr-only inline dark:hidden">
        {t('controles.temaOscuro')}
      </span>
    </button>
  );
};
