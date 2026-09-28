"""Format A (देवी कथा): the story VO over a devotional bed (tanpura, bansuri phrases, temple bells), ducked under
speech; muxed onto out/navratri-a<d>-silent.mp4 -> output/navratri/day<d>-A-<name>.mp4 (end card appended later).
    python3 scripts/navratri_a.py 1 [2 ...]
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import music_pitru as mp                               # noqa: E402
import navratri_c                                      # noqa: E402
from navratri_b import load                            # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = mp.SR


def main(days):
    tl = json.load(open(os.path.join(ROOT, 'src/formats/a-timeline.json'), encoding='utf-8'))
    out = os.path.join(ROOT, 'output/navratri'); os.makedirs(out, exist_ok=True)
    for d in days:
        T = tl[str(d)]; dur = T['dur']; n = int(dur * SR); navratri_c.DUR = dur
        sc = [s['from'] for s in T['scenes']]
        flute = [n_ for i, s in enumerate(sc[1:-1], 1) if i % 2 for n_ in mp.phrase(s + .4, [4, 3, 4, 7, 4] if i % 4 == 1 else [7, 8, 7, 4])]
        flute += mp.phrase(sc[-1] + .3, [4, 3, 1, 0], 1.1, 2.6)
        bed = mp.tanpura(dur, lambda t: min(1, t / 2) * (1 - np.clip((t - (dur - 2.5)) / 2.5, 0, 1)))[:n] + mp.bansuri(flute, dur)[:n] * .8
        for s in sc: bed = bed + navratri_c.bell(s, 880, .05)[:n]
        bed = bed + .3 * mp.reverb(bed)
        vo = np.zeros((n, 2))
        for l in T['lines']:
            x = load(os.path.join(ROOT, 'assets/vo', l['id'] + '.wav')); s = int(l['at'] * SR); y = x[:n - s]; vo[s:s + len(y)] += y
        env = np.convolve((np.abs(vo).max(1) > .01).astype(float), np.ones(int(.4 * SR)) / int(.4 * SR), mode='same')
        mix = np.stack([bed, bed], 1) * (1 - .55 * np.clip(env * 1.5, 0, 1))[:, None] * .75 + vo * 2.4
        mix /= max(1.0, np.abs(mix).max() / .95)
        wav = os.path.join(ROOT, f'out/navratri-a{d}.wav')
        with wave.open(wav, 'wb') as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
        name = f'day{d}-A-{navratri_c.NAMES[d]}'
        subprocess.run([navratri_c.FF, '-y', '-loglevel', 'error', '-i', os.path.join(ROOT, f'out/navratri-a{d}-silent.mp4'), '-i', wav, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-maxrate', '7M', '-bufsize', '14M', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
                        '-t', str(dur), '-movflags', '+faststart', os.path.join(out, name + '.mp4')], check=True)
        print(name, round(os.path.getsize(os.path.join(out, name + '.mp4')) / 1e6, 1), 'MB', dur, 's')


if __name__ == '__main__':
    main([int(a) for a in sys.argv[1:]])
