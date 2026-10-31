"""Ingest generated images into the FRAME Studio.

Reads PNG/JPG/WebP files that an image agent (Codex) saved in incoming/ and
publishes optimized WebP copies at the paths the site expects:

  incoming/<REQUEST-ID>.png                 -> target from docs/codex/fila.json
  incoming/projects/<slug>/<file>.png       -> assets/projects/<slug>/<file>.webp

Each image keeps its native resolution (no upscale, no crop), gets a thumbnail
and is registered in data/generated-assets.js. Originals move to
incoming/processed/, which Git ignores.

Usage:
  python scripts/ingest-images.py            # ingest everything waiting
  python scripts/ingest-images.py --dry-run  # only report what would happen
Then run `npm run check` so the queue documents and tests are refreshed.
"""
import argparse
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / 'incoming'
QUEUE = ROOT / 'docs/codex/fila.json'
REGISTRY = ROOT / 'data/generated-assets.js'
SUFFIXES = {'.png', '.jpg', '.jpeg', '.webp'}
ID = re.compile(r'^[A-Z0-9][A-Z0-9-]{2,80}$')
SLUG = re.compile(r'^[a-z0-9][a-z0-9-]{0,47}$')
NAME = re.compile(r'^[a-z0-9][a-z0-9-]{0,60}$')
MIN_SHORT_SIDE = 768
THUMB_BOX = (640, 960)
# Generators return ~1.5 MP; anything far larger is not a generated frame.
Image.MAX_IMAGE_PIXELS = 40_000_000


def inside(path: Path, base: Path) -> bool:
    try:
        path.resolve().relative_to(base.resolve())
        return True
    except ValueError:
        return False


def load_registry() -> dict:
    if not REGISTRY.exists():
        return {}
    text = REGISTRY.read_text(encoding='utf-8')
    body = text[text.index('generatedAssets') :]
    body = body[body.index('=') + 1 : body.rindex(';')].strip()
    return json.loads(body)


def save_registry(registry: dict) -> None:
    REGISTRY.write_text(
        '// Written by scripts/ingest-images.py. Do not edit by hand: each entry proves that\n'
        '// a requested image was generated, optimized and stored at its public path.\n'
        'export const generatedAssets = ' + json.dumps(dict(sorted(registry.items())), ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8',
    )


def queue_revisions() -> dict[str, str]:
    """Request id -> current revision, for requests reopened in data/image-revisions.js."""
    queue = json.loads(QUEUE.read_text(encoding='utf-8'))
    return {r['id']: r['revision'] for r in queue['requests'] if r.get('revision')}


def plan() -> list[tuple[Path, str, str]]:
    """Return (source, target, request id) for every file waiting in incoming/."""
    queue = json.loads(QUEUE.read_text(encoding='utf-8'))
    targets = {r['id']: r['target'] for r in queue['requests']}
    jobs, problems = [], []
    if not INCOMING.exists():
        return jobs
    for source in sorted(INCOMING.iterdir()):
        if source.is_file() and source.suffix.lower() in SUFFIXES:
            request = source.stem.upper()
            if not ID.match(request) or request not in targets:
                problems.append(f'{source.name}: ID desconhecido na fila')
                continue
            jobs.append((source, targets[request], request))
    projects = INCOMING / 'projects'
    if projects.exists():
        for folder in sorted(p for p in projects.iterdir() if p.is_dir()):
            if not SLUG.match(folder.name):
                problems.append(f'projects/{folder.name}: slug inválido')
                continue
            for source in sorted(folder.iterdir()):
                if source.is_file() and source.suffix.lower() in SUFFIXES:
                    if not NAME.match(source.stem):
                        problems.append(f'projects/{folder.name}/{source.name}: nome inválido')
                        continue
                    jobs.append((source, f'assets/projects/{folder.name}/{source.stem}.webp', f'PROJECT:{folder.name}/{source.stem}'))
    for message in problems:
        print('IGNORADO ·', message)
    return jobs


def ingest(source: Path, target: str, request: str, registry: dict, revision: str | None = None) -> None:
    destination = ROOT / target
    if not inside(destination, ROOT / 'assets') or destination.suffix != '.webp':
        raise ValueError(f'Destino fora de assets/: {target}')
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        picture = ImageOps.exif_transpose(original).convert('RGB')
    if min(picture.size) < MIN_SHORT_SIDE:
        raise ValueError(f'{source.name}: {picture.width}x{picture.height} é pequeno demais (mínimo {MIN_SHORT_SIDE}px no lado menor)')
    picture.save(destination, quality=90, method=6)
    thumb_path = destination.with_name(destination.stem + '-thumb.webp')
    thumb = picture.copy()
    thumb.thumbnail(THUMB_BOX, Image.Resampling.LANCZOS)
    thumb.save(thumb_path, quality=84, method=6)
    registry[target] = {
        'width': picture.width,
        'height': picture.height,
        'bytes': destination.stat().st_size,
        'thumb': thumb_path.relative_to(ROOT).as_posix(),
        'request': request,
        'sourceFilename': source.name,
        'generatedAt': date.today().isoformat(),
        'method': 'Codex image generation',
        'upscaled': False,
    }
    if revision:
        # Marks the reopened request as redone; without it the queue keeps asking for this image.
        registry[target]['revision'] = revision
    processed = INCOMING / 'processed'
    processed.mkdir(exist_ok=True)
    shutil.move(str(source), processed / f'{request.replace(":", "-").replace("/", "-")}{source.suffix.lower()}')


def main() -> None:
    sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    jobs = plan()
    if not jobs:
        print('Nada em incoming/. Salve os PNGs como incoming/<ID>.png (veja docs/codex/FILA-DE-IMAGENS.md).')
        return
    if args.dry_run:
        for source, target, request in jobs:
            print(f'{source.relative_to(ROOT)} -> {target} ({request})')
        return
    registry = load_registry()
    revisions = queue_revisions()
    done = 0
    for source, target, request in jobs:
        try:
            ingest(source, target, request, registry, revisions.get(request))
            save_registry(registry)  # persist per image so an interrupted batch never orphans files
            done += 1
            print(f'OK · {request} -> {target}')
        except (OSError, ValueError, Image.DecompressionBombError) as error:
            print(f'ERRO · {source.name}: {error}')
    print(f'{done}/{len(jobs)} imagens publicadas. Rode `npm run check` para atualizar a fila e os testes.')


if __name__ == '__main__':
    main()
