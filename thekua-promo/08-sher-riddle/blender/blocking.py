"""Brief §5.5 step 3: animation blocking. Poses the film at chosen times and renders quick stills.
    python3 blender/blocking.py 1 8 13.9 ...   -> build/blocking/t<sec>/<pass>_0001.exr"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import bpy
import film
import scene

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sc, cast, rigs, oar, cam = film.build()
sc.cycles.samples = 4
for s in sys.argv[1:]:
    t = float(s)
    film.pose(t, cast, rigs, oar, cam)
    scene.outputs(sc, os.path.join(ROOT, 'build/blocking', f't{t:05.1f}') + '/')
    sc.frame_set(1)
    bpy.ops.render.render(write_still=False)
    print('rendered', t, flush=True)
