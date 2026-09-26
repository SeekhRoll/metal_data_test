"""The cast, modelled in code as chunky painted-clay toys (brief §5.2). Every builder returns a root empty at the
character's feet, facing -Y (toward the camera). Pass indices label object regions for the watercolour post
(pigment pools at region edges, ink lines along them) and for the text-collision check (§6)."""
import math

from mathutils import Vector
from toolkit import mat, checker_mat, sphere, cone, cyl, tube, blob, empty, eye

# palette (brief §5.3): cadmium yellow, ultramarine, turquoise, sap green, rose madder, burnt sienna
SKIN, DHOTI, VEST, HAIR = '#C27A4B', '#F4EEDD', '#EDE4CC', '#1E1814'
ID = {'farmer': 10, 'lion': 30, 'goat': 50, 'cabbage': 70, 'boat': 80, 'islandL': 90, 'islandR': 110, 'river': 1}


def farmer(loc=(0, 0, 0), name='ram'):
    r = empty(name, loc)
    i = ID['farmer']
    skin = mat('skin', SKIN)
    for sx in (-1, 1):
        sphere(f'{name}_foot{sx}', (sx * .11, -.06, .045), (.075, .13, .05), skin, i, r)
        tube(f'{name}_leg{sx}', [(sx * .11, 0, .06), (sx * .115, 0, .3), (sx * .12, 0, .5)], .055, skin, i, r)
    cone(f'{name}_dhoti', (0, 0, .62), .34, .25, .56, mat('dhoti', DHOTI), i + 1, r)
    cyl(f'{name}_border', (0, 0, .365), .335, .05, mat('border', '#C8412B'), i + 1, r)
    sphere(f'{name}_torso', (0, 0, 1.04), (.3, .24, .36), mat('vest', VEST), i + 2, r)
    sphere(f'{name}_belly', (0, -.09, .93), .21, mat('vest', VEST), i + 2, r)
    for sx in (-1, 1):
        tube(f'{name}_arm{sx}', [(sx * .3, 0, 1.24), (sx * .38, -.02, 1.02), (sx * .4, -.06, .82)], .065, skin, i, r)
        sphere(f'{name}_hand{sx}', (sx * .4, -.07, .77), .08, skin, i, r)
    # gamchha: red-and-white checks, over the left shoulder and down the front
    tube(f'{name}_gamchha', [(-.3, .05, 1.3), (-.12, -.2, 1.38), (.12, -.2, 1.36), (.3, -.08, 1.26), (.33, -.1, 1.0), (.33, -.12, .84)], .055,
         checker_mat('gamchha', '#D23A2A', '#F8F2E4', 14), i + 3, r)
    # the big head
    sphere(f'{name}_head', (0, 0, 1.64), (.31, .29, .31), skin, i + 4, r)
    sphere(f'{name}_hair', (0, .04, 1.72), (.315, .29, .25), mat('hair', HAIR), i + 5, r)
    for sx in (-1, 1): sphere(f'{name}_ear{sx}', (sx * .3, 0, 1.63), (.05, .04, .08), skin, i + 4, r)
    sphere(f'{name}_nose', (0, -.3, 1.6), (.07, .07, .075), skin, i + 4, r)
    for sx in (-1, 1):
        eye(f'{name}_eye{sx}', (sx * .105, -.245, 1.7), .058, i + 6, r)
        tube(f'{name}_brow{sx}', [(sx * .04, -.28, 1.79), (sx * .1, -.29, 1.81), (sx * .17, -.26, 1.79)], .022, mat('hair', HAIR), i + 5, r)
        # the big moustache: thick, curling up at the ends
        tube(f'{name}_mush{sx}', [(sx * .015, -.315, 1.55), (sx * .1, -.31, 1.535), (sx * .2, -.28, 1.55), (sx * .27, -.24, 1.6), (sx * .29, -.22, 1.65)], .034,
             mat('hair', HAIR), i + 5, r, taper=[1.1, 1.25, 1, .6, .3])
    tube(f'{name}_smile', [(-.08, -.27, 1.46), (0, -.29, 1.43), (.08, -.27, 1.46)], .016, mat('mouth', '#7A2320'), i + 6, r)
    sphere(f'{name}_tilak', (0, -.28, 1.86), (.02, .01, .035), mat('tilak', '#D8392A'), i + 6, r)
    return r


def lion(loc=(0, 0, 0), name='lion'):
    r = empty(name, loc)
    i = ID['lion']
    fur, mane, muz = mat('lfur', '#E3A53C'), mat('lmane', '#B4561D'), mat('lmuz', '#F6E6C4')
    sphere(f'{name}_body', (0, .05, .55), (.58, .34, .34), fur, i, r)
    for sx, sy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        tube(f'{name}_leg{sx}{sy}', [(sx * .36, sy * .14 + .05, .45), (sx * .38, sy * .15 + .05, .12)], .1, fur, i, r)
        sphere(f'{name}_paw{sx}{sy}', (sx * .38, sy * .15 - .02, .07), (.12, .14, .07), fur, i, r)
    # lazy tail with a tuft
    tube(f'{name}_tail', [(-.55, .08, .6), (-.8, .12, .55), (-.95, .1, .75), (-.92, .02, .95)], .045, fur, i, r)
    blob(f'{name}_tuft', [((-.92, .0, 1.0), .16), ((-.95, .05, 1.06), .12)], mane, i + 1, r)
    # the big mane: a ring of puffs around the face, fuller at the back
    hx, hz = .55, .95
    balls = [((hx + .08, .08, hz), .42)]
    for k in range(14):
        a = k / 14 * math.tau
        balls.append(((hx + math.cos(a) * .33, .0 + .05, hz + math.sin(a) * .33), .24))
    blob(f'{name}_mane', balls, mane, i + 1, r, res=.05)
    sphere(f'{name}_head', (hx, -.14, hz), (.27, .24, .26), fur, i + 2, r)
    for sx in (-1, 1):
        sphere(f'{name}_ear{sx}', (hx + sx * .2, -.08, hz + .24), (.08, .05, .08), fur, i + 2, r)
        sphere(f'{name}_muz{sx}', (hx + sx * .075, -.34, hz - .09), .1, muz, i + 3, r)
        eye(f'{name}_eye{sx}', (hx + sx * .1, -.33, hz + .06), .055, i + 4, r, look=(0, -1, -.1), lid=.42, lid_col='#E3A53C')
    sphere(f'{name}_nose', (hx, -.41, hz - .02), (.07, .05, .05), mat('lnose', '#5A2A1C'), i + 4, r)
    sphere(f'{name}_chin', (hx, -.3, hz - .19), (.08, .06, .05), muz, i + 3, r)
    tube(f'{name}_smirk', [(hx - .06, -.42, hz - .14), (hx + .02, -.43, hz - .15), (hx + .09, -.41, hz - .11)], .012, mat('mouth', '#7A2320'), i + 4, r)
    return r


def goat(loc=(0, 0, 0), name='goat'):
    r = empty(name, loc)
    i = ID['goat']
    wool, patch = mat('gwool', '#F3EEE2'), mat('gpatch', '#9A5B34')
    sphere(f'{name}_body', (0, .03, .48), (.36, .2, .22), wool, i, r)
    sphere(f'{name}_patch', (-.12, -.06, .56), (.14, .14, .12), patch, i + 1, r)
    for sx, sy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        tube(f'{name}_leg{sx}{sy}', [(sx * .22, sy * .09 + .03, .4), (sx * .23, sy * .09 + .03, .06)], .042, wool, i, r)
        sphere(f'{name}_hoof{sx}{sy}', (sx * .23, sy * .09 + .02, .03), (.05, .06, .035), mat('hoof', '#3B2A22'), i + 1, r)
    tube(f'{name}_tail', [(-.34, .03, .56), (-.42, .03, .66)], .035, wool, i, r)
    # head up and cheeky
    tube(f'{name}_neck', [(.26, 0, .56), (.34, -.04, .72)], .09, wool, i, r)
    sphere(f'{name}_head', (.38, -.08, .82), (.15, .13, .15), wool, i + 2, r)
    sphere(f'{name}_snout', (.42, -.2, .76), (.09, .08, .075), wool, i + 2, r)
    cone(f'{name}_beard', (.42, -.2, .63), .045, .005, .14, patch, i + 1, r, rot=(math.pi, 0, 0))
    for sx in (-1, 1):
        sphere(f'{name}_ear{sx}', (.38 + sx * .15, -.05, .84), (.1, .035, .045), wool, i + 2, r, rot=(0, sx * .5, 0))
        tube(f'{name}_horn{sx}', [(.38 + sx * .05, -.02, .94), (.38 + sx * .08, .03, 1.03), (.38 + sx * .06, .1, 1.07)], .025, mat('horn', '#D9C39A'), i + 1, r, taper=[1, .7, .3])
        eye(f'{name}_eye{sx}', (.38 + sx * .065, -.2, .86), .04, i + 3, r, look=(sx * .3, -1, 0))
    sphere(f'{name}_nose', (.42, -.28, .77), (.03, .015, .02), mat('pupil', '#15110E'), i + 3, r)
    tube(f'{name}_grin', [(.37, -.27, .72), (.42, -.285, .705), (.47, -.27, .72)], .01, mat('mouth', '#7A2320'), i + 3, r)
    return r


def cabbage(loc=(0, 0, 0), name='cabbage'):
    r = empty(name, loc)
    i = ID['cabbage']
    sphere(f'{name}_heart', (0, 0, .3), (.27, .27, .26), mat('cab1', '#B7DE72'), i, r)
    # outer leaves wrap the head from below, their tips curling out; veins pale
    for k in range(10):
        a = k / 10 * math.tau + (k % 2) * .3
        rr, z = (.2, .2) if k % 2 else (.16, .27)
        sphere(f'{name}_leaf{k}', (math.cos(a) * rr, math.sin(a) * rr, z), (.24, .09, .2), mat('cab2' if k % 2 else 'cab3', '#62AE36' if k % 2 else '#7DC24A'), i + 1, r,
               rot=(math.radians(35 if k % 2 else 20), 0, a + math.pi / 2))
        tube(f'{name}_vein{k}', [(math.cos(a) * .12, math.sin(a) * .12, .06), (math.cos(a) * (rr + .09), math.sin(a) * (rr + .09), z), (math.cos(a) * (rr + .06), math.sin(a) * (rr + .06), z + .16)], .011, mat('cabv', '#E3F2B8'), i + 2, r)
    return r


def boat(loc=(0, 0, 0), name='boat'):
    import bmesh, bpy
    r = empty(name, loc)
    i = ID['boat']
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 0, .32), segments=40, ring_count=20)
    h = bpy.context.active_object; h.name = f'{name}_hull'
    bm = bmesh.new(); bm.from_mesh(h.data)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z > 0.05], context='VERTS')
    bm.to_mesh(h.data); bm.free()
    h.scale = (1.35, .5, .34)
    sol = h.modifiers.new('solid', 'SOLIDIFY'); sol.thickness = .06
    from toolkit import _finish
    wood = mat('wood', '#B67B40')
    nt = wood.node_tree
    wave = nt.nodes.new('ShaderNodeTexWave'); wave.wave_type = 'BANDS'; wave.bands_direction = 'Z'; wave.inputs['Scale'].default_value = 3.5
    ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = (.36, .16, .05, 1); ramp.color_ramp.elements[1].color = (.52, .27, .1, 1)
    nt.links.new(wave.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])
    _finish(h, wood, i, r)
    rim = [(math.cos(a) * 1.35, math.sin(a) * .5, .35) for a in [k / 24 * math.tau for k in range(25)]]
    tube(f'{name}_rim', rim, .035, mat('rim', '#5A3417'), i + 1, r)
    cyl(f'{name}_seat', (0, 0, .22), .06, .95, mat('rim', '#5A3417'), i + 1, r, rot=(math.pi / 2, 0, 0))
    tube(f'{name}_oar', [(.3, .1, .4), (.9, .75, .1), (1.2, 1.05, -.1)], .025, mat('oar', '#C08A4A'), i + 2, r)
    sphere(f'{name}_blade', (1.25, 1.1, -.12), (.22, .06, .1), mat('oar', '#C08A4A'), i + 2, r, rot=(0, 0, math.radians(45)))
    return r


def palm(loc, h=2.2, lean=.3, name='palm', pid=100, parent=None):
    r = empty(name, loc, parent)
    pts = [(0, 0, 0), (lean * .3, 0, h * .4), (lean * .75, 0, h * .75), (lean, 0, h)]
    tube(f'{name}_trunk', pts, .09, mat('trunk', '#9B6B3E'), pid, r, taper=[1.4, 1.1, .9, .8])
    for k in range(7):
        a = k / 7 * math.tau
        tip = (lean + math.cos(a) * .9, math.sin(a) * .9, h - .35)
        mid = (lean + math.cos(a) * .5, math.sin(a) * .5, h + .12)
        tube(f'{name}_frond{k}', [(lean, 0, h), mid, tip], .09, mat('frond' + str(k % 2), '#3E9A3C' if k % 2 else '#62B845'), pid + 1, r, taper=[.6, 1, .15])
    for k in range(3):
        sphere(f'{name}_coco{k}', (lean + (k - 1) * .09, -.06, h - .12), .07, mat('coco', '#6B4A1F'), pid + 2, r)
    return r


def island(loc=(0, 0, 0), name='island', pid=90, flip=False):
    r = empty(name, loc)
    sphere(f'{name}_sand', (0, 0, -.12), (2.0, 1.45, .32), mat('sand', '#EBCB8B'), pid, r, seg=48)
    sphere(f'{name}_grass', (0, .08, .02), (1.75, 1.25, .2), mat('grass', '#5FAF3A'), pid + 1, r, seg=48)
    palm((1.1 if not flip else -1.1, .7, .1), 2.3, .35 if not flip else -.35, f'{name}_palm', pid + 3, r)
    palm((-1.3 if not flip else 1.3, .9, .1), 1.7, -.25 if not flip else .25, f'{name}_palm2', pid + 3, r)
    for k in range(10):
        a = k * 2.4
        x, y = math.cos(a) * (1.0 + (k % 3) * .2), math.sin(a) * .8
        for j in range(3):
            cone(f'{name}_tuft{k}_{j}', (x + (j - 1) * .04, y, .2), .035, .0, .22, mat('tuft', '#3F8F2A' if j % 2 else '#7CC24E'), pid + 2, r, rot=(0, (j - 1) * .35, 0))
    return r
