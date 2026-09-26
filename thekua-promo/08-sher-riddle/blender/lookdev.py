"""Brief §5.5 step 2: a 3 s look-development clip of the boat rocking with the goat in it (rendered on twos)."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import bpy
import toolkit
import characters as ch
import scene
import world

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    toolkit.reset()
    sc = scene.setup(res=(720, 1280), samples=16)
    world.river()
    L, R = world.islands(7.5)
    L.location = (-3.2, 2.0, 0); R.location = (2.5, 11.5, 0)
    boat = ch.boat((0, 0, 0)); boat.rotation_euler[2] = math.radians(20)
    g = ch.goat((0, 0, 0)); g.parent = boat; g.location = (-.25, 0, .12); g.scale = (.9, .9, .9)
    scene.camera((1.5, -7.5, 5.2), (0, 1.2, .3), lens=40)
    sc.frame_start, sc.frame_end, sc.frame_step = 1, 72, 2
    for f in range(1, 73, 2):
        t = f / 24
        world.rock(boat, t, amp=6, bob=.06)
        boat.keyframe_insert('rotation_euler', frame=f); boat.keyframe_insert('location', frame=f)
        # the goat bounces happily, squash and stretch
        sq = 1 + .06 * math.sin(t * 5.2)
        g.scale = (.9 / math.sqrt(sq), .9 / math.sqrt(sq), .9 * sq)
        g.rotation_euler[2] = math.radians(8 * math.sin(t * 2.6))
        g.keyframe_insert('scale', frame=f); g.keyframe_insert('rotation_euler', frame=f)
    scene.outputs(sc, os.path.join(ROOT, 'build/lookdev') + '/')
    bpy.ops.render.render(animation=True)


if __name__ == '__main__':
    main()
