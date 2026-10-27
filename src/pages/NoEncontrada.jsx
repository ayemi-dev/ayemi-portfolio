import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Boton } from '../components/ui/Boton';
import { Microetiqueta } from '../components/marca/Logotipo';
import { EstadoConEmi } from '../components/marca/EstadoConEmi';
import { LINEAS } from '../config/piezas';
import { RUTA_PORTAFOLIO } from '../config/secciones';

/**
 * Página no encontrada
 * Kit de marca Ayemi · AGENTE.md §7 y §10
 *
 * §7 · La página 404 está en la columna «Emi sí» de la tabla, y su estado es
 * `vacio` con pose `flotando`. Es exactamente para lo que existe: acompañar
 * cuando algo no está.
 *
 * NORMA (§10, regla 3). Nunca se culpa al usuario. Una dirección que no existe
 * no es un error de quien la escribió: es una página que no está. El texto lo
 * dice así y ofrece por dónde seguir.
 *
 * §5 · El código de estado es un dato técnico, así que va en monoespaciada.
 */
export const NoEncontrada = () => {
  const { t } = useTranslation();

  return (
    <div
      className="mx-auto max-w-2xl"
      style={{
        paddingInline: 'var(--ay-margen)',
        paddingBlock: 'var(--ay-esp-24)',
      }}
    >
      <div className="mx-auto max-w-lectura">
        <div className="text-center">
          <Microetiqueta>404</Microetiqueta>
        </div>

        {/* Emi sostiene el estado vacío. El h1 va debajo, en su sitio. */}
        <EstadoConEmi estado="vacio" className="mt-8">
          <h1 className="text-titulo-1 text-texto">
            {t('noEncontrada.titulo')}
          </h1>
          <p className="mt-4 text-cuerpo-l text-texto-suave">
            {t('noEncontrada.texto')}
          </p>
          {/* La voz de Emi: segunda persona, dos frases como máximo. */}
          <p className="mt-4 text-cuerpo text-texto-tenue italic">
            {t('noEncontrada.emi')}
          </p>
        </EstadoConEmi>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Boton variante="primario" tamano="grande" to="/">
            {t('noEncontrada.inicio')}
          </Boton>
          <Boton variante="secundario" tamano="grande" to={RUTA_PORTAFOLIO}>
            {t('noEncontrada.fabrica')}
          </Boton>
        </div>
      </div>

      {/* Las ocho líneas, para que la página no sea un callejón sin salida. */}
      <nav
        className="mt-24 border-t border-borde pt-8"
        aria-labelledby="lineas-404"
      >
        <h2 id="lineas-404" className="ay-etiqueta">
          {t('noEncontrada.lineas')}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {LINEAS.map((linea) => (
            <li key={linea.id}>
              <Link
                to={RUTA_PORTAFOLIO}
                className="inline-block rounded-completo border border-borde px-3 py-2 text-cuerpo-s text-texto-suave transition-colors duration-rapida ease-estandar hover:border-borde-fuerte hover:text-texto"
              >
                {t(`fabrica.lineas.${linea.id}.nombre`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
