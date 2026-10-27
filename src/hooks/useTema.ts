/**
 * AYEMI · useTema
 * ===============
 * Gestion del tema. El oscuro es el predeterminado porque es la identidad de
 * Ayemi, no una preferencia del usuario.
 *
 * El tema claro es obligatorio en vistas imprimibles, facturacion y correo.
 *
 *   const { tema, resuelto, definir, alternar } = useTema();
 */

import { useCallback, useEffect, useState } from 'react';

export type Tema = 'oscuro' | 'claro' | 'sistema';
export type TemaResuelto = 'oscuro' | 'claro';

const CLAVE = 'ayemi:tema';

function leerGuardado(): Tema {
  if (typeof window === 'undefined') return 'oscuro';
  const v = window.localStorage.getItem(CLAVE);
  return v === 'claro' || v === 'oscuro' || v === 'sistema' ? v : 'oscuro';
}

function preferenciaSistema(): TemaResuelto {
  if (typeof window === 'undefined') return 'oscuro';
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'claro'
    : 'oscuro';
}

function aplicar(tema: Tema): TemaResuelto {
  const resuelto: TemaResuelto = tema === 'sistema' ? preferenciaSistema() : tema;
  const raiz = document.documentElement;
  if (tema === 'sistema') {
    raiz.removeAttribute('data-tema');
  } else {
    raiz.setAttribute('data-tema', tema);
  }
  raiz.style.colorScheme = resuelto === 'oscuro' ? 'dark' : 'light';
  return resuelto;
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(leerGuardado);
  const [resuelto, setResuelto] = useState<TemaResuelto>('oscuro');

  useEffect(() => {
    setResuelto(aplicar(tema));
    window.localStorage.setItem(CLAVE, tema);
  }, [tema]);

  useEffect(() => {
    if (tema !== 'sistema') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const alCambiar = () => setResuelto(aplicar('sistema'));
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, [tema]);

  const definir = useCallback((siguiente: Tema) => setTema(siguiente), []);
  const alternar = useCallback(
    () => setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro')),
    [],
  );

  return { tema, resuelto, definir, alternar };
}

/**
 * Script de arranque para evitar el destello de tema incorrecto.
 * Insertalo inline en el <head>, antes de cualquier CSS.
 */
export const GUION_ANTIDESTELLO = `(function(){try{
var t=localStorage.getItem('ayemi:tema')||'oscuro';
if(t!=='sistema'){document.documentElement.setAttribute('data-tema',t);}
var r=t==='sistema'?(matchMedia('(prefers-color-scheme: light)').matches?'claro':'oscuro'):t;
document.documentElement.style.colorScheme=r==='oscuro'?'dark':'light';
}catch(e){}})();`;

export default useTema;
