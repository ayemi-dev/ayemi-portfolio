# Imágenes de las placas propias

Aquí van los renders de las placas que aparecen en `/pcb`. Cada placa tiene su
carpeta, con el mismo nombre que su `slug` en `src/config/placas.js`:

```
public/pcb/atmega328p/
public/pcb/esp32/
public/pcb/stm32/
```

1. Exporta tres vistas desde el visor 3D de KiCad: `perspectiva`, `superior` e
   `inferior`. Guárdalas como WebP, de unos 1600 px de ancho.
2. Anota el ancho y el alto de cada imagen: van en `ficha.dimensiones` para que
   la página no salte al cargar.
3. Rellena `estado` y `ficha` de la placa en `src/config/placas.js`.

Estados:

- `disenoVerificado`: ERC y DRC sin errores, archivos listos para fabricar.
- `fabricadoProbado`: solo cuando exista la foto de la placa física probada.
  El render no demuestra que se fabricó.

Solo entran placas diseñadas por Ayemi, con archivos propios.
