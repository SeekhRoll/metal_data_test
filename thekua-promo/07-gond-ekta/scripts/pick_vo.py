"""Pick the cleanest VO take per line: transcribe every take with Whisper and keep the one whose Hindi transcript is
closest to the script (character error rate), then trim silence and level it.  -> assets/vo/<id>.wav, assets/vo/report.txt
"""
import glob
import json
import os
import re
import sys

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT = sys.argv[1] if len(sys.argv) > 1 else ROOT


def norm(s):
    return re.sub(r"[\s।,…?!\"'—\-.:;]", "", s)


def cer(a, b):
    a, b = norm(a), norm(b)
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
    return d[len(b)] / max(1, len(b))


def trim(a, sr, thr=.012, pad=.08):
    env = np.convolve(np.abs(a), np.ones(int(.02 * sr)) / int(.02 * sr), mode="same")
    idx = np.where(env > thr * env.max())[0]
    if not len(idx): return a
    i0, i1 = max(0, idx[0] - int(pad * sr)), min(len(a), idx[-1] + int(pad * sr))
    out = a[i0:i1].copy()
    f = int(.01 * sr); out[:f] *= np.linspace(0, 1, f); out[-f:] *= np.linspace(1, 0, f)
    return out


def main():
    from transformers import pipeline
    asr = pipeline("automatic-speech-recognition", model="openai/whisper-small", device="cpu")
    lines = json.load(open(os.path.join(PROJECT, "src/film/vo.json"), encoding="utf-8"))
    report, only = [], os.environ.get("VO_ONLY", "").split(",") if os.environ.get("VO_ONLY") else None
    for line in lines:
        if only and line["id"] not in only:
            continue
        best = None
        for f in sorted(glob.glob(os.path.join(PROJECT, "assets/vo/takes", line["id"] + "-*.wav"))):
            a, sr = sf.read(f)
            a16 = np.interp(np.arange(0, len(a), sr / 16000), np.arange(len(a)), a).astype(np.float32)
            txt = asr({"raw": a16, "sampling_rate": 16000}, generate_kwargs={"language": "hindi", "task": "transcribe"})["text"]
            score = cer(txt, line["text"])
            report.append(f"{line['id']}  {os.path.basename(f)}  {len(a) / sr:5.2f}s  CER {score:.2f}  {txt}")
            print(report[-1], flush=True)
            if best is None or score < best[0]: best = (score, f)
        if best:
            a, sr = sf.read(best[1])
            a = trim(a, sr)
            a = a / (np.sqrt(np.mean(a ** 2)) + 1e-9) * .08
            a = np.clip(a, -.98, .98)
            sf.write(os.path.join(PROJECT, "assets/vo", line["id"] + ".wav"), a, sr)
            report.append(f"  -> {os.path.basename(best[1])}  ({len(a) / sr:.2f}s)")
    name = "report.txt" if not only else "report-" + "-".join(only) + ".txt"
    open(os.path.join(PROJECT, "assets/vo", name), "w", encoding="utf-8").write("\n".join(report) + "\n")


if __name__ == "__main__":
    main()
