"""Final assembly (brief §3.1: FFmpeg for the mux).

1. Reads the subtitle cues from src/film/timeline.ts and writes assets/subtitles/subs.srt.
2. Places each VO line assets/vo/cue-NN.wav as laid out by scripts/fit_vo.py (assets/vo/placement.json:
   start time and a small common tempo), and ducks the music under the voice.
3. Muxes out/film-silent.mp4 + the mix into output/ (full quality, 720p WhatsApp copy, poster).

    python3 scripts/mix.py
"""
import json
import os
import re
import subprocess
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:  # pragma: no cover
    FF = "ffmpeg"


def cues():
    src = open(os.path.join(ROOT, "src/film/timeline.ts"), encoding="utf-8").read()
    return [(float(a), float(b), t) for a, b, t in re.findall(r"\{ from: ([\d.]+), to: ([\d.]+), text: '([^']+)' \}", src)]


def srt_time(s):
    ms = int(round(s * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def read_wav(p):
    with wave.open(p) as w:
        ch, sr, n = w.getnchannels(), w.getframerate(), w.getnframes()
        x = np.frombuffer(w.readframes(n), np.int16).astype(np.float32) / 32768
    x = x.reshape(-1, ch)
    if ch == 1:
        x = np.repeat(x, 2, axis=1)
    if sr != SR:  # simple resample
        t = np.arange(int(len(x) * SR / sr)) * sr / SR
        x = np.stack([np.interp(t, np.arange(len(x)), x[:, c]) for c in range(2)], 1)
    return x


def fit(path, max_len):
    """Returns the VO line, sped up (pitch-preserving atempo) only if it overruns its window."""
    x = read_wav(path)
    dur = len(x) / SR
    if dur <= max_len:
        return x
    tempo = min(1.12, dur / max_len)
    tmp = path.replace(".wav", ".fit.wav")
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", path, "-filter:a", f"atempo={tempo:.3f}", "-ar", str(SR), tmp], check=True)
    print(f"  {os.path.basename(path)}: {dur:.2f}s > {max_len:.2f}s window, sped up x{tempo:.2f}")
    return read_wav(tmp)


def main():
    cs = cues()
    os.makedirs(os.path.join(ROOT, "assets/subtitles"), exist_ok=True)
    with open(os.path.join(ROOT, "assets/subtitles/subs.srt"), "w", encoding="utf-8") as f:
        for i, (a, b, t) in enumerate(cs, 1):
            f.write(f"{i}\n{srt_time(a)} --> {srt_time(b)}\n{t}\n\n")
    music = read_wav(os.path.join(ROOT, "assets/music/music.wav"))
    n = int(60 * SR)
    music = np.pad(music, ((0, max(0, n - len(music))), (0, 0)))[:n]
    vo = np.zeros((n, 2), np.float32)
    have_vo = 0
    place = json.load(open(os.path.join(ROOT, "assets/vo/placement.json")))
    for pl in place:
        p = os.path.join(ROOT, "assets/vo", pl["id"] + ".wav")
        if not os.path.exists(p):
            continue
        if pl["tempo"] > 1.001:
            tmp = os.path.join(ROOT, "out", pl["id"] + ".tempo.wav")
            subprocess.run([FF, "-y", "-loglevel", "error", "-i", p, "-filter:a", f"atempo={pl['tempo']:.3f}", "-ar", str(SR), tmp], check=True)
            p = tmp
        x = read_wav(p)
        s = int(pl["at"] * SR)
        x = x[:n - s]
        vo[s:s + len(x)] += x
        have_vo += 1
    # duck music under the voice (smoothed envelope)
    env = np.abs(vo).max(axis=1)
    k = int(.25 * SR)
    env = np.convolve(env > .02, np.ones(k) / k, mode="same")
    duck = 1 - .55 * np.clip(env * 1.5, 0, 1)
    mix = music * .8 * (duck[:, None] if have_vo else 1.0) + vo * 2.2
    mix /= max(1.0, np.abs(mix).max() / .95)
    os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
    wav = os.path.join(ROOT, "out/mix.wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print(f"mix: {have_vo}/{len(cs)} VO lines, music {'ducked' if have_vo else 'full'}")

    out = os.path.join(ROOT, "output")
    os.makedirs(out, exist_ok=True)
    silent = os.path.join(ROOT, "out/film-silent.mp4")
    full = os.path.join(out, "sudama-ki-potli.mp4")
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
                    "-maxrate", "12M", "-bufsize", "24M", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "192k", "-t", "60", "-movflags", "+faststart", full], check=True)
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", full, "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
                    "-b:v", "2600k", "-maxrate", "3200k", "-bufsize", "6000k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
                    "-movflags", "+faststart", os.path.join(out, "sudama-ki-potli-whatsapp.mp4")], check=True)
    subprocess.run([FF, "-y", "-loglevel", "error", "-ss", "57.5", "-i", full, "-frames:v", "1", "-q:v", "2", os.path.join(out, "poster.jpg")], check=True)
    print("wrote", out)


if __name__ == "__main__":
    main()
