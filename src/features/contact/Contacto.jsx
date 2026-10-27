import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Seccion } from '../../components/layout/Seccion';
import { Boton } from '../../components/ui/Boton';
import { Campo } from '../../components/ui/Campo';
import { Aviso } from '../../components/ui/Aviso';
import { EstadoConEmi } from '../../components/marca/EstadoConEmi';
import {
  IconoCorreo,
  IconoEnlaceExterno,
  IconoMensaje,
  IconoUbicacion,
} from '../../components/marca/Iconos';
import {
  CONTACTO,
  FORMULARIO,
  PERFILES,
  SITIO,
  esPendiente,
} from '../../config/sitio';
import { rastrear } from '../../medicion/medicion';

/**
 * Contacto
 * Manual de Identidad Corporativa Ayemi · Edición 2.0 · §5.3, §5.4 y §1.10
 *
 * NORMA (§1.10, regla 3). Nunca se culpa al usuario. Los mensajes de error
 * describen qué falta y qué hacer, nunca qué hizo mal:
 *   ✗ «Ingresaste un dato inválido.»
 *   ✓ «Ese RFC tiene 11 caracteres y necesitamos 13. Revisa que no falte
 *      ninguno.»
 *
 * NORMA (§1.10, regla 4). Se admite lo que no se sabe. Si no hay endpoint
 * configurado, el formulario NO finge enviar: lo dice y abre un borrador de
 * correo con los datos ya escritos, de modo que el mensaje no se pierde en
 * silencio.
 *
 * NORMA (§5.3). Todo campo lleva etiqueta visible y los errores van debajo, en
 * texto, con icono. Lo resuelve <Campo>.
 *
 * NORMA (§5.4). Cargando: el elemento no responde a clic. Lo resuelve <Boton>.
 */

/* `sitioWeb` es el campo trampa contra robots. Va vacío siempre que lo rellene
   una persona, porque no lo ve ni lo alcanza con el teclado. El endpoint
   descarta en silencio cualquier envío que lo traiga con contenido. */
const CAMPOS_INICIALES = {
  nombre: '',
  correo: '',
  empresa: '',
  mensaje: '',
  sitioWeb: '',
};

export const Contacto = () => {
  const { t } = useTranslation();
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState('reposo');

  const actualizar = (clave) => (evento) => {
    setCampos((previos) => ({ ...previos, [clave]: evento.target.value }));
    /* El error se retira en cuanto la persona empieza a corregir. */
    setErrores((previos) => ({ ...previos, [clave]: undefined }));
  };

  /**
   * Validación en cliente.
   * Cada mensaje dice qué falta, no quién se equivocó (§1.10, regla 3).
   */
  const validar = () => {
    const nuevos = {};

    if (!campos.nombre.trim()) {
      nuevos.nombre = t('contacto.errores.nombreFalta');
    }

    const correo = campos.correo.trim();
    if (!correo) {
      nuevos.correo = t('contacto.errores.correoFalta');
    } else if (!correo.includes('@')) {
      nuevos.correo = t('contacto.errores.correoSinArroba');
    } else {
      const dominio = correo.split('@')[1] ?? '';
      if (!dominio.includes('.') || dominio.endsWith('.')) {
        nuevos.correo = t('contacto.errores.correoSinDominio');
      }
    }

    const mensaje = campos.mensaje.trim();
    if (!mensaje) {
      nuevos.mensaje = t('contacto.errores.mensajeFalta');
    } else if (mensaje.length < 20) {
      nuevos.mensaje = t('contacto.errores.mensajeCorto', {
        faltan: 20 - mensaje.length,
      });
    }

    return nuevos;
  };

  /** Respaldo honesto: compone un borrador con los datos ya escritos. */
  const abrirBorrador = () => {
    const asunto = t('contacto.borradorAsunto', { nombre: campos.nombre });
    const cuerpo = [
      `${t('contacto.campos.nombre')}: ${campos.nombre}`,
      `${t('contacto.campos.correo')}: ${campos.correo}`,
      campos.empresa && `${t('contacto.campos.empresa')}: ${campos.empresa}`,
      '',
      campos.mensaje,
    ]
      .filter(Boolean)
      .join('\n');

    const destino = esPendiente(CONTACTO.correo.valor)
      ? ''
      : CONTACTO.correo.valor;

    window.location.href = `mailto:${destino}?subject=${encodeURIComponent(
      asunto
    )}&body=${encodeURIComponent(cuerpo)}`;
  };

  const enviar = async (evento) => {
    evento.preventDefault();

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      setEstado('reposo');
      return;
    }

    /* Sin endpoint no se simula un envío: se abre el borrador y se dice. */
    if (!FORMULARIO.endpoint) {
      abrirBorrador();
      setEstado('borrador');
      return;
    }

    setEstado('enviando');
    try {
      const respuesta = await fetch(FORMULARIO.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campos),
      });

      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      setEstado('enviado');
      setCampos(CAMPOS_INICIALES);
      // Solo el envío que el servidor aceptó cuenta como conversión.
      rastrear('formulario_enviado', { ubicacion: 'contacto' });
    } catch {
      /* §1.10, regla 4 · Se dice que falló y se ofrece la vía alternativa. */
      setEstado('fallo');
    }
  };

  const canales = [
    !esPendiente(CONTACTO.correo.valor) && {
      clave: 'correo',
      Icono: IconoCorreo,
      etiqueta: t('contacto.canales.correo'),
      valor: CONTACTO.correo.valor,
      enlace: CONTACTO.correo.enlace,
    },
    !esPendiente(CONTACTO.whatsapp.valor) && {
      clave: 'whatsapp',
      Icono: IconoMensaje,
      etiqueta: t('contacto.canales.mensaje'),
      valor: CONTACTO.whatsapp.valor,
      enlace: CONTACTO.whatsapp.enlace,
    },
  ].filter(Boolean);

  const perfiles = PERFILES.filter((perfil) => !esPendiente(perfil.url));

  return (
    <Seccion
      id="contacto"
      etiqueta={t('contacto.etiqueta')}
      titulo={t('contacto.titulo')}
      acento={t('contacto.acento')}
      tituloDespues={t('contacto.tituloDespues')}
      entradilla={t('contacto.entradilla')}
      guia={t('contacto.guiaEmi')}
      /* Aquí Emi no orienta: escucha. La sección pide algo al visitante. */
      guiaSituacion="escucha"
    >
      <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
        {/* ── Formulario ───────────────────────────────────────────────────── */}
        <form onSubmit={enviar} noValidate className="max-w-lectura">
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Campo
                etiqueta={t('contacto.campos.nombre')}
                valor={campos.nombre}
                onChange={actualizar('nombre')}
                error={errores.nombre}
                requerido
                autoComplete="name"
              />
              <Campo
                etiqueta={t('contacto.campos.correo')}
                tipo="email"
                valor={campos.correo}
                onChange={actualizar('correo')}
                error={errores.correo}
                requerido
                autoComplete="email"
              />
            </div>

            <Campo
              etiqueta={t('contacto.campos.empresa')}
              ayuda={t('contacto.campos.empresaAyuda')}
              valor={campos.empresa}
              onChange={actualizar('empresa')}
              error={errores.empresa}
              autoComplete="organization"
            />

            <Campo
              etiqueta={t('contacto.campos.mensaje')}
              ayuda={t('contacto.campos.mensajeAyuda')}
              tipo="textarea"
              valor={campos.mensaje}
              onChange={actualizar('mensaje')}
              error={errores.mensaje}
              requerido
              maximo={FORMULARIO.maximoMensaje}
            />

            {/* Campo trampa. Un robot rellena todo lo que encuentra en el
                formulario; una persona no llega hasta aquí.

                Lleva aria-hidden y tabIndex -1 a propósito: si un lector de
                pantalla lo anunciara, alguien que navega sin ver podría
                rellenarlo de buena fe y su mensaje se descartaría sin aviso.
                Una defensa contra robots no puede convertirse en una trampa
                para personas. Por lo mismo no usa <Campo>, que exige etiqueta
                visible (§5.3): aquí esa etiqueta sería justo lo que no
                queremos. */}
            <div hidden aria-hidden="true">
              <label htmlFor="sitio-web">No rellenar</label>
              <input
                id="sitio-web"
                type="text"
                name="sitioWeb"
                value={campos.sitioWeb}
                onChange={actualizar('sitioWeb')}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>

          {/* §5.3 · Una sola acción principal. */}
          <div className="mt-8">
            <Boton
              variante="primario"
              tamano="grande"
              type="submit"
              cargando={estado === 'enviando'}
            >
              {estado === 'enviando'
                ? t('contacto.enviando')
                : t('contacto.enviar')}
            </Boton>
          </div>

          {/* ── Respuesta del formulario ─────────────────────────────────── */}
          {/* §7 · Carga, éxito y error están en la columna «Emi sí». Aquí va en
              formato de aviso, que usa el avatar: por debajo de 40 px el cuerpo
              completo sería una mancha ilegible.
              Su voz: segunda persona, dos frases, sin emojis, nunca culpa. */}
          <div
            className="mt-6 flex flex-col gap-4"
            aria-live="polite"
            aria-atomic="true"
          >
            {estado === 'enviando' && (
              <EstadoConEmi
                estado="cargando"
                formato="aviso"
                titulo={t('contacto.enviandoTitulo')}
              >
                {t('contacto.enviandoEmi')}
              </EstadoConEmi>
            )}

            {estado === 'enviado' && (
              <EstadoConEmi
                estado="exito"
                formato="aviso"
                titulo={t('contacto.exitoTitulo')}
              >
                {t('contacto.exitoTexto')}
              </EstadoConEmi>
            )}

            {estado === 'borrador' && (
              <Aviso tipo="info" titulo={t('contacto.borradorTitulo')}>
                {t('contacto.borradorTexto')}
              </Aviso>
            )}

            {estado === 'fallo' && (
              <EstadoConEmi
                estado="error"
                formato="aviso"
                titulo={t('contacto.falloTitulo')}
                accion={
                  <button
                    type="button"
                    onClick={abrirBorrador}
                    className="cursor-pointer rounded-sm text-cuerpo-s font-bold text-acento underline"
                  >
                    {t('contacto.falloAccion')}
                  </button>
                }
              >
                {t('contacto.falloTexto')}
              </EstadoConEmi>
            )}

            {Object.keys(errores).some((clave) => errores[clave]) && (
              <Aviso tipo="atencion" titulo={t('contacto.revisaTitulo')}>
                {t('contacto.revisaTexto')}
              </Aviso>
            )}
          </div>
        </form>

        {/* ── Canales directos ─────────────────────────────────────────────── */}
        <aside className="lg:w-72">
          <h3 className="text-titulo-4">{t('contacto.directoTitulo')}</h3>
          <p className="mt-2 text-cuerpo-s text-texto-suave">
            {t('contacto.directoTexto')}
          </p>

          {canales.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-4">
              {canales.map(({ clave, Icono, etiqueta, valor, enlace }) => (
                <li key={clave}>
                  <a
                    href={enlace}
                    className="group flex items-start gap-3 rounded-sm"
                  >
                    <Icono
                      tamano={20}
                      className="mt-0.5 shrink-0 text-acento"
                    />
                    <span className="min-w-0">
                      <span className="block text-cuerpo-s text-texto-tenue">
                        {etiqueta}
                      </span>
                      {/* §3.6 · Un correo o un teléfono son datos copiables. */}
                      <span className="block font-mono text-cuerpo-s break-words text-texto group-hover:text-acento">
                        {valor}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            /* §1.10, regla 4 · No se inventa un correo para rellenar el hueco. */
            <p className="mt-6 text-cuerpo-s text-texto-tenue">
              {t('contacto.sinCanales')}
            </p>
          )}

          {/* ── Ubicación y horario ───────────────────────────────────────── */}
          <div className="mt-8 flex items-start gap-3 border-t border-borde pt-6">
            <IconoUbicacion tamano={20} className="mt-0.5 shrink-0 text-acento" />
            <span>
              <span className="block text-cuerpo-s text-texto">
                {SITIO.ubicacion}
              </span>
              <span className="block font-mono text-micro text-texto-tenue">
                {SITIO.zonaHoraria}
              </span>
            </span>
          </div>

          {/* ── Perfiles ─────────────────────────────────────────────────── */}
          {perfiles.length > 0 && (
            <ul className="mt-8 flex flex-col gap-3 border-t border-borde pt-6">
              {perfiles.map((perfil) => (
                <li key={perfil.clave}>
                  <a
                    href={perfil.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm text-cuerpo-s text-texto-suave hover:text-acento"
                  >
                    {perfil.nombre}
                    <IconoEnlaceExterno tamano={16} />
                    <span className="sr-only">
                      {t('contacto.nuevaPestana')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </Seccion>
  );
};
