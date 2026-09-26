"""Brief §5.5 step 1: turnarounds (front, three-quarter, side, back) for the cast, the boat and an island.
    python3 blender/turnaround.py [name ...]   -> build/turn/<name>_<view>/<pass>_0001.exr"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import bpy
import toolkit
import characters as ch
import scene

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUBJECTS = {  # builder, camera distance, look-at height, base turn so that 'front' faces the camera
    'farmer': (ch.farmer, 3.7, .95, 0), 'lion': (ch.lion, 4.4, .65, 0), 'goat': (ch.goat, 3.0, .55, 0), 'cabbage': (ch.cabbage, 1.8, .28, 0),
    'boat': (ch.boat, 5.2, .25, -90), 'island': (lambda: ch.island(pid=90), 10.5, .9, 0),
}
VIEWS = {'front': 0, 'three-quarter': -40, 'side': -90, 'back': 180}


def main(names):
    for name in names:
        build, dist, h, base = SUBJECTS[name]
        for view, ang in VIEWS.items():
            toolkit.reset()
            sc = scene.setup(res=(540, 720), samples=24, transparent=True)
            root = build()
            root.rotation_euler = (0, 0, math.radians(ang + base))
            # a ground disc to catch the shadow (object index 0 = paper)
            bpy.ops.mesh.primitive_circle_add(radius=dist * .6, fill_type='NGON', location=(0, 0, 0))
            g = bpy.context.active_object; g.is_shadow_catcher = True
            scene.camera((0, -dist, h + dist * .32), (0, 0, h), lens=50)
            out = os.path.join(ROOT, 'build/turn', f'{name}_{view}') + '/'
            scene.outputs(sc, out)
            sc.frame_set(1)
            bpy.ops.render.render(write_still=False)
            print('rendered', name, view, flush=True)


if __name__ == '__main__':
    main(sys.argv[1:] or list(SUBJECTS))
