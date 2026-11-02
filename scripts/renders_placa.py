"""
Renders de una placa para /pcb
==============================
Convierte los renders de KiCad de una placa (`superior.png`, `inferior.png` e
`isometrico.png`, como los deja `tools/renders.py` en pcbAyemi) en las tres
vistas WebP de la ficha, y escribe el bloque `ficha` listo para pegar en
`src/config/placas.js`.

    python scripts/renders_placa.py <carpeta de renders> <slug> \
        --ancho-mm 90 --alto-mm 60 --capas 2 --componentes 71 --vias 436

Cada vista se recorta al contorno de la placa (con un margen), se lleva a
1600 px de ancho y se guarda en `public/pcb/<slug>/`. `--salida` cambia la
carpeta, para probar sin tocar `public/`.

El script no cambia `estado`: el peldaño lo decide una persona (ver la
escalera en placas.js). Requiere Pillow.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops

ANCHO = 1600
MARGEN = 0.04  # del lado mayor, alrededor del contorno de la placa
# Vista de la ficha ← archivo de KiCad
VISTAS = {"perspectiva": "isometrico.png", "superior": "superior.png", "inferior": "inferior.png"}


def recortar(imagen: Image.Image) -> Image.Image:
    """Recorta el fondo alrededor de la placa.

    Lo esperado es un PNG con fondo transparente (`kicad-cli pcb render
    --background transparent`): se recorta por el canal alfa y la transparencia
    se conserva, para que la tarjeta ponga su propio fondo. Con fondo opaco se
    recorta solo si es liso; el degradado por omisión de KiCad no se puede
    separar de la placa y el script se detiene.
    """
    if imagen.mode in ("RGBA", "LA") and imagen.getextrema()[-1][0] < 255:
        img = imagen.convert("RGBA")
        caja = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    else:
        img = imagen.convert("RGB")
        esquinas = {img.getpixel(p) for p in ((0, 0), (img.width - 1, 0),
                                               (0, img.height - 1), (img.width - 1, img.height - 1))}
        if len(esquinas) > 1:
            raise SystemExit("El render tiene un fondo degradado. Expórtalo con "
                             "`--background transparent` en kicad-cli.")
        fondo = Image.new("RGB", img.size, esquinas.pop())
        caja = (ImageChops.difference(img, fondo).convert("L")
                .point(lambda v: 255 if v > 12 else 0).getbbox())
    if caja is None:
        raise SystemExit("La imagen es solo fondo: revisa el render.")
    margen = int(max(caja[2] - caja[0], caja[3] - caja[1]) * MARGEN)
    caja = (max(caja[0] - margen, 0), max(caja[1] - margen, 0),
            min(caja[2] + margen, img.width), min(caja[3] + margen, img.height))
    return img.crop(caja)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("renders", type=Path)
    p.add_argument("slug")
    p.add_argument("--ancho-mm", type=float, required=True)
    p.add_argument("--alto-mm", type=float, required=True)
    p.add_argument("--capas", type=int, required=True)
    p.add_argument("--componentes", type=int, required=True)
    p.add_argument("--vias", type=int, required=True)
    p.add_argument("--salida", type=Path, help="carpeta de salida (por omisión public/pcb/<slug>)")
    a = p.parse_args()

    raiz = Path(__file__).resolve().parent.parent
    salida = a.salida or raiz / "public" / "pcb" / a.slug
    faltan = [f for f in VISTAS.values() if not (a.renders / f).is_file()]
    if faltan:
        sys.exit(f"Faltan renders en {a.renders}: {', '.join(faltan)}")

    salida.mkdir(parents=True, exist_ok=True)
    imagenes, dimensiones = {}, {}
    for vista, archivo in VISTAS.items():
        img = recortar(Image.open(a.renders / archivo))
        img = img.resize((ANCHO, round(img.height * ANCHO / img.width)), Image.LANCZOS)
        destino = salida / f"{vista}.webp"
        img.save(destino, "WEBP", quality=86, method=6)
        imagenes[vista] = f"/pcb/{a.slug}/{vista}.webp"
        dimensiones[vista] = list(img.size)
        print(f"{destino}  {img.width} × {img.height}  {destino.stat().st_size // 1024} KB")

    ficha = {
        "ancho_mm": a.ancho_mm, "alto_mm": a.alto_mm, "capas": a.capas,
        "componentes": a.componentes, "vias": a.vias,
        "imagenes": imagenes, "dimensiones": dimensiones,
    }
    print("\nficha para src/config/placas.js:\n")
    print(json.dumps(ficha, ensure_ascii=False, indent=2).replace(".0,", ","))


if __name__ == "__main__":
    main()
