"""Original score for "Ekta ka Jaal" (brief §3.4: bansuri with dhol, a Gond folk rhythm), 60 s, timed to the scenes.

Bhoopali colour on E (E F# G# B C#), tanpura drone, bansuri lead, and a folk dhol in a lilting 6/8 with
timki and manjira. Emotion follows the patterns: scattered, uneven rhythm in the panic; one locked
groove, in step with the wingbeats, once the flock flies as one. Sound effects follow the picture: leaves
popping, grain falling, the net dropping, the king's call, the mouse's nibbles, each pigeon's joyful burst.
Composed here, so it is royalty-free. Levels leave room for the VO (mix.py ducks it).
    python3 scripts/music.py  ->  assets/music/music.wav
"""
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, DUR = 44100, 60.0
N = int(SR * (DUR + 1))
rng = np.random.default_rng(57)
music, perc, fx = (np.zeros((N, 2)) for _ in range(3))
SA = 64                                   # E
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


# ---------------------------------------------------------------- folk dhol, timki, manjira
def dhol_bass(v=1.):
    t = ts(.6); f = 62 + 70 * np.exp(-t * 26)
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.5)) * v
def dhol_slap(v=1.):
    t = ts(.2)
    return (filt(rng.standard_normal(len(t)), "bandpass", (900, 4500)) * np.exp(-t * 45) + .6 * np.sin(2 * np.pi * 330 * t) * np.exp(-t * 30)) * v
def timki(v=1.):
    t = ts(.25); return (np.sin(2 * np.pi * 620 * t) * np.exp(-t * 22) + .4 * filt(rng.standard_normal(len(t)), "bandpass", (2000, 6000)) * np.exp(-t * 60)) * v
def manjira(v=1.): t = ts(1.0); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 3.4) for f in (3100, 4260, 5520)) * .2 * v
def pop(m): t = ts(.3); return np.sin(2 * np.pi * np.cumsum(midi(m) * (1 + .6 * np.exp(-t * 40))) / SR) * np.exp(-t * 14)
def nibble(v=1.): t = ts(.07); return filt(rng.standard_normal(len(t)), "bandpass", (2500, 8000)) * np.exp(-t * 80) * v
def flutter(d, v=1., rate=14):
    t = ts(d); return filt(rng.standard_normal(len(t)), "bandpass", (300, 2500)) * (.5 + .5 * np.sin(2 * np.pi * rate * t)) ** 3 * v * np.minimum(1, (d - t) / .1)

EIGHTH = .25                                             # 6/8 at 80 bpm dotted-quarter: each eighth 0.25 s, bar 1.5 s
def groove(t0, bars, v=1., fill=False):
    """dhol 6/8: DHA - na DHA na na | with timki on the offbeats and manjira on each bar"""
    for b in range(bars):
        tb = t0 + b * 6 * EIGHTH
        add(perc, tb, dhol_bass(v), .5); add(perc, tb + 3 * EIGHTH, dhol_bass(.8 * v), .45)
        for e in (2, 4, 5): add(perc, tb + e * EIGHTH, dhol_slap(.7 * v), .3, .2)
        for e in (1, 3): add(perc, tb + e * EIGHTH, timki(.5 * v), .2, -.3)
        add(fx, tb, manjira(.7 * v), .18, .4)
        if fill and b == bars - 1:
            for e in range(6): add(perc, tb + e * EIGHTH / 2 + 3 * EIGHTH, dhol_slap(.8), .28, .1)


# ================================================================ score
add(music, .3, tanpura(59.7), 1.0)
# S1 0-5: the seed; bansuri alap; a pop for the leaves opening
sig, t0 = venu([(0, sw(0), 1.3), (1.3, sw(1), .5), (1.8, sw(2), 1.2), (3.0, sw(4), .6), (3.6, sw(3), 1.2)], .6)
add(music, t0, sig, .3)
for k in range(14): add(fx, 2.6 + k * .11, pop(sw(5 + k % 5)), .06, (-1) ** k * .4)
# S2 5-13: the flock over the forest; the folk groove enters, a soaring melody
groove(5.5, 5, .7)
sig, t0 = venu([(0, sw(4), .75), (.75, sw(5), .75), (1.5, sw(6), 1.5), (3.0, sw(5), .75), (3.75, sw(4), .75), (4.5, sw(2), 1.5),
                (6.0, sw(4), .5), (6.5, sw(5), .5), (7.0, sw(7), 1.0)], 5.3)
add(music, t0, sig, .28, -.1)
add(fx, 5.4, flutter(7.5, .5, 4), .04, .3)
# S3 13-20: the hunter; a sparse, low pulse; grain falls; the net rises
for b in range(9): add(perc, 13.0 + b * .75, dhol_bass(.5), .35)
for k in range(34): add(fx, 13.4 + k * .045 + .6, timki(.25), .05, (-1) ** k * .3)
add(fx, 15.6, flutter(1.2, .6, 9), .08)
sig, t0 = venu([(0, sw(-3), 1.0), (1.0, sw(-2), .5), (1.5, sw(-3), 1.5), (3.4, sw(-1), .6), (4.0, sw(0), 1.4)], 13.3)
add(music, t0, sig, .22)
add(fx, 18.0, flutter(1.9, .7, 14), .1, -.2)
# S4 20-27: the net drops; panic: scattered, uneven strokes and flapping
add(fx, 20.3, thud(1.2), .6); add(perc, 20.3, dhol_bass(1.2), .5)
for k in range(46):
    tt = 20.6 + k * .14 + rng.uniform(-.05, .05)
    add(perc, tt, dhol_slap(rng.uniform(.4, .9)), .22, rng.uniform(-.6, .6))
    if k % 3 == 0: add(perc, tt + .07, timki(.5), .12, rng.uniform(-.6, .6))
add(fx, 20.5, flutter(6.4, 1, 17), .12)
add(music, 20.4, pad([SA - 13, SA - 12, SA - 6], 6.8), .35)
# S5 27-35: the king's call; the rhythm locks, in step with the wingbeats; up into the sky
sig, t0 = venu([(0, sw(7), .25), (.25, sw(9), .9)], 27.5)
add(music, t0, sig, .34)
groove(28.2, 5, .95, fill=True)
sig, t0 = venu([(0, sw(5), .5), (.5, sw(6), .5), (1.0, sw(7), 1.0), (2.0, sw(8), .5), (2.5, sw(9), 1.5), (4.2, sw(8), .5), (4.7, sw(7), 1.5)], 29.4)
add(music, t0, sig, .3)
add(music, 29.4, pad([SA - 12, SA - 5, SA, SA + 4], 5.8), .5)
for k in range(13): add(fx, 28.2 + k * .5, swish(.6), .08, .2)
# S6 35-44: the friend; playful nibbles; a burst of joy for each pigeon set free, the king's last and biggest
groove(35.2, 3, .55)
for i in range(7):
    ft = 43.1 if i == 0 else 39.3 + (i - 1) * .62
    for k in range(6): add(fx, ft - .55 + k * .08, nibble(.8), .2, .3)
    for k in range(6 if i else 12): add(fx, ft + k * .05, pop(sw(5 + (k + i) % 6) + 12), .07 if i else .09, (-1) ** k * .5)
add(fx, 43.1, bell(sw(5), 3), .1)
sig, t0 = venu([(0, sw(4), .4), (.4, sw(5), .4), (.8, sw(4), .4), (1.2, sw(2), .8), (2.4, sw(4), .4), (2.8, sw(5), .4), (3.2, sw(7), 1.0)], 39.2)
add(music, t0, sig, .22, .2)
# S7 44-51: the moral; together on the banyan; a calm, united melody
groove(44.2, 4, .5)
sig, t0 = venu([(0, sw(2), 1.2), (1.2, sw(4), .6), (1.8, sw(5), 1.6), (3.6, sw(4), .6), (4.2, sw(2), .6), (4.8, sw(0), 1.8)], 44.4)
add(music, t0, sig, .28)
add(music, 44.0, pad([SA - 12, SA - 5, SA], 7.2), .35)
add(fx, 45.6, bell(SA, 4.5), .14)
# S8 51-60: the family; warm groove; end-card flourish
groove(51.2, 3, .7)
sig, t0 = venu([(0, sw(4), .5), (.5, sw(5), .5), (1.0, sw(7), 1.0), (2.0, sw(5), .5), (2.5, sw(4), 1.5)], 51.4)
add(music, t0, sig, .26)
for k in range(2): add(fx, 52.2 + k * .35, flutter(.8, .6, 12), .06)
groove(55.7, 2, .9, fill=True)
add(fx, 56.2, bell(sw(5), 3.5), .12)
sig, t0 = venu([(0, sw(5), .4), (.4, sw(7), .4), (.8, sw(8), .8), (1.6, sw(7), .4), (2.0, sw(5), 1.8)], 56.3)
add(music, t0, sig, .3)
add(music, 56.2, pad([SA - 12, SA - 5, SA, SA + 4, SA + 7], 3.8), .7)


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
