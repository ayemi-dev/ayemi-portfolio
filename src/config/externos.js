/**
 * Datos externos · un solo archivo
 *
 * Todo lo que depende de cuentas o decisiones que aún no existen vive aquí y
 * sale de variables de entorno `VITE_*` (ver .env.example). No hay valores
 * inventados: una variable vacía vale '' y quien la consume oculta su botón,
 * enlace o línea. El sitio nunca enseña un enlace roto.
 *
 * Las variables `VITE_` se incrustan al COMPILAR: después de cambiarlas en
 * Vercel hay que volver a desplegar.
 */

const env = (clave) => (import.meta.env[clave] ?? '').trim();

/** Aviso de privacidad (LFPDPPP). */
export const RESPONSABLE = {
  /** Nombre legal completo de la persona física responsable. */
  nombre: env('VITE_RESPONSABLE_NOMBRE'),
  /** Domicilio para oír y recibir notificaciones. */
  domicilio: env('VITE_RESPONSABLE_DOMICILIO'),
  /** Correo para derechos ARCO. Si falta, se usa el de contacto del sitio. */
  correo: env('VITE_PRIVACIDAD_CORREO'),
};
