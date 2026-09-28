"""Format C (शुभकामना, 13 s): a soft shehnai phrase in Yaman with temple bells, muxed onto each day's silent render.
    python3 scripts/navratri_c.py music         -> assets/music/navratri-c.wav
    python3 scripts/navratri_c.py mux 1 [2 ...]  (expects out/navratri-c<d>-silent.mp4) -> output/navratri/day<d>-C-*.mp4
"""
import os
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, DUR = 44100, 13.0
SA = 61
YAMAN = [0, 2, 4, 6, 7, 9, 11]
rng = np.random.default_rng(3)
NAMES = {1: 'shailaputri', 2: 'brahmacharini', 3: 'chandraghanta', 4: 'kushmanda', 5: 'skandamata', 6: 'katyayani', 7: 'kalaratri', 8: 'mahagauri', 9: 'siddhidatri'}
try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FF = 'ffmpeg'


def midi(m): return 440 * 2 ** ((m - 69) / 12)
def sw(d): return SA + YAMAN[d % 7] + 12 * (d // 7)
def filt(x, k, f, o=2):
    f = [v / (SR / 2) for v in f] if isinstance(f, (list, tuple)) else f / (SR / 2)
    return sosfilt(butter(o, f, btype=k, output='sos'), x)


def shehnai(notes):
    """double-reed: bright odd-heavy tone through a nasal formant, slides between notes, quick vibrato"""
    n = int(DUR * SR); t = np.arange(n) / SR
    f = np.full(n, midi(sw(notes[0][1]) + 12)); amp = np.zeros(n)
    for t0, d, L in notes:
        i0, i1 = int(t0 * SR), int((t0 + L) * SR); f[i0:] = midi(sw(d) + 12)
        seg = np.zeros(n); k = np.arange(i1 - i0); seg[i0:i1] = np.minimum(1, k / (.05 * SR)) * np.minimum(1, (i1 - i0 - k) / (.25 * SR)); amp = np.maximum(amp, seg)
    k = int(.09 * SR); f = np.convolve(f, np.ones(k) / k, mode='same')
    f *= 1 + .01 * np.sin(2 * np.pi * 6.2 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = sum((1 / h) * np.sin(h * ph) * (1.4 if h % 2 else .7) for h in range(1, 16))
    s = filt(s, 'bandpass', (700, 3800)) + .3 * filt(s, 'lowpass', 900)
    return s * amp * .09


def bell(t0, f0=880, g=.14):
    n = int(DUR * SR); out = np.zeros(n); L = int(4 * SR); t = np.arange(L) / SR
    b = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / d) for r, a, d in [(1, 1, 2.4), (2.76, .5, 1.2), (5.4, .25, .6), (8.9, .12, .3), (.5, .4, 3)])
    i = int(t0 * SR); m = min(L, n - i); out[i:i + m] = b[:m] * g
    return out


def music():
    notes = [(3.2, 4, .5), (3.7, 6, .5), (4.2, 7, 1.4), (5.8, 9, .5), (6.3, 7, .5), (6.8, 6, .6), (7.4, 4, 1.6), (9.3, 2, .5), (9.8, 4, .5), (10.3, 2, .6), (10.9, 0, 1.9)]
    x = shehnai(notes) + bell(.6, 740) + bell(3.0, 988, .1) + bell(10.2, 740, .1)
    drone = sum(np.sin(2 * np.pi * midi(m) * np.arange(int(DUR * SR)) / SR) * g for m, g in [(SA - 12, .02), (SA - 5, .014)])
    x = x + drone * np.minimum(1, np.arange(len(drone)) / (2 * SR))
    ir = rng.standard_normal(int(2 * SR)) * np.exp(-np.arange(int(2 * SR)) / SR / .5); ir /= np.abs(ir).sum() / 3
    x = x + .3 * fftconvolve(x, ir)[:len(x)]
    x *= np.minimum(1, (len(x) - np.arange(len(x))) / (1.2 * SR)); x /= np.abs(x).max() / .7
    st = np.stack([x, np.roll(x, int(.011 * SR))], 1)
    os.makedirs(os.path.join(ROOT, 'assets/music'), exist_ok=True)
    with wave.open(os.path.join(ROOT, 'assets/music/navratri-c.wav'), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
    print('wrote assets/music/navratri-c.wav')


def mux(days):
    out = os.path.join(ROOT, 'output/navratri'); os.makedirs(out, exist_ok=True)
    for d in days:
        name = f'day{d}-C-{NAMES[d]}'
        subprocess.run([FF, '-y', '-loglevel', 'error', '-i', os.path.join(ROOT, f'out/navratri-c{d}-silent.mp4'), '-i', os.path.join(ROOT, 'assets/music/navratri-c.wav'),
                        '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
                        '-t', str(DUR), '-movflags', '+faststart', os.path.join(out, name + '.mp4')], check=True)
        print(name, round(os.path.getsize(os.path.join(out, name + '.mp4')) / 1e6, 1), 'MB')


if __name__ == '__main__':
    music() if sys.argv[1] == 'music' else mux([int(a) for a in sys.argv[2:]])
