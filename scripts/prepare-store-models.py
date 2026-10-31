"""Prepare private references of the Sarcenet store models for the Studio.

Reads (never writes) the store's clothing folder and saves clean crops in
references/sarcenet/modelos/, which Git ignores and the site never publishes:

  sarcenet-modelo-a-{rosto,corpo,costas}.png   from MODELO LOJA (the gallery model)
  sarcenet-modelo-NN-{rosto,corpo,costas}.png  from the 20 sheets in MODELOS SARCENET

The store manual asks for identity from a clean face close-up, never from a collage with text,
so each sheet is cut into its face panel, its front body panel (without the layout text) and its
back panel.

Usage:
  python scripts/prepare-store-models.py --origem "<...>/LOJA SARCENET/07 - VESTUARIO" [--dry-run]
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "references" / "sarcenet" / "modelos"
Image.MAX_IMAGE_PIXELS = 40_000_000
MIN_SIDE = 600

# Panel boxes as fractions of a model sheet (left, top, right, bottom), measured on the 20 sheets.
SHEET_PANELS = {
    "rosto": (0.55, 0.095, 0.978, 0.42),
    "corpo": (0.205, 0.01, 0.535, 0.985),
    "costas": (0.787, 0.44, 0.975, 0.828),
}
LOJA_FILES = {"rosto": "LOJA_rosto_principal.jpg", "corpo": "LOJA_corpo_frente.jpg", "costas": "LOJA_corpo_costas.jpg"}


def find_dir(base: Path, suffix: str) -> Path:
    """Folders carry a renumbered prefix ("06 - "); match by name, never by number."""
    for path in base.rglob("*"):
        if path.is_dir() and re.sub(r"^\d+\s*-\s*", "", path.name).casefold() == suffix.casefold():
            return path
    raise SystemExit(f"Pasta '{suffix}' não encontrada em {base}")


SMALL: list[str] = []


def save(image: Image.Image, name: str, dry_run: bool) -> None:
    if min(image.size) < MIN_SIDE:
        SMALL.append(name)
    target = DEST / name
    if dry_run:
        print(f"  [simulação] {target.relative_to(ROOT)} {image.size[0]}×{image.size[1]}")
        return
    tmp = target.with_suffix(".tmp")
    image.convert("RGB").save(tmp, "PNG", optimize=True)
    tmp.replace(target)
    print(f"  {target.relative_to(ROOT)} {image.size[0]}×{image.size[1]}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--origem", required=True, type=Path, help="pasta 07 - VESTUARIO da loja (somente leitura)")
    parser.add_argument("--dry-run", action="store_true", help="mostra o que seria gerado sem gravar")
    args = parser.parse_args()
    origem = args.origem.resolve()
    if not origem.is_dir():
        raise SystemExit(f"Origem inexistente: {origem}")
    if ROOT in origem.parents or origem == ROOT:
        raise SystemExit("A origem deve ser a pasta da loja, fora do projeto.")
    if not args.dry_run:
        DEST.mkdir(parents=True, exist_ok=True)

    loja = find_dir(origem, "MODELO LOJA")
    print("MODELO-A ·", loja)
    for view, filename in LOJA_FILES.items():
        source = loja / filename
        if not source.is_file():
            print(f"  ausente: {filename}")
            continue
        with Image.open(source) as image:
            save(image, f"sarcenet-modelo-a-{view}.png", args.dry_run)

    sheets = find_dir(origem, "MODELOS SARCENET")
    print("Fichas ·", sheets)
    for path in sorted(sheets.glob("*.png")):
        match = re.match(r"^(\d{2})\s*-\s*imagem\.png$", path.name, re.IGNORECASE)
        if not match:
            continue
        number = match.group(1)
        with Image.open(path) as image:
            width, height = image.size
            for view, (left, top, right, bottom) in SHEET_PANELS.items():
                box = (round(width * left), round(height * top), round(width * right), round(height * bottom))
                save(image.crop(box), f"sarcenet-modelo-{number}-{view}.png", args.dry_run)
    if SMALL:
        print(f"\nAviso: {len(SMALL)} recortes têm o lado menor abaixo de {MIN_SIDE} px, porque as fichas são pequenas "
              "(cerca de 1100 px). Funcionam como referência de traços; para mais fidelidade, exporte fichas maiores.")
    return 0


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
