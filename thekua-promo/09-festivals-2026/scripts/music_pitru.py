"""Pitru Paksha score (brief §2: tanpura drone with soft bansuri or sarangi, NO percussion; slow, reverent).

Raga Bhairavi colour on C#: a plucked tanpura cycle (Pa-Sa-Sa-Sa, jawari buzz) under everything, a bowed
sarangi-like voice that swells under the heavier scenes, and sparse bansuri phrases that leave long silences.
Cue sheet per episode below, timed to src/episodes/pitru/ep<N>-timeline.json. Royalty-free (composed here).
    python3 scripts/music_pitru.py 1   ->  assets/music/pitru-ep1.wav
"""
import json
import os
import sys
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
SA = 61                                    # C#
BHAIRAVI = [0, 1, 3, 5, 7, 8, 10]
rng = np.random.default_rng(11)


def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def sw(deg): return SA + BHAIRAVI[deg % 7] + 12 * (deg // 7)
def filt(x, kind, f, order=2):
    f = [v / (SR / 2) for v in f] if isinstance(f, (list, tuple)) else f / (SR / 2)
    return sosfilt(butter(order, f, btype=kind, output="sos"), x)


def pluck(m, d=3.2):
    """one tanpura string: rich harmonics with a slow jawari shimmer and long decay"""
    t = np.arange(int(d * SR)) / SR
    s = sum((1 / h ** .9) * np.sin(2 * np.pi * midi(m) * h * t + h * .7) * (1 + .35 * np.sin(2 * np.pi * (.7 + .13 * h) * t)) for h in range(1, 14))
    return filt(s * np.exp(-t / 1.6) * np.minimum(1, t / .01), "lowpass", 3800)


def tanpura(dur, gain):
    out = np.zeros(int((dur + 4) * SR))
    cyc, i = [SA - 5, SA, SA, SA - 12], 0
    t = 0.0
    while t < dur:
        s = pluck(cyc[i % 4]) * gain(t)
        j = int(t * SR); out[j:j + len(s)] += s[:len(out) - j]
        t += .95; i += 1
    return out * .10


def bowed(notes, dur):
    """sarangi-like: filtered saw with slow bow swell and vibrato. notes: (t, deg, len)"""
    out = np.zeros(int((dur + 4) * SR))
    for t0, deg, d in notes:
        t = np.arange(int(d * SR)) / SR
        f = midi(sw(deg)) * (1 + .007 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / .8))
        ph = 2 * np.pi * np.cumsum(f) / SR
        s = sum(np.sin(h * ph) / h for h in range(1, 10))
        env = np.minimum(1, t / (d * .35)) * np.minimum(1, (d - t) / (d * .4))
        s = filt(s * env, "bandpass", (300, 2600))
        j = int(t0 * SR); out[j:j + len(s)] += s[:len(out) - j]
    return out * .05


def bansuri(notes, dur):
    """breathy flute with slides (meend) and delayed vibrato. notes: (t, deg, len)"""
    out = np.zeros(int((dur + 4) * SR))
    for t0, deg, d in notes:
        t = np.arange(int(d * SR)) / SR
        f = midi(sw(deg) + 12) * (1 + .006 * np.sin(2 * np.pi * 5 * t) * np.clip((t - .4) / .6, 0, 1))
        ph = 2 * np.pi * np.cumsum(f) / SR
        env = np.minimum(1, t / .12) * np.minimum(1, (d - t) / .4)
        breath = filt(rng.standard_normal(len(t)), "bandpass", (1500, 6000)) * .1
        s = (np.sin(ph) + .2 * np.sin(2 * ph) + breath) * env
        j = int(t0 * SR); out[j:j + len(s)] += s[:len(out) - j]
    return out * .07


def phrase(t0, degs, step=.9, hold=1.8):
    """a slow phrase: each note `step` apart, the last one held"""
    return [(t0 + i * step, d, (hold if i == len(degs) - 1 else step * 1.15)) for i, d in enumerate(degs)]


def reverb(x, secs=2.8):
    n = int(secs * SR); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / .7); ir = filt(ir, "lowpass", 5000); ir /= np.abs(ir).sum() / 4
    return fftconvolve(x, ir)[:len(x)]


CUES = {
    1: dict(
        flute=[*phrase(1.6, [4, 3, 1, 0]), *phrase(10.8, [0, 1, 3, 4, 3]), *phrase(21.4, [7, 6, 4, 3]), *phrase(42.2, [4, 5, 7, 6, 4]),
               *phrase(52.4, [0, 1, 3, 4, 7]), *phrase(57.6, [7, 8, 9, 7]), *phrase(72.4, [4, 5, 7, 8, 7, 4]), *phrase(82.6, [4, 3, 1, 0], 1.1, 2.8)],
        bow=[(20.4, 0, 6), (26.6, -2, 6.8), (41.4, 0, 5.2), (46.4, 3, 5.2), (61.2, 4, 4.6), (65.8, 7, 5.8), (72.0, 4, 4.6), (76.6, 7, 5.2)],
        quiet=[(35.6, 41.2)],          # the silence after Kapila's gaze
    ),
    2: dict(flute=[], bow=[], quiet=[]),
    3: dict(flute=[], bow=[], quiet=[]),
}


def main(ep):
    tl = json.load(open(os.path.join(ROOT, f"src/episodes/pitru/ep{ep}-timeline.json")))
    dur = tl["dur"]; c = CUES[ep]
    closing = next(s for s in tl["scenes"] if s["id"] == "closing")["from"]
    def gain(t):
        g = min(1, t / 3) * (1 - np.clip((t - (dur - 3)) / 3, 0, 1))
        for a, b in c["quiet"]:
            if a <= t < b: g *= .55
        return g
    x = tanpura(dur, gain)
    mel = bowed(c["bow"], dur) + bansuri([n for n in c["flute"] if n[0] < closing - 1], dur)
    x = x + mel
    x = x + .35 * reverb(x)
    x = x[:int(dur * SR)]
    fade = np.minimum(1, np.arange(len(x)) / (1.5 * SR)) * np.minimum(1, (len(x) - np.arange(len(x))) / (2.5 * SR))
    x = x * fade; x /= max(1e-6, np.abs(x).max() / .6)
    st = np.stack([x, np.roll(x, int(.012 * SR)) * .96], 1)
    os.makedirs(os.path.join(ROOT, "assets/music"), exist_ok=True)
    out = os.path.join(ROOT, f"assets/music/pitru-ep{ep}.wav")
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
    print("wrote", out, round(dur, 1), "s")


if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 1)
