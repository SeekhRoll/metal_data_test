import glob
import os

import numpy as np
import OpenEXR


def read(path):
    ch = OpenEXR.File(path).channels()
    if len(ch) == 1:
        return next(iter(ch.values())).pixels.astype(np.float32)
    return np.stack([ch[k].pixels for k in sorted(ch, key=lambda k: 'XYZRGBA'.find(k))], -1).astype(np.float32)


def passes(directory, frame=1):
    """Load every pass written by blender/scene.outputs for one frame."""
    out = {}
    for name in ('Image', 'DiffCol', 'DiffDir', 'DiffInd', 'AO', 'Depth', 'Normal', 'IndexOB'):
        p = os.path.join(directory, f'{name}_{frame:04d}.exr')
        if os.path.exists(p):
            out[name] = read(p)
    return out
