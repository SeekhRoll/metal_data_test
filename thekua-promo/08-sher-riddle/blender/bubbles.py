"""The two painted "imagination" bubbles of scene 2: the lion licking its lips at the goat, and the goat eyeing
the cabbage. Rendered as small stills on paper; Remotion places them in painted bubbles."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import bpy
import toolkit
import characters as ch
import scene

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for shot in ('lion', 'goat'):
    toolkit.reset()
    sc = scene.setup(res=(640, 640), samples=24, transparent=True)
    bpy.ops.mesh.primitive_circle_add(radius=6, fill_type='NGON'); bpy.context.active_object.is_shadow_catcher = True
    if shot == 'lion':
        l = ch.lion((-.9, .2, 0)); rg = ch.rig(l, 'lion'); l.rotation_euler[2] = math.radians(62)
        bpy.data.objects['lion_tongue'].hide_render = False
        rg['head'].rotation_euler = (math.radians(-6), 0, math.radians(8))
        g = ch.goat((1.15, .1, 0)); g.rotation_euler[2] = math.radians(-60); g.scale = (.9, .9, .9)
        scene.camera((.3, -3.6, 1.7), (.25, 0, .6), lens=40)
    else:
        g = ch.goat((-.55, .1, 0)); rg = ch.rig(g, 'goat'); g.rotation_euler[2] = math.radians(60)
        rg['head'].rotation_euler = (math.radians(18), 0, math.radians(10))
        c = ch.cabbage((.75, -.1, 0)); c.scale = (1.3, 1.3, 1.3)
        scene.camera((.2, -2.8, 1.4), (.15, 0, .45), lens=40)
    scene.outputs(sc, os.path.join(ROOT, 'build/bubble_' + shot) + '/')
    sc.frame_set(1)
    bpy.ops.render.render(write_still=False)
    print('rendered', shot, flush=True)
