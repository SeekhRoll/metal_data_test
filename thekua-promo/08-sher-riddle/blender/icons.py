"""Small painted icons of the lion, goat and cabbage for the status panel (front three-quarter, transparent)."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import bpy
import toolkit
import characters as ch
import scene

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for name, build, dist, h, yaw in (('lion', ch.lion, 3.6, .6, -25), ('goat', ch.goat, 2.6, .55, -25), ('cabbage', ch.cabbage, 1.6, .3, 0), ('farmer', ch.farmer, 3.4, 1.0, -10)):
    toolkit.reset()
    sc = scene.setup(res=(320, 320), samples=24, transparent=True)
    o = build(); o.rotation_euler[2] = math.radians(yaw)
    scene.camera((0, -dist, h + dist * .25), (0, 0, h), lens=50)
    scene.outputs(sc, os.path.join(ROOT, 'build/icon_' + name) + '/')
    sc.frame_set(1); bpy.ops.render.render(write_still=False)
    print('rendered', name, flush=True)
