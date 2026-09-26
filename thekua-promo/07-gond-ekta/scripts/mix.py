"""Final assembly (brief §3.1 and §3.5 step 5: FFmpeg mux of video, VO, music and subtitles).

1. Writes assets/subtitles/subs.srt from src/film/subs.json (the same cards that are burned into the picture).
2. Places each chosen VO line assets/vo/<id>.wav at its time in src/film/vo.json, gently time-fitting a line
   (max 10% faster, pitch-preserving) only if it would run into the next one, and ducks the music under the voice.
3. Muxes out/film-silent.mp4 + the mix into output/ (full quality, 720p WhatsApp copy, poster).

    python3 scripts/mix.py
"""
import json
import os
import subprocess
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR, DUR = 44100, 60.0
NAME = "ekta-ka-jaal"
try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:  # pragma: no cover
    FF = "ffmpeg"


def srt_time(s):
    ms = int(round(s * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def read_wav(p):
    import soundfile as sf
    x, sr = sf.read(p, dtype="float32", always_2d=True)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    if sr != SR:
        t = np.arange(int(len(x) * SR / sr)) * sr / SR
        x = np.stack([np.interp(t, np.arange(len(x)), x[:, c]) for c in range(2)], 1).astype(np.float32)
    return x


def fit(path, max_len):
    x = read_wav(path)
    dur = len(x) / SR
    if dur <= max_len:
        return x
    tempo = min(1.10, dur / max_len)
    tmp = os.path.join(ROOT, "out", os.path.basename(path).replace(".wav", ".fit.wav"))
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", path, "-filter:a", f"atempo={tempo:.3f}", "-ar", str(SR), tmp], check=True)
    print(f"  {os.path.basename(path)}: {dur:.2f}s > {max_len:.2f}s, sped up x{tempo:.2f}")
    return read_wav(tmp)


def main():
    os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
    subs = json.load(open(os.path.join(ROOT, "src/film/subs.json"), encoding="utf-8"))
    os.makedirs(os.path.join(ROOT, "assets/subtitles"), exist_ok=True)
    with open(os.path.join(ROOT, "assets/subtitles/subs.srt"), "w", encoding="utf-8") as f:
        for i, c in enumerate(subs, 1):
            f.write(f"{i}\n{srt_time(c['from'])} --> {srt_time(c['to'])}\n" + "\n".join(c["lines"]) + "\n\n")
    n = int(DUR * SR)
    music = read_wav(os.path.join(ROOT, "assets/music/music.wav"))
    music = np.pad(music, ((0, max(0, n - len(music))), (0, 0)))[:n]
    vo = np.zeros((n, 2), np.float32)
    lines = json.load(open(os.path.join(ROOT, "src/film/vo.json"), encoding="utf-8"))
    placed = 0
    for i, line in enumerate(lines):
        p = os.path.join(ROOT, "assets/vo", line["id"] + ".wav")
        if not os.path.exists(p):
            continue
        if line.get("tempo", 1) > 1.001:
            tmp = os.path.join(ROOT, "out", line["id"] + ".tempo.wav")
            subprocess.run([FF, "-y", "-loglevel", "error", "-i", p, "-filter:a", f"atempo={line['tempo']:.3f}", "-ar", str(SR), tmp], check=True)
            p = tmp
        nxt = lines[i + 1]["at"] if i + 1 < len(lines) else DUR - .3
        x = fit(p, nxt - .15 - line["at"])
        s = int(line["at"] * SR)
        x = x[:n - s]
        vo[s:s + len(x)] += x
        placed += 1
    env = np.abs(vo).max(axis=1)
    k = int(.3 * SR)
    env = np.convolve((env > .01).astype(np.float32), np.ones(k) / k, mode="same")
    duck = 1 - .6 * np.clip(env * 1.6, 0, 1)
    mix = music * .8 * duck[:, None] + vo * 2.2
    mix /= max(1.0, np.abs(mix).max() / .95)
    wav = os.path.join(ROOT, "out/mix.wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print(f"mix: {placed}/{len(lines)} VO lines placed")

    out = os.path.join(ROOT, "output")
    os.makedirs(out, exist_ok=True)
    silent = os.path.join(ROOT, "out/film-silent.mp4")
    full = os.path.join(out, NAME + ".mp4")
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
                    "-maxrate", "12M", "-bufsize", "24M", "-pix_fmt", "yuv420p", "-r", "24",
                    "-c:a", "aac", "-b:a", "192k", "-t", str(DUR), "-movflags", "+faststart", full], check=True)
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", full, "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
                    "-b:v", "2600k", "-maxrate", "3200k", "-bufsize", "6000k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
                    "-movflags", "+faststart", os.path.join(out, NAME + "-whatsapp.mp4")], check=True)
    subprocess.run([FF, "-y", "-loglevel", "error", "-ss", "58.5", "-i", full, "-frames:v", "1", "-q:v", "2", os.path.join(out, "poster.jpg")], check=True)
    print("wrote", out)


if __name__ == "__main__":
    main()
