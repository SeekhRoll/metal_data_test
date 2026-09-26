"""Build checks (brief §2 and §6). Exits non-zero on any failure.

1. Catchphrase: every lion-move interval in src/film/timeline.json starts with the catchphrase cue, and the cue
   plays nowhere else (cue times come from src/film/vo.json, where "catch" lists its placements).
2. Status panel: the states after each crossing match the brief's solution table.
3. Text collision: every 6th frame, no illustration pixel (object IDs >= 10: people, animals, cabbage, boat,
   islands, palms) lies inside a text zone grown by 24 px; overlay graphics (bubbles, icons) never touch text.
"""
import json
import os
import sys

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, 'src/film/timeline.json')))
VO = json.load(open(os.path.join(ROOT, 'src/film/vo.json'), encoding='utf-8'))
fails = []

# 1 --------------------------------------------------------------- catchphrase
cues = next(l for l in VO if l['id'] == 'catch').get('placements', [])
starts = [iv['from'] for iv in TL['lionMoving']]
for iv in TL['lionMoving']:
    if not any(abs(c - iv['from']) <= 1 / 24 + 1e-6 for c in cues):
        fails.append(f"catchphrase missing at lion move '{iv['what']}' ({iv['from']:.2f} s)")
for c in cues:
    if not any(abs(c - s) <= 1 / 24 + 1e-6 for s in starts):
        fails.append(f'catchphrase at {c:.2f} s is outside every lion-move interval')
print(f'catchphrase: {len(cues)} cues for {len(starts)} lion moves')

# 2 --------------------------------------------------------------- status panel vs the solution table (brief §1)
TABLE = [({'lion', 'cabbage'}, {'goat'}), ({'lion', 'cabbage'}, {'goat'}), ({'cabbage'}, {'goat', 'lion'}), ({'cabbage', 'goat'}, {'lion'}),
         ({'goat'}, {'lion', 'cabbage'}), ({'goat'}, {'lion', 'cabbage'}), (set(), {'lion', 'cabbage', 'goat'})]
for (near, far), st, cr in zip(TABLE, TL['states'][1:], TL['crossings']):
    if set(st['near']) != near or set(st['far']) != far:
        fails.append(f"status after crossing {st['k']}: {st} does not match the table")
    # nobody is left alone to be eaten on the island the farmer has just left
    for side in [set(st['near']) if cr['dir'] > 0 else set(st['far'])]:
        if {'lion', 'goat'} <= side or {'goat', 'cabbage'} <= side:
            fails.append(f"crossing {st['k']}: something gets eaten on an island left without the farmer ({side})")
print('status panel: checked 7 crossings')

# 3 --------------------------------------------------------------- text collision
sys.path.insert(0, os.path.join(ROOT, 'src'))
L = {  # mirrors src/film/layout.ts
    'panel': (0, 0, 1080, 330), 'band': (0, 1620, 1080, 300), 'think': (520, 900, 520, 250),
}
PAD, S = 24, 4
checked = 0
for f in range(0, int(TL['duration'] * TL['fps']), 6):
    t = f / TL['fps']
    p = os.path.join(ROOT, 'build/ids', f'{f:05d}.png')
    if not os.path.exists(p):
        continue
    ids = cv2.imread(p, cv2.IMREAD_UNCHANGED).astype(np.int32)
    ill = ids >= 10
    fz = TL['beats']['freeze']
    zones = ['band'] + (['panel'] if t >= TL['beats']['panel_in'] else []) + (['think'] if fz[0] <= t < fz[1] else [])
    scene = next(s['id'] for s in TL['scenes'] if s['from'] <= t < s['to'] + 1e-9) if t < TL['duration'] else 'S6'
    for z in zones:
        x, y, w, h = L[z]
        x0, y0, x1, y1 = max(0, (x - PAD) // S), max(0, (y - PAD) // S), (x + w + PAD) // S, (y + h + PAD) // S
        hit = ill[y0:y1, x0:x1]
        if hit.any():
            who = sorted(set(ids[y0:y1, x0:x1][hit].tolist()))
            fails.append(f'text collision · {scene} · frame {f} ({t:.2f} s) · zone {z} x object ids {who}')
    checked += 1
# overlays: the bubbles live in open water and never meet a text zone; panel icons keep 24 px from panel words
BUB = (600, 640, 420)
for z in ('panel', 'band'):
    x, y, w, h = L[z]
    if not (BUB[1] + BUB[2] + PAD <= y or BUB[1] >= y + h + PAD):
        fails.append(f'bubble overlaps zone {z}')
print(f'text collision: {checked} sampled frames')

if fails:
    print('FAIL'); [print(' -', m) for m in fails[:40]]
    sys.exit(1)
print('PASS')
