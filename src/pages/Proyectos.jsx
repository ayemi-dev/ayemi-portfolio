import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seccion } from '../components/layout/Seccion';
import { Boton } from '../components/ui/Boton';
import { EstadoConEmi } from '../components/marca/EstadoConEmi';
import { FiltrosProyectos } from '../features/proyectos/FiltrosProyectos';
import { TarjetaProyecto } from '../features/proyectos/TarjetaProyecto';
import {
  categorias,
  porTipo,
  slugDeStack,
  stacks,
} from '../config/proyectos';

/**
 * Proyectos · `/proyectos` · refactorización 2026-11 (R3.1, R4, T5)
 *
 * La galería del portafolio, en dos grupos con ancla propia:
 *
 *   #casos ........ Casos de clientes
 *   #laboratorio .. Proyectos del Laboratorio (cada tarjeta, «Proyecto
 *                   demostrativo»)
 *
 * Un grupo sin fichas publicadas, o sin ninguna que pase los filtros, no se
 * pinta (R0.5).
 *
 * FILTROS (R4.2). Viven en la URL para poder compartirlos:
 * `?tipo=pagos,ia&stack=nextjs`. Varios valores de un mismo grupo se suman
 * (basta con que la ficha tenga uno); los dos grupos se combinan (la ficha
 * cumple los dos). La URL se reemplaza en lugar de apilarse, para que «atrás»
 * salga de la galería en vez de deshacer filtros uno a uno.
 *
 * Sin resultados (R4.3): Emi en estado vacío y el botón «Quitar filtros».
 *
 * §5.5 · Esta sección ES la página, así que su titular es el h1; los grupos
 * son h2 y las tarjetas h3. El contador de resultados va en una región
 * `aria-live` para que el lector de pantalla lo anuncie al filtrar.
 */

/** Orden de las categorías: el del esquema, no el de aparición. */
const ORDEN_CATEGORIAS = ['tiendas', 'pagos', 'ia', 'integraciones', 'hardware'];

const GRUPOS = [
  { id: 'casos', tipo: 'caso-cliente' },
  { id: 'laboratorio', tipo: 'laboratorio' },
];

/** `pagos,ia` → ['pagos', 'ia'], sin vacíos ni repetidos. */
const valoresDe = (parametro) => [
  ...new Set(
    (parametro ?? '')
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean)
  ),
];

const cumple = (proyecto, tiposActivos, stacksActivos) =>
  (tiposActivos.length === 0 ||
    (proyecto.categorias ?? []).some((c) => tiposActivos.includes(c))) &&
  (stacksActivos.length === 0 ||
    (proyecto.stack ?? []).some((s) => stacksActivos.includes(slugDeStack(s))));

export const Proyectos = () => {
  const { t } = useTranslation();
  const [parametros] = useSearchParams();
  const navigate = useNavigate();
  const { hash } = useLocation();

  const tiposActivos = valoresDe(parametros.get('tipo'));
  const stacksActivos = valoresDe(parametros.get('stack'));

  const opcionesTipo = ORDEN_CATEGORIAS.filter((c) => categorias().includes(c)).map(
    (valor) => ({ valor, texto: t(`proyectos.categorias.${valor}`) })
  );
  const opcionesStack = stacks().map((nombre) => ({
    valor: slugDeStack(nombre),
    texto: nombre,
  }));

  /* Las comas se escriben tal cual: los valores son slugs y así la URL se
     lee y se comparte como `?tipo=pagos,ia`. */
  const irA = (tipos, stacksSel) => {
    const partes = [];
    if (tipos.length > 0) partes.push(`tipo=${tipos.map(encodeURIComponent).join(',')}`);
    if (stacksSel.length > 0)
      partes.push(`stack=${stacksSel.map(encodeURIComponent).join(',')}`);
    navigate(
      { search: partes.length > 0 ? `?${partes.join('&')}` : '', hash },
      { replace: true, preventScrollReset: true }
    );
  };

  const alternar = (lista, valor) =>
    lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];

  const cambiar = (grupo, valor) =>
    grupo === 'tipo'
      ? irA(alternar(tiposActivos, valor), stacksActivos)
      : irA(tiposActivos, alternar(stacksActivos, valor));

  const grupos = GRUPOS.map((grupo) => ({
    ...grupo,
    proyectos: porTipo(grupo.tipo).filter((p) => cumple(p, tiposActivos, stacksActivos)),
  })).filter((grupo) => grupo.proyectos.length > 0);

  const total = grupos.reduce((suma, grupo) => suma + grupo.proyectos.length, 0);

  return (
    <Seccion
      id="proyectos"
      nivel={1}
      etiqueta={t('proyectos.etiqueta')}
      titulo={t('proyectos.titulo')}
      acento={t('proyectos.acento')}
      tituloDespues={t('proyectos.tituloDespues')}
      entradilla={t('proyectos.entradilla')}
    >
      <FiltrosProyectos
        tipos={opcionesTipo}
        stacks={opcionesStack}
        tiposActivos={tiposActivos}
        stacksActivos={stacksActivos}
        onCambiar={cambiar}
      />

      <p
        role="status"
        aria-live="polite"
        className="mt-8 font-mono text-cuerpo-s text-texto-suave"
      >
        {t('proyectos.contador', { count: total })}
      </p>

      {total === 0 ? (
        <EstadoConEmi
          estado="vacio"
          titulo={t('proyectos.vacioTitulo')}
          className="mt-12"
          accion={
            <Boton variante="secundario" onClick={() => irA([], [])}>
              {t('proyectos.quitarFiltros')}
            </Boton>
          }
        >
          {t('proyectos.vacioTexto')}
        </EstadoConEmi>
      ) : (
        grupos.map((grupo) => (
          <section
            key={grupo.id}
            id={grupo.id}
            aria-labelledby={`${grupo.id}-titulo`}
            className="mt-16 scroll-mt-16"
          >
            <h2 id={`${grupo.id}-titulo`} className="text-titulo-2 text-texto">
              {t(`proyectos.grupos.${grupo.id}`)}
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {grupo.proyectos.map((proyecto) => (
                <TarjetaProyecto key={proyecto.slug} proyecto={proyecto} />
              ))}
            </ul>
          </section>
        ))
      )}
    </Seccion>
  );
};
