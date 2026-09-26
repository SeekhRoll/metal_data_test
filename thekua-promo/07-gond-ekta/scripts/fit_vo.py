"""Fit the chosen narration into 60 s: each line starts at its scene anchor (src/film/vo.json "anchor") unless the
previous line is still speaking; only lines that must move are pulled earlier (at most EARLY s before their anchor),
and only if that is not enough are all lines sped up by one small common tempo (pitch-preserving, <= 1.12x).
Writes "at" and "tempo" back into vo.json (used by subs.py and mix.py)."""
import json
import os

import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
END, BREATH, EARLY = 59.6, .25, 1.6


def layout(d, anchors):
    starts, t = [], -1.0
    for di, a in zip(d, anchors):
        s = max(a, t + BREATH) if starts else a
        starts.append(s); t = s + di
    limit = END
    for i in range(len(starts) - 1, -1, -1):
        starts[i] = min(starts[i], limit - d[i])
        if starts[i] < anchors[i] - EARLY or starts[i] < 0:
            return None
        limit = starts[i] - BREATH
    for i in range(1, len(starts)):
        if starts[i] < starts[i - 1] + d[i - 1] + BREATH - 1e-6:
            return None
    return starts


def main():
    p = os.path.join(ROOT, "src/film/vo.json")
    lines = json.load(open(p, encoding="utf-8"))
    for l in lines:
        l.setdefault("anchor", l["at"])
    durs = []
    for l in lines:
        a, sr = sf.read(os.path.join(ROOT, "assets/vo", l["id"] + ".wav"))
        durs.append(len(a) / sr)
    for tempo in [1.05 + k * .01 for k in range(8)]:
        st = layout([x / tempo for x in durs], [l["anchor"] for l in lines])
        if st:
            break
    else:
        raise SystemExit("narration does not fit in 60 s")
    for l, s, d in zip(lines, st, durs):
        l["at"], l["tempo"] = round(s, 2), round(tempo, 3)
        print(f"{l['id']:4s} {s:6.2f}-{s + d / tempo:6.2f}  anchor {l['anchor']:5.1f}")
    print("tempo", tempo)
    json.dump(lines, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
