# Pendientes de permiso

Archivos que ya están listos pero **no se publican** hasta tener el permiso
por escrito de su dueño. Esta carpeta no está en `public/`, así que Vercel no
la sirve.

## casos/ita/

Capturas del sitio de ITA donde sale su personal.

Cuando ITA lo autorice por escrito:

1. Mueve los tres `.jpg` a `contenido/proyectos/ita-2026/medios/`. El build
   los copia a `public/proyectos/ita-2026/`.
2. En `contenido/proyectos/ita-2026/proyecto.json`, cambia `permisoPersonal`
   a `true`.
