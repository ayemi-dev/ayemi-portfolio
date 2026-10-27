# Servicio de diseño de PCBs · `/pcb`

## Propósito

Página de servicio que explica qué recibe quien encarga una placa y cómo se
trabaja, y lleva a cotizar por WhatsApp. Solo muestra trabajo propio de Ayemi.

## Requisitos

1. **Portada.** Etiqueta, titular con una palabra en acento, entradilla y dos
   acciones: «Cotiza tu placa» (primaria, WhatsApp con mensaje prellenado) y
   «Ver el proceso» (secundaria). Sin imagen ni cifras mientras no exista una
   placa propia publicada.
2. **Lo que recibes.** Lista de entregables: esquemático, PCB editable,
   Gerber y taladros, BOM, CPL, modelo STEP, reporte ERC/DRC.
3. **Proceso.** Seis pasos (requisitos, esquemático, ruteo, verificación,
   archivos de fabricación, fabricación), cada uno con lo que queda en manos
   del cliente al cerrarlo. Sin placa de ejemplo.
4. **Placas propias.** Tres espacios genéricos: placa ATmega328P, placa ESP32
   y placa STM32 (`src/config/placas.js`). Nombres finales por definir.
   - Sin `ficha`, la tarjeta dice que el espacio está preparado y no muestra
     render ni cifras.
   - El estado es una escala de dos peldaños siempre visible:
     «Diseño verificado · listo para fabricar» y «Fabricado y probado».
     El peldaño alcanzado se marca con punto lleno y texto, no solo color.
   - `fabricadoProbado` exige foto de la placa física probada.
5. **Preguntas frecuentes** y **cierre** con WhatsApp y correo.
6. **Vista previa en redes.** `public/pcb/og-pcb.png` (1200×630) se genera con
   `pcb-ayemi/tools/og_pcb.py`: tipografía, logotipo y degradado Corriente.

## Fuera de alcance

Diseños de terceros o de empleadores, aunque se re-serigrafíen.
