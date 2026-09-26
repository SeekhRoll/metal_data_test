"""Save progress to GitHub scene by scene, so a restarted or replaced machine loses at most one scene.

Loops until every scene is saved: when all painted frames of a scene exist, encode them into
render/<scene>.mp4 (high quality), pack that scene's object-ID maps into render/<scene>-ids.npz (for the
text-collision check), then commit and push. `--restore` does the reverse on a fresh machine: it unpacks
the saved scenes back into public/frames and build/ids so post/assemble.py resumes with the rest.
"""
import json
import os
import subprocess
import sys
import time

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(os.path.dirname(ROOT))
TL = json.load(open(os.path.join(ROOT, 'src/film/timeline.json')))
FPS, N = TL['fps'], int(TL['duration'] * TL['fps'])
FR, IDS, OUT = (os.path.join(ROOT, p) for p in ('public/frames', 'build/ids', 'render'))
try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:  # pragma: no cover
    FF = 'ffmpeg'


def ranges():
    out = []
    for s in TL['scenes']:
        a, b = int(round(s['from'] * FPS)), min(N, int(round(s['to'] * FPS)))
        out.append((s['id'], a, b))
    return out


def git(*args):
    return subprocess.run(['git', '-C', REPO, *args], capture_output=True, text=True)


def save(scene, a, b):
    os.makedirs(OUT, exist_ok=True)
    mp4 = os.path.join(OUT, f'{scene}.mp4')
    subprocess.run([FF, '-y', '-loglevel', 'error', '-framerate', str(FPS), '-start_number', str(a), '-i', os.path.join(FR, '%05d.jpg'),
                    '-frames:v', str(b - a), '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', mp4], check=True)
    ids = [cv2.imread(os.path.join(IDS, f'{f:05d}.png'), cv2.IMREAD_UNCHANGED) for f in range(a, b)]
    ids = np.stack([i if i is not None else np.zeros((480, 270), np.uint8) for i in ids])
    np.savez_compressed(os.path.join(OUT, f'{scene}-ids.npz'), ids=ids, first=a)
    git('add', os.path.relpath(mp4, REPO), os.path.relpath(os.path.join(OUT, f'{scene}-ids.npz'), REPO))
    r = git('commit', '-m', f'Ee Gaya Hamra Sher: painted frames of {scene} (checkpoint)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01ED9yXD6JBh8d7vr7PikQRe')
    for k in range(4):
        p = git('push', '-u', 'origin', 'claude/thekua-promo-video-7vfzqo')
        if p.returncode == 0: break
        time.sleep(2 ** (k + 1))
    print('saved', scene, a, b, 'pushed' if p.returncode == 0 else 'push failed', flush=True)


def restore():
    for scene, a, b in ranges():
        mp4 = os.path.join(OUT, f'{scene}.mp4')
        if not os.path.exists(mp4): continue
        os.makedirs(FR, exist_ok=True); os.makedirs(IDS, exist_ok=True)
        cap = cv2.VideoCapture(mp4); f = a
        while True:
            ok, img = cap.read()
            if not ok: break
            cv2.imwrite(os.path.join(FR, f'{f:05d}.jpg'), img, [cv2.IMWRITE_JPEG_QUALITY, 95]); f += 1
        d = np.load(os.path.join(OUT, f'{scene}-ids.npz'))
        for k, im in enumerate(d['ids']): cv2.imwrite(os.path.join(IDS, f'{a + k:05d}.png'), im)
        print('restored', scene, a, f)


def watch():
    done = {s for s, _, _ in ranges() if os.path.exists(os.path.join(OUT, f'{s}.mp4'))}
    while len(done) < len(ranges()):
        for scene, a, b in ranges():
            if scene in done: continue
            if all(os.path.exists(os.path.join(FR, f'{f:05d}.jpg')) for f in range(a, b)):
                save(scene, a, b); done.add(scene)
        time.sleep(30)


if __name__ == '__main__':
    restore() if '--restore' in sys.argv else watch()
