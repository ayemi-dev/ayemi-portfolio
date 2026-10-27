# Identidad Ayemi · reglas de trabajo

Resumen operativo del **Manual de Identidad Corporativa Ayemi · Edición 2.0**
(`docs/Ayemi_Manual_de_Identidad_v2.0.pdf`). Cuando este archivo y el manual se
contradigan, manda el manual. Las referencias `§` apuntan a sus apartados.

El manual distingue tres grados (§0.1): **Norma** («debe», «siempre», «nunca»)
no admite excepción; **Recomendación** («conviene») es el camino por defecto;
**Criterio abierto** («se puede») decide el ejecutor.

## Dónde vive el sistema

| Archivo                        | Qué contiene                                              |
| ------------------------------ | --------------------------------------------------------- |
| `src/styles/ayemi-tokens.css`  | Primitivas, roles semánticos, ambos temas, base, foco      |
| `src/styles/ayemi-fuentes.css` | Las tres familias, autoalojadas con `@fontsource`          |
| `src/styles/global.css`        | Tailwind, `@theme`, variantes de tema, fotogramas clave    |
| `src/components/marca/`        | Logotipo, firmas, isotipo, iconografía                     |
| `src/components/ui/Boton.jsx`  | Botones con las variantes y tamaños del §5.3               |
| `src/hooks/useTema.js`         | Conmutación de tema sobre `data-tema`                      |

## Color

**Norma (§5.1).** El código consume roles, no colores literales. Se escribe
`bg-lienzo` o `var(--ay-texto)`, nunca `#E2E8F0` ni un tinte suelto.

Roles disponibles como utilidad de Tailwind y como variable CSS:

```
lienzo · lienzo-profundo · lienzo-alterno · superficie · superficie-elevada
borde · borde-fuerte · texto · texto-suave · texto-tenue
acento · acento-hover · acento-activo · sobre-acento
exito · info · atencion · error
logo-tinta · logo-acento · logo-lema
```

Las primitivas (`cian-500`, `grafito-800`, `azul-500`, `verde-500`, `ambar-500`,
`rojo-500`…) existen para ilustración y gráficas. En interfaz se prefiere el rol.

- **Norma (§3.1).** Todos los colores salen de la paleta. La paleta por defecto
  de Tailwind está vaciada (`--color-*: initial`), así que `bg-slate-900` no
  compila. Si hace falta un color nuevo, lo aprueba la dirección de marca.
- **Norma (§3.1).** El cian es acento, no fondo. Reparto de referencia:
  60 % grafito, 30 % grises y texto, 10 % cian.
- **Norma (§3.2).** El Azul Núcleo no compite con el cian: nunca en botones
  primarios, ni en enlaces, ni en el foco.
- **Norma (§7.2).** Cian 500 no se usa como texto sobre fondo claro. El rol
  `acento` ya resuelve esto: vale Cian 500 en oscuro y Cian 800 en claro.
- **Norma (§3.5).** El degradado Corriente (`--ay-corriente`, `.ay-corriente`)
  es el único autorizado, y **ningún texto se coloca encima**. Tampoco toca el
  logotipo, la iconografía de interfaz, tablas ni formularios.

## Tipografía

| Familia           | Utilidad     | Para qué                                    |
| ----------------- | ------------ | ------------------------------------------- |
| Plus Jakarta Sans | `font-sans`  | Logotipo, titulares, interfaz, cuerpo       |
| Instrument Serif  | `font-serif` | Solo portadas, citas y manifiesto           |
| JetBrains Mono    | `font-mono`  | Código, datos, identificadores, etiquetas   |

**Norma (§3.7).** No se usa ningún tamaño fuera de la escala de doce peldaños.
La escala de Tailwind está vaciada (`--text-*: initial`), así que `text-sm` y
`text-4xl` no existen. Cada peldaño ya trae peso, tracking e interlínea:

```
display-2xl  display-xl  display-l
titulo-1  titulo-2  titulo-3  titulo-4
cuerpo-l  cuerpo  cuerpo-s
micro  etiqueta
```

- **Norma (§3.9).** Instrument Serif nunca en interfaz, tablas, formularios ni
  bloques de más de tres líneas. No se mezcla con la sans en la misma línea.
- **Norma (§3.6).** Los datos que el usuario podría copiar (identificadores,
  folios, RFC, importes, rutas, comandos) van siempre en monoespaciada.
- **Norma (§3.7).** La caja alta nunca se usa en textos de más de cinco
  palabras. Para etiquetas está `<Microetiqueta>` o la clase `.ay-etiqueta`.
- **Norma (§5.2).** La medida de línea se mantiene entre 60 y 80 caracteres:
  `max-w-lectura` (720 px).

## Espaciado, retícula y radios

**Norma (§5.2).** Base 4 px. Todo margen, relleno y hueco es múltiplo de 4. Un
`margin-top: 22px` es un error, no una decisión. La escala de Tailwind coincide,
así que `p-4`, `gap-6`, `mt-12` son válidos; los valores arbitrarios no.

Contenedores: `max-w-lectura` 720 · `max-w-lg` 1024 · `max-w-xl` 1280 ·
`max-w-2xl` 1440. El margen lateral por dispositivo es `var(--ay-margen)`.

Radios: `rounded-xs` 3 · `sm` 4 · `md` 6 (botones y campos, por defecto) ·
`lg` 10 (tarjetas) · `xl` 16 (modales) · `2xl` 24 · `completo`.

## Movimiento

Duraciones: `duration-instante` 80 ms · `duration-rapida` 150 ms ·
`duration-media` 240 ms · `duration-lenta` 400 ms.
Curvas: `ease-estandar` (por defecto) · `ease-entrada` · `ease-salida`.

- **Norma (§3.13).** Nada rebota. Sin `bounce`, sin `elastic`, sin
  sobreimpulso. El sistema es preciso, no juguetón.
- **Norma (§3.13).** Se respeta `prefers-reduced-motion`. Ya está resuelto en
  los tokens; no se anula.

## Componentes

- **Norma (§5.3).** Una sola acción principal por vista: un único botón
  primario. Se usa `<Boton variante="primario|secundario|terciario|destructivo">`
  con `tamano="pequeno|medio|grande"` (32 / 40 / 48 px de alto).
- **Norma (§5.3).** El texto del botón primario sobre cian va en Grafito 900.
  Nunca blanco sobre cian (2.06:1). El rol `sobre-acento` lo resuelve.
- **Norma (§5.3).** Área mínima de toque 44 × 44 px, aunque el control se vea
  menor. Se consigue con la clase `.ay-toque`.
- **Norma (§5.3).** Tarjetas: superficie, borde de 1 px, radio 10 px, relleno
  24 px, **sin sombra en reposo**. En tema oscuro la jerarquía se construye con
  luminosidad, no con sombras.
- **Norma (§5.3).** Todo campo lleva etiqueta visible; el placeholder no
  sustituye a la etiqueta. Los errores van en texto debajo del campo, con
  icono, nunca solo con color de borde.
- **Norma (§5.3).** Las tablas no llevan líneas verticales, solo un filete
  horizontal de 1 px entre filas. Las cantidades van en monoespaciada y
  alineadas a la derecha.

## Temas

**Norma (§5.6).** El tema oscuro es el predeterminado: es la identidad de
Ayemi, no una preferencia. El tema vive en `data-tema` del elemento `<html>`
(`"oscuro"` | `"claro"`); sin atributo se respeta `prefers-color-scheme`. El
guion de arranque de `index.html` lo fija antes del primer pintado.

El tema claro es obligatorio en documentos imprimibles, facturación y correo.

## Marca

- **Norma (§2.1).** El logotipo es puramente tipográfico. El acento cian ocupa
  la letra «i» **completa** (tallo y Núcleo) y ninguna otra letra.
- **Norma (§2.2).** El Núcleo es un círculo sólido, nunca un anillo.
- **Norma (§1.1).** Se escribe **Ayemi**: una sola palabra, A mayúscula
  inicial, resto en minúsculas. Nunca `AYEMI`, `AyEmi`, `Ayemí` ni `A-Yemi`.
  La excepción es la microetiqueta en caja alta, que es un recurso gráfico.
- **Norma (§2.5).** El isotipo solo en favicon, iconos de plataforma, avatar,
  icono de aplicación, sello por debajo de 15 mm y marca de agua. Fuera de esos
  casos manda el logotipo.
- **Norma (§2.11).** Mínimos en digital: logotipo 20 px de alto, firma vertical
  48 px, firma horizontal 24 px, isotipo 16 px.
- **Norma (§2.10).** Área de protección de 4 X alrededor del logotipo, siendo X
  el ancho del tallo de la «i». Dentro no entra nada.
- **Norma (§2.12).** Sobre Cian Ayemi el logotipo va a una sola tinta grafito:
  `<Logotipo variante="sobreCian" />`. Es el error más frecuente del sistema.

Usos incorrectos que no se repiten (§2.15): deformar, rotar, cambiar el color
del acento, aplicarlo a otra letra, **sombras / biseles / 3D / resplandor**,
degradado sobre la marca, recuadrarla, invadir su área de protección,
sustituir el Núcleo por otra forma.

## Iconografía

**Norma (§3.10).** No se mezclan iconos de librerías externas con la familia de
Ayemi: la coherencia de trazo es lo que hace familia a una familia. Los
pictogramas de interfaz se añaden a `src/components/marca/Iconos.jsx`, sobre
retícula de 24 × 24, área viva 20 × 20, trazo constante de 2 unidades, remates
y uniones redondos. Tamaños de uso: 16 / 20 / 24 / 32 / 48 px.

Los logotipos de terceros (React, Docker, Azure…) son marcas ajenas, no forman
parte de esta familia y no se recolorean.

## Patrones

**Norma (§3.11).** Los patrones van por debajo del contenido y con opacidad
entre 10 % y 30 %. No se colocan detrás de bloques de lectura ni de tablas, y
no se mezclan dos patrones en una misma pieza.

## Fotografía

**Norma (§3.12).** Ayemi no vende oficinas ni gente sonriendo frente a un
portátil. Sí: manos operando un sistema real, pantallas de producto propio,
detalle de proceso, el espacio real del cliente. No: reuniones de stock,
**pantallas falsas de código verde**, rascacielos, apretones de manos,
ilustración isométrica genérica.

## Tono de voz

Cuatro reglas (§1.10), iguales en una propuesta, un mensaje de error y una
publicación:

1. Primero el resultado, después el método.
2. Cifras concretas antes que adjetivos.
3. Nunca se culpa al usuario.
4. Se admite lo que no se sabe.

**Norma (§1.10).** Se trata de **tú** al usuario en producto y soporte. Nunca
«usted» en interfaz. Ayemi no es una marca personal, es una casa (§1.1): la voz
es primera del plural o segunda del singular, nunca primera del singular.

Léxico retirado (§1.11): «solución», «innovador», «disruptivo», «cliente
potencial», «levantar requerimientos», «recurso» por personas, «sinergia»,
«ecosistema», «holístico». Tampoco se adjetiva la propia capacidad («código
limpio»): se describe el resultado.

Elementos verbales fijos, exportados desde `marca/Logotipo.jsx`:
`LEMA` = «Ingeniería que fluye» · `MICROETIQUETA` = «INGENIERÍA QUE FLUYE» ·
`DESCRIPTOR` = «Fábrica de software e innovación».

## Accesibilidad

Objetivo declarado: **WCAG 2.1 nivel AA** (§5.5).

- **Norma (§5.4).** El anillo de foco nunca se elimina. `outline: none` sin
  sustitución visible es un fallo de accesibilidad, no una decisión estética.
  La regla `:focus-visible` de los tokens ya da 2 px de acento con 2 px de
  desplazamiento.
- **Norma (§5.5).** Independencia del color: todo estado lleva icono o texto
  además de color.
- **Norma (§5.5).** Un solo `h1` por vista, sin saltos de nivel. Toda la escala
  en `rem` para soportar zoom al 200 %. Los SVG de marca llevan `<title>` y
  `role="img"`.

Nota honesta del propio manual: estas medidas cubren lo verificable por cálculo
y por norma escrita. La conformidad completa exige además pruebas manuales con
lector de pantalla, navegación real por teclado y revisión por una persona
especializada. El sistema prepara esa auditoría, no la sustituye.

## Qué requiere aprobación

| Situación                                | Quién decide                 |
| ---------------------------------------- | ---------------------------- |
| Aplicar el sistema como está descrito     | Cualquier ejecutor           |
| Añadir un icono a la familia              | Dirección de marca           |
| Usar un color fuera de la paleta          | Dirección de marca           |
| Añadir un peldaño a la escala tipográfica | Dirección de marca           |
| Modificar el logotipo o el isotipo        | Solo nueva edición del manual |
| Cambiar el lema o el naming               | Solo nueva edición del manual |

## Pendiente de la dirección de marca

Estos activos que el manual da por entregados no están en el repositorio:

- `marca/01-logotipo/*.svg` — matrices del logotipo. Mientras falten,
  `<Logotipo>` reconstruye la palabra con la fuente resolviendo de forma
  explícita las dos pérdidas que §2.15 n.º 3 pretende evitar: el kerning por
  pares y el Núcleo circular. Al recibir las matrices basta cambiar el interior
  del componente; su API no cambia.
- `marca/04-mascota-emi/` — Emi (§4) no está implementada.
- `marca/05-iconografia/` — el inventario de dieciocho pictogramas.
- `marca/06-patrones/` — teselas Corriente, Retícula de Nodos y Vías.
- `tokens/` — el generador oficial. Aquí los tokens se escriben a mano en
  `ayemi-tokens.css`; si llega el generador, esta capa se sustituye por él.
