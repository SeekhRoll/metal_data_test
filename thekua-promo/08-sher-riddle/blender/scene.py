"""Render setup: Cycles on CPU (no GPU here), warm sun + cool sky fill, and the passes the watercolour post needs:
diffuse colour (flat albedo), diffuse direct light (for 2-3 step toon shading), AO, depth, normals, object index."""
import math

import bpy


def setup(res=(720, 1280), samples=20, transparent=False):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 3
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.film_transparent = transparent
    sc.render.filter_size = 1.0
    sc.view_settings.view_transform = 'Standard'
    # light: warm low sun with soft long shadows, cool sky fill
    sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 4.2; sun.angle = math.radians(6); sun.color = (1.0, .9, .74)
    so = bpy.data.objects.new('sun', sun); bpy.context.collection.objects.link(so)
    so.rotation_euler = (math.radians(52), math.radians(8), math.radians(-38))
    w = bpy.data.worlds.new('sky'); w.use_nodes = True; sc.world = w
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (.55, .72, .95, 1)
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = .9
    vl = sc.view_layers[0]
    vl.use_pass_diffuse_color = True; vl.use_pass_diffuse_direct = True; vl.use_pass_diffuse_indirect = True
    vl.use_pass_ambient_occlusion = True; vl.use_pass_z = True; vl.use_pass_normal = True; vl.use_pass_object_index = True
    return sc


def outputs(sc, directory):
    """Compositor: write each pass as its own float EXR (<pass>_####.exr) for the post-process."""
    sc.use_nodes = True
    nt = sc.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    rl = nt.nodes.new('CompositorNodeRLayers')
    fo = nt.nodes.new('CompositorNodeOutputFile'); fo.base_path = directory
    fo.format.file_format = 'OPEN_EXR'; fo.format.color_depth = '32'; fo.format.exr_codec = 'ZIP'
    fo.file_slots.clear()
    for name in ('Image', 'DiffCol', 'DiffDir', 'DiffInd', 'AO', 'Depth', 'Normal', 'IndexOB'):
        fo.file_slots.new(name + '_')
        nt.links.new(rl.outputs[name], fo.inputs[name + '_'])
    comp = nt.nodes.new('CompositorNodeComposite'); nt.links.new(rl.outputs['Image'], comp.inputs['Image'])


def camera(loc, target, lens=50):
    from mathutils import Vector
    cam = bpy.data.cameras.new('cam'); cam.lens = lens
    co = bpy.data.objects.new('cam', cam); bpy.context.collection.objects.link(co)
    co.location = loc
    d = Vector(target) - Vector(loc)
    co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = co
    return co
