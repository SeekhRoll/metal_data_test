"""Place each picked VO line in its scene: at max(wanted start, previous end + gap), and fail if a line would
spill past the end of its scene (brief: slow pacing, pauses between lines). Writes `at` and `dur` into the
episode's vo json used by the film.
    python3 scripts/fit_vo.py src/episodes/pitru/ep1-vo.json src/episodes/pitru/ep1-timeline.json
"""
import json
import sys

import soundfile as sf

GAP = .7


def main(vo_path, tl_path):
    lines, tl = json.load(open(vo_path, encoding="utf-8")), json.load(open(tl_path))
    prev, bad = 0.0, []
    for l in lines:
        a, sr = sf.read(f"assets/vo/{l['id']}.wav")
        l["dur"] = round(len(a) / sr, 2)
        want = l.get("want", l["at"])
        l["want"] = want
        l["at"] = round(max(want, prev + GAP), 2)
        scene = next(s for s in tl["scenes"] if s["from"] <= want < s["to"])
        end = l["at"] + l["dur"]
        if end > scene["to"] - .35:
            bad.append(f"{l['id']} ends {end:.2f}s, scene {scene['id']} ends {scene['to']}s (over by {end - scene['to'] + .35:.2f}s)")
        prev = end
        print(f"{l['id']:8s} at {l['at']:6.2f}  dur {l['dur']:5.2f}  end {end:6.2f}  [{scene['id']} {scene['from']}-{scene['to']}]")
    json.dump(lines, open(vo_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if bad:
        print("DOES NOT FIT:\n  " + "\n  ".join(bad)); sys.exit(1)
    print("all lines fit")


if __name__ == "__main__":
    main(*sys.argv[1:3])
