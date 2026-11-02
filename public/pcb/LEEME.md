# Imágenes de las placas propias

Aquí van los renders de las placas que aparecen en `/pcb`. Cada placa tiene su
carpeta, con el mismo nombre que su `slug` en `src/config/placas.js`:

```
public/pcb/atmega328p/
public/pcb/esp32/
public/pcb/stm32/
```

1. Pide los renders de KiCad con fondo transparente (`superior.png`,
   `inferior.png` e `isometrico.png`, con `kicad-cli pcb render --background
   transparent`).
2. Conviértelos y obtén el bloque `ficha` con sus medidas:

   ```bash
   python scripts/renders_placa.py <carpeta de renders> <slug>        --ancho-mm 90 --alto-mm 60 --capas 2 --componentes 71 --vias 436
   ```

   Deja `perspectiva.webp`, `superior.webp` e `inferior.webp` de 1600 px en
   esta carpeta. Las dimensiones van en `ficha.dimensiones` para que la página
   no salte al cargar.
3. Pega `ficha` en la placa de `src/config/placas.js` y pon el `estado` que
   alcanzó de verdad.

Estados, en orden. Nunca se marca uno que la placa no alcanzó:

- `disenoCompleto`: ERC y DRC en 0, renders completos (sin huellas vacías) y
  firmware que compila.
- `disenoVerificado`: además, el DFM de JLCPCB aprobado, con su captura.
- `fabricadoProbado`: solo cuando exista la foto de la placa física probada.
  El render no demuestra que se fabricó.

Solo entran placas diseñadas por Ayemi, con archivos propios.
