"""Animate and render the whole film (brief §3, §5.2). Poses are computed for every rendered frame and keyed on
twos (a hand-painted cadence). Lively motion: anticipation before every hop, stretch in the air, squash on
landing with overshoot, the boat dipping and rocking whenever anyone boards, follow-through on tails and heads.

    python3 blender/film.py [first last]   -> build/film/<pass>_####.exr (every 2nd frame)
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector
import toolkit
import characters as ch
import scene
import world
import timeline as TL
from film_data import NEAR, FAR, SPOT, DOCK, HEADING, CAM, NEAR_PALMS, FAR_PALMS, ROT

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = math.radians


# ---------------------------------------------------------------- easing and hops
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def seg(t, a, b): return clamp((t - a) / (b - a))
def ease(u): u = clamp(u); return u * u * (3 - 2 * u)
def lerp(a, b, u): return tuple(x + (y - x) * u for x, y in zip(a, b))
def kf(t, keys):
    if t <= keys[0][0]: return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1: return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0))
    return keys[-1][1]


def squash(t, t_land, amt=.2):
    """squash on landing with overshoot, settling (returns z-scale factor)"""
    u = t - t_land
    if u < 0 or u > .6: return 1.0
    return 1 - amt * math.exp(-u * 9) * math.cos(u * 22)


def hop(t, t0, dur, p0, p1, h=.9):
    """anticipation (0.22 s crouch) -> arc -> land. returns (pos, zscale) or None when not hopping"""
    if t < t0 - .22 or t > t0 + dur + .6: return None
    if t < t0:
        a = seg(t, t0 - .22, t0); return p0, 1 - .16 * math.sin(a * math.pi / 2)
    if t <= t0 + dur:
        u = (t - t0) / dur
        p = lerp(p0, p1, ease(u) * .85 + u * .15)
        return (p[0], p[1], p[2] + h * 4 * u * (1 - u)), 1 + .14 * math.sin(u * math.pi)
    return p1, squash(t, t0 + dur)


# ---------------------------------------------------------------- the boat
H = HEADING
TR = TL.WRONG
def boat_at(t):
    """(x, y, heading) of the boat"""
    near, far = DOCK['near'], DOCK['far']
    if t < TR['push'] + .3: return (*near, H)
    if t < TR['reset']:
        u = ease(seg(t, TR['push'] + .3, TR['stop'])) * .42
        return (*lerp(near, far, u), H)
    heading, pos = H, near
    for k, (cargo, d) in enumerate(TL.CROSSINGS, 1):
        c = TL.crossing_times(k)
        src, dst = (near, far) if d > 0 else (far, near)
        h_to = H
        if t < c['start']: break
        h_from = heading
        heading = h_from + (h_to - h_from) * ease(seg(t, c['start'], c['start'] + .9))
        u = ease(seg(t, c['push'] + .3, c['arrive']))
        pos = lerp(src, dst, u)
        heading = h_to if t >= c['start'] + .9 else heading
    return (*pos, heading)


def boarding_times():
    B = TL.BEATS
    ev = [B['farmer_board'] + .7, B['goat_in'] + .6, B['goat_out'] + .7, TR['push'] + .6, TR['reset']]
    for k, (cargo, d) in enumerate(TL.CROSSINGS, 1):
        c = TL.crossing_times(k)
        if cargo: ev += [c['board'] + .6 if cargo != 'lion' else c['push'] + .6, c['unload'] + .7]
        ev += [c['arrive']]
    return ev + [TL.BEATS['farmer_off'] + .1]
BOARD_EV = boarding_times()


def boat_motion(t):
    """bob, roll and pitch: always a gentle rock, more while moving, and a dip for every boarding"""
    moving = any(TL.crossing_times(k)['push'] + .3 < t < TL.crossing_times(k)['arrive'] for k in range(1, 8)) or (TR['push'] + .3 < t < TR['stop'])
    amp = 5.0 if moving else 2.0
    dip = sum(math.exp(-(t - e) * 4) * math.sin((t - e) * 14) for e in BOARD_EV if 0 <= t - e < 1.5)
    bob = .04 * math.sin(t * 2.4) - .07 * max(0, dip) - .03 * abs(dip)
    return bob, amp * .6 * math.sin(t * 2.1) + 4 * dip, amp * math.sin(t * 1.6 + 1) + 2 * dip, moving


def seat(t, which):
    """world position of the bow (cargo) or stern (farmer) seat"""
    x, y, hd = boat_at(t)
    bob = boat_motion(t)[0]
    lx = -.5 if which == 'bow' else .78
    a = R(hd)
    return (x + math.cos(a) * lx, y + math.sin(a) * lx, .14 + bob)


def on_island(name, island):
    p = SPOT[island][name]
    return (p[0], p[1], .12)


# ---------------------------------------------------------------- each character's path: (pos, yaw, zscale)
def cargo_path(name, t):
    """lion, goat or cabbage: where it is, which way it faces, its squash"""
    home = 'near'
    events = []                                    # (t_board, t_unload, boat side it leaves from, island it ends on)
    if name == 'goat':
        events.append((TL.BEATS['goat_in'], TL.BEATS['goat_out'], 'near', 'near'))
    if name == 'lion':
        events.append((TR['push'], None, 'near', None))
    for k, (cargo, d) in enumerate(TL.CROSSINGS, 1):
        if cargo == name:
            c = TL.crossing_times(k)
            tb = c['push'] if name == 'lion' else c['board']
            events.append((tb, c['unload'], 'near' if d > 0 else 'far', 'far' if d > 0 else 'near'))
    pos, yaw, zs = on_island(name, 'near'), ROT[name], 1.0
    if name == 'lion' and TR['push'] - .3 <= t < TR['reset']:
        hp = hop(t, TR['push'], .55, on_island('lion', 'near'), seat(TR['push'] + .55, 'bow'), 1.0)
        if hp and t <= TR['push'] + .55: return hp[0], ROT['lion'] + 60 * seg(t, TR['push'], TR['push'] + .55), hp[1]
        return seat(t, 'bow'), boat_at(t)[2] + 90, (hp[1] if hp else 1.0)
    if name == 'goat' and TR['goat_walk'] - .3 <= t < TR['reset']:
        # the goat trots to the cabbage and eats it
        p0, p1 = on_island('goat', 'near'), on_island('cabbage', 'near')
        tgt = (p1[0] + .55, p1[1] - .05, .12)
        hp = hop(t, TR['goat_walk'], .5, p0, tgt, .35)
        return (hp[0] if hp and t < TR['goat_walk'] + .5 else tgt), 80, (hp[1] if hp else 1.0)
    for tb, tu, frm, to in events:
        if tb is None: continue
        if name == 'lion' and tu is None: continue
        land_in = tb + .6
        if t < tb - .25: break
        src = on_island(name, frm)
        if t <= land_in:
            hp = hop(t, tb, .6, src, seat(land_in, 'bow'), .8 if name != 'cabbage' else .6)
            return hp[0], ROT[name] + 40 * seg(t, tb, land_in), hp[1]
        if t < tu:
            return seat(t, 'bow'), boat_at(t)[2] + (90 if name != 'cabbage' else 0), squash(t, land_in)
        dst = on_island(name, to)
        hp = hop(t, tu, .7, seat(tu, 'bow'), dst, .8 if name != 'cabbage' else .6)
        if hp and t <= tu + .7: return hp[0], ROT[name], hp[1]
        pos, zs = dst, (hp[1] if hp else 1.0)
    return pos, yaw, zs


def farmer_path(t):
    near = on_island('farmer', 'near')
    fb, fo = TL.BEATS['farmer_board'], TL.BEATS['farmer_off']
    if t < fb - .2: return near, ROT['farmer'], 1.0, 'land'
    if t < fb + .7:
        hp = hop(t, fb, .7, near, seat(fb + .7, 'stern'), .7); return hp[0], ROT['farmer'], hp[1], 'land'
    if t < fo:
        return seat(t, 'stern'), None, squash(t, fb + .7), 'boat'
    far = (SPOT['far']['farmer'][0], SPOT['far']['farmer'][1], .12)
    hp = hop(t, fo + .1, .7, seat(fo, 'stern'), far, .7)
    return (hp[0] if hp else far), 0, (hp[1] if hp else 1.0), 'land'


# ---------------------------------------------------------------- build the scene
def build():
    toolkit.reset()
    sc = scene.setup(res=(540, 960), samples=8)
    world.river()
    ch.island((*NEAR, 0), 'islandL', pid=ch.ID['islandL'], palms=NEAR_PALMS)
    ch.island((*FAR, 0), 'islandR', pid=ch.ID['islandR'], flip=True, palms=FAR_PALMS)
    cast = {'farmer': ch.farmer(), 'lion': ch.lion(), 'goat': ch.goat(), 'cabbage': ch.cabbage(), 'boat': ch.boat()}
    rigs = {k: ch.rig(v, k) for k, v in cast.items()}
    oar = bpy.data.objects['boat_oarpivot']
    cam = scene.camera(*CAM['wide'][:2], lens=CAM['wide'][2])
    return sc, cast, rigs, oar, cam


def camera_at(t):
    wide_p, wide_t, lens = CAM['wide']
    p = lerp((0.6, -8.6, 10.2), wide_p, ease(seg(t, 0, 5.5)))
    tg = wide_t
    # scene 2: swing across to the empty far island and back
    # (first a pure sideways truck so the near island leaves by the left edge, then on to the far island)
    s0, s1 = TL.BEATS['swing']
    a = ease(seg(t, s0, s0 + 1.1)) - ease(seg(t, s1 - 1.0, s1))
    b = ease(seg(t, s0 + 1.0, s0 + 2.6)) - ease(seg(t, s1 - 2.0, s1 - .9))
    p = (p[0] + 4.6 * a, p[1], p[2]); tg = (tg[0] + 4.6 * a, tg[1], tg[2])
    p = lerp(p, (8.4, -1.2, 7.6), b); tg = lerp(tg, (FAR[0] + .9, FAR[1] + .2, .3), b)
    # scene 3: push in on Ramkhelawan scratching his head
    c0, c1 = TL.BEATS['scratch']
    c = ease(seg(t, c0 - .2, c0 + .5)) - ease(seg(t, c1 + .2, c1 + .7))
    fx, fy, _ = seat(c0, 'stern')
    p = lerp(p, (wide_p[0] - .1, wide_p[1] + .5, wide_p[2] - .4), c); tg = lerp(tg, (wide_t[0] - .15, wide_t[1] - .3, 0), c)
    # scene 6: pull up into a wide view of the river at golden hour
    u = ease(seg(t, *TL.BEATS['pullup']))
    p = lerp(p, (1.3, -7.5, 15.5), u); tg = lerp(tg, (1.0, 5.2, 0), u)
    return p, tg, lens - 3 * u


def pose(t, cast, rigs, oar, cam):
    boat = cast['boat']
    x, y, hd = boat_at(t)
    bob, roll, pitch, moving = boat_motion(t)
    boat.location = (x, y, bob); boat.rotation_euler = (R(roll), R(pitch), R(hd))
    oar.rotation_euler = (R(35 * math.sin(t * 4.2)) if moving else R(6 * math.sin(t * 1.1)), 0, 0)

    # cargo
    for name in ('lion', 'goat', 'cabbage'):
        o = cast[name]
        p, yaw, zs = cargo_path(name, t)
        o.location = p; o.rotation_euler = (0, 0, R(yaw))
        o.scale = (1 / math.sqrt(zs), 1 / math.sqrt(zs), zs)
    # the cabbage gets eaten in the wrong attempt (bite by bite), then the wash resets everything
    if TR['munch'] <= t < TR['reset']:
        k = 1 - .65 * min(1, math.floor((t - TR['munch']) / .55) / 5)
        cast['cabbage'].scale = (k, k, k)

    # farmer
    f = cast['farmer']; fr = rigs['farmer']
    p, yaw, zs, where = farmer_path(t)
    if yaw is None:
        yaw = hd + 90 if moving or t > TL.T0 else 5
        if TR['turn'] <= t < TR['reset']: yaw = hd + 90 + 170 * ease(seg(t, TR['turn'], TR['turn'] + .35))
    f.location = p; f.rotation_euler = (0, R(3 * math.sin(t * 4.2)) if moving else 0, R(yaw))
    f.scale = (1 / math.sqrt(zs), 1 / math.sqrt(zs), zs)
    armR = armL = 0.0; head_tilt = head_yaw = 0.0
    if t < 2.4:                                               # "राम-राम भइया!" a big wave
        armR = -150 * ease(seg(t, .5, .9)) * (1 - ease(seg(t, 2.0, 2.4))) + 18 * math.sin(t * 12) * seg(t, .9, 1.0) * (1 - seg(t, 1.9, 2.0))
    s0, s1 = TL.BEATS['scratch']
    if s0 <= t < s1:                                          # scratching his head
        armR = -150 * ease(seg(t, s0, s0 + .5)) * (1 - ease(seg(t, s1 - .4, s1))) + 8 * math.sin(t * 18)
        head_tilt = 12 * ease(seg(t, s0 + .1, s0 + .6)) * (1 - ease(seg(t, s1 - .4, s1)))
    if TR['turn'] <= t < TR['reset']:                         # horrified
        armR = armL = -160 * ease(seg(t, TR['turn'] + .1, TR['turn'] + .4))
        head_tilt = -10
    if moving and t > TL.T0:                                  # rowing
        armR = -40 + 25 * math.sin(t * 4.2); armL = -30 + 25 * math.sin(t * 4.2)
    fr['armR'].rotation_euler = (R(armR), 0, 0); fr['armL'].rotation_euler = (R(armL), 0, 0)
    fr['head'].rotation_euler = (0, R(head_tilt), R(head_yaw + 3 * math.sin(t * 1.3)))

    # lion: lazy idle, tail swish; a big yawn in scene 1 and the finale; sniff and disgust at the cabbage
    lr = rigs['lion']
    yawn = max(math.sin(math.pi * seg(t, *TL.BEATS['lion_yawn'])), math.sin(math.pi * seg(t, *TL.BEATS['yawn2'])))
    c5 = TL.crossing_times(5)
    sniff = math.sin(math.pi * seg(t, c5['unload'] + .9, c5['unload'] + 1.7))
    disgust = ease(seg(t, c5['unload'] + 1.7, c5['unload'] + 2.1)) * (1 - ease(seg(t, c5['unload'] + 3.4, c5['unload'] + 3.9)))
    lr['head'].rotation_euler = (R(-22 * yawn + 20 * sniff), 0, R(-8 * sniff - 55 * disgust + 3 * math.sin(t * .9)))
    lr['tail'].rotation_euler = (R(12 * math.sin(t * 2.3)), 0, R(20 * math.sin(t * 1.7 + 1) + 30 * disgust * math.sin(t * 9)))
    bpy.data.objects['lion_tongue'].hide_render = yawn < .4
    # goat: cheeky head bobs, munching, confusion on the way back, a nuzzle at the end
    gr = rigs['goat']
    munch = (math.sin(t * 9) * .5 + .5) if TR['munch'] <= t < TR['reset'] else 0
    c4 = TL.crossing_times(4)
    confused = math.sin(math.pi * seg(t, c4['push'], c4['push'] + 2.4))
    n0, n1 = TL.BEATS['nuzzle']
    nuzzle = seg(t, n0, n0 + .4) * (1 - seg(t, n1 - .4, n1))
    gr['head'].rotation_euler = (R(35 * munch + 10 * nuzzle * math.sin(t * 7)), R(-25 * confused), R(8 * math.sin(t * 1.9) + 20 * confused))
    gr['tail'].rotation_euler = (R(30 * math.sin(t * 7)), 0, 0)
    if nuzzle > 0:                                           # the goat trots up to Ramkhelawan and rubs against him
        fp = cast['farmer'].location
        g = cast['goat']; tgt = (fp[0] + .55, fp[1] - .3, .12)
        g.location = lerp(tuple(g.location), tgt, ease(seg(t, n0 - .4, n0 + .4))); g.rotation_euler[2] = R(160)

    p, tg, lens = camera_at(t)
    cam.location = p
    cam.rotation_euler = (Vector(tg) - Vector(p)).to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens


def main(first=1, last=int(TL.DUR * TL.FPS)):
    sc, cast, rigs, oar, cam = build()
    objs = [cast[k] for k in cast] + [oar, cam] + [p for r in rigs.values() for p in r.values()] + [bpy.data.objects['lion_tongue']]
    for f in range(first, last + 1, 2):
        t = (f - 1) / TL.FPS
        pose(t, cast, rigs, oar, cam)
        for o in objs:
            o.keyframe_insert('location', frame=f); o.keyframe_insert('rotation_euler', frame=f); o.keyframe_insert('scale', frame=f)
        cam.data.keyframe_insert('lens', frame=f)
        bpy.data.objects['lion_tongue'].keyframe_insert('hide_render', frame=f)
    sc.frame_start, sc.frame_end, sc.frame_step = first, last, 2
    scene.outputs(sc, os.path.join(ROOT, 'build/film') + '/', passes=scene.FILM_PASSES, half=True)
    if os.environ.get('SAVE_BLEND'):
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'build/film.blend'))
    if not os.environ.get('NO_RENDER'):
        bpy.ops.render.render(animation=True)


if __name__ == '__main__':
    a = [int(x) for x in sys.argv[1:3]]
    main(*a) if a else main()
