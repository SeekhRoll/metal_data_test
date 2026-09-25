"""Soundtrack for concept 04, "Van Gogh Dussehra".

  0-6 s    starry sky: tanpura drone, lone bansuri, bells; a shankh (conch) calls the Ramlila
  6-12 s   the mela: dhol groove + shehnai, crowd murmur
  12-14 s  Ram draws the bow: drum roll and rising strings
  14-15 s  the arrow: whoosh, then the hit
  15-22 s  Ravan Dahan: fire crackle, cheering, a boom for every firework (same times as promo.html)
  22-30 s  home: santoor + bansuri, distant fireworks, warm final chord

    python3 04-van-gogh-dussehra/soundtrack.py  ->  04-van-gogh-dussehra/build/soundtrack.wav
"""
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build")
SR = 44100
DUR = 30.0
N = int(SR * (DUR + 1))
rng = np.random.default_rng(10)
music, perc, fx = (np.zeros((N, 2)) for _ in range(3))
BURSTS = [16.3, 17.0, 17.7, 18.4, 19.1, 19.8, 20.5, 21.2, 21.9]          # keep in sync with promo.html
HOME_BURSTS = [22.6, 23.9, 25.2, 26.6, 28.0]


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(x, kind, f, order=2):
    f = [v / (SR / 2) for v in f] if isinstance(f, (list, tuple)) else f / (SR / 2)
    return sosfilt(butter(order, f, btype=kind, output="sos"), x)


def ts(d):
    return np.arange(int(d * SR)) / SR


def add(bus, t, sig, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or t < 0:
        return
    sig = sig[:N - i]
    bus[i:i + len(sig), 0] += sig * g * np.cos((pan + 1) * np.pi / 4) * 1.414
    bus[i:i + len(sig), 1] += sig * g * np.sin((pan + 1) * np.pi / 4) * 1.414


def env(n, a, r):
    e = np.ones(n)
    ai, ri = int(a * SR), int(r * SR)
    e[:ai] = np.linspace(0, 1, ai) if ai else 1
    if ri:
        e[-ri:] *= np.linspace(1, 0, ri)
    return e


# ---------------------------------------------------------------- instruments
def tanpura(d, root=50):
    t = ts(d)
    s = np.zeros(len(t))
    for m, g in [(root, .5), (root + 7, .35), (root + 12, .4), (root - 12, .3)]:
        for h in range(1, 9):
            s += g / h ** 1.1 * np.sin(2 * np.pi * midi(m) * h * t + h) * (.6 + .4 * np.sin(2 * np.pi * (.11 * h + .05) * t))
    return filt(s, "lowpass", 2600) * .1


def lead(notes, t0, kind="bansuri"):
    total = max(b + d for b, _, d in notes) + .6
    n = int(total * SR)
    t = np.arange(n) / SR
    f = np.full(n, midi(notes[0][1]))
    amp = np.zeros(n)
    for b, m, d in notes:
        i0, i1 = int(b * SR), int((b + d) * SR)
        f[i0:] = midi(m)
        seg = np.zeros(n)
        L = i1 - i0
        seg[i0:i1] = np.minimum(1, np.arange(L) / (.07 * SR)) * np.minimum(1, (L - np.arange(L)) / (.15 * SR))
        amp = np.maximum(amp, seg)
    k = int(.07 * SR)
    f = np.convolve(f, np.ones(k) / k, mode="same")
    vib = 1 + (.006 if kind == "shehnai" else .004) * np.sin(2 * np.pi * 5.3 * t) * np.minimum(1, t / .5)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    if kind == "bansuri":
        w = np.sin(ph) + .15 * np.sin(2 * ph) + filt(rng.standard_normal(n), "bandpass", (1500, 6000)) * .12
    else:
        w = sum(g * np.sin(h * ph) for h, g in [(1, .6), (2, .9), (3, 1), (4, .8), (5, .5), (6, .3), (7, .15)])
        w = filt(np.tanh(.6 * w), "bandpass", (500, 5000))
    return w * amp, t0


def santoor(m, d=1.2):
    t = ts(d)
    s = sum(g * np.sin(2 * np.pi * midi(m) * det * h * t) * np.exp(-t * k)
            for det in (1, 1.003) for h, g, k in [(1, 1, 2.2), (2, .5, 3.5), (3, .25, 5), (4, .12, 7)])
    return s * .5 * np.minimum(1, t / .001)


def bell(m, d=3.0, decay=1.0):
    t = ts(d)
    return sum(g * np.sin(2 * np.pi * midi(m) * r * t) * np.exp(-t * k * decay)
               for r, g, k in [(1, 1, .9), (2, .5, 1.4), (2.76, .35, 1.9), (5.4, .2, 3), (8.9, .1, 5)])


def shankh(d=1.8, f0=277):
    t = ts(d)
    f = f0 * (1 + .02 * np.minimum(1, t / .3)) * (1 + .004 * np.sin(2 * np.pi * 5 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    w = sum(np.sin(h * ph) / h ** .7 for h in range(1, 12))
    w = filt(w, "bandpass", (250, 3500)) + filt(rng.standard_normal(len(t)), "bandpass", (400, 2500)) * .15
    return w * env(len(t), .35, .5)


def dhol(v=1.):
    t = ts(.5)
    body = np.sin(2 * np.pi * np.cumsum(58 + 70 * np.exp(-t * 26)) / SR) * np.exp(-t * 6.5)
    slap = filt(rng.standard_normal(len(t)), "bandpass", (200, 1800)) * np.exp(-t * 80)
    return np.tanh(1.6 * (body + .5 * slap)) * v


def tilli(v=1.):
    t = ts(.16)
    return (.6 * np.sin(2 * np.pi * 520 * t) * np.exp(-t * 30) + .8 * filt(rng.standard_normal(len(t)), "bandpass", (1800, 7000)) * np.exp(-t * 55)) * v


def crowd(d, level_fn):
    n = int(d * SR)
    x = filt(rng.standard_normal(n), "bandpass", (250, 2500))
    mod = np.convolve(rng.standard_normal(n), np.ones(2000) / 2000, mode="same") * 20
    return x * (0.6 + 0.4 * np.tanh(mod)) * level_fn(np.arange(n) / SR)


def crackle(d, density=90):
    n = int(d * SR)
    out = filt(rng.standard_normal(n), "lowpass", 900) * .25
    for _ in range(int(d * density)):
        j = rng.integers(0, n - 300)
        out[j:j + 300] += rng.standard_normal(300) * np.exp(-np.arange(300) / 40) * rng.uniform(.2, 1)
    return filt(out, "highpass", 80)


def boom(big=1.0, far=False):
    t = ts(2.5)
    sub = np.sin(2 * np.pi * np.cumsum(42 + 55 * np.exp(-t * 7)) / SR) * np.exp(-t * 3)
    crack = filt(rng.standard_normal(len(t)), "highpass", 1200) * np.exp(-t * 4) * .3
    fizz = np.zeros(len(t))
    for _ in range(90):
        j = int(rng.uniform(.15, 1.6) * SR)
        L = 250
        fizz[j:j + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / 30) * np.exp(-(j / SR) * 1.5)
    s = np.tanh(1.4 * sub) + crack + filt(fizz, "highpass", 2500) * .8
    if far:
        s = filt(s, "lowpass", 900) * .5
    return s * big


def whistle_up(d=0.7):
    t = ts(d)
    return np.sin(2 * np.pi * np.cumsum(900 + 1400 * t / d) / SR) * env(len(t), .05, .15) * .5


def whoosh(d, f0, f1):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for c in range(30):
        a, b = c * n // 30, (c + 1) * n // 30
        fc = f0 * (f1 / f0) ** (c / 30)
        out[a:b] = filt(x[a:b], "bandpass", (fc * .7, min(20000, fc * 1.4)))
    return out * np.sin(np.linspace(0, np.pi, n)) ** 1.5


def strings(ms, d):
    t = ts(d)
    s = np.zeros(len(t))
    for m in ms:
        for det in (-.1, 0, .1):
            ph = 2 * np.pi * midi(m + det) * t
            s += sum(np.sin(h * ph) / h for h in range(1, 8))
    return filt(s, "lowpass", 2200) / len(ms) * .4


# ---------------------------------------------------------------- arrangement (D, raga-ish Khamaj colours)
add(music, 0, tanpura(31), .8)
sig, t0 = lead([(0, 74, 1.2), (1.2, 76, .6), (1.8, 78, 1.4), (3.2, 76, .5), (3.7, 74, .5), (4.2, 71, 1.2)], .8)
add(music, t0, sig, .35, -.1)
for i, (tt, m) in enumerate([(.4, 86), (1.6, 90), (2.9, 83), (4.1, 88)]):
    add(fx, tt, bell(m, 2.5, 1.6), .06, -.4 + .25 * i)
add(fx, 5.0, shankh(1.9), .5)

# mela groove 6-15 (120 BPM, one bar = 2 s)
S16 = .125
for b in range(int((15 - 6) / 2)):
    t0b = 6 + b * 2
    for s in range(16):
        tt = t0b + s * S16 + (.015 if s % 2 else 0)
        if s in (0, 3, 6, 8, 11, 14):
            add(perc, tt, dhol(1. if s in (0, 8) else .75), .5)
        if s in (2, 4, 5, 7, 10, 12, 13, 15):
            add(perc, tt, tilli(.6), .3, .3)
sig, t0 = lead([(0, 74, .5), (.5, 76, .5), (1, 78, 1), (2, 81, .5), (2.5, 79, .5), (3, 78, 1), (4, 76, .5), (4.5, 78, .5), (5, 74, 1)], 6.4, "shehnai")
add(music, t0, sig, .22, .15)
add(fx, 6.0, crowd(9, lambda x: .5 + .2 * np.sin(x)), .06)

# bow drawn: roll + rising strings
for k in range(40):
    tt = 12.4 + 1.6 * (1 - (1 - k / 40) ** 1.6)
    add(perc, tt, tilli(.3 + .6 * k / 40), .35, (-1) ** k * .3)
add(music, 12.2, strings([62, 66, 69, 74], 1.9) * np.linspace(.2, 1, int(1.9 * SR)), .6)
add(fx, 13.9, whoosh(1.2, 400, 6000), .35)
# the hit
add(fx, 15.05, boom(1.2), .7)
add(perc, 15.05, dhol(1.3), .8)

# Ravan Dahan
add(fx, 15.1, crackle(7.5), .22)
add(fx, 15.2, crowd(6.8, lambda x: np.minimum(1, x / .6) * (1 - np.maximum(0, x - 5.8))), .16)
for b in range(4):
    t0b = 15.1 + b * 1.72
    for s in range(16):
        tt = t0b + s * .1075
        if s in (0, 3, 6, 8, 10, 12, 14):
            add(perc, tt, dhol(1.), .45)
        if s % 2:
            add(perc, tt, tilli(.6), .25, .3)
sig, t0 = lead([(0, 81, .5), (.5, 83, .5), (1, 86, 1), (2, 83, .5), (2.5, 81, .5), (3, 78, 1), (4, 81, .7), (4.7, 86, 1.8)], 15.6, "shehnai")
add(music, t0, sig, .2)
for i, tb in enumerate(BURSTS):
    add(fx, tb - .6, whistle_up(.6), .08, (-1) ** i * .4)
    add(fx, tb, boom(.8), .45, (-1) ** i * .3)

# home
for i, tb in enumerate(HOME_BURSTS):
    add(fx, tb, boom(.6, far=True), .3, (-1) ** i * .4)
CH = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]]
for b in range(4):
    t0b = 22.0 + b * 2
    ch = CH[b % 4] if b < 3 else [62, 66, 69]
    add(music, t0b, strings([m - 12 for m in ch] + [ch[0]], 2.4), .5)
    for k in range(8):
        add(music, t0b + k * .25, santoor((ch + [ch[0] + 12])[[0, 1, 2, 3, 2, 1, 2, 3][k]] + 12, 1.0), .14, -.3 + .08 * k)
sig, t0 = lead([(0, 78, 1), (1, 81, .5), (1.5, 83, .5), (2, 81, 1.5), (3.5, 78, .5), (4, 76, 1), (5, 74, 2.8)], 22.8)
add(music, t0, sig, .32, .1)
add(fx, 28.0, bell(74, 3), .12)


# ---------------------------------------------------------------- mix
def reverb(x, wet, secs=2.4):
    n = int(secs * SR)
    o = np.zeros_like(x)
    for ch in range(2):
        ir = filt(rng.standard_normal(n) * np.exp(-np.arange(n) / (.55 * SR)), "lowpass", 6000)
        o[:, ch] = fftconvolve(x[:, ch], ir / np.sqrt(np.sum(ir ** 2)))[:len(x)]
    return x + wet * o


mix = reverb(music, .4) + reverb(perc, .12) + reverb(fx, .25)
mix = filt(mix.T, "highpass", 28).T[:int(DUR * SR)]
fi = int(1.0 * SR)
mix[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(1.8 * SR)
mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.3
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.5 * mix) / np.tanh(1.5) * .93

os.makedirs(OUT_DIR, exist_ok=True)
with wave.open(os.path.join(OUT_DIR, "soundtrack.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("wrote", os.path.join(OUT_DIR, "soundtrack.wav"))
