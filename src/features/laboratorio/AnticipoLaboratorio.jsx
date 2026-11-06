import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Boton } from '../../components/ui/Boton';
import { IconoFlechaDerecha } from '../../components/marca/Iconos';
import { PLACAS } from '../../config/placas';
import { RUTA_LABORATORIO } from '../../config/secciones';

/**
 * Anticipo del Laboratorio en la portada
 * Manual de Identidad Ayemi · Edición 2.2 · §1.3 y §1.9
 *
 * La portada no lleva el Laboratorio entero: nombra lo que hay dentro y abre
 * la puerta. Solo productos con artefacto revisable; ninguna tarjeta vacía.
 *
 * NORMA (§1.9). Cada producto se compone como `Nombre` en la tipografía
 * corporativa y `POR AYEMI` en microetiqueta. WaBot se nombra solo «WaBot».
 */
export const AnticipoLaboratorio = () => {
  const { t } = useTranslation();

  const productos = [
    ...PLACAS.map((placa) => ({
      clave: placa.slug,
      nombre: t(`pcb.placas.lista.${placa.slug}.producto`),
      respaldo: t('pcb.placas.respaldo'),
      dato: placa.micro,
    })),
    {
      clave: 'wabot',
      nombre: 'WaBot',
      respaldo: null,
      dato: t('laboratorio.anticipo.wabot'),
    },
  ];

  return (
    <Seccion
      id="del-laboratorio"
      etiqueta={t('laboratorio.etiqueta')}
      titulo={t('laboratorio.titulo')}
      acento={t('laboratorio.acento')}
      tituloDespues={t('laboratorio.tituloDespues')}
      entradilla={t('laboratorio.entradilla')}
      fondo="profundo"
    >
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map(({ clave, nombre, respaldo, dato }) => (
          <li key={clave}>
            <div className="h-px w-12 bg-acento" />
            <h3 className="mt-6 text-titulo-3">
              {nombre}
              {respaldo && <span className="ay-etiqueta mt-1 block">{respaldo}</span>}
            </h3>
            {/* §3.6 · El micro es un dato técnico: monoespaciada. */}
            <p className="mt-3 font-mono text-micro text-texto-tenue">{dato}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <Boton variante="secundario" tamano="grande" to={RUTA_LABORATORIO}>
          {t('laboratorio.anticipo.boton')}
          <IconoFlechaDerecha tamano={16} />
        </Boton>
      </div>
    </Seccion>
  );
};
