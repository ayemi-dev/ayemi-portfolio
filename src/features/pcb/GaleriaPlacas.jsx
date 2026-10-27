import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Tarjeta } from '../../components/ui/Tarjeta';
import { IconoCapas } from '../../components/marca/Iconos';
import { ControlSegmentado } from './ControlSegmentado';
import { ESTADOS_PLACA, PLACAS } from '../../config/placas';

/**
 * Galería de placas propias
 *
 * Una tarjeta por espacio de `placas.js`. Sin `ficha`, la tarjeta es un
 * espacio preparado: no inventa render ni cifras. Con `ficha`, muestra las
 * vistas y la hoja de medidas.
 *
 * El estado se lee como una escala de dos peldaños, siempre visible, para que
 * nadie confunda «listo para fabricar» con «fabricado»: el peldaño alcanzado
 * se marca con punto lleno y texto, nunca solo con color (§5.5).
 */

/* Clases escritas enteras: Tailwind no ve las que se componen con plantillas. */
const COLOR_ESTADO = {
  disenoVerificado: { texto: 'text-info', punto: 'bg-info' },
  fabricadoProbado: { texto: 'text-exito', punto: 'bg-exito' },
};

const EscalaEstado = ({ estado, t }) => {
  const alcanzado = ESTADOS_PLACA.indexOf(estado);

  return (
    <div>
      <p className="font-mono text-micro uppercase text-texto-tenue">
        {t('pcb.placas.estados.rotulo')}
      </p>
      <ol className="mt-2 flex flex-col gap-2">
        {ESTADOS_PLACA.map((clave, i) => {
          const hecho = i <= alcanzado;
          const color = COLOR_ESTADO[clave];
          return (
            <li
              key={clave}
              className={`flex items-center gap-2 font-mono text-micro ${
                hecho ? color.texto : 'text-texto-tenue'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-completo ${
                  hecho ? color.punto : 'border border-borde'
                }`}
                aria-hidden="true"
              />
              <span>{t(`pcb.placas.estados.${clave}`)}</span>
              <span className="sr-only">
                {hecho
                  ? t('pcb.placas.estados.alcanzado')
                  : t('pcb.placas.estados.pendiente')}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const VISTAS = ['perspectiva', 'superior', 'inferior'];

/** Render con selector de vista. Solo existe cuando la placa tiene ficha. */
const VistasPlaca = ({ ficha, nombre, t }) => {
  const [vista, setVista] = useState('perspectiva');
  const [ancho, alto] = ficha.dimensiones[vista];

  const opciones = VISTAS.map((v) => ({
    valor: v,
    texto: t(`pcb.placas.vistas.${v}`),
  }));

  return (
    <div>
      <div className="flex aspect-[4/3] items-center justify-center rounded-md bg-lienzo-profundo p-4">
        <img
          src={ficha.imagenes[vista]}
          width={ancho}
          height={alto}
          loading="lazy"
          decoding="async"
          alt={t('pcb.placas.alt', {
            nombre,
            vista: t(`pcb.placas.vistas.${vista}`),
          })}
          className="h-full w-auto max-h-full object-contain"
        />
      </div>
      <div className="mt-3">
        <ControlSegmentado
          etiqueta={t('pcb.placas.vistas.control')}
          opciones={opciones}
          valor={vista}
          onCambio={setVista}
        />
      </div>
    </div>
  );
};

/** Lugar del render mientras no hay diseño publicado. */
const EspacioPreparado = ({ micro, t }) => (
  <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-borde bg-lienzo-profundo p-4 text-center">
    <IconoCapas tamano={32} className="text-texto-tenue" />
    <p className="font-mono text-micro uppercase text-texto-tenue">{micro}</p>
    <p className="max-w-[28ch] text-cuerpo-s text-texto-suave">
      {t('pcb.placas.preparado')}
    </p>
  </div>
);

const HojaMedidas = ({ ficha, t }) => (
  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-borde pt-4 min-[400px]:grid-cols-4">
    {[
      ['medidas', `${ficha.ancho_mm} × ${ficha.alto_mm} mm`],
      ['capas', ficha.capas],
      ['componentes', ficha.componentes],
      ['vias', ficha.vias],
    ].map(([clave, valor]) => (
      <div key={clave}>
        <dt className="font-mono text-micro uppercase text-texto-tenue">
          {t(`pcb.placas.ficha.${clave}`)}
        </dt>
        <dd className="font-mono text-cuerpo-s text-texto">{valor}</dd>
      </div>
    ))}
  </dl>
);

const TarjetaPlaca = ({ placa, t }) => {
  const nombre = t(`pcb.placas.lista.${placa.slug}.nombre`);
  const { ficha } = placa;

  return (
    <Tarjeta como="li">
      {ficha ? (
        <VistasPlaca ficha={ficha} nombre={nombre} t={t} />
      ) : (
        <EspacioPreparado micro={placa.micro} t={t} />
      )}

      <h3 className="mt-5 text-titulo-4">{nombre}</h3>
      <p className="mt-2 text-cuerpo-s text-texto-suave">
        {t(`pcb.placas.lista.${placa.slug}.descripcion`)}
      </p>

      <div className="mt-5 border-t border-borde pt-4">
        <EscalaEstado estado={placa.estado} t={t} />
      </div>

      {ficha && <HojaMedidas ficha={ficha} t={t} />}
    </Tarjeta>
  );
};

export const GaleriaPlacas = () => {
  const { t } = useTranslation();

  return (
    <Seccion
      id="placas"
      etiqueta={t('pcb.placas.etiqueta')}
      titulo={t('pcb.placas.titulo')}
      acento={t('pcb.placas.acento')}
      tituloDespues={t('pcb.placas.tituloDespues')}
      entradilla={t('pcb.placas.entradilla')}
      fondo="alterno"
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {PLACAS.map((placa) => (
          <TarjetaPlaca key={placa.slug} placa={placa} t={t} />
        ))}
      </ul>
    </Seccion>
  );
};
