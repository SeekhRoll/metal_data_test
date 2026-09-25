"""Synthesizes the 30 s promo soundtrack (original, royalty-free).

Bhangra-flavoured groove at 120 BPM: dhol, tumbi riff, sitar plucks,
shehnai lead, tanpura drone, risers and impacts. Section boundaries match
the scene timeline in promo.html (every cut lands on a beat).

    python3 01-cinematic/soundtrack.py  ->  01-cinematic/build/soundtrack.wav
"""
import os
import wave

import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build")
SR = 44100
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
S16 = BEAT / 4
N = int(SR * (DUR + 0.5))
rng = np.random.default_rng(7)

drums = np.zeros((N, 2))
music = np.zeros((N, 2))
fx = np.zeros((N, 2))


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(bus, t, sig, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    bus[i : i + len(sig), 0] += sig * gain * l * 1.414
    bus[i : i + len(sig), 1] += sig * gain * r * 1.414


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def filt(sig, kind, f, order=2):
    if isinstance(f, (list, tuple)):
        sos = butter(order, [x / (SR / 2) for x in f], btype=kind, output="sos")
    else:
        sos = butter(order, f / (SR / 2), btype=kind, output="sos")
    return sosfilt(sos, sig)


# ---------------------------------------------------------------- instruments
def dagga(vel=1.0):
    """Dhol bass head: pitch-dropping membrane + slap."""
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    f = 55 + 70 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env_exp(n, 0.16)
    body += 0.35 * np.sin(2.01 * ph) * env_exp(n, 0.05)
    slap = filt(rng.standard_normal(n), "bandpass", (200, 1800)) * env_exp(n, 0.012)
    return np.tanh(1.6 * (body + 0.5 * slap)) * vel


def tilli(vel=1.0):
    """Dhol treble stick: tight crack."""
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * (520 + 160 * np.exp(-t * 60)) * t) * env_exp(n, 0.035)
    crack = filt(rng.standard_normal(n), "bandpass", (1800, 7000)) * env_exp(n, 0.018)
    return (0.6 * tone + 0.9 * crack) * vel


def clap(vel=1.0):
    n = int(0.3 * SR)
    noise = filt(rng.standard_normal(n), "bandpass", (900, 5000))
    e = np.zeros(n)
    for k, off in enumerate([0, 0.009, 0.019]):
        j = int(off * SR)
        e[j:] += env_exp(n - j, 0.006 if k < 2 else 0.07)
    return noise * e * vel


def shaker(vel=1.0):
    n = int(0.09 * SR)
    a = np.minimum(1, np.arange(n) / (0.012 * SR))
    return filt(rng.standard_normal(n), "highpass", 6500) * a * env_exp(n, 0.025) * vel


def karplus(freq, dur, bright=0.5, decay=0.996, buzz=0.0):
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p)
    buf = filt(buf, "lowpass", min(18000, 1500 + bright * 12000), 1)
    out = np.zeros(n)
    prev = 0.0
    for i in range(n):
        s = buf[i % p]
        out[i] = s
        nxt = decay * 0.5 * (s + prev)
        prev = s
        buf[i % p] = nxt
    if buzz:
        out = np.tanh(out * (1 + buzz * 6)) / np.tanh(1 + buzz * 6)
    fade = np.ones(n)
    k = int(0.02 * SR)
    fade[-k:] = np.linspace(1, 0, k)
    return out * fade


def tumbi(m, dur=0.22):
    s = karplus(midi(m), dur + 0.15, bright=0.95, decay=0.992, buzz=0.35)
    return filt(s, "highpass", 300)


def sitar(m, dur=0.9):
    s = karplus(midi(m), dur, bright=0.7, decay=0.9975, buzz=0.55)
    return filt(s, "highpass", 180)


def shehnai(notes, t0):
    """notes: list of (start_beat_offset, midi, beats). Portamento lead."""
    total = max(b + d for b, _, d in notes) * BEAT + 0.4
    n = int(total * SR)
    t = np.arange(n) / SR
    f = np.full(n, midi(notes[0][1]))
    amp = np.zeros(n)
    for b, m, d in notes:
        i0 = int(b * BEAT * SR)
        i1 = int((b + d) * BEAT * SR)
        f[i0:] = midi(m)
        seg = np.zeros(n)
        L = i1 - i0
        a = np.minimum(1, np.arange(L) / (0.04 * SR))
        r = np.minimum(1, (L - np.arange(L)) / (0.05 * SR))
        seg[i0:i1] = a * r
        amp = np.maximum(amp, seg)
    k = int(0.035 * SR)
    f = np.convolve(f, np.ones(k) / k, mode="same")  # glide
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.6 * t) * np.minimum(1, t / 0.4)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    w = np.zeros(n)
    for h, g in [(1, 0.6), (2, 0.9), (3, 1.0), (4, 0.8), (5, 0.55), (6, 0.35), (7, 0.2), (8, 0.12)]:
        w += g * np.sin(h * ph)
    w = np.tanh(0.6 * w)
    w = filt(w, "bandpass", (500, 5200))
    return w * amp, t0


def bass(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = midi(m)
    s = np.sin(2 * np.pi * fr * t) + 0.25 * np.sin(4 * np.pi * fr * t)
    e = np.minimum(1, t / 0.005) * np.exp(-t / (dur * 0.9))
    return np.tanh(1.4 * s) * e


def impact(big=1.0):
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 9)) / SR) * env_exp(n, 0.55)
    crash = filt(rng.standard_normal(n), "highpass", 3000) * env_exp(n, 0.5) * 0.35
    thud = filt(rng.standard_normal(n), "lowpass", 400) * env_exp(n, 0.06)
    return (np.tanh(1.5 * sub) + crash + 0.6 * thud) * big


def riser(dur, up=True):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    chunks = 40
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        k = c / chunks
        fc = 400 + (9000 * k ** 2 if up else 9000 * (1 - k) ** 2)
        out[a:b] = filt(noise[a:b], "bandpass", (fc * 0.7, min(20000, fc * 1.4)))
    return out * (t ** 2 if up else (1 - t) ** 2)


def whoosh(dur=0.45):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    env = np.sin(np.pi * t) ** 2
    return filt(rng.standard_normal(n), "bandpass", (500, 4000)) * env


def crunch():
    n = int(0.5 * SR)
    out = np.zeros(n)
    for _ in range(70):
        j = int(rng.uniform(0, 0.28) * SR)
        L = int(rng.uniform(0.002, 0.012) * SR)
        g = rng.uniform(0.3, 1.0) * np.exp(-j / (0.12 * SR))
        seg = rng.standard_normal(min(L, n - j)) * g
        out[j : j + len(seg)] += seg
    return filt(out, "bandpass", (700, 9000)) * 1.4


def bell(m, dur=1.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = midi(m)
    s = sum(g * np.sin(2 * np.pi * fr * r * t) * np.exp(-t * d) for r, g, d in
            [(1, 1, 2.5), (2.76, 0.5, 4), (5.4, 0.25, 7), (8.9, 0.12, 11)])
    return s * np.minimum(1, t / 0.002)


def drone(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for fr, g in [(midi(38), 0.5), (midi(45), 0.35), (midi(50), 0.4), (midi(57), 0.2)]:
        for h in range(1, 7):
            s += g / h ** 1.2 * np.sin(2 * np.pi * fr * h * t + h) * (0.7 + 0.3 * np.sin(2 * np.pi * (0.13 * h) * t))
    return filt(s, "lowpass", 2500) * 0.12


# ---------------------------------------------------------------- arrangement
D = 62  # D4 tonic; Khamaj flavour (D E F# G A B C)
SC = [0, 2, 4, 5, 7, 9, 10]


def deg(d, octv=0):
    return D + 12 * (octv + d // 7) + SC[d % 7]


# Intro 0-2 s: drone, match strike, bells, riser into the title hit
add(music, 0.0, drone(31.0) * np.minimum(1, np.arange(int(31 * SR)) / (1.5 * SR)), 0.9)
add(fx, 0.28, filt(rng.standard_normal(int(0.25 * SR)), "highpass", 2500) * env_exp(int(0.25 * SR), 0.05), 0.5, 0.2)
for i, (b, d) in enumerate([(0.5, 4), (1.0, 6), (1.25, 7), (1.5, 9)]):
    add(music, b, bell(deg(d, 1)), 0.18, -0.3 + 0.2 * i)
add(fx, 0.6, riser(1.4), 0.35)

# Title hit 2.0 and half-time build 2-4
add(fx, 2.0, impact(1.0), 0.9)
add(music, 2.0, sitar(deg(0, 0), 2.0), 0.5, -0.2)
add(music, 2.0, sitar(deg(4, 0), 2.0), 0.35, 0.2)
add(drums, 2.0, dagga(1.0), 0.9)
add(drums, 3.0, dagga(0.9), 0.8)
for k in range(8):
    add(drums, 3.0 + k * S16 * (1 if k < 4 else 0.5) + (0 if k < 4 else 2 * S16), tilli(0.5 + 0.06 * k), 0.6, 0.3)
for k in range(8):
    add(drums, 3.5 + k * S16 / 2 + 0.25, tilli(0.6), 0.45, -0.3)
add(fx, 3.0, riser(1.0), 0.4)

# Main groove: one bar = 4 beats = 2 s
DAGGA = [0, 3, 6, 8, 11, 14]
TILLI = [2, 4, 5, 7, 10, 12, 13, 15]
ROOTS = [deg(0, -2), deg(6, -3), deg(3, -2), deg(4, -2)]  # D C G A
TUMBI = [0, None, 4, None, 2, 4, 5, 4, 0, None, 4, 7, 6, 4, 2, 1]


def groove_bar(t0, bar_idx, intensity=1.0, tumbi_on=True, drop_after=None):
    for s in range(16):
        ts = t0 + s * S16 + (0.018 if s % 2 else 0)  # light swing
        if drop_after is not None and ts >= drop_after:
            continue
        if s in DAGGA:
            add(drums, ts, dagga(1.0 if s in (0, 8) else 0.75), 0.85, -0.05)
        if s in TILLI:
            add(drums, ts, tilli(0.8 if s % 4 == 0 else 0.6), 0.55, 0.25)
        add(drums, ts, shaker(0.9 if s % 2 else 0.5), 0.22 * intensity, 0.5)
        if s in (4, 12):
            add(drums, ts, clap(1.0), 0.45, -0.1)
        root = ROOTS[bar_idx % 4]
        if s in (0, 3, 6, 8, 10, 14):
            add(music, ts, bass(root + (12 if s in (6, 14) else 0), S16 * 2.4), 0.42)
        if tumbi_on and TUMBI[s] is not None:
            d = TUMBI[s] + (1 if bar_idx % 4 == 3 and s > 8 else 0)
            add(music, ts, tumbi(deg(d, 1)), 0.26, 0.35)


bar = 0
for t0 in np.arange(4.0, 25.0, 2.0):
    drop = 18.5 if 18.0 <= t0 < 19.9 else None
    groove_bar(t0, bar, 1.0, tumbi_on=not (15.0 <= t0 < 20.0), drop_after=drop)
    bar += 1

# Ingredient cuts 4-9: sitar stab + chime on each cut
for i, tc in enumerate([4.0, 5.0, 6.0, 7.0, 8.0]):
    add(music, tc, sitar(deg([0, 2, 4, 5, 7][i], 0), 0.8), 0.32, -0.25)
    add(fx, tc - 0.2, whoosh(0.3), 0.2, 0.4 * (-1) ** i)
add(fx, 9.0, riser(1.0), 0.3)
add(fx, 10.0, impact(0.55), 0.6)
add(fx, 10.5, dagga(1.2), 0.6)          # dough press
add(fx, 11.0, impact(0.4), 0.55)        # second press
add(fx, 12.3, whoosh(0.4), 0.3)
# frying sizzle 12.5-15
nz = int(2.6 * SR)
sizzle = filt(rng.standard_normal(nz), "highpass", 3500) * (0.5 + 0.5 * rng.random(nz) ** 8)
sizzle *= np.minimum(1, np.arange(nz) / (0.3 * SR)) * np.minimum(1, (nz - np.arange(nz)) / (0.4 * SR))
add(fx, 12.5, sizzle, 0.16)
for i, tc in enumerate([13.0, 13.5, 14.0]):
    add(music, tc, sitar(deg([4, 5, 7][i], 0), 0.6), 0.35)
add(fx, 14.2, riser(0.8), 0.35)

# Hero 15-20: shehnai melody over groove, crunch break at 18.5
add(fx, 15.0, impact(0.8), 0.7)
mel = [(0, 9, 1), (1, 11, 0.5), (1.5, 12, 0.5), (2, 14, 2), (4, 12, 1), (5, 11, 0.5), (5.5, 9, 0.5),
       (6, 11, 2), (8, 9, 0.5), (8.5, 11, 0.5), (9, 12, 1), (10, 14, 0.5), (10.5, 16, 0.5), (11, 14, 1.5)]
sig, t0 = shehnai([(b, deg(d, 0), l) for b, d, l in mel], 15.0)
add(music, t0, sig, 0.3, -0.1)
add(fx, 18.5, crunch(), 0.9, 0.05)
add(fx, 18.5, dagga(1.3), 0.5)
add(fx, 19.0, impact(0.7), 0.6)

# Value props 20-25: pop per badge
for i, tc in enumerate([20.0, 21.0, 22.0, 23.0, 24.0]):
    add(music, tc, bell(deg([7, 9, 11, 12, 14][i], 0), 0.9), 0.16, 0.3 * (-1) ** i)
    add(fx, tc, dagga(1.1), 0.35)
add(fx, 24.0, riser(1.0), 0.45)

# End card 25-30: impact, lighter groove, final hit 28 ringing out
add(fx, 25.0, impact(1.0), 0.85)
for t0b in (25.0, 26.0, 27.0):
    for s in range(0, 8):
        ts = t0b + s * S16 * 2
        if s in (0, 3, 6):
            add(drums, ts, dagga(0.8), 0.6)
        if s in (2, 5, 7):
            add(drums, ts, tilli(0.6), 0.4, 0.25)
        add(drums, ts, shaker(0.7), 0.15, 0.5)
end_riff = [0, 4, 7, 9, 7, 4, 7, 11, 12, 11, 9, 7]
for i, d in enumerate(end_riff):
    add(music, 25.0 + i * BEAT / 2, tumbi(deg(d, 1)), 0.22, 0.3)
add(fx, 28.0, impact(1.0), 0.9)
for d, p in [(0, -0.3), (4, 0), (7, 0.3)]:
    add(music, 28.0, sitar(deg(d, 0), 2.4), 0.35, p)
add(music, 28.0, bell(deg(14, 0), 2.4), 0.2)
add(music, 28.0, bass(deg(0, -2), 1.8), 0.6)


# ---------------------------------------------------------------- mix
def reverb(x, secs=1.8, wet=0.2):
    n = int(secs * SR)
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (0.35 * SR))
        ir = filt(ir, "lowpass", 6000)
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = fftconvolve(x[:, ch], ir)[: len(x)]
    return x + wet * out


mix = reverb(music, wet=0.32) + reverb(drums, wet=0.1) + reverb(fx, wet=0.22)
mix[:, :] = filt(mix.T, "highpass", 28).T
end = int(DUR * SR)
mix = mix[:end]
fade = int(0.8 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.8 * mix) / np.tanh(1.8)
mix *= 0.93

os.makedirs(OUT_DIR, exist_ok=True)
pcm = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(OUT_DIR, "soundtrack.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", os.path.join(OUT_DIR, "soundtrack.wav"))
