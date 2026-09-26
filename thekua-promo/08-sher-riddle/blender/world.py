"""The river world: turquoise river, the two islands, a sky. Shared by the look-dev test and the film."""
import math

import bpy
from toolkit import mat, empty
import characters as ch


def river(size=60):
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, 0))
    r = bpy.context.active_object; r.name = 'river'
    r.data.materials.append(mat('water', '#27A9B4', rough=.6))
    r.pass_index = ch.ID['river']
    return r


def islands(gap=7.0):
    """left island near the camera (y = 0), right island across the river (y = gap)"""
    L = ch.island((0, 0, 0), 'islandL', pid=ch.ID['islandL'])
    R = ch.island((0, gap, 0), 'islandR', pid=ch.ID['islandR'], flip=True)
    return L, R


def rock(ob, t, amp=4.0, bob=.05, speed=1.0, phase=0.0):
    """boat rocking: roll, pitch and bob (used in keyframes)"""
    ob.rotation_euler[0] = math.radians(amp * .6 * math.sin(t * 2.1 * speed + phase))
    ob.rotation_euler[1] = math.radians(amp * math.sin(t * 1.6 * speed + phase + 1))
    ob.location[2] = bob * math.sin(t * 2.6 * speed + phase)
