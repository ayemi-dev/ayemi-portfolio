import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Pictograma } from '../../components/marca/Iconos';
import { EstadoConEmi } from '../../components/marca/EstadoConEmi';
import { Boton } from '../../components/ui/Boton';
import { Tablero } from './Tablero';
import {
  LINEAS,
  NATURALEZAS,
  PIEZAS,
  contadorDeProduccion,
  llenadoDeLinea,
  plazasDeLinea,
  primeraLineaConPiezas,
  rutaDePieza,
} from '../../config/piezas';

/**
 * La Fábrica de Innovación
 * Manual de Identidad Ayemi · Edición 2.0 · §1.3
 *
 * «La palabra fábrica es deliberada. No “estudio”, no “agencia”, no “startup”.
 * Una fábrica tiene procesos, tiene medidas, entrega piezas que encajan y
 * repite resultados.»
 *
 * Esta sección se toma esa frase al pie de la letra:
 *
 *   PROCESOS ....... ocho líneas de producción, cuatro de hardware y cuatro de
 *                    software. Eso es «del microcontrolador a la nube», que es
 *                    lo que casi nadie cubre completo.
 *   MEDIDAS ........ el contador de producción y el llenado de cada línea se
 *                    calculan de los datos, así que nunca mienten.
 *   PIEZAS ......... cada trabajo es una pieza con su ficha, no un «proyecto».
 *   REPITE ......... cinco plazas por línea. Las vacías se ven, y eso es
 *                    honesto: dicen que hay hueco, no fingen un trabajo.
 *
 * §5.5 · Independencia del color: la línea activa se distingue por texto, borde
 * y fondo, y el llenado va escrito en cifras además de dibujado.
 */

/** §3.8 · Dato técnico: monoespaciada. Las cifras salen de los datos. */
const Contador = ({ contador }) => {
  const { t } = useTranslation();

  const cifras = [
    { clave: 'entregadas', valor: contador.entregadas, color: 'text-exito' },
    { clave: 'enCurso', valor: contador.enCurso, color: 'text-acento' },
    { clave: 'libres', valor: contador.libres, color: 'text-texto-tenue' },
    { clave: 'lineas', valor: contador.lineas, color: 'text-texto-suave' },
  ];

  return (
    <dl className="grid grid-cols-2 gap-6 border-t border-borde pt-6 sm:grid-cols-4">
      {cifras.map(({ clave, valor, color }) => (
        <div key={clave}>
          <dd className={`font-mono text-titulo-2 ${color}`}>
            {String(valor).padStart(2, '0')}
          </dd>
          <dt className="ay-etiqueta mt-1 block">
            {t(`fabrica.contador.${clave}`)}
          </dt>
        </div>
      ))}
    </dl>
  );
};

/**
 * @param {object} props
 * @param {1|2} [props.nivel] Nivel del titular. En `/portafolio` esta sección
 *   ES la página, así que su titular es el h1 (§5.5). En cualquier otro sitio
 *   sería un h2, pero hoy solo se usa como página.
 */
export const Fabrica = ({ nivel = 2 }) => {
  const { t } = useTranslation();
  /* Abre en la primera línea que tenga piezas, no en la primera de la lista:
     así lo primero que se ve es trabajo y no un hueco. Ver piezas.js */
  const [lineaActiva, setLineaActiva] = useState(primeraLineaConPiezas);

  const contador = useMemo(() => contadorDeProduccion(), []);
  const plazas = useMemo(() => plazasDeLinea(lineaActiva), [lineaActiva]);
  const llenado = useMemo(() => llenadoDeLinea(lineaActiva), [lineaActiva]);

  const definicion = LINEAS.find((l) => l.id === lineaActiva);

  return (
    <Seccion
      id="fabrica"
      etiqueta={t('fabrica.etiqueta')}
      titulo={t('fabrica.titulo')}
      acento={t('fabrica.acento')}
      tituloDespues={t('fabrica.tituloDespues')}
      entradilla={t('fabrica.entradilla')}
      guia={t('fabrica.guiaEmi')}
      nivel={nivel}
      fondo="alterno"
    >
      {/* ── Contador de producción ─────────────────────────────────────────── */}
      <Contador contador={contador} />

      {/* ── Selector de línea, agrupado por naturaleza ─────────────────────── */}
      <div className="mt-16 flex flex-col gap-6 lg:flex-row lg:gap-12">
        {NATURALEZAS.map((naturaleza) => (
          <div key={naturaleza} className="flex-1">
            <h3 className="ay-etiqueta">
              {t(`fabrica.naturalezas.${naturaleza}`)}
            </h3>

            <ul className="mt-3 flex flex-wrap gap-2">
              {LINEAS.filter((l) => l.naturaleza === naturaleza).map((linea) => {
                const activa = linea.id === lineaActiva;
                const suLlenado = llenadoDeLinea(linea.id);

                return (
                  <li key={linea.id}>
                    <button
                      type="button"
                      onClick={() => setLineaActiva(linea.id)}
                      aria-pressed={activa}
                      className={[
                        'ay-toque inline-flex items-center gap-2 rounded-completo border px-3 py-2',
                        'transition-colors duration-rapida ease-estandar',
                        activa
                          ? 'border-acento bg-acento/12 text-acento'
                          : 'border-borde text-texto-suave hover:border-borde-fuerte hover:text-texto',
                      ].join(' ')}
                    >
                      <Pictograma nombre={linea.icono} tamano={16} />
                      <span className="text-cuerpo-s">
                        {t(`fabrica.lineas.${linea.id}.nombre`)}
                      </span>
                      {/* El llenado, en cifras. §1.10, regla 2. */}
                      <span className="font-mono text-micro opacity-70">
                        {suLlenado.ocupadas}/{suLlenado.total}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Línea activa ───────────────────────────────────────────────────── */}
      <div className="mt-16 border-t border-borde pt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Pictograma
              nombre={definicion.icono}
              tamano={32}
              className="mt-1 shrink-0 text-acento"
            />
            <div>
              <h3 className="text-titulo-3">
                {t(`fabrica.lineas.${lineaActiva}.nombre`)}
              </h3>
              <p className="mt-2 max-w-lectura text-cuerpo-s text-texto-suave">
                {t(`fabrica.lineas.${lineaActiva}.descripcion`)}
              </p>
            </div>
          </div>

          {/* §5.5 · aria-live anuncia el cambio de línea a quien no lo ve. */}
          <p
            className="shrink-0 font-mono text-micro text-texto-tenue"
            aria-live="polite"
          >
            {t('fabrica.llenado', {
              ocupadas: llenado.ocupadas,
              total: llenado.total,
            })}
          </p>
        </div>

        {/* ── El tablero de la línea ──────────────────────────────────────── */}
        {/* §7 · Una línea sin piezas es un estado vacío, y ahí Emi sí entra.
            Es el caso más frecuente hoy: cinco de las ocho líneas están
            abiertas y todavía no tienen nada publicado. Preferimos que lo diga
            Emi antes que dejar cinco Núcleos apagados sin explicación. */}
        {llenado.ocupadas === 0 ? (
          <EstadoConEmi
            estado="vacio"
            titulo={t('fabrica.lineaVaciaTitulo')}
            className="mt-16"
            accion={
              <Boton variante="secundario" to="/#contacto">
                {t('fabrica.lineaVaciaBoton')}
              </Boton>
            }
          >
            {t('fabrica.lineaVaciaEmi')}
          </EstadoConEmi>
        ) : (
          <div className="mt-16">
            <Tablero plazas={plazas} />
          </div>
        )}
      </div>

      {/* ── Índice de todas las piezas ─────────────────────────────────────── */}
      {/* El tablero solo pinta la línea activa, así que las fichas de las demás
          quedarían sin un enlace desde aquí: ni se pueden recorrer con el
          teclado ni las encuentra un buscador. Este índice las expone todas. */}
      {PIEZAS.length > 0 && (
        <nav
          className="mt-24 border-t border-borde pt-8"
          aria-labelledby="indice-piezas"
        >
          <h3 id="indice-piezas" className="ay-etiqueta">
            {t('fabrica.indice')}
          </h3>

          <ul className="mt-4 flex flex-col">
            {PIEZAS.map((pieza) => (
              <li key={pieza.slug} className="border-b border-borde">
                <Link
                  to={rutaDePieza(pieza.slug)}
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 transition-colors duration-rapida ease-estandar"
                >
                  <span className="text-cuerpo-s text-texto group-hover:text-acento">
                    {pieza.titulo}
                  </span>

                  {/* Marca ajena. Este índice es el único sitio de la portada
                      donde aparecen TODAS las piezas, así que es donde más
                      importa que no se lean como producto propio. */}
                  {pieza.cliente && (
                    <span className="font-mono text-micro text-texto-tenue">
                      {t('fabrica.paraCliente', {
                        cliente: pieza.cliente.nombre,
                      })}
                    </span>
                  )}

                  <span className="font-mono text-micro text-texto-tenue">
                    {t(`fabrica.lineas.${pieza.linea}.nombre`)}
                  </span>
                  <span className="ml-auto font-mono text-micro text-texto-tenue">
                    {t(`fabrica.estados.${pieza.estado}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ── Nota honesta sobre las plazas libres ───────────────────────────── */}
      <p className="mt-16 max-w-lectura border-t border-borde pt-6 text-cuerpo-s text-texto-tenue">
        {t('fabrica.nota')}
      </p>
    </Seccion>
  );
};
