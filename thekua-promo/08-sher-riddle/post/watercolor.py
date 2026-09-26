"""Watercolour post-process for the Blender passes (brief §5.3). Per frame:

  flat colour x 2-3 step toon light -> Kuwahara simplification -> wet-edge bleed (low-frequency displacement)
  -> pigment pooling at object-region edges -> granulation in the darks -> uneven wash density and white paper
  in the highlights -> loose ink line (from object-ID, depth and normal edges), offset and wobbling off the fills
  -> cold-press paper multiplied over everything (fixed to the frame; it never swims with the camera).

Noise is re-seeded every 6 frames (a quarter second) and cross-faded across the whole hold: a slow, gentle
boil, never a flicker (client: hold each drawing longer).
"""
import os

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INK = np.array([.2, .14, .11], np.float32)            # sepia ink (RGB)
COOL = np.array([.36, .42, .72], np.float32)          # ultramarine shadow
WARM = np.array([1.0, .93, .80], np.float32)          # warm sun
WATER_IDS = (1,)


def srgb(x):
    x = np.clip(x, 0, 1)
    return np.where(x <= .0031308, x * 12.92, 1.055 * np.power(x, 1 / 2.4) - .055).astype(np.float32)


def lum(c):
    return (c[..., 0] * .3 + c[..., 1] * .59 + c[..., 2] * .11).astype(np.float32)


# ---------------------------------------------------------------- noise
def noise(h, w, scale, seed):
    """smooth value noise in [-1, 1] with features about `scale` px"""
    rs = np.random.RandomState(seed)
    gh, gw = max(2, int(h / scale) + 2), max(2, int(w / scale) + 2)
    g = rs.uniform(-1, 1, (gh, gw)).astype(np.float32)
    return cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)


def fbm(h, w, scale, seed, oct=3):
    out, amp, tot = np.zeros((h, w), np.float32), 1.0, 0.0
    for o in range(oct):
        out += amp * noise(h, w, scale / (2 ** o), seed * 7 + o); tot += amp; amp *= .5
    return out / tot


_paper = {}
def paper(h, w):
    """cold-press watercolour paper: tooth (bumps) lit from the upper left, plus faint fibres; fixed to the frame"""
    if (h, w) not in _paper:
        p = os.path.join(ROOT, 'build', f'paper_{w}x{h}.png')
        if os.path.exists(p):
            _paper[(h, w)] = cv2.imread(p, cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255
        else:
            rs = np.random.RandomState(11)
            t = cv2.GaussianBlur(rs.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 3.0)
            t += .7 * cv2.GaussianBlur(rs.normal(0, 1, (h, w)).astype(np.float32), (0, 0), 8)
            t /= t.std() + 1e-6
            emb = cv2.filter2D(t, -1, np.array([[-1, -.5, 0], [-.5, 0, .5], [0, .5, 1]], np.float32))
            fib = cv2.GaussianBlur(rs.normal(0, 1, (h, w)).astype(np.float32), (0, 0), sigmaX=14, sigmaY=.8)
            v = .968 + .007 * emb / (np.abs(emb).max() + 1e-6) * 3 + .006 * fib / (np.abs(fib).max() + 1e-6)
            v = np.clip(v, .86, 1.0).astype(np.float32)
            os.makedirs(os.path.dirname(p), exist_ok=True); cv2.imwrite(p, (v * 255).astype(np.uint8))
            _paper[(h, w)] = v
    return _paper[(h, w)]


PAPER_TINT = np.array([.985, .965, .925], np.float32)


# ---------------------------------------------------------------- filters
def kuwahara(img, r=4):
    """quadrant Kuwahara via shifted box filters: flattens detail into brush-like patches, keeps edges"""
    k = (r + 1, r + 1)
    best = None
    sq = img * img
    for ax, ay in ((r, r), (0, r), (r, 0), (0, 0)):
        m = cv2.blur(img, k, anchor=(ax, ay), borderType=cv2.BORDER_REFLECT)
        v = (cv2.blur(sq, k, anchor=(ax, ay), borderType=cv2.BORDER_REFLECT) - m * m).sum(axis=2)
        if best is None:
            best, out = v, m
        else:
            sel = v < best
            best = np.where(sel, v, best); out = np.where(sel[..., None], m, out)
    return out


def displace(img, dx, dy, interp=cv2.INTER_LINEAR):
    h, w = img.shape[:2]
    X, Y = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    return cv2.remap(img, X + dx, Y + dy, interp, borderMode=cv2.BORDER_REFLECT)


def edges(ids, depth, normal):
    """1-px line mask from object-ID changes, depth jumps and creases"""
    e = np.zeros(ids.shape, np.float32)
    for a, b in ((ids[1:, :], ids[:-1, :]), (ids[:, 1:], ids[:, :-1])):
        d = (a != b).astype(np.float32)
        if a.shape[0] < ids.shape[0]: e[1:, :] = np.maximum(e[1:, :], d)
        else: e[:, 1:] = np.maximum(e[:, 1:], d)
    z = np.log(np.clip(depth, .01, 1e4))
    dz = np.abs(cv2.Sobel(z, cv2.CV_32F, 1, 0, ksize=3)) + np.abs(cv2.Sobel(z, cv2.CV_32F, 0, 1, ksize=3))
    e = np.maximum(e, np.clip((dz - .12) * 4, 0, 1))
    if normal is not None:
        n = normal[..., :3]
        dn = np.abs(cv2.Sobel(n, cv2.CV_32F, 1, 0, ksize=3)).sum(2) + np.abs(cv2.Sobel(n, cv2.CV_32F, 0, 1, ksize=3)).sum(2)
        e = np.maximum(e, np.clip((dn - 2.4) * .6, 0, 1))
    return e


# ---------------------------------------------------------------- the painting
def aniso(h, w, sx, sy, seed, ox=0.0):
    """anisotropic noise: long in x, short in y (water streaks), drifting by ox px"""
    rs = np.random.RandomState(seed)
    gh, gw = max(2, int(h / sy) + 3), max(2, int(w / sx) + 3)
    g = rs.uniform(-1, 1, (gh, gw)).astype(np.float32)
    big = cv2.resize(g, (int(gw * sx), int(gh * sy)), interpolation=cv2.INTER_CUBIC)
    o = int(ox) % max(1, int(sx))
    return big[:h, o:o + w] if big.shape[1] >= o + w else cv2.resize(big, (w + o, h))[:, o:o + w]


def sky_wash(h, w, golden=0.0):
    """a loose sky: cerulean wash fading to paper, soft cloud shapes left white; `golden` warms it for the finale"""
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None] * np.ones((1, w), np.float32)
    top, low = np.array([.42, .66, .9], np.float32), np.array([.93, .9, .82], np.float32)
    gold = np.array([.98, .74, .42], np.float32)
    k = np.clip(y * 1.3 + fbm(h, w, 260, 71) * .15, 0, 1)[..., None]
    col = top[None, None] * (1 - k) + low[None, None] * k
    col = col * (1 - golden * .6) + gold[None, None] * golden * .6 * (.4 + .6 * k)
    cloud = np.clip((fbm(h, w, 180, 83) - .15) * 3, 0, 1) * (1 - y)
    return np.clip(col * (1 - cloud[..., None]) + cloud[..., None], 0, 1)


def water(h, w, frame, depth):
    """wet-on-wet river: soft blooming turquoise-ultramarine washes, darker with distance, painted white sparkles"""
    t = frame / 24
    turq, ultra, sap = np.array([.16, .70, .74], np.float32), np.array([.20, .38, .80], np.float32), np.array([.30, .66, .48], np.float32)
    a = np.clip(fbm(h, w, 420, 21) * .8 + .5, 0, 1)
    b = np.clip(fbm(h, w, 200, 33) * .8 + .5, 0, 1)
    col = turq[None, None] * (1 - a[..., None] * .75) + ultra[None, None] * (a[..., None] * .75)
    col = col * (1 - .18 * b[..., None]) + sap[None, None] * .18 * b[..., None]
    far = np.clip((np.log(np.clip(depth, .1, 1e3)) - 1.6) / 1.6, 0, 1)
    col = col * (1 - .25 * far[..., None]) + ultra[None, None] * .25 * far[..., None]
    streak = aniso(h, w, 220, 16, 41, ox=t * 30)
    col = col * (1 - .07 * np.clip(streak, 0, 1)[..., None])
    sp = aniso(h, w, 120, 9, 57 + (frame // 12) % 6, ox=t * 30)
    zone = np.clip(fbm(h, w, 380, 91) * 1.5 + .2, 0, 1)             # sparkles gather in a few sunlit patches
    sparkle = np.clip((sp - .8) * 8, 0, 1) * zone * (1 - far * .5)
    return np.clip(col, 0, 1), sparkle


def paint(P, frame=0, out_size=None, background=None, sky=None):
    """P: passes dict from exr.passes. background: 'paper' (turnarounds) or None (the rendered world).
    Returns an RGB float32 image in [0, 1]."""
    ids = P['IndexOB']; alpha = P['Image'][..., 3] if P['Image'].shape[-1] == 4 else np.ones(ids.shape, np.float32)
    alb = srgb(P['DiffCol'][..., :3])
    L = lum(P['DiffDir'][..., :3]); Li = lum(P['DiffInd'][..., :3]) if 'DiffInd' in P else np.zeros_like(L)
    ao = P['AO'][..., 0] if 'AO' in P else np.ones_like(L)
    depth = P['Depth']; normal = P.get('Normal')
    if out_size:
        W, H = out_size
        up = lambda a, i=cv2.INTER_LINEAR: cv2.resize(a, (W, H), interpolation=i)
        alb, L, Li, ao, alpha, depth = up(alb), up(L), up(Li), up(ao), up(alpha), up(depth)
        ids = up(ids, cv2.INTER_NEAREST); normal = up(normal) if normal is not None else None
    h, w = L.shape
    HOLD = 6
    seed, fade = frame // HOLD, (frame % HOLD) / HOLD
    fade = fade * fade * (3 - 2 * fade)
    def boil(fn, *a):                       # cross-faded between the two seeds around this frame
        return fn(*a, seed) * (1 - fade) + fn(*a, seed + 1) * fade

    # 1. vibrant flat colour
    hsv = cv2.cvtColor(alb, cv2.COLOR_RGB2HSV)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.3, 0, 1); hsv[..., 2] = np.clip(hsv[..., 2] * 1.06 + .03, 0, 1)
    base = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    obj = (ids > .5).astype(np.float32)
    wat = (np.abs(ids - 1) < .5).astype(np.float32)
    actors = ((ids >= 9.5) & (ids < 89.5)).astype(np.float32)          # farmer, lion, goat, cabbage, boat
    sparkle = None
    if wat.any():
        wc_, sparkle = water(h, w, frame, depth)
        lit = (.78 + .3 * np.clip(L, 0, 1))[..., None]               # object shadows fall on the water
        base = base * (1 - wat[..., None]) + np.clip(wc_ * lit, 0, 1) * wat[..., None]
    base = kuwahara(base, 4 if w > 800 else 3)

    # 2. wet-edge bleed: colour runs a few px past the forms
    bx, by = boil(noise, h, w, 60) * 3.2, boil(noise, h, w, 60) * 3.2
    base = displace(base, bx, by); obj_b = displace(obj, bx, by)

    # 3. pigment: transparent washes over white paper (density varies across each wash)
    dens = .6 + .3 * (fbm(h, w, 160, 5 + seed % 3) * .5 + .5)
    dens = dens[..., None] + (1 - dens[..., None]) * (1 - lum(base)[..., None]) ** 2   # darks stay dark
    pig = (1 - base) * dens

    # 4. pooling along object-region edges: pigment gathers where the wash dried
    bnd = edges(ids, depth, None)
    dist = cv2.distanceTransform((bnd < .5).astype(np.uint8), cv2.DIST_L2, 3)
    pool = displace(np.exp(-dist / 3.0), bx, by) * (.7 + .3 * boil(noise, h, w, 18))
    pig = pig * (1 + .9 * pool[..., None])

    # 5. shadow glazes: 2 hard-edged, wobbling layers of cool, deeper colour (toon steps painted as glazes)
    for thr, strength, sc in ((.62, .5, 70), (.2, .45, 40)):
        m = (L < thr).astype(np.float32) * obj * (1 - wat * .5)
        m = displace(cv2.GaussianBlur(m, (0, 0), 1.5), boil(noise, h, w, sc) * 5, boil(noise, h, w, sc) * 5)
        m = np.clip((m - .5) * 6 + .5, 0, 1)
        md = cv2.distanceTransform((np.abs(np.diff(np.pad(m > .5, ((0, 1), (0, 0)), mode='edge').astype(np.int8), axis=0)) + np.abs(np.diff(np.pad(m > .5, ((0, 0), (0, 1)), mode='edge').astype(np.int8), axis=1)) == 0).astype(np.uint8), cv2.DIST_L2, 3)
        rim = np.exp(-md / 2.5) * m
        glaze = (1 - (base * .55 + COOL[None, None] * .45)) * (strength * (.8 + .2 * boil(noise, h, w, 25)))[..., None]
        pig = pig + glaze * (m + .8 * rim)[..., None]
    ao_g = np.clip(1 - ao, 0, 1) * obj
    pig = pig + (1 - COOL)[None, None] * (ao_g * .35)[..., None]

    # 6. blooms (backruns): pale centres with a dark cauliflower rim here and there inside the washes
    bl = boil(noise, h, w, 55)
    bm = np.clip((bl - .74) * 5, 0, 1) * actors
    bring = np.clip(1 - np.abs(bl - .74) * 14, 0, 1) * actors
    pig = pig * (1 - .22 * bm[..., None]) * (1 + .35 * bring[..., None])

    # 7. granulation: grainy pigment, strongest in the darks
    g = np.clip(boil(noise, h, w, 1.3) * .5 + boil(noise, h, w, 2.6) * .5, -.2, 1)
    pig = pig * (1 + (.08 + .3 * np.clip(pig.mean(2), 0, 1)) * g)[..., None]

    # 8. white paper breaking through in the sunlit highlights
    hl = np.clip((L - .95) * 6, 0, 1) * np.clip((lum(base) - .45) * 3, 0, 1) * np.clip(boil(noise, h, w, 30) * 1.6 + .1, 0, 1)
    pig = pig * (1 - .5 * (hl * actors)[..., None])
    if sparkle is not None:
        pig = pig * (1 - .85 * (sparkle * wat)[..., None])        # white paper left unpainted: sparkles
    painted = np.clip(1 - pig, 0, 1)

    # background
    pp = paper(h, w)
    if background == 'paper':
        bg = np.ones((h, w, 3), np.float32)
        # cast shadow from the shadow catcher, as a cool violet wash
        sh = np.clip((alpha - obj) * 1.4, 0, 1) * (1 - obj_b)
        sh = cv2.GaussianBlur(sh, (0, 0), 2) * (.8 + .2 * fbm(h, w, 60, 9))
        bg = 1 - (1 - np.array([.62, .64, .86], np.float32))[None, None] * sh[..., None] * .8
        a = np.clip(obj_b, 0, 1)[..., None]
        painted = painted * a + bg * (1 - a)
    else:
        a = np.clip(obj_b, 0, 1)[..., None]
        painted = painted * a + (sky if sky is not None else sky_wash(h, w)) * (1 - a)

    # 7. ink line: loose, wobbling, 1-2 px off the fills
    e = edges(ids, depth, normal) * np.clip(alpha + obj, 0, 1)
    wx, wy = boil(noise, h, w, 22) * 1.6 + 1.2, boil(noise, h, w, 22) * 1.6 + 1.2
    e = displace(e, wx, wy)
    thick = .7 + .6 * (boil(noise, h, w, 50) * .5 + .5)
    e = cv2.GaussianBlur(e, (0, 0), .6) * thick
    e = np.clip(e * (.55 + .45 * np.clip(boil(noise, h, w, 9) + .6, 0, 1)), 0, .85)
    painted = painted * (1 - e[..., None]) + INK[None, None] * e[..., None]

    # 8. paper over everything
    painted = painted * PAPER_TINT[None, None] * pp[..., None]
    return np.clip(painted, 0, 1)


def save(img, path):
    cv2.imwrite(path, (np.clip(img, 0, 1)[..., ::-1] * 255).astype(np.uint8))
