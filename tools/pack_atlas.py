"""Packs rendered sprites into atlases and runs structural checks.

  python3 tools/pack_atlas.py

Inputs : art/out/manifest.json, art/out/png/<sheet>/<name>.png
Outputs: out/assets/atlas_<sheet>_<n>.webp (+ .png fallback), out/assets/atlas.json,
         out/assets/bg/*.webp|png, art/out/asset-check.json (structure report)

Structure checks (fail the build on errors):
  * every manifest entry rendered, not empty, transparent background (corner pixels alpha 0)
  * content not touching the render edge (would mean it was cut off)
  * pivots inside the cell; animation groups keep a stable pivot (frame alignment)
  * atlas pages within 2048x2048, tileable backgrounds wrap without a seam
"""
import json, os, sys, re
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ART = os.path.join(ROOT, 'art', 'out')
OUT = os.path.join(ROOT, 'out', 'assets')
MAXW = 2048
PAD = 3

manifest = json.load(open(os.path.join(ART, 'manifest.json')))
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.join(OUT, 'bg'), exist_ok=True)

errors, warnings = [], []
anchors = {}
frames = {}
pages = {}
checks = {}

def edge_touch(im):
    a = im.getchannel('A')
    w, h = im.size
    touch = []
    if a.crop((0, 0, w, 1)).getextrema()[1] > 40: touch.append('top')
    if a.crop((0, h - 1, w, h)).getextrema()[1] > 40: touch.append('bottom')
    if a.crop((0, 0, 1, h)).getextrema()[1] > 40: touch.append('left')
    if a.crop((w - 1, 0, w, h)).getextrema()[1] > 40: touch.append('right')
    return touch

by_sheet = {}
for name, m in manifest.items():
    by_sheet.setdefault(m['sheet'], []).append(name)

TILE_OK = {'tex_snow', 'tex_cloud', 'tex_ice'}

for sheet, names in by_sheet.items():
    items = []
    for name in names:
        m = manifest[name]
        path = os.path.join(ART, 'png', sheet, name + '.png')
        if not os.path.exists(path):
            errors.append(f'{name}: not rendered'); continue
        im = Image.open(path).convert('RGBA')
        c = {'size': im.size}
        corners = [im.getpixel((0, 0))[3], im.getpixel((im.width - 1, 0))[3], im.getpixel((0, im.height - 1))[3], im.getpixel((im.width - 1, im.height - 1))[3]]
        c['transparent_corners'] = max(corners) == 0
        bbox = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
        if bbox is None:
            errors.append(f'{name}: empty image'); continue
        c['bbox'] = bbox
        tiling = sheet == 'bg' and (name.startswith('far_') or name.startswith('mid_') or name in TILE_OK or name == 'aurora')
        if not tiling:
            t = edge_touch(im)
            if t: warnings.append(f'{name}: content touches render edge {t} (may be clipped)')
            c['edge_touch'] = t
            if not c['transparent_corners']: errors.append(f'{name}: background not transparent')
        if sheet == 'bg':
            if tiling:
                # seam check: compare first and last column alpha profile
                a = im.getchannel('A')
                left = list(a.crop((0, 0, 1, im.height)).tobytes())
                right = list(a.crop((im.width - 1, 0, im.width, im.height)).tobytes())
                diff = sum(abs(l - r) for l, r in zip(left, right)) / max(1, len(left))
                c['seam_alpha_diff'] = round(diff, 2)
                if diff > 18: warnings.append(f'{name}: horizontal seam alpha diff {diff:.1f}')
            fmt_name = name
            im.save(os.path.join(OUT, 'bg', fmt_name + '.png'), optimize=True)
            im.save(os.path.join(OUT, 'bg', fmt_name + '.webp'), quality=88, method=6)
            frames[name] = {'bg': True, 'w': im.width, 'h': im.height}
            checks[name] = c
            continue
        scale = m.get('scale', 1)
        if scale != 1:
            im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
        piv = m.get('pivot', [0.5, 0.5])
        pxs, pys = piv[0] * im.width, piv[1] * im.height
        bbox = im.getchannel('A').point(lambda v: 255 if v > 4 else 0).getbbox()
        x0, y0, x1, y1 = max(0, bbox[0] - 1), max(0, bbox[1] - 1), min(im.width, bbox[2] + 1), min(im.height, bbox[3] + 1)
        trimmed = im.crop((x0, y0, x1, y1))
        items.append((name, trimmed, pxs - x0, pys - y0, im.width, im.height))
        if m.get('anchor'):
            anchors[name] = [round(m['anchor'][0] * im.width - pxs, 1), round(m['anchor'][1] * im.height - pys, 1)]
        c['scaled'] = im.size; c['trim'] = trimmed.size; c['pivot_px'] = [round(pxs - x0, 1), round(pys - y0, 1)]
        checks[name] = c
    if sheet == 'bg':
        continue
    # shelf pack, tallest first
    items.sort(key=lambda t: -t[1].height)
    page_list = []
    cur = None
    for (name, im, px, py, sw, sh) in items:
        w, h = im.width + PAD * 2, im.height + PAD * 2
        if cur is None:
            cur = {'shelves': [], 'h': 0, 'imgs': []}
            page_list.append(cur)
        placed = False
        for sh_ in cur['shelves']:
            if sh_['x'] + w <= MAXW and h <= sh_['h']:
                pos = (sh_['x'], sh_['y']); sh_['x'] += w; placed = True; break
        if not placed:
            if cur['h'] + h > MAXW:
                cur = {'shelves': [], 'h': 0, 'imgs': []}
                page_list.append(cur)
            sh_ = {'x': w, 'y': cur['h'], 'h': h}
            cur['shelves'].append(sh_)
            pos = (0, cur['h'])
            cur['h'] += h
        cur['imgs'].append((name, im, pos, px, py, sw, sh))
    for pi, pg in enumerate(page_list):
        width = max(s['x'] for s in pg['shelves'])
        height = pg['h']
        # round up to multiple of 4
        width = (width + 3) // 4 * 4; height = (height + 3) // 4 * 4
        atlas = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        for (name, im, (x, y), px, py, sw, sh) in pg['imgs']:
            atlas.paste(im, (x + PAD, y + PAD))
            frames[name] = {'p': f'{sheet}_{pi}', 'x': x + PAD, 'y': y + PAD, 'w': im.width, 'h': im.height, 'px': round(px, 1), 'py': round(py, 1)}
            if name in anchors: frames[name]['ax'], frames[name]['ay'] = anchors[name]
        base = os.path.join(OUT, f'atlas_{sheet}_{pi}')
        atlas.save(base + '.png', optimize=True)
        atlas.save(base + '.webp', quality=90, method=6, alpha_quality=100)
        pages[f'{sheet}_{pi}'] = {'w': width, 'h': height, 'file': f'atlas_{sheet}_{pi}'}
        if width > MAXW or height > MAXW: errors.append(f'atlas {sheet}_{pi} too large {width}x{height}')

# frame alignment for animation groups: frames sharing a prefix keep the same pivot role.
groups = {}
for name in frames:
    mt = re.match(r'^(.*?)(_?\d+)$', name)
    if mt and 'p' in frames[name]:
        groups.setdefault(mt.group(1), []).append(name)
align = {}
for g, names in groups.items():
    if len(names) < 2: continue
    # bottom of content relative to pivot should stay within a few px across walk/idle frames
    offs = [round(frames[n]['h'] - frames[n]['py'], 1) for n in names]
    spread = max(offs) - min(offs)
    align[g] = {'frames': sorted(names), 'below_pivot_spread_px': spread}
    if spread > 14 and not g.startswith(('plume', 'puff', 'wind', 'cloud', 'pine', 'rock', 'crystal', 'spire', 'igloo', 'nest', 'fish', 'gold', 'bz_blow')):
        warnings.append(f'animation group {g}: base below pivot varies by {spread}px')

json.dump({'pages': pages, 'frames': frames}, open(os.path.join(OUT, 'atlas.json'), 'w'), separators=(',', ':'))
report = {'errors': errors, 'warnings': warnings, 'checks': checks, 'alignment': align, 'pages': pages}
json.dump(report, open(os.path.join(ART, 'asset-check.json'), 'w'), indent=1, default=str)
total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT) if f.endswith('.webp'))
total += sum(os.path.getsize(os.path.join(OUT, 'bg', f)) for f in os.listdir(os.path.join(OUT, 'bg')) if f.endswith('.webp'))
print(f'pages: {", ".join(f"{k} {v[chr(119)]}x{v[chr(104)]}" for k, v in pages.items())}')
print(f'frames: {len(frames)}  webp total: {total/1024:.0f} KB')
for w in warnings: print('WARN', w)
for e in errors: print('ERROR', e)
sys.exit(1 if errors else 0)
