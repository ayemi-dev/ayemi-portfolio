import { useTranslation } from 'react-i18next';
import { Seccion } from '../components/layout/Seccion';
import { Boton } from '../components/ui/Boton';
import { Microetiqueta } from '../components/marca/Logotipo';
import { IconoEnlaceExterno } from '../components/marca/Iconos';
import { ListaPlacas } from '../features/pcb/GaleriaPlacas';
import { WABOT } from '../config/laboratorio';
import { enlaceWhatsapp } from '../config/sitio';

/**
 * Laboratorio · `/laboratorio`
 * Manual de Identidad Ayemi · Edición 2.2 · §1.3 y §1.9
 *
 * Lo que Ayemi construye por iniciativa propia y publica abierto. Sustituye al
 * tablero de La Fábrica, que mostraba ocho líneas con plazas vacías: aquí solo
 * entra lo que tiene un artefacto revisable (§1.3), así que no hay tarjetas
 * vacías ni anuncios de lo que vendrá.
 *
 *   Placas ..... Chispa, Enlace e Impulso «por Ayemi», con su escalera de
 *                estados y el enlace a su diseño en GitHub (config/placas.js)
 *   WaBot ...... la arquitectura del servicio y su lista de espera
 *   Cierre ..... «¿Necesitas algo más específico? Lo construimos.»
 *
 * NORMA (§1.9). «Laboratorio» es un descriptor: texto, sin logotipo propio.
 * Los productos se componen como nombre + `POR AYEMI` en microetiqueta.
 *
 * §5.3 · Una acción primaria por bloque: la lista de espera en WaBot y contar
 * tu idea en el cierre.
 */

const Wabot = ({ t }) => {
  const medidas = t('laboratorio.wabot.medidas', { returnObjects: true });
  const capas = t('laboratorio.wabot.arquitectura', { returnObjects: true });
  const incluye = t('laboratorio.wabot.incluye', { returnObjects: true });
  const lista = (x) => (Array.isArray(x) ? x : []);

  return (
    <Seccion
      id={WABOT.slug}
      etiqueta={t('laboratorio.wabot.etiqueta')}
      titulo={t('laboratorio.wabot.titulo')}
      acento={t('laboratorio.wabot.acento')}
      tituloDespues={t('laboratorio.wabot.tituloDespues')}
      entradilla={t('laboratorio.wabot.entradilla')}
      fondo="alterno"
    >
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          {/* Estado: se dice en qué punto está (§1.10, regla 4). */}
          <h3 className="ay-etiqueta">{t('laboratorio.wabot.estadoRotulo')}</h3>
          <ol className="mt-3 flex flex-col gap-2 font-mono text-micro">
            <li className="flex items-center gap-2 text-exito">
              <span className="h-1.5 w-1.5 shrink-0 rounded-completo bg-exito" aria-hidden="true" />
              <span>{t('laboratorio.wabot.estadoActual')}</span>
              <span className="sr-only">{t('pcb.placas.estados.alcanzado')}</span>
            </li>
            <li className="flex items-center gap-2 text-texto-tenue">
              <span className="h-1.5 w-1.5 shrink-0 rounded-completo border border-borde" aria-hidden="true" />
              <span>{t('laboratorio.wabot.estadoSiguiente')}</span>
              <span className="sr-only">{t('pcb.placas.estados.pendiente')}</span>
            </li>
          </ol>

          {/* §3.6 · Las medidas son datos: monoespaciada, sin líneas verticales. */}
          <h3 className="ay-etiqueta mt-12">{t('laboratorio.wabot.medidasRotulo')}</h3>
          <dl className="mt-3">
            {lista(medidas).map(({ que, valor }) => (
              <div key={que} className="grid grid-cols-2 gap-4 border-t border-borde py-3">
                <dt className="text-cuerpo-s text-texto-tenue">{que}</dt>
                <dd className="font-mono text-cuerpo-s text-texto">{valor}</dd>
              </div>
            ))}
          </dl>

          <h3 className="ay-etiqueta mt-12">{t('laboratorio.wabot.pilaRotulo')}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {WABOT.pila.map((pieza) => (
              <li
                key={pieza}
                className="rounded-xs border border-borde px-2 py-1 font-mono text-micro text-texto-tenue"
              >
                {pieza}
              </li>
            ))}
          </ul>

          <a
            href={WABOT.documentacion}
            target="_blank"
            rel="noopener noreferrer"
            className="ay-toque mt-8 inline-flex h-10 items-center gap-2 rounded-md border border-borde-fuerte px-4 text-cuerpo-s font-bold text-texto transition-colors duration-rapida ease-estandar hover:border-acento hover:text-acento"
          >
            {t('laboratorio.wabot.documentacion')}
            <IconoEnlaceExterno tamano={16} />
            <span className="sr-only">{t('contacto.nuevaPestana')}</span>
          </a>
        </div>

        {/* Capa por capa: primero lo que hace y después con qué (§1.10). */}
        <div>
          <h3 className="ay-etiqueta">{t('laboratorio.wabot.arquitecturaRotulo')}</h3>
          <ol className="mt-3">
            {lista(capas).map(({ capa, que }, i) => (
              <li
                key={capa}
                className="grid grid-cols-[2rem_1fr] gap-x-4 border-t border-borde py-4"
              >
                <span className="font-mono text-micro text-acento">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="text-cuerpo font-bold text-texto">{capa}</h4>
                  <p className="mt-1 text-cuerpo-s text-texto-suave">{que}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── Lista de espera ────────────────────────────────────────────────── */}
      {/* Sin backend nuevo: WhatsApp con el mensaje prellenado. */}
      <div
        className="mt-24 rounded-lg border border-borde bg-superficie p-6 md:p-8"
        data-ubicacion="wabot"
      >
        <h3 className="max-w-lectura text-titulo-2">{t('laboratorio.wabot.esperaTitulo')}</h3>
        <p className="mt-4 max-w-lectura text-cuerpo-l text-texto-suave">
          {t('laboratorio.wabot.esperaTexto')}
        </p>
        <h4 className="ay-etiqueta mt-8">{t('laboratorio.wabot.incluyeRotulo')}</h4>
        <ul className="mt-3 flex max-w-lectura flex-col gap-2">
          {lista(incluye).map((punto) => (
            <li key={punto} className="flex gap-3 text-cuerpo text-texto">
              <span className="text-acento" aria-hidden="true">·</span>
              {punto}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-lectura text-cuerpo-s text-texto-tenue">
          {t('laboratorio.wabot.nota')}
        </p>
        <div className="mt-8">
          <Boton
            variante="primario"
            tamano="grande"
            href={enlaceWhatsapp(t('laboratorio.wabot.mensaje'))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('laboratorio.wabot.boton')}
          </Boton>
        </div>
      </div>
    </Seccion>
  );
};

export const Laboratorio = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seccion
        id="laboratorio"
        nivel={1}
        etiqueta={t('laboratorio.etiqueta')}
        titulo={t('laboratorio.titulo')}
        acento={t('laboratorio.acento')}
        tituloDespues={t('laboratorio.tituloDespues')}
        entradilla={t('laboratorio.entradilla')}
        guia={t('laboratorio.guiaEmi')}
      >
        <div id="placas" className="scroll-mt-20">
          <Microetiqueta>{t('laboratorio.placas.etiqueta')}</Microetiqueta>
          <h2 className="mt-3 text-titulo-2">{t('laboratorio.placas.titulo')}</h2>
          <p className="mt-3 max-w-lectura text-cuerpo text-texto-suave">
            {t('laboratorio.placas.entradilla')}
          </p>
          <ListaPlacas className="mt-12" />
        </div>
      </Seccion>

      <Wabot t={t} />

      {/* ── Cierre ───────────────────────────────────────────────────────── */}
      <section
        className="bg-lienzo"
        style={{ paddingBlock: 'var(--ay-esp-24)' }}
        aria-labelledby="laboratorio-cierre"
      >
        <div className="mx-auto max-w-2xl" style={{ paddingInline: 'var(--ay-margen)' }}>
          <h2 id="laboratorio-cierre" className="max-w-lectura text-titulo-1 md:text-display-l">
            {t('laboratorio.cierre.titulo')}
            <span className="text-acento">{t('laboratorio.cierre.acento')}</span>
          </h2>
          <div className="mt-8">
            <Boton variante="primario" tamano="grande" to="/#contacto">
              {t('hero.botonPrimario')}
            </Boton>
          </div>
        </div>
      </section>
    </>
  );
};
