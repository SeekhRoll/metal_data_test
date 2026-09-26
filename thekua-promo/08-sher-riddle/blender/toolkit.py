"""Small helpers for building chunky, toy-like characters from primitives in Blender (bpy, headless)."""
import math

import bpy
from mathutils import Vector


def reset():
    _mats.clear()
    bpy.ops.wm.read_factory_settings(use_empty=True)


_mats = {}


def mat(name, rgb, rough=1.0):
    """A matte, flat-ish material. Colours are sRGB hex strings or 0-1 tuples."""
    key = (name, rgb)
    if key in _mats:
        return _mats[key]
    if isinstance(rgb, str):
        h = rgb.lstrip('#'); rgb = tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = tuple((c / 12.92) if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb)
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*lin, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Specular IOR Level'].default_value = 0.15
    _mats[key] = m
    return m


def checker_mat(name, a, b, scale=6.0):
    m = mat(name, a)
    nt = m.node_tree
    ck = nt.nodes.new('ShaderNodeTexChecker'); ck.inputs['Scale'].default_value = scale
    def lin(h):
        h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
        return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1,)
    ck.inputs['Color1'].default_value = lin(a); ck.inputs['Color2'].default_value = lin(b)
    nt.links.new(ck.outputs['Color'], nt.nodes['Principled BSDF'].inputs['Base Color'])
    return m


def _finish(ob, material, pid, parent, smooth=True, sub=0):
    if material is not None:
        ob.data.materials.append(material)
    ob.pass_index = pid
    if parent is not None:
        ob.parent = parent
    if smooth and ob.type == 'MESH':
        for p in ob.data.polygons: p.use_smooth = True
    if sub:
        m = ob.modifiers.new('sub', 'SUBSURF'); m.levels = sub; m.render_levels = sub
    return ob


def sphere(name, loc, scale, material, pid, parent=None, rot=(0, 0, 0), seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=loc, segments=seg, ring_count=seg // 2, rotation=rot)
    ob = bpy.context.active_object; ob.name = name
    ob.scale = scale if isinstance(scale, (tuple, list)) else (scale, scale, scale)
    return _finish(ob, material, pid, parent)


def cone(name, loc, r1, r2, depth, material, pid, parent=None, rot=(0, 0, 0), verts=32):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, radius2=r2, depth=depth, location=loc, rotation=rot, vertices=verts)
    ob = bpy.context.active_object; ob.name = name
    return _finish(ob, material, pid, parent)


def cyl(name, loc, r, depth, material, pid, parent=None, rot=(0, 0, 0), verts=32):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    ob = bpy.context.active_object; ob.name = name
    return _finish(ob, material, pid, parent)


def tube(name, pts, radius, material, pid, parent=None, taper=None, res=12):
    """A smooth tube along points (a bevelled Bezier curve): limbs, tails, moustaches, palm trunks."""
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'
    cu.bevel_depth = radius; cu.bevel_resolution = 6; cu.resolution_u = res; cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    if taper:
        for bp, r in zip(sp.bezier_points, taper): bp.radius = r
    ob = bpy.data.objects.new(name, cu); bpy.context.collection.objects.link(ob)
    return _finish(ob, material, pid, parent, smooth=False)


def blob(name, balls, material, pid, parent=None, res=0.06):
    """Metaball cluster (manes, wool, cabbage leaves). balls: [(loc, radius)]."""
    mb = bpy.data.metaballs.new(name); mb.resolution = res; mb.render_resolution = res * .6
    for loc, r in balls:
        e = mb.elements.new(); e.co = loc; e.radius = r
    ob = bpy.data.objects.new(name, mb); bpy.context.collection.objects.link(ob)
    return _finish(ob, material, pid, parent, smooth=False)


def empty(name, loc=(0, 0, 0), parent=None):
    ob = bpy.data.objects.new(name, None); ob.location = loc; bpy.context.collection.objects.link(ob)
    if parent is not None: ob.parent = parent
    return ob


def eye(name, loc, r, pid, parent, look=(0, -1, 0), lid=0.0, lid_col='#B8744A'):
    """A toy eye: white ball, black pupil pushed toward `look`, optional heavy lid (lazy / smug)."""
    w = sphere(name + '_w', loc, r, mat('eyeW', '#FFFDF6'), pid, parent)
    lv = Vector(look).normalized()
    sphere(name + '_p', Vector(loc) + lv * r * .72, r * .45, mat('pupil', '#15110E'), pid, parent)
    sphere(name + '_hl', Vector(loc) + lv * r * .92 + Vector((.3, 0, .35)) * r * .5, r * .12, mat('eyeW', '#FFFDF6'), pid, parent)
    if lid > 0:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r * 1.08, location=loc, segments=24, ring_count=12)
        L = bpy.context.active_object; L.name = name + '_lid'
        # keep only the upper cap: delete verts below the lid line
        import bmesh
        bm = bmesh.new(); bm.from_mesh(L.data)
        cut = 1 - 2 * lid
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < cut * r * 1.08], context='VERTS')
        bm.to_mesh(L.data); bm.free()
        _finish(L, mat('lid' + lid_col, lid_col), pid, parent)
    return w


def look_at(ob, target):
    d = Vector(target) - ob.location
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
