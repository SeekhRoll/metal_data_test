"""Mix a Pitru Paksha episode: VO lines at their fitted times over the tanpura score (ducked under speech, never
percussion), mux with the silent Remotion render, and export the full file, a WhatsApp copy (<30 MB) and a poster.
    python3 scripts/mix_pitru.py 1   (expects out/pitru-ep1-silent.mp4)
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
NAMES = {1: "bhagirath-prayas", 2: "indira-ekadashi", 3: "phalgu-ke-tat-par"}
try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FF = "ffmpeg"


def load(p):
    a, sr = sf.read(p, always_2d=True)
    if sr != SR:
        idx = np.arange(0, len(a), sr / SR)
        a = np.stack([np.interp(idx, np.arange(len(a)), a[:, c]) for c in range(a.shape[1])], 1)
    return a if a.shape[1] == 2 else np.repeat(a, 2, 1)


def main(ep):
    tl = json.load(open(os.path.join(ROOT, f"src/episodes/pitru/ep{ep}-timeline.json")))
    dur, n = tl["dur"], int(tl["dur"] * SR)
    music = load(os.path.join(ROOT, f"assets/music/pitru-ep{ep}.wav"))
    music = np.pad(music, ((0, max(0, n - len(music))), (0, 0)))[:n]
    vo = np.zeros((n, 2))
    for l in json.load(open(os.path.join(ROOT, f"src/episodes/pitru/ep{ep}-vo.json"), encoding="utf-8")):
        x = load(os.path.join(ROOT, "assets/vo", l["id"] + ".wav"))
        s = int(l["at"] * SR); y = x[:n - s]; vo[s:s + len(y)] += y
    env = np.abs(vo).max(1); k = int(.4 * SR)
    env = np.convolve((env > .01).astype(float), np.ones(k) / k, mode="same")
    duck = 1 - .5 * np.clip(env * 1.5, 0, 1)
    mix = music * .75 * duck[:, None] + vo * 2.4
    mix /= max(1.0, np.abs(mix).max() / .95)
    os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
    wav = os.path.join(ROOT, f"out/pitru-ep{ep}-mix.wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
    out = os.path.join(ROOT, "output"); os.makedirs(out, exist_ok=True)
    name = f"pitru-{ep}-{NAMES[ep]}"
    silent, full = os.path.join(ROOT, f"out/pitru-ep{ep}-silent.mp4"), os.path.join(out, name + ".mp4")
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
                    "-maxrate", "8M", "-bufsize", "16M", "-pix_fmt", "yuv420p", "-r", "24", "-c:a", "aac", "-b:a", "192k", "-t", str(dur), "-movflags", "+faststart", full], check=True)
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", full, "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
                    "-b:v", "2000k", "-maxrate", "2600k", "-bufsize", "5000k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
                    "-movflags", "+faststart", os.path.join(out, name + "-whatsapp.mp4")], check=True)
    subprocess.run([FF, "-y", "-loglevel", "error", "-ss", "3.2", "-i", full, "-frames:v", "1", "-q:v", "2", os.path.join(out, name + "-poster.jpg")], check=True)
    for f in sorted(os.listdir(out)):
        if f.startswith(name): print(f, round(os.path.getsize(os.path.join(out, f)) / 1e6, 1), "MB")


if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 1)
