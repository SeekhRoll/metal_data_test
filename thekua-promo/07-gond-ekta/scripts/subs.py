"""Subtitle cards from the VO lines (brief §4.6): at most 2 lines, about 28 characters per line.

Each VO line is split into cards; a card's time is its share of the line's spoken duration (by characters).
Durations come from the chosen takes in assets/vo/<id>.wav when present, otherwise an estimate.
Writes src/film/subs.json. The moral (s7) is shown as moral text instead of a subtitle.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX = 28


PUNCT = ("।", ",", "…", "?", "—", '"', "!")
END = ("।", "?", '।"', '?"', "…")


def lines_of(text):
    """Greedy lines of <= MAX chars that prefer to break after punctuation."""
    words, out, cur = text.split(), [], ""
    for i, w in enumerate(words):
        nxt = (cur + " " + w).strip()
        if len(nxt) > MAX and cur:
            out.append(cur); cur = w
        else:
            cur = nxt
        # break early at a phrase end when the rest of the phrase would not fit anyway
        if cur.endswith(PUNCT) and len(cur) >= 14 and i + 1 < len(words):
            rest = " ".join(words[i + 1:])
            nxt_phrase = rest.split("।")[0].split(",")[0]
            if len(cur) + 1 + len(nxt_phrase) > MAX:
                out.append(cur); cur = ""
    if cur:
        out.append(cur)
    return out


def cards_of(ls):
    """Two lines per card, but a new sentence starts a new card."""
    cards, cur = [], []
    for l in ls:
        cur.append(l)
        if len(cur) == 2 or l.endswith(END):
            cards.append(cur); cur = []
    if cur:
        cards.append(cur)
    return cards


def duration(line):
    p = os.path.join(ROOT, "assets/vo", line["id"] + ".wav")
    if os.path.exists(p):
        import soundfile as sf
        a, sr = sf.read(p)
        return len(a) / sr / line.get("tempo", 1.0)
    return 0.085 * len(line["text"]) + 0.4


def main():
    vo = json.load(open(os.path.join(ROOT, "src/film/vo.json"), encoding="utf-8"))
    cards = []
    for line in vo:
        if line["id"] == "s7":
            continue
        groups = line.get("cards") or cards_of(lines_of(line["text"]))
        total = sum(len(" ".join(g)) for g in groups)
        t, d = line["at"], duration(line)
        for g in groups:
            share = d * len(" ".join(g)) / total
            cards.append({"from": round(t - .1, 2), "to": round(t + share + .15, 2), "lines": g})
            t += share
    # never let two cards overlap
    for a, b in zip(cards, cards[1:]):
        a["to"] = round(min(a["to"], b["from"] - .04), 2)
    json.dump(cards, open(os.path.join(ROOT, "src/film/subs.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for c in cards:
        print(c["from"], c["to"], " / ".join(c["lines"]))


if __name__ == "__main__":
    main()
