"""Render the film in chunks and paint it (brief §5.5 step 4), keeping disk use small:
for each chunk, Blender renders every 2nd frame to half-float EXRs, four workers paint them into 1080x1920 JPGs
for both film frames each render covers, then the EXRs are deleted.

Special frames:
  scene 3   the frame freezes under a painted wash while "सोचिए…" is on screen
  scene 4   a watercolour wash wipes across and resets the scene after the wrong attempt
  scene 6   the sky and the whole painting warm into golden hour
Also writes build/ids/<frame>.png (object IDs at 1/4 size) for the text-collision check.

    python3 post/assemble.py [first_frame last_frame]
"""
import json
import os
import subprocess
import sys
from multiprocessing import Pool

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import exr
import watercolor as wc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, 'src/film/timeline.json')))
FPS, N = TL['fps'], int(TL['duration'] * TL['fps'])
OUT, IDS, EXR = (os.path.join(ROOT, p) for p in ('public/frames', 'build/ids', 'build/film'))
FREEZE = tuple(TL['beats']['freeze'])
WIPE = (TL['wrong']['wipe'], TL['wrong']['reset'])


def src_frame(f):
    """which Blender frame (1-based, odd numbers only) shows at film frame f (0-based)"""
    t = f / FPS
    if FREEZE[0] <= t < FREEZE[1]: t = FREEZE[0]
    g = int(round(t * FPS))
    return g - (g % 2) + 1


def smooth(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)


def paint_frame(f):
    t = f / FPS
    P = exr.passes(EXR, src_frame(f))
    g0, g1 = TL['beats']['golden']
    golden = smooth((t - g0) / (g1 - g0))
    h, w = 1920, 1080
    sky = wc.sky_wash(h, w, golden)
    img = wc.paint(P, f, out_size=(w, h), sky=sky)
    if golden > 0:
        img = img * (1 - .22 * golden) + img * np.array([1.08, .95, .78], np.float32)[None, None] * .22 * golden
    if FREEZE[0] <= t < FREEZE[1]:
        # the painted wash that freezes the frame: a pale paper glaze bleeding in from the edges
        k = smooth((t - FREEZE[0]) / .35) * (1 - smooth((t - FREEZE[1] + .3) / .3))
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        v = np.clip((np.hypot((xx - w / 2) / w, (yy - h * .55) / h) * 1.8 + wc.fbm(h, w, 120, 5) * .25), 0, 1)
        glaze = (.45 + .4 * v)[..., None] * k
        wash = np.array([.97, .93, .84], np.float32)[None, None] * wc.paper(h, w)[..., None]
        img = img * (1 - glaze) + wash * glaze
    ids = cv2.resize(P['IndexOB'], (w // 4, h // 4), interpolation=cv2.INTER_NEAREST)
    return f, img, ids


def wipe_frame(f, before, after):
    """a turquoise wash sweeps left to right with a ragged, pooled leading edge"""
    t = f / FPS
    u = smooth((t - WIPE[0]) / (WIPE[1] - WIPE[0]))
    h, w = before.shape[:2]
    edge = wc.fbm(h, 1, 80, 17)[:, 0] * 90 + wc.fbm(h, 1, 18, 19)[:, 0] * 25
    x = np.arange(w, dtype=np.float32)[None, :]
    front = (u * (w + 500) - 250 + edge)[:, None]
    d = front - x
    band = np.clip(1 - np.abs(d - 120) / 140, 0, 1)
    wash = np.array([.22, .62, .72], np.float32)[None, None] * (.9 + .1 * wc.fbm(h, w, 60, 23)[..., None])
    m = (d > 0).astype(np.float32)[..., None]
    out = after * m + before * (1 - m)
    out = out * (1 - band[..., None] * .85) + wash * band[..., None] * .85
    pool = np.clip(1 - np.abs(d - 260) / 10, 0, 1)[..., None]
    return np.clip(out * (1 - .35 * pool), 0, 1) * wc.paper(h, w)[..., None]


def save(f, img, ids):
    cv2.imwrite(os.path.join(OUT, f'{f:05d}.jpg'), (np.clip(img, 0, 1)[..., ::-1] * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
    if ids is not None:
        cv2.imwrite(os.path.join(IDS, f'{f:05d}.png'), np.clip(ids, 0, 255).astype(np.uint8))


def job(f):
    f, img, ids = paint_frame(f)
    save(f, img, ids)
    return f


def main(first=0, last=N - 1, chunk=96):
    for d in (OUT, IDS, EXR): os.makedirs(d, exist_ok=True)
    wipe_f = [f for f in range(first, last + 1) if WIPE[0] <= f / FPS < WIPE[1]]
    for c0 in range(first, last + 1, chunk):
        c1 = min(last, c0 + chunk - 1)
        frames = [f for f in range(c0, c1 + 1) if f not in wipe_f and not os.path.exists(os.path.join(OUT, f'{f:05d}.jpg'))]
        if not frames: continue
        need = sorted({src_frame(f) for f in frames})
        missing = [g for g in need if not os.path.exists(os.path.join(EXR, f'IndexOB_{g:04d}.exr'))]
        if missing:
            subprocess.run([sys.executable, os.path.join(ROOT, 'blender/film.py'), str(missing[0]), str(missing[-1])], check=True,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        with Pool(4) as p:
            for f in p.imap_unordered(job, frames): pass
        keep = {src_frame(f) for f in range(c1 + 1, min(N, c1 + 4))} | {src_frame(int(WIPE[1] * FPS) + 1)}
        for g in need:
            if g in keep: continue
            for name in os.listdir(EXR):
                if name.endswith(f'_{g:04d}.exr'): os.remove(os.path.join(EXR, name))
        print('painted', c0, c1, flush=True)
    # the wipe, between the last frame of the wrong attempt and the reset scene
    if wipe_f:
        fb, fa = wipe_f[0] - 1, int(WIPE[1] * FPS) + 1
        rd = lambda f: cv2.imread(os.path.join(OUT, f'{f:05d}.jpg'))[..., ::-1].astype(np.float32) / 255
        if os.path.exists(os.path.join(OUT, f'{fb:05d}.jpg')) and os.path.exists(os.path.join(OUT, f'{fa:05d}.jpg')):
            before, after = rd(fb), rd(fa)
            for f in wipe_f:
                save(f, wipe_frame(f, before, after), None)
                src = os.path.join(IDS, f'{fb:05d}.png')
                if os.path.exists(src): cv2.imwrite(os.path.join(IDS, f'{f:05d}.png'), cv2.imread(src, cv2.IMREAD_UNCHANGED))
            print('wipe', wipe_f[0], wipe_f[-1])


if __name__ == '__main__':
    a = [int(x) for x in sys.argv[1:3]]
    main(*a) if a else main()
