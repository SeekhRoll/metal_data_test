"""Quick layout check: the two islands, the cast and the camera for the main wide shot."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import bpy
import toolkit
import characters as ch
import scene
import world
from film_data import NEAR, FAR, SPOT, DOCK, HEADING, CAM, NEAR_PALMS, FAR_PALMS, ROT

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
toolkit.reset()
sc = scene.setup(res=(540, 960), samples=8)
world.river()
L = ch.island((*NEAR, 0), 'islandL', pid=ch.ID['islandL'], palms=NEAR_PALMS)
R = ch.island((*FAR, 0), 'islandR', pid=ch.ID['islandR'], flip=True, palms=FAR_PALMS)
for name, build in (('farmer', ch.farmer), ('lion', ch.lion), ('goat', ch.goat), ('cabbage', ch.cabbage)):
    o = build(); o.location = (*SPOT['near'][name], .12); o.rotation_euler[2] = math.radians(ROT[name])
b = ch.boat(); b.location = (*DOCK['near'], 0); b.rotation_euler[2] = math.radians(HEADING)
scene.camera(CAM['wide'][0], CAM['wide'][1], lens=CAM['wide'][2])
scene.outputs(sc, os.path.join(ROOT, 'build/layout') + '/')
sc.frame_set(1)
bpy.ops.render.render(write_still=False)
