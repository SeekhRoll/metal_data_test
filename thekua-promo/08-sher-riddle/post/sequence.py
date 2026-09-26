"""Paint a rendered sequence (on twos: each rendered frame is held for 2 film frames) and encode an MP4.
    python3 post/sequence.py <pass dir> <first> <last> <out.mp4> [--hold 2]"""
import os
import subprocess
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import exr
import watercolor as wc

try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:  # pragma: no cover
    FF = 'ffmpeg'


def main(d, first, last, out, hold=2):
    tmp = out + '.frames'
    os.makedirs(tmp, exist_ok=True)
    n = 0
    for f in range(first, last + 1, hold):
        P = exr.passes(d, f)
        for k in range(hold):
            img = wc.paint(P, f - first + k, out_size=(1080, 1920))
            cv2.imwrite(os.path.join(tmp, f'{n:05d}.png'), (img[..., ::-1] * 255).astype(np.uint8)); n += 1
    subprocess.run([FF, '-y', '-loglevel', 'error', '-framerate', '24', '-i', os.path.join(tmp, '%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', out], check=True)
    print('wrote', out, n, 'frames')


if __name__ == '__main__':
    a = sys.argv[1:]
    main(a[0], int(a[1]), int(a[2]), a[3])
