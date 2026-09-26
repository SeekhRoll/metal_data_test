"""Painted UI pieces for the composite (brief §5.4): the status-panel strip, the subtitle band, the icons and
the two imagination bubbles. All painted with the same watercolour vocabulary as the film."""
import os
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import exr
import watercolor as wc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')


def wash_strip(w, h, color, seed, ragged='bottom'):
    """a paper-coloured wash with a soft pooled, ragged edge; RGBA"""
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None] * np.ones((1, w), np.float32)
    edge = wc.fbm(1, w, 60, seed)[0] * 14 + wc.fbm(1, w, 12, seed + 1)[0] * 4
    d = (h - 16 + edge)[None, :] - y * h if ragged == 'bottom' else y * h - (16 + edge)[None, :]
    a = np.clip(d / 3, 0, 1)
    pool = np.exp(-np.clip(d, 0, None) / 6) * a
    tex = .9 + .1 * (wc.fbm(h, w, 90, seed + 2) * .5 + .5)
    c = np.array(color, np.float32)[None, None] * tex[..., None]
    c = c * (1 - .18 * pool[..., None])
    rgb = c * wc.paper(h, w)[..., None]
    return np.dstack([rgb, a])


def save_rgba(img, path):
    im = (np.clip(img, 0, 1) * 255).astype(np.uint8)
    cv2.imwrite(path, cv2.cvtColor(im, cv2.COLOR_RGBA2BGRA))


def icon(name):
    P = exr.passes(os.path.join(ROOT, 'build', 'icon_' + name), 1)
    img = wc.paint(P, 0, background='paper')
    obj = (P['IndexOB'] > .5).astype(np.uint8)
    a = cv2.GaussianBlur(cv2.dilate(obj, np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 1.2)
    ys, xs = np.where(a > .05)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    save_rgba(np.dstack([img, a])[y0:y1, x0:x1], os.path.join(PUB, f'icon-{name}.png'))


def bubble(name):
    src = cv2.cvtColor(cv2.imread(os.path.join(PUB, f'bubble-{name}.png')), cv2.COLOR_BGR2RGB).astype(np.float32) / 255
    S = 560
    src = cv2.resize(src, (S, S))
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    r = np.hypot(xx - S / 2, yy - S / 2)
    ang = np.arctan2(yy - S / 2, xx - S / 2)
    wob = 6 * np.sin(ang * 7) + 4 * np.sin(ang * 13 + 1)
    inside = np.clip((S / 2 - 30 + wob - r) / 2, 0, 1)
    rim = np.clip(1 - np.abs(r - (S / 2 - 30 + wob)) / 7, 0, 1)
    ink = np.array([.22, .16, .12], np.float32)
    img = src * inside[..., None] + ink[None, None] * rim[..., None] * .85 + (1 - inside - rim * .85)[..., None] * np.array([.99, .97, .92])[None, None]
    a = np.clip(inside + rim, 0, 1)
    save_rgba(np.dstack([img, a]), os.path.join(PUB, f'bubble-{name}-framed.png'))


if __name__ == '__main__':
    os.makedirs(PUB, exist_ok=True)
    save_rgba(wash_strip(1080, 330, (.99, .95, .86), 3, 'bottom'), os.path.join(PUB, 'panel.png'))
    save_rgba(wash_strip(1080, 300, (.99, .95, .86), 7, 'top'), os.path.join(PUB, 'band.png'))
    for n in ('lion', 'goat', 'cabbage', 'farmer'):
        icon(n)
    for n in ('lion', 'goat'):
        bubble(n)
    print('ok')
