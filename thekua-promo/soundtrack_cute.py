"""Synthesizes the bouncy soundtrack for the hand-drawn cut (promo-cute.html).

Same 120 BPM grid and section timings as soundtrack.py, but light and playful:
marimba bass, kalimba plucks, glockenspiel, dholak, claps and cartoon
boings/pops/whistles on the cuts.

    python3 soundtrack_cute.py  ->  build/soundtrack_cute.wav
"""
import os
import wave

import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
DUR = 30.0
BEAT = 0.5
S16 = BEAT / 4
N = int(SR * (DUR + 0.5))
rng = np.random.default_rng(11)
drums, music, fx = (np.zeros((N, 2)) for _ in range(3))


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(sig, kind, f, order=2):
    f = [x / (SR / 2) for x in f] if isinstance(f, (list, tuple)) else f / (SR / 2)
    return sosfilt(butter(order, f, btype=kind, output="sos"), sig)


def add(bus, t, sig, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    bus[i:i + len(sig), 0] += sig * gain * np.cos((pan + 1) * np.pi / 4) * 1.414
    bus[i:i + len(sig), 1] += sig * gain * np.sin((pan + 1) * np.pi / 4) * 1.414


def ts(d):
    return np.arange(int(d * SR)) / SR


# ---------------------------------------------------------------- instruments
def marimba(m, d=0.5):
    t = ts(d)
    f = midi(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 7) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)
    return s * np.minimum(1, t / 0.002)


def kalimba(m, d=0.7):
    t = ts(d)
    f = midi(m)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t * 5) + 0.25 * np.sin(2 * np.pi * f * 5.9 * t) * np.exp(-t * 25)
         + 0.1 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 9))
    return s * np.minimum(1, t / 0.001)


def glock(m, d=1.0):
    t = ts(d)
    f = midi(m)
    return sum(g * np.sin(2 * np.pi * f * r * t) * np.exp(-t * k)
               for r, g, k in [(1, 1, 3.5), (2.76, .35, 6), (5.4, .15, 10)]) * np.minimum(1, t / 0.001)


def dholak_low(v=1.0):
    t = ts(0.35)
    f = 95 + 90 * np.exp(-t * 30)
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)) * v


def dholak_hi(v=1.0):
    t = ts(0.15)
    tone = np.sin(2 * np.pi * 380 * t) * np.exp(-t * 35)
    slap = filt(rng.standard_normal(len(t)), "bandpass", (1500, 6000)) * np.exp(-t * 60)
    return (0.8 * tone + 0.6 * slap) * v


def clap(v=1.0):
    t = ts(0.22)
    n = filt(rng.standard_normal(len(t)), "bandpass", (1000, 5000))
    e = np.exp(-t * 160) + np.exp(-np.maximum(0, t - 0.01) * 160) * (t > .01) + 0.6 * np.exp(-np.maximum(0, t - 0.02) * 25) * (t > .02)
    return n * e * v


def shaker(v=1.0):
    t = ts(0.07)
    return filt(rng.standard_normal(len(t)), "highpass", 7000) * np.minimum(1, t / 0.01) * np.exp(-t * 45) * v


def boing(f0=220, f1=600, d=0.35):
    t = ts(d)
    f = f0 + (f1 - f0) * (1 - np.exp(-t * 18)) + 25 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def pop(f=900):
    t = ts(0.08)
    return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t * 60))) / SR) * np.exp(-t * 50)


def whistle(f0, f1, d=0.5):
    t = ts(d)
    f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.01 * np.sin(2 * np.pi * 6 * t))) / SR) * np.sin(np.pi * t / d) ** 0.5


def sparkle(start, n=6):
    for i in range(n):
        add(music, start + i * 0.05, glock(86 + [0, 2, 4, 7, 9, 12, 14][i % 7], 0.5), 0.1, -0.5 + i / n)


def crunch():
    out = np.zeros(int(0.4 * SR))
    for _ in range(60):
        j = int(rng.uniform(0, 0.22) * SR)
        seg = rng.standard_normal(int(rng.uniform(0.002, 0.01) * SR)) * rng.uniform(.3, 1) * np.exp(-j / (0.1 * SR))
        out[j:j + len(seg)] += seg[:len(out) - j]
    return filt(out, "bandpass", (800, 9000)) * 1.3


def slide_whistle_up(d=1.0):
    return whistle(500, 1600, d)


# ---------------------------------------------------------------- arrangement
D = 62
SC = [0, 2, 4, 7, 9]  # major pentatonic: cheerful, can't go wrong


def pent(d, o=0):
    return D + 12 * (o + d // 5) + SC[d % 5]


# 0-2: skyline doodles itself in; metro "ding-dong", little kalimba intro
add(music, 0.2, glock(pent(4, 1), 1.2), 0.25, -0.2)
add(music, 0.45, glock(pent(2, 1), 1.4), 0.25, 0.2)
for i, d in enumerate([0, 2, 4, 5, 7, 9]):
    add(music, 0.8 + i * 0.2, kalimba(pent(d, 0)), 0.3, -0.3 + i * .12)
add(fx, 1.3, filt(rng.standard_normal(int(0.7 * SR)), "bandpass", (300, 1200)) * np.hanning(int(0.7 * SR)), 0.12, 0.6)  # metro whoosh

# 2-4: mascot pops in, title
add(fx, 2.0, boing(180, 700), 0.5)
sparkle(2.05)
for i, d in enumerate([5, 7, 9, 10]):
    add(music, 2.0 + i * 0.5, marimba(pent(d, 0) - 12), 0.45)
add(fx, 3.0, pop(1200), 0.4)
add(fx, 3.5, slide_whistle_up(0.5), 0.12)

# main bouncy groove, 4-25 (one bar = 2 s)
BASS = [0, 0, 3, 4]      # roots in pentatonic degrees: D D A B
MEL = [5, None, 7, 6, 5, None, 3, None, 5, 6, 7, None, 9, 7, 6, None]


def bar(t0, b, melody=True, stop_after=None):
    for s in range(16):
        tt = t0 + s * S16 + (0.02 if s % 2 else 0)
        if stop_after is not None and tt >= stop_after:
            continue
        if s in (0, 6, 8, 11):
            add(drums, tt, dholak_low(1.0 if s in (0, 8) else .7), 0.6)
        if s in (2, 4, 10, 13, 14):
            add(drums, tt, dholak_hi(.7), 0.45, 0.3)
        if s in (4, 12):
            add(drums, tt, clap(), 0.35, -0.1)
        add(drums, tt, shaker(.9 if s % 2 else .5), 0.18, 0.5)
        r = pent(BASS[b % 4], -2)
        if s in (0, 3, 6, 8, 10, 14):
            add(music, tt, marimba(r + (12 if s in (6, 14) else 0), 0.3), 0.5)
        if s in (2, 10):
            for k, iv in enumerate([0, 4, 7]):
                add(music, tt + k * 0.012, marimba(r + 24 + iv, 0.25), 0.16, -0.2 + .2 * k)
        if melody and MEL[s] is not None:
            add(music, tt, kalimba(pent(MEL[s] + (1 if b % 4 == 3 and s > 8 else 0), 0)), 0.3, 0.25)


b = 0
for t0 in np.arange(4.0, 25.0, 2.0):
    bar(t0, b, melody=not (20.0 <= t0 < 25.0), stop_after=18.5 if 18.0 <= t0 < 19.9 else None)
    b += 1

# ingredient friends hop in: boing at rising pitch
for i in range(5):
    add(fx, 4.0 + i, boing(200 + i * 60, 500 + i * 110, 0.3), 0.35, (-1) ** i * .3)
    add(music, 4.0 + i, glock(pent(5 + i, 1), 0.6), 0.16)
add(fx, 9.0, whistle(1400, 400, 0.8), 0.12)   # they dive into the bowl
for i in range(6):
    add(fx, 9.1 + i * .1, pop(700 + 120 * i), 0.3, (-1) ** i * .4)
add(fx, 9.85, slide_whistle_up(0.2), 0.1)
# press squish + pop out
add(fx, 10.5, boing(400, 120, 0.4), 0.45)
add(fx, 11.0, boing(380, 110, 0.4), 0.45)
add(fx, 11.5, boing(200, 900, 0.3), 0.4)
sparkle(11.9)
# frying: bubbly pops
R = np.random.default_rng(3)
for k in range(40):
    add(fx, 12.5 + R.uniform(0, 2.4), pop(R.uniform(500, 1400)), 0.12, R.uniform(-.7, .7))
for i, tt in enumerate([13.0, 13.5, 14.0]):
    add(music, tt, glock(pent(7 + 2 * i, 0), 0.7), 0.25)
add(fx, 14.5, slide_whistle_up(0.5), 0.12)
# hero: sparkles and "aww" glock line
sparkle(15.0, 7)
for i, d in enumerate([9, 10, 12, 10, 9, 7, 9, 10]):
    add(music, 15.25 + i * 0.4, glock(pent(d, 0), 0.8), 0.14, 0.3)
add(fx, 18.5, crunch(), 0.95)
add(fx, 18.5, dholak_low(1.2), 0.4)
add(fx, 18.75, boing(150, 500, 0.4), 0.35)
sparkle(19.0)
# promises: a "ding" per sticky note
for i in range(5):
    add(fx, 20.0 + i, pop(1000), 0.35)
    add(music, 20.0 + i, glock(pent(10 + i, 0), 0.8), 0.22)
    add(music, 20.5 + i, kalimba(pent(5 + i, 0)), 0.25)
add(fx, 24.0, whistle(600, 1200, 0.9), 0.1)   # scooter zooms
# end card
add(fx, 25.0, boing(180, 700), 0.45)
sparkle(25.05, 7)
for t0 in (25.0, 26.0, 27.0):
    for s in range(8):
        tt = t0 + s * S16 * 2
        if s in (0, 3, 6):
            add(drums, tt, dholak_low(.8), 0.45)
        if s in (2, 5, 7):
            add(drums, tt, dholak_hi(.6), 0.35, .3)
for i, d in enumerate([5, 7, 9, 10, 9, 7, 9, 12, 10, 9, 7, 5]):
    add(music, 25.0 + i * .25, kalimba(pent(d, 0)), 0.28, .2)
for d, p in [(5, -.3), (7, 0), (10, .3)]:
    add(music, 28.0, glock(pent(d, 0), 2.0), 0.25, p)
    add(music, 28.0, marimba(pent(d, -1), 1.5), 0.35, p)
add(music, 28.0, marimba(pent(0, -2), 1.8), 0.5)
add(fx, 28.0, boing(250, 900, 0.5), 0.3)
sparkle(28.1, 7)


# ---------------------------------------------------------------- mix
def reverb(x, wet):
    n = int(1.2 * SR)
    out = np.zeros_like(x)
    for ch in range(2):
        ir = filt(rng.standard_normal(n) * np.exp(-np.arange(n) / (0.25 * SR)), "lowpass", 7000)
        out[:, ch] = fftconvolve(x[:, ch], ir / np.sqrt(np.sum(ir ** 2)))[:len(x)]
    return x + wet * out


mix = reverb(music, 0.25) + reverb(drums, 0.08) + reverb(fx, 0.15)
mix = filt(mix.T, "highpass", 35).T[:int(DUR * SR)]
fade = int(0.8 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.6 * mix) / np.tanh(1.6) * 0.93

os.makedirs("build", exist_ok=True)
with wave.open("build/soundtrack_cute.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("wrote build/soundtrack_cute.wav")
