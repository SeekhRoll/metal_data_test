"""Original score for "Gilahari ka Yogdan" (brief §3.5: flute with mridangam), 60 s, timed to the scenes.

Raga Mohanam colour on D (D E F# A B), tanpura drone, a venu (bamboo flute) lead with slides and vibrato,
and a synthesized mridangam (thom, nam, din, ta, chapu). Sound effects follow the picture: the lamp being
struck, rocks landing, the squirrel's dips and shakes, the flick and the tumble, the stripes lighting up,
the sancha press. Composed here, so it is royalty-free. Levels leave room for the VO (mix.py ducks it).
    python3 scripts/music.py  ->  assets/music/music.wav
"""
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, DUR = 44100, 60.0
N = int(SR * (DUR + 1))
rng = np.random.default_rng(41)
music, perc, fx = (np.zeros((N, 2)) for _ in range(3))
SA = 62                                   # D
MOHANAM = [0, 2, 4, 7, 9]


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
def sw(deg, octv=0): return SA + 12 * octv + MOHANAM[deg % 5] + 12 * (deg // 5)


def tanpura(d, root=SA - 12):
    t = ts(d)
    s = sum(g / h ** 1.1 * np.sin(2 * np.pi * midi(m) * h * t + h) * (.6 + .4 * np.sin(2 * np.pi * (.1 * h + .05) * t))
            for m, g in [(root + 7, .35), (root + 12, .45), (root + 12, .4), (root, .5)] for h in range(1, 9))
    return filt(s, "lowpass", 2600) * .09


def venu(notes, t0):
    """Bamboo flute: breathy sine with slides between notes (gamaka) and delayed vibrato. notes: (beat_s, midi, dur_s)."""
    total = max(b + d for b, _, d in notes) + .5
    n = int(total * SR); t = np.arange(n) / SR
    f = np.full(n, midi(notes[0][1])); amp = np.zeros(n)
    for b, m, d in notes:
        i0, i1 = int(b * SR), int((b + d) * SR); f[i0:] = midi(m); L = i1 - i0
        seg = np.zeros(n); seg[i0:i1] = np.minimum(1, np.arange(L) / (.06 * SR)) * np.minimum(1, (L - np.arange(L)) / (.18 * SR))
        amp = np.maximum(amp, seg)
    k = int(.07 * SR); f = np.convolve(f, np.ones(k) / k, mode="same")
    vib = .006 * np.sin(2 * np.pi * 5.4 * t) * np.clip((t % 1.2) / .5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * (1 + vib)) / SR
    breath = filt(rng.standard_normal(n), "bandpass", (1200, 7000)) * .12
    w = np.sin(ph) + .22 * np.sin(2 * ph) + .06 * np.sin(3 * ph) + breath
    return w * amp, t0


# ---------------------------------------------------------------- mridangam strokes
def thom(v=1.):
    t = ts(.5); f = 70 + 45 * np.exp(-t * 20)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)) * v
def nam(v=1., dec=5.):
    t = ts(1.0); f0 = midi(SA)
    return sum(g * np.sin(2 * np.pi * f0 * h * t) * np.exp(-t * dec * (1 + .3 * h)) for h, g in [(1, 1), (2, .7), (3, .45), (4, .25)]) * .5 * v \
        + filt(rng.standard_normal(len(t)), "bandpass", (1500, 5000)) * np.exp(-t * 90) * .4 * v
def din(v=1.): return nam(v, 2.4)
def ta(v=1.):
    t = ts(.12)
    return (filt(rng.standard_normal(len(t)), "bandpass", (1800, 6000)) * np.exp(-t * 70) + .5 * np.sin(2 * np.pi * 520 * t) * np.exp(-t * 60)) * v
def chapu(v=1.):
    t = ts(.8); f0 = midi(SA) * 4.02
    return np.sin(2 * np.pi * f0 * t) * np.exp(-t * 4) * .5 * v


def bol(seq, t0, beat, v=1., g=.5):
    """Play a sollukattu: space-separated syllables, '-' is a rest, each one `beat` seconds."""
    for i, s in enumerate(seq.split()):
        if s == "-": continue
        tt = t0 + i * beat
        if s == "tha": add(perc, tt, thom(v), g * .9); add(perc, tt, ta(.5 * v), g * .5, .2)
        elif s == "dhi": add(perc, tt, din(v), g * .7, .15); add(perc, tt, thom(.6 * v), g * .5)
        elif s == "jhu": add(perc, tt, chapu(v), g * .6, .2)
        elif s == "ka": add(perc, tt, ta(v), g * .6, .25)
        else: add(perc, tt, nam(v), g * .6, .15)


# ---------------------------------------------------------------- sound effects
def bell(m, d=3.0): t = ts(d); return sum(g * np.sin(2 * np.pi * midi(m) * r * t) * np.exp(-t * k) for r, g, k in [(1, 1, .9), (2, .5, 1.4), (2.76, .35, 1.9), (5.4, .2, 3)])
def splash(v=1.):
    t = ts(.7); n = filt(rng.standard_normal(len(t)), "bandpass", (500, 4000)) * np.exp(-t * 7)
    return (n + .6 * np.sin(2 * np.pi * np.cumsum(180 + 400 * np.exp(-t * 12)) / SR) * np.exp(-t * 14)) * v
def plip(v=1.): t = ts(.25); return np.sin(2 * np.pi * np.cumsum(500 + 900 * t) / SR) * np.exp(-t * 22) * v
def rattle(d, v=1.): t = ts(d); return filt(rng.standard_normal(len(t)), "bandpass", (3000, 9000)) * (.5 + .5 * np.sin(2 * np.pi * 22 * t)) ** 2 * v * np.minimum(1, (d - t) / .05)
def swish(v=1.): t = ts(.35); return filt(rng.standard_normal(len(t)), "bandpass", (800, 5000)) * np.sin(np.pi * t / .35) ** 2 * v
def thud(v=1.): t = ts(.3); return np.sin(2 * np.pi * np.cumsum(90 + 60 * np.exp(-t * 30)) / SR) * np.exp(-t * 16) * v
def twinkle(m): t = ts(1.4); return (np.sin(2 * np.pi * midi(m) * t) + .3 * np.sin(2 * np.pi * midi(m) * 3.01 * t)) * np.exp(-t * 3.2)
def strike(): t = ts(1.2); return filt(rng.standard_normal(len(t)), "bandpass", (1500, 7000)) * np.exp(-t * 18) * .8 + filt(rng.standard_normal(len(t)), "lowpass", 900) * np.exp(-t * 2.2) * np.minimum(1, t / .15) * .5
def pad(ms, d):
    t = ts(d); s = np.zeros(len(t))
    for m in ms:
        for det in (-.08, 0, .08): s += sum(np.sin(h * 2 * np.pi * midi(m + det) * t) / h for h in range(1, 6))
    return filt(s, "lowpass", 1600) / len(ms) * .3 * np.minimum(1, t / 1.0) * np.minimum(1, (d - t) / 1.2)


# ================================================================ score
BEAT = .625                                              # 96 BPM
add(music, .4, tanpura(59.6), 1.0)
# S1 0-5: the wick is struck; a slow flute alap
add(fx, .5, strike(), .5)
add(fx, 1.4, bell(sw(5), 3.5), .08)
sig, t0 = venu([(0, sw(0), 1.1), (1.1, sw(1), .5), (1.6, sw(2), 1.3), (2.9, sw(1), .4), (3.3, sw(0), 1.2)], 1.3)
add(music, t0, sig, .32, -.1)
# S2 5-13: the sea; flute melody, mridangam enters softly
sig, t0 = venu([(0, sw(2), .6), (.6, sw(3), .6), (1.2, sw(4), 1.2), (2.4, sw(3), .6), (3.0, sw(2), .6), (3.6, sw(1), 1.2),
                (5.0, sw(2), .6), (5.6, sw(4), .6), (6.2, sw(5), 1.5)], 5.3)
add(music, t0, sig, .3, -.1)
add(music, 5.0, pad([SA - 12, SA - 5, SA], 8.2), .35)
bol("tha - - - dhi - - - tha - - - dhi - mi -", 8.0, BEAT / 2, .6, .4)
# S3 13-21: the vanar sena; full groove, a splash for every rock
for bar in range(3):
    bol("tha ka dhi mi tha ka jhu na", 13.0 + bar * 8 * BEAT / 2, BEAT / 2, .85, .5)
for lt in [14.95, 16.3, 17.65, 19.0, 20.35]:
    add(fx, lt, splash(), .35, .3); add(perc, lt, thom(1), .35)
for r in [14.2, 15.55, 16.9, 18.25, 19.6]: add(fx, r - .05, swish(.8), .2, -.2)
sig, t0 = venu([(0, sw(5), .3), (.3, sw(6), .3), (.6, sw(7), .6), (1.2, sw(6), .3), (1.5, sw(5), .3), (1.8, sw(4), .6),
                (2.5, sw(5), .3), (2.8, sw(7), .3), (3.1, sw(8), .9), (4.2, sw(7), .3), (4.5, sw(6), .3), (4.8, sw(5), 1.0),
                (6.0, sw(4), .3), (6.3, sw(5), .3), (6.6, sw(7), 1.2)], 13.2)
add(music, t0, sig, .26, .1)
# S4 21-29: the squirrel; light, quick strokes and staccato flute
for bar in range(3):
    bol("ka ka mi ka ka mi ka mi", 21.0 + bar * 8 * BEAT / 2, BEAT / 2, .55, .38)
staccato = [(i * .31, sw([5, 7, 6, 5, 7, 8, 7, 5][i % 8]), .16) for i in range(24)]
sig, t0 = venu(staccato, 21.2)
add(music, t0, sig, .2, .2)
for d in [21.1 + 3.1 * .28, 24.2 + 2.6 * .28, 26.8 + 2.1 * .28]: add(fx, d, plip(), .3, .2)
for a, b in [(21.1 + 3.1 * .84, 24.2), (24.2 + 2.6 * .84, 26.8), (26.8 + 2.1 * .84, 28.9), (30.2, 31.3)]: add(fx, a, rattle(b - a), .12, .1)
# S5 29-36: the scoff; the drum stops, a mocking flute run, the flick and the tumble
bol("tha - ka - tha - ka -", 29.0, BEAT / 2, .6, .35)
sig, t0 = venu([(0, sw(7), .15), (.15, sw(6), .15), (.3, sw(7), .15), (.45, sw(6), .15), (.6, sw(7), .15), (.75, sw(6), .15),
                (1.2, sw(8), .2), (1.4, sw(7), .2), (1.6, sw(8), .2), (1.8, sw(7), .4)], 30.6)
add(music, t0, sig, .22, .3)
add(fx, 33.4, swish(1), .3, .2)
sig, t0 = venu([(0, sw(9), .1), (.1, sw(7), .1), (.2, sw(5), .1), (.3, sw(3), .1), (.4, sw(1), .1), (.5, sw(0), .3)], 33.45)
add(music, t0, sig, .24)
add(fx, 34.25, thud(1), .5); add(fx, 34.45, thud(.5), .3)
# S6 36-45: Ram's touch; tender melody, a twinkle for each stripe as it lights
add(music, 36.0, pad([SA - 12, SA - 5, SA, SA + 4], 9.2), .45)
sig, t0 = venu([(0, sw(2), 1.0), (1.0, sw(3), .5), (1.5, sw(4), 1.5), (3.2, sw(5), 1.0), (4.2, sw(4), .5), (4.7, sw(3), 1.3)], 36.4)
add(music, t0, sig, .26)
for k in range(9): add(fx, 40.1 + k * .18, twinkle(sw(5 + k % 6) + 12), .08, (-1) ** k * .3)
add(fx, 41.7, bell(sw(5) + 12, 3), .07)
sig, t0 = venu([(0, sw(5), 1.2), (1.2, sw(4), .6), (1.8, sw(5), 1.8)], 42.2)
add(music, t0, sig, .24)
# S7 45-52: the moral; temple bell and long flute notes over the drone
add(fx, 45.2, bell(SA, 5.5), .2)
sig, t0 = venu([(0, sw(0), 1.8), (1.8, sw(1), .8), (2.6, sw(2), 1.6), (4.4, sw(1), .6), (5.0, sw(0), 1.6)], 45.8)
add(music, t0, sig, .26)
add(music, 45.0, pad([SA - 12, SA - 5, SA], 7.2), .3)
# S8 52-60: thekua by hand; the groove returns, a soft press for each piece, then the end-card cadence
bol("tha - dhi mi tha - dhi mi tha - dhi mi tha -", 52.0, BEAT / 2, .6, .38)
for i in range(3):
    t0p = 52.25 + i * 1.3
    add(fx, t0p + .32, thud(.6), .25); add(fx, t0p + 1.05, thud(.4), .2, -.2)
sig, t0 = venu([(0, sw(2), .6), (.6, sw(4), .6), (1.2, sw(5), 1.2), (2.4, sw(4), .6), (3.0, sw(2), 1.0)], 52.4)
add(music, t0, sig, .24)
bol("tha ka dhi mi tha ka jhu na tha - - - dhi - - -", 56.4, BEAT / 2, .8, .45)
add(fx, 56.5, bell(sw(5), 3.5), .12)
sig, t0 = venu([(0, sw(5), .5), (.5, sw(7), .5), (1.0, sw(8), .8), (1.8, sw(7), .4), (2.2, sw(5), 1.6)], 56.6)
add(music, t0, sig, .3)
add(music, 56.4, pad([SA - 12, SA - 5, SA, SA + 4, SA + 7], 3.6), .7)


def reverb(x, wet, secs=2.2):
    n = int(secs * SR); o = np.zeros_like(x)
    for ch in range(2):
        ir = filt(rng.standard_normal(n) * np.exp(-np.arange(n) / (.5 * SR)), "lowpass", 6000)
        o[:, ch] = fftconvolve(x[:, ch], ir / np.sqrt(np.sum(ir ** 2)))[:len(x)]
    return x + wet * o


mix = reverb(music, .35) + reverb(perc, .14) + reverb(fx, .25)
mix = filt(mix.T, "highpass", 30).T[:int(DUR * SR)]
fi, fo = int(.3 * SR), int(1.2 * SR)
mix[:fi] *= np.linspace(0, 1, fi)[:, None]; mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.4
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.4 * mix) / np.tanh(1.4) * .9
out = os.path.join(ROOT, "assets", "music", "music.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("wrote", out)
