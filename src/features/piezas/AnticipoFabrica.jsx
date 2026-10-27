import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Boton } from '../../components/ui/Boton';
import { Pictograma } from '../../components/marca/Iconos';
import {
  buscarLinea,
  contadorDeProduccion,
  piezasDestacadas,
  rutaDePieza,
} from '../../config/piezas';
import { RUTA_PORTAFOLIO } from '../../config/secciones';

/**
 * Anticipo de La Fábrica
 *
 * La portada es una landing y tiene que leerse de un tirón. Antes llevaba La
 * Fábrica entera —contador, selector de ocho líneas, tablero, índice de todas
 * las piezas y nota—, y era el bloque más pesado de ocho, de los cuales solo
 * ese era portafolio. La página dejaba de ser una landing.
 *
 * Aquí queda lo justo para que el mensaje no se pierda: las cifras, tres piezas
 * y la puerta al tablero completo. Quien quiera el detalle entra; quien esté
 * evaluando a Ayemi sigue bajando.
 *
 * §1.10, regla 2 · Cifras concretas antes que adjetivos, y salen de los datos.
 */

/** Las cuatro cifras del contador, en monoespaciada (§3.8). */
const Cifras = ({ contador }) => {
  const { t } = useTranslation();

  const cifras = [
    { clave: 'entregadas', valor: contador.entregadas, color: 'text-exito' },
    { clave: 'enCurso', valor: contador.enCurso, color: 'text-acento' },
    { clave: 'libres', valor: contador.libres, color: 'text-texto-tenue' },
    { clave: 'lineas', valor: contador.lineas, color: 'text-texto-suave' },
  ];

  return (
    <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
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

/** Tarjeta de pieza. §5.3 · Superficie, borde de 1 px, radio 10, sin sombra. */
const Tarjeta = ({ pieza }) => {
  const { t } = useTranslation();
  const linea = buscarLinea(pieza.linea);

  return (
    <li>
      <Link
        to={rutaDePieza(pieza.slug)}
        className="group flex h-full flex-col rounded-lg border border-borde bg-superficie p-6 transition-colors duration-media ease-estandar hover:border-borde-fuerte"
      >
        <span className="flex items-center gap-2">
          <Pictograma nombre={linea?.icono} tamano={16} className="text-acento" />
          <span className="font-mono text-micro text-texto-tenue">
            {t(`fabrica.lineas.${pieza.linea}.nombre`)}
          </span>
        </span>

        <span className="mt-3 text-titulo-4 text-texto group-hover:text-acento">
          {pieza.titulo}
        </span>

        {/* Marca ajena, igual que en el tablero: quien lee de pasada no debe
            suponer que la pieza es de Ayemi. */}
        {pieza.cliente && (
          <span className="mt-1 font-mono text-micro text-texto-tenue">
            {t('fabrica.paraCliente', { cliente: pieza.cliente.nombre })}
          </span>
        )}

        {pieza.resuelve && (
          <span className="mt-3 text-cuerpo-s text-texto-suave">
            {pieza.resuelve}
          </span>
        )}
      </Link>
    </li>
  );
};

export const AnticipoFabrica = () => {
  const { t } = useTranslation();
  const contador = useMemo(() => contadorDeProduccion(), []);
  const destacadas = useMemo(() => piezasDestacadas(3), []);

  return (
    <Seccion
      id="fabrica"
      etiqueta={t('fabrica.etiqueta')}
      titulo={t('fabrica.titulo')}
      acento={t('fabrica.acento')}
      tituloDespues={t('fabrica.tituloDespues')}
      entradilla={t('fabrica.entradilla')}
      guia={t('fabrica.guiaEmi')}
      fondo="alterno"
    >
      <Cifras contador={contador} />

      {destacadas.length > 0 && (
        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {destacadas.map((pieza) => (
            <Tarjeta key={pieza.slug} pieza={pieza} />
          ))}
        </ul>
      )}

      <div className="mt-16 border-t border-borde pt-8">
        <p className="max-w-lectura text-cuerpo-l text-texto">
          {t('fabrica.anticipoCierre')}
        </p>
        <div className="mt-6">
          <Boton variante="primario" tamano="grande" to={RUTA_PORTAFOLIO}>
            {t('fabrica.anticipoBoton')}
          </Boton>
        </div>
      </div>
    </Seccion>
  );
};
