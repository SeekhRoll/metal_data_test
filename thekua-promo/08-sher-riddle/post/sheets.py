"""Turnaround sheets: four painted views per subject with Hindi/English labels in a clear band (no art under text)."""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(__file__))
import exr
import watercolor as wc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = lambda n, s: ImageFont.truetype(os.path.join(ROOT, 'fonts', n), s, layout_engine=ImageFont.Layout.RAQM)
NAMES = {'farmer': ('रामखेलावन', 'Ramkhelawan: dhoti, gamchha, big moustache'), 'lion': ('शेर', 'the lion: lazy, a bit smug, big mane'),
         'goat': ('बकरी', 'the goat: small, cheeky, with a goatee'), 'cabbage': ('गोभी', 'the cabbage: layered leaves'),
         'boat': ('नाव', 'the little wooden boat'), 'island': ('टापू', 'an island: sand, grass, palms')}
VIEWS = [('front', 'सामने'), ('three-quarter', 'तिरछा'), ('side', 'बगल'), ('back', 'पीछे')]


def sheet(name):
    tiles = []
    for v, _ in VIEWS:
        P = exr.passes(os.path.join(ROOT, 'build/turn', f'{name}_{v}'))
        tiles.append((wc.paint(P, 0, background='paper') * 255).astype(np.uint8))
    h, w = tiles[0].shape[:2]
    band = 190
    img = Image.new('RGB', (w * 4, h + band), (250, 245, 234))
    for k, t in enumerate(tiles):
        img.paste(Image.fromarray(t), (k * w, 0))
    d = ImageDraw.Draw(img)
    for k, (_, hi) in enumerate(VIEWS):
        d.text((k * w + w / 2, h + 30), hi, font=F('TiroDevanagariHindi-Regular.ttf', 34), fill=(90, 60, 40), anchor='mm')
    hi, en = NAMES[name]
    d.text((w * 2, h + 100), hi, font=F('YatraOne-Regular.ttf', 58), fill=(150, 40, 30), anchor='mm')
    d.text((w * 2, h + 158), en, font=F('TiroDevanagariHindi-Regular.ttf', 30), fill=(90, 60, 40), anchor='mm')
    out = os.path.join(ROOT, 'stills', f'turn-{name}.jpg')
    img.save(out, quality=90)
    print('wrote', out)


if __name__ == '__main__':
    for n in sys.argv[1:] or NAMES:
        sheet(n)
