"""Fit the chosen narration into the 60 s film and re-time the subtitle cues to it.

Each line is anchored at its scene's cue time and never starts before the previous line has ended (+ a breath).
If the lines together would run past 59.7 s, all of them are sped up by the same small factor (pitch-preserving,
at most 1.15x), and lines may start up to 1.2 s before their anchor. Writes assets/vo/placement.json (start and
tempo per line, used by mix.py) and rewrites the from/to of CUES in src/film/timeline.ts.
"""
import json
import os
import re

import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
END, BREATH, EARLY = 59.7, .3, 1.2


def layout(durs, anchors, tempo):
    """Forward pass: each line at its anchor or after the previous one. Backward pass: pull only the lines that
    must move earlier (never more than EARLY before their anchor) so the last one ends by END."""
    d = [x / tempo for x in durs]
    starts, t = [], -1.0
    for di, a in zip(d, anchors):
        s = max(a, t + BREATH) if starts else a
        starts.append(s); t = s + di
    limit = END
    for i in range(len(starts) - 1, -1, -1):
        starts[i] = min(starts[i], limit - d[i])
        if starts[i] < anchors[i] - EARLY or (i and starts[i] < 0):
            return starts, None
        limit = starts[i] - BREATH
    for i in range(1, len(starts)):
        if starts[i] < starts[i - 1] + d[i - 1] + BREATH - 1e-6:
            return starts, None
    return starts, starts[-1] + d[-1]


def main():
    lines = json.load(open(os.path.join(ROOT, "src/film/vo.json"), encoding="utf-8"))
    durs = []
    for l in lines:
        a, sr = sf.read(os.path.join(ROOT, "assets/vo", l["id"] + ".wav"))
        durs.append(len(a) / sr)
    anchors = [l["at"] for l in lines]
    # prefer natural speed: first let lines start a little before their anchors, then speed up as little as needed
    best = None
    for tempo in [1 + k * .01 for k in range(16)]:
        starts, end = layout(durs, anchors, tempo)
        if end is not None:
            best = (tempo, max(a - s for a, s in zip(anchors, starts)), starts); break
    if not best:
        raise SystemExit(f"narration too long: {sum(durs):.1f}s of speech; shorten a line or re-take")
    tempo, early, starts = best
    ends = [s + d / tempo for s, d in zip(starts, durs)]
    place = [{"id": l["id"], "at": round(s, 3), "tempo": round(tempo, 3)} for l, s in zip(lines, starts)]
    json.dump(place, open(os.path.join(ROOT, "assets/vo/placement.json"), "w"), indent=1)
    src = open(os.path.join(ROOT, "src/film/timeline.ts"), encoding="utf-8").read()
    cues = list(re.finditer(r"\{ from: ([\d.]+), to: ([\d.]+), text: '([^']+)' \}", src))
    out, last = [], 0
    for i, m in enumerate(cues):
        fr = round(starts[i] - .05, 2)
        to = round(min(ends[i] + .15, (starts[i + 1] - .5) if i + 1 < len(cues) else 59.8), 2)
        out.append(src[last:m.start()] + f"{{ from: {fr}, to: {to}, text: '{m.group(3)}' }}")
        last = m.end()
    open(os.path.join(ROOT, "src/film/timeline.ts"), "w", encoding="utf-8").write("".join(out) + src[last:])
    print(f"tempo x{tempo:.2f}, up to {early:.1f}s early; speech {sum(durs):.1f}s")
    for l, s, e, a in zip(lines, starts, ends, anchors):
        print(f"  {l['id']}  {s:5.2f}-{e:5.2f}  (anchor {a:4.1f})  {l['text']}")


if __name__ == "__main__":
    main()
