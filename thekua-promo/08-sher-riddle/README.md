# ई गया हमरा शेर! (The Lion, the Goat and the Cabbage)

A standalone riddle video, about 90 s long, vertical 1080×1920 at 24 fps. Ramkhelawan must ferry a lion, a goat and a cabbage across the river, taking only one at a time. It's built as 3D animation in Blender, then post-processed into a vibrant watercolour painting.

## Status: character turnarounds awaiting approval (brief §5.5, step 1)

The stills are `stills/turn-*.jpg`, covering Ramkhelawan, the lion, the goat, the cabbage, the boat and an island, each shown front, three-quarter, side and back.

## Pipeline

| Stage | Code |
|---|---|
| Characters, built in code as chunky clay toys | `blender/characters.py` (primitives, bevelled curves, metaballs), `blender/toolkit.py` |
| Rendering | `blender/scene.py`, which uses Cycles on the CPU (headless Blender through the `bpy` wheel; there is no GPU). It writes these passes as EXR: diffuse colour, diffuse direct and indirect, AO, depth, normals and object index |
| Watercolour | `post/watercolor.py` (described below) |
| Turnaround sheets | `blender/turnaround.py` renders the views, then `post/sheets.py` paints and labels them |

`post/watercolor.py` paints each frame in these steps:
1. Boosts the flat colour and simplifies it with a Kuwahara filter.
2. Lets the colour bleed a few pixels past the forms (wet edges).
3. Lays transparent washes of uneven density, so darks stay dark.
4. Pools pigment along the edges of each object-ID region.
5. Paints the toon light steps as two hard-edged, wobbling shadow glazes in cool ultramarine.
6. Adds blooms (backruns).
7. Adds granulation.
8. Lets white paper show through the highlights.
9. Draws a loose sepia ink line from ID, depth and crease edges, offset and wobbling off the fills.
10. Lays cold-press paper over everything, fixed to the frame.

Noise is re-seeded every 2 frames with a cross-fade, giving a gentle boil.

Grease Pencil Line Art needs a GPU renderer, which this environment lacks. The ink line is therefore drawn in post from the object-ID and depth passes instead.
