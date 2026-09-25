"""Original folk score for "Sudama ki Potli" (sitar, dholak, bansuri, tanpura). 60 s, timed to the scenes.

Composed here, so it is royalty-free and owned outright. Levels leave room for the VO (mix.py ducks it).
    python3 scripts/music.py  ->  assets/music/music.wav
"""
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, DUR = 44100, 60.0
N = int(SR * (DUR + 1))
rng = np.random.default_rng(26)
music, perc, fx = (np.zeros((N, 2)) for _ in range(3))


def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def ts(d): return np.arange(int(d * SR)) / SR
def filt(x, kind, f, order=2):
    f = [v / (SR / 2) for v in f] if isinstance(f, (list, tuple)) else f / (SR / 2)
    return sosfilt(butter(order, f, btype=kind, output="sos"), x)
def add(bus, t, sig, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or t < 0: return
    sig = sig[:N - i]
    bus[i:i + len(sig), 0] += sig * g * np.cos((pan + 1) * np.pi / 4) * 1.414
    bus[i:i + len(sig), 1] += sig * g * np.sin((pan + 1) * np.pi / 4) * 1.414


def sitar(m, d=1.6, glide=0.0):
    """Karplus-Strong string with jawari buzz and an optional meend (glide) in semitones."""
    n = int(d * SR)
    f0 = midi(m)
    p = int(SR / f0)
    buf = filt(rng.uniform(-1, 1, p), "lowpass", 7000, 1)
    out = np.zeros(n)
    prev = 0.0
    idx = 0.0
    for i in range(n):
        g = glide * min(1, i / (0.25 * SR))
        step = 2 ** (g / 12)
        j = int(idx) % p
        s = buf[j]
        out[i] = s
        buf[j] = 0.996 * 0.5 * (s + prev)
        prev = s
        idx += step
    out = np.tanh(out * 3.2) / np.tanh(3.2)
    sym = sum(np.sin(2 * np.pi * f0 * h * ts(d)) * np.exp(-ts(d) * (1.2 + h)) for h in (2, 3)) * .08
    return filt(out + sym, "highpass", 150) * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))


def tanpura(d, root=50):
    t = ts(d)
    s = sum(g / h ** 1.1 * np.sin(2 * np.pi * midi(m) * h * t + h) * (.6 + .4 * np.sin(2 * np.pi * (.1 * h + .05) * t))
            for m, g in [(root, .5), (root + 7, .35), (root + 12, .4), (root - 12, .3)] for h in range(1, 8))
    return filt(s, "lowpass", 2400) * .1


def bansuri(notes, t0):
    total = max(b + d for b, _, d in notes) + .6
    n = int(total * SR); t = np.arange(n) / SR
    f = np.full(n, midi(notes[0][1])); amp = np.zeros(n)
    for b, m, d in notes:
        i0, i1 = int(b * SR), int((b + d) * SR); f[i0:] = midi(m); L = i1 - i0
        seg = np.zeros(n); seg[i0:i1] = np.minimum(1, np.arange(L) / (.08 * SR)) * np.minimum(1, (L - np.arange(L)) / (.2 * SR)); amp = np.maximum(amp, seg)
    k = int(.08 * SR); f = np.convolve(f, np.ones(k) / k, mode="same")
    ph = 2 * np.pi * np.cumsum(f * (1 + .005 * np.sin(2 * np.pi * 5.1 * t) * np.minimum(1, t / .6))) / SR
    w = np.sin(ph) + .15 * np.sin(2 * ph) + filt(rng.standard_normal(n), "bandpass", (1500, 6000)) * .1
    return w * amp, t0


def dholak(v=1.): t = ts(.4); return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(88 + 70 * np.exp(-t * 28)) / SR) * np.exp(-t * 7)) * v
def tik(v=1.): t = ts(.15); return (.7 * np.sin(2 * np.pi * 460 * t) * np.exp(-t * 32) + .5 * filt(rng.standard_normal(len(t)), "bandpass", (1800, 6000)) * np.exp(-t * 60)) * v
def manjira(v=1.): t = ts(1.2); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 3) for f in (2960, 4140, 5370)) * .2 * v
def bell(m, d=3.0): t = ts(d); return sum(g * np.sin(2 * np.pi * midi(m) * r * t) * np.exp(-t * k) for r, g, k in [(1, 1, .9), (2, .5, 1.4), (2.76, .35, 1.9), (5.4, .2, 3)])
def chime(m): t = ts(1.2); return np.sin(2 * np.pi * midi(m) * t) * np.exp(-t * 4) + .3 * np.sin(2 * np.pi * midi(m) * 4.1 * t) * np.exp(-t * 10)
def pad(ms, d):
    t = ts(d); s = np.zeros(len(t))
    for m in ms:
        for det in (-.1, 0, .1): s += sum(np.sin(h * 2 * np.pi * midi(m + det) * t) / h for h in range(1, 7))
    return filt(s, "lowpass", 1800) / len(ms) * .35 * np.minimum(1, t / .8) * np.minimum(1, (d - t) / 1.0)
def shimmer(d):
    t = ts(d); return sum(np.sin(2 * np.pi * midi(84 + k * 2) * t * (1 + .002 * k)) * np.exp(-((t - k * d / 12) ** 2) / .02) for k in range(12)) * .3


# ---------------------------------------------------------------- score (raga-ish Yaman colour on D: D E F# G# A B C#)
add(music, 0, tanpura(61), .9)
# 0-5 alap on sitar with meend
for tt, m, gl in [(.3, 62, 0), (1.1, 69, -2), (2.0, 71, 0), (2.7, 69, 0), (3.5, 66, 2), (4.3, 62, 0)]:
    add(music, tt, sitar(m, 2.0, gl), .45, -.2)
add(fx, .2, bell(74, 3.5), .08)
# 5-13 the hut: quiet sitar phrase, soft dholak from 8.5
for i, (tt, m) in enumerate([(5.4, 62), (6.0, 64), (6.6, 66), (7.4, 64), (8.4, 69), (9.2, 68), (10.0, 66), (11.0, 64), (12.0, 62)]):
    add(music, tt, sitar(m, 1.6), .38, -.2 + .05 * i)
for b in range(9):
    tt = 8.5 + b * .5
    add(perc, tt, dholak(.6 if b % 2 == 0 else .4), .3); add(perc, tt + .25, tik(.4), .15, .3)
# 13-21 the journey: walking dholak at 120 BPM (one beat per step), bansuri melody
for b in range(16):
    tt = 13 + b * .5
    add(perc, tt, dholak(.85 if b % 2 == 0 else .6), .45)
    add(perc, tt + .25, tik(.55), .22, .3)
    if b % 4 == 3: add(perc, tt + .375, tik(.45), .18, -.3)
sig, t0 = bansuri([(0, 74, 1), (1, 76, .5), (1.5, 78, 1.5), (3, 81, 1), (4, 80, .5), (4.5, 78, 1), (5.5, 76, .5), (6, 74, 1.8)], 13.4)
add(music, t0, sig, .3, .15)
add(music, 13, pad([50, 57, 62], 8.2), .3)
# 21-29 the embrace: build, then a swell at 25
for b in range(8):
    tt = 21 + b * .5
    add(perc, tt, dholak(.7 + .04 * b), .4); add(perc, tt + .25, tik(.5), .2, .3)
for k in range(12): add(perc, 24.4 + k * .05, tik(.3 + k * .05), .2, (-1) ** k * .3)
add(music, 25.0, pad([50, 57, 62, 66, 69], 4.2), .9)
add(fx, 25.0, manjira(1.2), .3)
sig, t0 = bansuri([(0, 81, 1.2), (1.2, 83, .6), (1.8, 85, 1.4), (3.2, 81, .8)], 25.1)
add(music, t0, sig, .32)
for tt, m in [(25.0, 62), (25.0, 69), (25.0, 74)]: add(music, tt, sitar(m, 2.4), .3)
# 29-39 the potli: playful plucks, chimes for each flower
for i, (tt, m) in enumerate([(29.3, 69), (29.8, 71), (30.3, 69), (30.8, 66), (31.8, 64), (32.4, 66), (33.6, 69), (33.9, 74), (34.2, 76)]):
    add(music, tt, sitar(m, 1.0, 0), .34, (-1) ** i * .2)
for k in range(14): add(fx, 34.3 + k * .32, chime(81 + [0, 2, 4, 7, 9, 12, 14][k % 7]), .06, (-1) ** k * .4)
for b in range(10):
    tt = 34.0 + b * .5
    add(perc, tt, dholak(.55), .28); add(perc, tt + .25, tik(.4), .14, .3)
add(music, 34.0, pad([50, 57, 62, 66], 5.2), .55)
# 39-46 the return: walking beat, then shimmer as the hut becomes a palace
for b in range(8):
    tt = 39 + b * .5
    add(perc, tt, dholak(.6), .32); add(perc, tt + .25, tik(.45), .16, .3)
add(fx, 41.8, shimmer(2.0), .3)
add(fx, 43.4, bell(86, 2.5), .1)
add(music, 42.0, pad([50, 57, 62, 66, 71], 4.2), .6)
sig, t0 = bansuri([(0, 78, 1), (1, 81, 1), (2, 83, 1.5)], 43.0)
add(music, t0, sig, .3)
# 46-52 the moral: temple bell, tanpura, long bansuri notes
add(fx, 46.0, bell(62, 5), .22)
sig, t0 = bansuri([(0, 74, 2), (2, 76, 1), (3, 74, 2.4)], 46.6)
add(music, t0, sig, .28)
add(music, 46.0, pad([50, 57, 62], 6.2), .26)
# 52-60 the end card: warm resolution
for i, (tt, m) in enumerate([(52.2, 62), (52.8, 66), (53.4, 69), (54.0, 74), (55.0, 71), (55.6, 69), (56.4, 66), (57.2, 62)]):
    add(music, tt, sitar(m, 1.8), .36, -.2 + .05 * i)
for b in range(10):
    tt = 53 + b * .5
    add(perc, tt, dholak(.5), .25); add(perc, tt + .25, tik(.35), .12, .3)
add(music, 57.0, pad([50, 57, 62, 66, 69], 3.5), .8)
add(fx, 57.0, bell(74, 3), .12)


def reverb(x, wet, secs=2.2):
    n = int(secs * SR); o = np.zeros_like(x)
    for ch in range(2):
        ir = filt(rng.standard_normal(n) * np.exp(-np.arange(n) / (.5 * SR)), "lowpass", 6000)
        o[:, ch] = fftconvolve(x[:, ch], ir / np.sqrt(np.sum(ir ** 2)))[:len(x)]
    return x + wet * o


mix = reverb(music, .35) + reverb(perc, .12) + reverb(fx, .3)
mix = filt(mix.T, "highpass", 30).T[:int(DUR * SR)]
fi, fo = int(.3 * SR), int(1.5 * SR)
mix[:fi] *= np.linspace(0, 1, fi)[:, None]; mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.4
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.4 * mix) / np.tanh(1.4) * .9
os.makedirs(os.path.join(ROOT, "assets", "music"), exist_ok=True)
out = os.path.join(ROOT, "assets", "music", "music.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("wrote", out)
