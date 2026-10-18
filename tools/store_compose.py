#!/usr/bin/env python3
"""Store screenshots (1080x1920): a caption band over the real game frame from tools/store-shots.mjs,
and the 1024x500 feature graphic.

python3 tools/store_compose.py [lang]  -> out/release/screenshots/ (ko) or out/release/screenshots-en/
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LANG = sys.argv[1] if len(sys.argv) > 1 else 'ko'
SRC = os.path.join(ROOT, '.cache/stills', LANG)
OUT = os.path.join(ROOT, 'out/release', 'screenshots' if LANG == 'ko' else 'screenshots-' + LANG)
INK = (30, 35, 80)

CAPTIONS = {
    'ko': {
        '01_soar': '꾹 누르고, 떼면\n하늘 높이!',
        '02_rush': '완벽한 착지로\n눈꽃 질주',
        '03_blizzard': '바짝 따라오는\n눈보라를 따돌려요',
        '04_village': '물고기로\n펭귄 마을을 키워요',
        '05_upgrade': '강화하면 다음 판에\n바로 더 높이',
        '06_rings': '오로라 섬에서\n빛의 고리를 통과',
        '07_sunset': '아홉 개의 섬을\n건너 하늘 끝까지',
        '08_map': '섬마다 새로운\n목표와 보상',
    },
    'en': {
        '01_soar': 'Hold to slide,\nlet go to soar!',
        '02_rush': 'Land perfectly\nfor a Snow Rush',
        '03_blizzard': 'Shake off the\nblizzard behind you',
        '04_village': 'Grow your\npenguin village',
        '05_upgrade': 'Upgrade and fly\nhigher next run',
        '06_rings': 'Fly through the\naurora rings',
        '07_sunset': 'Cross nine islands\nto the end of the sky',
        '08_map': 'New goals and\nrewards on every island',
    },
}
# background tint per screenshot (top, bottom) taken from the island's sky
TINT = {
    '01_soar': ((70, 168, 240), (150, 214, 255)), '02_rush': ((54, 150, 228), (140, 210, 250)),
    '03_blizzard': ((60, 170, 210), (150, 225, 240)), '04_village': ((96, 150, 230), (180, 210, 250)),
    '05_upgrade': ((90, 110, 210), (160, 180, 245)), '06_rings': ((26, 30, 80), (70, 70, 150)),
    '07_sunset': ((150, 90, 190), (250, 160, 170)), '08_map': ((60, 120, 210), (150, 200, 250)),
}


def font(size):
    if LANG == 'ko':
        return ImageFont.truetype(os.path.join(ROOT, 'art/fonts/Jua-Regular.ttf'), size)
    f = ImageFont.truetype(os.path.join(ROOT, 'art/fonts/Fredoka.ttf'), size)
    f.set_variation_by_axes([620, 100])
    return f


def gradient(w, h, top, bottom):
    g = Image.new('RGB', (1, h))
    for y in range(h):
        k = y / (h - 1)
        g.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * k) for i in range(3)))
    return g.resize((w, h))


def outlined_text(img, xy, text, f, fill=(255, 255, 255), stroke=10, anchor='ma', spacing=10):
    d = ImageDraw.Draw(img)
    # soft drop shadow, then ink outline + white fill
    sh = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).multiline_text((xy[0], xy[1] + 10), text, font=f, fill=INK + (150,), anchor=anchor, align='center', spacing=spacing, stroke_width=stroke, stroke_fill=INK + (150,))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(4)))
    d.multiline_text(xy, text, font=f, fill=fill, anchor=anchor, align='center', spacing=spacing, stroke_width=stroke, stroke_fill=INK)


def rounded(im, r):
    m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], r, fill=255)
    out = im.convert('RGBA')
    out.putalpha(m)
    return out


def screenshot(name):
    W, H = 1080, 1920
    top, bottom = TINT[name]
    img = gradient(W, H, top, bottom).convert('RGBA')
    # decorative snow dots
    d = ImageDraw.Draw(img)
    import random
    rnd = random.Random(hash(name) & 0xffff)
    for _ in range(46):
        x, y, r = rnd.randint(0, W), rnd.randint(0, 420), rnd.randint(3, 9)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, rnd.randint(70, 170)))
    cap = CAPTIONS[LANG][name]
    size = 96 if LANG == 'ko' else 88
    f = font(size)
    while max(d.textlength(line, font=f) for line in cap.split('\n')) > W - 120:
        size -= 4
        f = font(size)
    outlined_text(img, (W // 2, 74), cap, f, spacing=14)
    # the game frame
    shot = Image.open(os.path.join(SRC, name + '.png')).convert('RGB')
    k = 0.775
    sw, shh = int(1080 * k), int(1920 * k)
    shot = shot.resize((sw, shh), Image.LANCZOS)
    x0, y0 = (W - sw) // 2, H - shh - 46
    frame = Image.new('RGBA', (sw + 24, shh + 24), (0, 0, 0, 0))
    ImageDraw.Draw(frame).rounded_rectangle([0, 0, sw + 23, shh + 23], 58, fill=INK + (255,))
    shadow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([x0 - 12, y0 + 6, x0 + sw + 12, y0 + shh + 30], 58, fill=(20, 24, 60, 120))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(14)))
    img.alpha_composite(frame, (x0 - 12, y0 - 12))
    img.alpha_composite(rounded(shot, 48), (x0, y0))
    return img.convert('RGB')


def feature():
    src = os.path.join(SRC, 'feature@2x.png')
    if not os.path.exists(src):
        return
    im = Image.open(src).convert('RGB').resize((1024, 500), Image.LANCZOS)
    p = os.path.join(ROOT, 'out/release', 'feature-1024x500.png' if LANG == 'ko' else f'feature-1024x500-{LANG}.png')
    im.save(p, optimize=True)
    print(p, im.size)


def main():
    feature()
    os.makedirs(OUT, exist_ok=True)
    names = sorted(n[:-4] for n in os.listdir(SRC) if n.endswith('.png') and n[:2].isdigit() and n[:-4] in CAPTIONS[LANG])
    for i, n in enumerate(names, 1):
        im = screenshot(n)
        p = os.path.join(OUT, f'{i}.png')
        im.save(p, optimize=True)
        print(p, im.size, os.path.getsize(p) // 1024, 'KB')


if __name__ == '__main__':
    main()
