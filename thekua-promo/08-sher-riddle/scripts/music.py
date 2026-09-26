"""Original score for "Ee Gaya Hamra Sher" (brief §5.4: a light, playful folk tune on harmonium, dholak and flute).

A bouncy 4/4 in Bilawal (major) on D, timed to src/film/timeline.json: a village tune for the introduction, a
curious little theme for the problem, a held harmonium chord and a ticking pause for "सोचिए…", a comic slide for
"गोभिया तो गई!", a rowing groove for the seven crossings with a chime each time the panel updates, a swaggering
drum flourish under every "ई गया हमरा शेर!", and a warm cadence at golden hour. Royalty-free (composed here).
    python3 scripts/music.py  ->  assets/music/music.wav"""
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, DUR = 44100, 60.0
N = int(SR * (DUR + 1))
rng = np.random.default_rng(57)
music, perc, fx = (np.zeros((N, 2)) for _ in range(3))
SA = 62                                   # D
MOHANAM = [0, 2, 4, 5, 7, 9, 11]  # Bilawal (major)


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
def sw(deg, octv=0): return SA + 12 * octv + MOHANAM[deg % 7] + 12 * (deg // 7)


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


import json
TL = json.load(open(os.path.join(ROOT, 'src/film/timeline.json')))


def harmonium(ms, d, v=1.):
    """reedy chord: odd-rich partials, bellows swell and a slow tremolo"""
    t = ts(d); s = np.zeros(len(t))
    for m in ms:
        f = midi(m)
        for h in range(1, 9):
            s += np.sin(2 * np.pi * f * h * t * (1 + .0008 * (h % 3))) * (1 / h ** .8) * (1.0 if h % 2 else .55)
    s = filt(s, 'lowpass', 3200) / len(ms) * .22
    env = np.minimum(1, t / .12) * np.minimum(1, (d - t) / .2) * (1 + .08 * np.sin(2 * np.pi * 5.5 * t))
    return s * env * v


def dholak(v=1.):
    t = ts(.45); return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(92 + 80 * np.exp(-t * 26)) / SR) * np.exp(-t * 7)) * v
def dha(v=1.):
    t = ts(.18); return (filt(rng.standard_normal(len(t)), 'bandpass', (900, 5000)) * np.exp(-t * 55) + .5 * np.sin(2 * np.pi * 420 * t) * np.exp(-t * 40)) * v
def kharatal(v=1.):
    t = ts(.3); return filt(rng.standard_normal(len(t)), 'highpass', 5000) * np.exp(-t * 25) * v


BPM = 112; B = 60 / BPM
def groove(t0, t1, v=1.):
    """dholak keherwa-ish: dha . ge na | ta . ge na"""
    t = t0
    while t < t1 - .01:
        for i, (stroke, g) in enumerate([('b', 1), ('s', .6), ('b', .7), ('s', .5), ('s', .8), ('s', .5), ('b', .7), ('s', .5)]):
            tt = t + i * B / 2
            if tt >= t1: break
            add(perc, tt, dholak(g * v) if stroke == 'b' else dha(g * v), .45 if stroke == 'b' else .28, .15 if stroke == 's' else 0)
            if i % 2 == 1: add(fx, tt, kharatal(.5 * v), .08, .4)
        t += 4 * B


def tune(t0, degs, step=B / 2, v=.26, octv=1):
    notes = [(i * step, sw(d, octv), step * (1.8 if i == len(degs) - 1 else .95)) for i, d in enumerate(degs) if d is not None]
    sig, s0 = venu(notes, t0); add(music, s0, sig, v, -.1)


def chords(t0, t1, prog, bar=4 * B, v=1.):
    t, i = t0, 0
    while t < t1 - .05:
        root = prog[i % len(prog)]
        add(music, t, harmonium([SA - 12 + root, SA - 12 + root + (3 if root in (2, 4, 9) else 4), SA - 12 + root + 7], min(bar, t1 - t) + .05, v), .5, .15)
        t += bar; i += 1


# ================================================================ score
W = TL['wrong']; C = TL['crossings']
# S1 introduction: a village tune
chords(.2, 6, [0, 5, 7, 0])
groove(1.0, 6.0, .7)
tune(1.1, [0, 2, 4, 4, 5, 4, 2, 0, 2, 4, 2, None, 0])
# S2 the problem: a curious, tiptoeing theme
chords(6, 20, [0, 9, 5, 7])
for k in range(int(13.5 / (B))): add(perc, 6.3 + k * B, dha(.35 if k % 2 else .5), .2, (-1) ** k * .2)
tune(6.4, [4, None, 5, 4, 2, None, 4, 2, 0, None, 7, 6, 5, 4], B / 2 * 1.4, .22)
tune(13.5, [7, 6, 5, None, 4, 5, 4, 2, None, 2, 1, 0], B / 2 * 1.4, .22)
for b in TL.get('bubbles', []): add(fx, b['from'], twinkle(sw(7, 1)), .1, .3)
# S3 "सोचिए…": a held chord and a ticking clock
add(music, 20.2, harmonium([SA - 12, SA - 8, SA - 5, SA - 1], 3.8, .8), .45)
for k in range(8): add(fx, 20.6 + k * .45, dha(.35), .16, (-1) ** k * .5)
# S4 the wrong attempt: bold march; the comic collapse
chords(24.0, W['turn'], [0, 7])
groove(24.2, W['turn'], .9)
sig, s0 = venu([(0, sw(0, 1), .6), (.6, sw(4, 1), .6), (1.2, sw(7, 1), 1.2)], 24.6); add(music, s0, sig, .26)
sig, s0 = venu([(0, sw(4, 1), .35), (.35, sw(3, 1), .35), (.7, sw(2, 1), .35), (1.05, sw(1, 1) - .5, 1.1)], W['turn'] + .2); add(music, s0, sig, .3)
add(fx, W['turn'] + .1, thud(.8), .4)
add(fx, W['wipe'], swish(1), .3, -.3); add(fx, W['wipe'] + .3, swish(.8), .25, .3)
# S5 the seven crossings: the rowing groove, a chime when the panel updates
groove(34.0, 83.0, .8)
chords(34.0, 83.0, [0, 5, 7, 0, 9, 5, 7, 0])
for c in C:
    tune(c['start'] + .3, [0, 2, 4, 5, 4, 2, 4] if c['dir'] > 0 else [4, 2, 0, 2, 4, 2, 0], B / 2, .18)
    add(fx, c['unload'] + .9, bell(sw(7, 1), 1.6), .08, .3)
# every "ई गया हमरा शेर!": a swaggering flourish
for tc in TL['catchphrase']:
    for i in range(6): add(perc, tc - .3 + i * .06, dha(.6 + .08 * i), .3, (-1) ** i * .2)
    add(perc, tc + .06, dholak(1.2), .55)
    add(music, tc + .1, harmonium([SA, SA + 4, SA + 7, SA + 12], 1.4, 1.1), .5)
# S6 finale: golden-hour cadence
chords(83.0, 90.0, [5, 7, 0], bar=2.4)
tune(83.4, [4, 5, 7, None, 9, 7, 5, 4, 2, 0], B / 2 * 1.3, .26)
groove(83.0, 88.0, .5)
add(fx, 87.2, bell(sw(0, 1), 3), .1)


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
