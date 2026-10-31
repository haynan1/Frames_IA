"""Optimize native imagegen outputs without cropping, enlarging or recreating them.

The source manifest is private, ignored working state. Only dimensions, filenames
and relative public paths are included in the published asset registry.
"""
import json
import re
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
sources = json.loads((ROOT / '.work/gallery-sources.json').read_text(encoding='utf-8-sig'))
registry = {}
comparisons = {}
for record in sources:
    study = record['study']
    frame = record['frame']
    if not re.fullmatch(r'[a-z0-9-]+', study) or frame not in (1, 2, 3):
        raise ValueError('Invalid asset identity')
    source = Path(record['source'])
    target_dir = ROOT / 'assets/gallery' / study
    target_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        picture = ImageOps.exif_transpose(original).convert('RGB')
        width, height = picture.size
        target = target_dir / f'{frame:02}.webp'
        thumbnail = target_dir / f'{frame:02}-thumb.webp'
        picture.save(target, quality=92, method=6)
        thumb = picture.copy()
        thumb.thumbnail((640, 800), Image.Resampling.LANCZOS)
        thumb.save(thumbnail, quality=85, method=6)
        key = './' + target.relative_to(ROOT).as_posix()
        if key in registry:
            raise ValueError('Duplicate frame identity')
        registry[key] = {
            'width': width, 'height': height, 'bytes': target.stat().st_size,
            'thumbnailWidth': thumb.width, 'thumbnailHeight': thumb.height,
            'sourceFilename': source.name, 'generatedAt': '2026-10-30',
            'method': 'built-in image_gen', 'upscaled': False,
            'referenceFrame': None if frame == 1 else f'{study}-01.webp'
        }

comparison_manifest = ROOT / '.work/gallery-comparison.json'
if comparison_manifest.exists():
    comparison_source = json.loads(comparison_manifest.read_text(encoding='utf-8-sig'))
    with Image.open(comparison_source['source']) as original:
        picture = ImageOps.exif_transpose(original).convert('RGB')
        comparison_target = ROOT / 'assets/gallery/ambar-deserto/tentativa-repetida.webp'
        picture.save(comparison_target, quality=90, method=6)
        comparisons['ambar-deserto'] = {'candidate':'./assets/gallery/ambar-deserto/tentativa-repetida.webp','width':picture.width,'height':picture.height,'sourceFilename':Path(comparison_source['source']).name}

(ROOT / 'data/gallery-assets.js').write_text(
    '// Verified dimensions and provenance of the original generated frames.\n'
    'export const galleryAssets=' + json.dumps(registry, ensure_ascii=False, indent=2) + ';\n'
    'export const galleryComparisons=' + json.dumps(comparisons, ensure_ascii=False, indent=2) + ';\n',
    encoding='utf-8'
)
print(f'{len(registry)} individual frames optimized at native dimensions.')

if len(registry) == 30:
    ids = list(dict.fromkeys(record['study'] for record in sources))
    overview = Image.new('RGB', (1600, 800), '#111210')
    for index, study in enumerate(ids):
        with Image.open(ROOT / 'assets/gallery' / study / '02.webp') as picture:
            tile = ImageOps.contain(picture.convert('RGB'), (312, 390))
            x = (index % 5) * 320 + (320 - tile.width) // 2
            y = (index // 5) * 400 + (400 - tile.height) // 2
            overview.paste(tile, (x, y))
    overview.save(ROOT / 'assets/gallery/overview.webp', quality=87, method=6)
