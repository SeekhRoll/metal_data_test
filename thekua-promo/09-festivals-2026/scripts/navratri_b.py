"""Format B (आज की देवी): the day's VO over a soft tanpura bed with a temple bell, ducked under speech; muxed onto
out/navratri-b<d>-silent.mp4 -> output/navratri/day<d>-B-<name>.mp4 (the full end card is appended later).
    python3 scripts/navratri_b.py 1 [2 ...]
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from music_pitru import tanpura, reverb, SR          # noqa: E402
from navratri_c import bell, NAMES, FF               # noqa: E402
import navratri_c                                    # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(p):
    a, sr = sf.read(p, always_2d=True)
    if sr != SR:
        idx = np.arange(0, len(a), sr / SR); a = np.stack([np.interp(idx, np.arange(len(a)), a[:, c]) for c in range(a.shape[1])], 1)
    return a if a.shape[1] == 2 else np.repeat(a, 2, 1)


def main(days):
    tl = json.load(open(os.path.join(ROOT, 'src/formats/b-timeline.json'), encoding='utf-8'))
    out = os.path.join(ROOT, 'output/navratri'); os.makedirs(out, exist_ok=True)
    for d in days:
        T = tl[str(d)]; dur = T['dur']; n = int(dur * SR)
        navratri_c.DUR = dur
        bed = tanpura(dur, lambda t: min(1, t / 2) * (1 - np.clip((t - (dur - 2)) / 2, 0, 1)))[:n] * .8
        bed = bed + bell(.3, 740, .08)[:n] + bell(T['scenes'][3]['from'], 988, .06)[:n]
        bed = bed + .3 * reverb(bed)
        vo = np.zeros((n, 2))
        for l in T['lines']:
            x = load(os.path.join(ROOT, 'assets/vo', l['id'] + '.wav')); s = int(l['at'] * SR); y = x[:n - s]; vo[s:s + len(y)] += y
        env = np.convolve((np.abs(vo).max(1) > .01).astype(float), np.ones(int(.4 * SR)) / int(.4 * SR), mode='same')
        mix = np.stack([bed, bed], 1) * (1 - .55 * np.clip(env * 1.5, 0, 1))[:, None] * .7 + vo * 2.4
        mix /= max(1.0, np.abs(mix).max() / .95)
        wav = os.path.join(ROOT, f'out/navratri-b{d}.wav')
        with wave.open(wav, 'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
        name = f'day{d}-B-{NAMES[d]}'
        subprocess.run([FF, '-y', '-loglevel', 'error', '-i', os.path.join(ROOT, f'out/navratri-b{d}-silent.mp4'), '-i', wav, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-t', str(dur),
                        '-movflags', '+faststart', os.path.join(out, name + '.mp4')], check=True)
        print(name, round(os.path.getsize(os.path.join(out, name + '.mp4')) / 1e6, 1), 'MB', dur, 's')


if __name__ == '__main__':
    main([int(a) for a in sys.argv[1:]])
