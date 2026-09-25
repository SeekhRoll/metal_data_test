"""Soundtrack for concept 03, "Ghar ki Mithas" (the sweetness of home).

Warm and uplifting at 100 BPM (one bar = 2.4 s; each scene is two bars):
santoor arpeggios over a D-A-Bm-G progression, bansuri melody, string pad,
soft tabla that grows into dholak + claps for the family scene, a temple
bell at the ghat, rain ambience at home and a swelling finale.

    python3 03-ghar-ki-mithas/soundtrack.py  ->  03-ghar-ki-mithas/build/soundtrack.wav
"""
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build")
SR = 44100
DUR = 30.0
BEAT = 0.6
BAR = 4 * BEAT
N = int(SR * (DUR + 1.0))
rng = np.random.default_rng(21)
music, perc, fx = (np.zeros((N, 2)) for _ in range(3))


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(sig, kind, f, order=2):
    f = [x / (SR / 2) for x in f] if isinstance(f, (list, tuple)) else f / (SR / 2)
    return sosfilt(butter(order, f, btype=kind, output="sos"), sig)


def add(bus, t, sig, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or t < 0:
        return
    sig = sig[: N - i]
    bus[i:i + len(sig), 0] += sig * gain * np.cos((pan + 1) * np.pi / 4) * 1.414
    bus[i:i + len(sig), 1] += sig * gain * np.sin((pan + 1) * np.pi / 4) * 1.414


def ts(d):
    return np.arange(int(d * SR)) / SR


# ---------------------------------------------------------------- instruments
def santoor(m, d=1.2):
    """Hammered strings: bright attack, shimmering double-course decay."""
    t = ts(d)
    f = midi(m)
    s = np.zeros(len(t))
    for det in (1.0, 1.003):
        for h, g, k in [(1, 1, 2.2), (2, .5, 3.5), (3, .28, 5), (4, .15, 7), (6, .07, 10)]:
            s += g * np.sin(2 * np.pi * f * det * h * t) * np.exp(-t * k)
    click = filt(rng.standard_normal(len(t)), "highpass", 4000) * np.exp(-t * 300) * .3
    return (s * .5 + click) * np.minimum(1, t / .001)


def bansuri(notes, t0):
    """notes: (beat_offset, midi, beats). Breathy flute with glides and vibrato."""
    total = max(b + d for b, _, d in notes) * BEAT + .5
    n = int(total * SR)
    t = np.arange(n) / SR
    f = np.full(n, midi(notes[0][1]))
    amp = np.zeros(n)
    for b, m, d in notes:
        i0, i1 = int(b * BEAT * SR), int((b + d) * BEAT * SR)
        f[i0:] = midi(m)
        L = i1 - i0
        env = np.minimum(1, np.arange(L) / (.06 * SR)) * np.minimum(1, (L - np.arange(L)) / (.12 * SR))
        seg = np.zeros(n)
        seg[i0:i1] = env
        amp = np.maximum(amp, seg)
    k = int(.06 * SR)
    f = np.convolve(f, np.ones(k) / k, mode="same")
    vib = 1 + .005 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / .6)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    tone = np.sin(ph) + .18 * np.sin(2 * ph) + .06 * np.sin(3 * ph)
    breath = filt(rng.standard_normal(n), "bandpass", (1500, 6000)) * .12
    return (tone + breath) * amp, t0


def pad(ms, d):
    t = ts(d)
    s = np.zeros(len(t))
    for m in ms:
        for det in (-.12, 0, .12):
            ph = 2 * np.pi * midi(m + det) * t + rng.uniform(0, 6)
            s += sum(np.sin(h * ph) / h for h in range(1, 7))
    s = filt(s, "lowpass", 1800)
    env = np.minimum(1, t / .6) * np.minimum(1, (d - t) / .8)
    return s * env / len(ms) * .5


def bass(m, d):
    t = ts(d)
    return np.sin(2 * np.pi * midi(m) * t) * np.minimum(1, t / .01) * np.exp(-t / (d * .8))


def tabla_dha(v=1.):
    t = ts(.5)
    low = np.sin(2 * np.pi * np.cumsum(80 + 60 * np.exp(-t * 18)) / SR) * np.exp(-t * 6)
    ring = np.sin(2 * np.pi * 620 * t) * np.exp(-t * 9) * .5
    return (low + ring) * v


def tabla_na(v=1.):
    t = ts(.35)
    return (np.sin(2 * np.pi * 700 * t) * np.exp(-t * 10) + .4 * np.sin(2 * np.pi * 1400 * t) * np.exp(-t * 16)) * v


def tabla_ti(v=1.):
    t = ts(.08)
    return filt(rng.standard_normal(len(t)), "bandpass", (2000, 6000)) * np.exp(-t * 70) * v


def dholak(v=1.):
    t = ts(.35)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(90 + 80 * np.exp(-t * 30)) / SR) * np.exp(-t * 8)) * v


def clap(v=1.):
    t = ts(.25)
    e = np.exp(-t * 150) + (t > .011) * np.exp(-np.maximum(0, t - .011) * 150) + (t > .022) * .6 * np.exp(-np.maximum(0, t - .022) * 22)
    return filt(rng.standard_normal(len(t)), "bandpass", (900, 5000)) * e * v


def bell(m, d=3.5):
    t = ts(d)
    f = midi(m)
    return sum(g * np.sin(2 * np.pi * f * r * t) * np.exp(-t * k) for r, g, k in
               [(1, 1, .9), (2.0, .5, 1.3), (2.76, .35, 1.8), (5.4, .2, 3), (8.9, .1, 5)]) * np.minimum(1, t / .002)


def chime(m, d=1.5):
    t = ts(d)
    f = midi(m)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 3) + .3 * np.sin(2 * np.pi * f * 4.1 * t) * np.exp(-t * 9))


def swell(d, f0=300, f1=5000):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for c in range(30):
        a, b = c * n // 30, (c + 1) * n // 30
        fc = f0 * (f1 / f0) ** (c / 30)
        out[a:b] = filt(x[a:b], "bandpass", (fc * .7, min(20000, fc * 1.4)))
    return out * np.sin(np.linspace(0, np.pi, n)) ** 2


def rain(d):
    n = int(d * SR)
    x = filt(rng.standard_normal(n), "bandpass", (1500, 9000)) * .4
    drops = np.zeros(n)
    for _ in range(int(d * 60)):
        j = rng.integers(0, n - 400)
        drops[j:j + 400] += rng.standard_normal(400) * np.exp(-np.arange(400) / 60) * rng.uniform(.2, 1)
    env = np.minimum(1, np.arange(n) / (.5 * SR)) * np.minimum(1, (n - np.arange(n)) / (.6 * SR))
    return (x + filt(drops, "highpass", 2000)) * env


# ---------------------------------------------------------------- harmony
D4 = 62
CHORDS = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]]   # D  A  Bm  G
ROOTS = [38, 33, 35, 31]
nbars = int(np.ceil(DUR / BAR))
for b in range(nbars):
    t0 = b * BAR
    ch = CHORDS[b % 4]
    final = t0 >= 24.0
    if final:
        ch = CHORDS[0] if b % 2 == 0 else CHORDS[3]
    add(music, t0, pad([m - 12 for m in ch] + [ch[0]], BAR + .6), .55 if t0 < 4.8 else .7)
    # santoor arpeggio: 8ths, 16ths once the family is together
    step = BEAT / 2 if t0 < 14.4 or t0 >= 26.4 else BEAT / 4
    pat = [0, 1, 2, 1, 3, 2, 1, 2]
    k = 0
    while k * step < BAR - 1e-6:
        idx = pat[k % 8]
        m = (ch + [ch[0] + 12])[idx] + 12
        add(music, t0 + k * step, santoor(m, 1.0), .16 if step < .2 else .2, -.35 + .1 * (k % 8))
        k += 1
    if t0 >= 4.8:
        add(music, t0, bass(ROOTS[b % 4] if not final else 38, BAR * .9), .45)
        add(music, t0 + BEAT * 2.5, bass(ROOTS[b % 4] + 12 if not final else 50, BEAT * 1.2), .25)

# percussion: soft tabla from the ghat, dholak + claps at home
for b in range(nbars):
    t0 = b * BAR
    if t0 < 4.8 or t0 >= 27.0:
        continue
    for s in range(16):
        tt = t0 + s * BEAT / 4
        if s in (0, 6, 8):
            add(perc, tt, tabla_dha(.9), .45)
        if s in (3, 10, 12, 14):
            add(perc, tt, tabla_na(.7), .3, .25)
        if s % 2 == 1:
            add(perc, tt, tabla_ti(.6), .18, .4)
        if 14.4 <= t0 < 24.0:
            if s in (0, 7, 10):
                add(perc, tt, dholak(.9), .4, -.1)
            if s in (4, 12):
                add(perc, tt, clap(), .3, .1)

# bansuri melody, phrase per scene (beat offsets relative to scene start)
MEL = {
    0.0: [(2, 74, 1), (3, 76, 1), (4, 78, 2), (6, 76, 1), (7, 74, 1)],
    4.8: [(0, 78, 1.5), (1.5, 81, .5), (2, 83, 2), (4, 81, 1), (5, 78, 1), (6, 76, 2)],
    9.6: [(0, 74, 1), (1, 76, .5), (1.5, 78, .5), (2, 76, 2), (4, 74, 1), (5, 71, 1), (6, 74, 2)],
    14.4: [(0, 78, .5), (.5, 81, .5), (1, 83, 1), (2, 81, .5), (2.5, 78, .5), (3, 76, 1), (4, 78, 1), (5, 81, 1), (6, 86, 2)],
    19.2: [(0, 83, 1), (1, 81, 1), (2, 78, 2), (4, 81, 1), (5, 83, 1), (6, 85, 2)],
    24.0: [(0, 86, 2), (2, 83, 1), (3, 81, 1), (4, 78, 2), (6, 81, 1), (7, 78, 1), (8, 74, 4)],
}
for t0, notes in MEL.items():
    sig, st = bansuri(notes, t0)
    add(music, st, sig, .32, .15)

# scene moments
add(fx, 0.0, chime(86, 2.5), .12, .4)                       # dawn
add(fx, 3.0, swell(1.8, 400, 6000), .12)                    # thekua floats into the window
add(fx, 4.8, bell(74, 4.0), .1, -.2)
add(fx, 6.2, bell(62, 5.0), .22, .1)                        # temple bell as it lands in the soop
add(fx, 8.8, swell(.8, 300, 5000), .14)                     # dive into the thekua
for i, m in enumerate([86, 90, 93]):
    add(fx, 9.6 + i * .12, chime(m, 1.2), .08, .3)
add(fx, 13.6, swell(.8, 500, 7000), .12)                    # into the phone
add(fx, 14.4, rain(4.9), .05)                               # monsoon at home
add(fx, 19.2, swell(.8, 6000, 400), .1)                     # pull out through the window
add(fx, 22.6, swell(1.4, 300, 6000), .12)                   # rise into the sky
add(fx, 24.0, bell(74, 5.0), .12)
for i, m in enumerate([74, 78, 81, 86, 90]):
    add(fx, 24.0 + i * .08, chime(m, 2.0), .07, -.4 + .2 * i)


# ---------------------------------------------------------------- mix
def reverb(x, wet, secs=2.2):
    n = int(secs * SR)
    out = np.zeros_like(x)
    for ch in range(2):
        ir = filt(rng.standard_normal(n) * np.exp(-np.arange(n) / (.5 * SR)), "lowpass", 6000)
        out[:, ch] = fftconvolve(x[:, ch], ir / np.sqrt(np.sum(ir ** 2)))[:len(x)]
    return x + wet * out


mix = reverb(music, .35) + reverb(perc, .12) + reverb(fx, .3)
mix = filt(mix.T, "highpass", 30).T[:int(DUR * SR)]
fade = int(1.6 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.3
mix[:int(.05 * SR)] *= np.linspace(0, 1, int(.05 * SR))[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.5 * mix) / np.tanh(1.5) * .93

os.makedirs(OUT_DIR, exist_ok=True)
with wave.open(os.path.join(OUT_DIR, "soundtrack.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("wrote", os.path.join(OUT_DIR, "soundtrack.wav"))
