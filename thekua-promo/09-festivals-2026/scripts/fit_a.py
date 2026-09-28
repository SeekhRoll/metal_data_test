"""Format A: one scene per VO line (title, story scenes, portrait + moral, [finale]). Lines are laid end to end with a
pause; scene boundaries sit just before each line. Uses the picked take's length, or an estimate if not picked yet.
    python3 scripts/fit_a.py 1 2 ...  -> src/formats/a-timeline.json
"""
import json
import os
import sys

import soundfile as sf

GAP, LEAD, TAIL = .7, .9, 2.4


def main(days):
    path = 'src/formats/a-timeline.json'
    out = json.load(open(path)) if os.path.exists(path) else {}
    for d in days:
        lines = json.load(open(f'vo/navratri-A{d}.json', encoding='utf-8'))
        t, placed, est = LEAD, [], False
        for l in lines:
            p = f"assets/vo/{l['id']}.wav"
            if os.path.exists(p):
                a, sr = sf.read(p); dur = len(a) / sr
            else:
                dur = len(l['text']) * .085; est = True
            placed.append({'id': l['id'], 'text': l['text'], 'at': round(t, 2), 'dur': round(dur, 2)}); t += dur + GAP
        end = round(placed[-1]['at'] + placed[-1]['dur'] + TAIL, 2)
        scenes = [{'id': f's{i}', 'from': 0 if i == 0 else round(p['at'] - .45, 2), 'to': round(placed[i + 1]['at'] - .45, 2) if i + 1 < len(placed) else end} for i, p in enumerate(placed)]
        out[str(d)] = {'dur': end, 'estimated': est, 'lines': placed, 'scenes': scenes}
        print(f'day {d}: {end:.1f} s{" (estimated)" if est else ""}')
    json.dump(out, open(path, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main([int(a) for a in sys.argv[1:]])
