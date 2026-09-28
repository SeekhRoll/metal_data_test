"""Format B: lay each day's picked VO lines end to end (gap 0.45 s), derive the sections from the lines themselves
(title = first line; colour = the "आज का रंग" + "भोग" lines; mantra = the "मंत्र" line) -> src/formats/b-timeline.json
    python3 scripts/fit_b.py 1 2 ...
"""
import json
import os
import sys

import soundfile as sf

GAP, TAIL = .45, 1.6


def main(days):
    path = 'src/formats/b-timeline.json'
    out = json.load(open(path)) if os.path.exists(path) else {}
    lines = json.load(open('vo/navratri-B.json', encoding='utf-8'))
    for d in days:
        ls = [l for l in lines if l['id'].startswith(f'b{d}_')]
        t, placed = .8, []
        for l in ls:
            a, sr = sf.read(f"assets/vo/{l['id']}.wav"); dur = round(len(a) / sr, 2)
            placed.append({'id': l['id'], 'text': l['text'], 'at': round(t, 2), 'dur': dur}); t += dur + GAP
        end = round(placed[-1]['at'] + placed[-1]['dur'] + TAIL, 2)
        col = next(p['at'] for p in placed if p['text'].startswith('आज का रंग'))
        man = next(p['at'] for p in placed if p['text'].startswith('मंत्र'))
        out[str(d)] = {'dur': end, 'lines': placed, 'scenes': [
            {'id': 'title', 'from': 0, 'to': round(placed[1]['at'] - .2, 2)},
            {'id': 'attributes', 'from': round(placed[1]['at'] - .2, 2), 'to': round(col - .2, 2)},
            {'id': 'colour', 'from': round(col - .2, 2), 'to': round(man - .2, 2)},
            {'id': 'mantra', 'from': round(man - .2, 2), 'to': end}]}
        print(f'day {d}: {end:.1f} s, sections', [(s['id'], s['from']) for s in out[str(d)]['scenes']])
    json.dump(out, open(path, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main([int(a) for a in sys.argv[1:]])
