# एकता का जाल (The Net of Unity): Gond Katha, Episode 1

A 60 s vertical (1080×1920, 24 fps) story film for Sri Desi Thekua, inspired by the Gond art of Madhya Pradesh.
It tells the Panchatantra story of Chitragreeva, king of the pigeons, who leads his flock out of a hunter's net, and
his friend Hiranyaka the mouse, who frees them. The moral is "संघे शक्तिः कलौ युगे": in this age, strength lies in
togetherness. Built with Remotion (React + SVG).

## Status: style and character sheets awaiting approval (brief §3.4, steps 1–2)

| Still | What it shows |
|---|---|
| `stills/StyleSheet.png` | Palette, the six-pattern library (dots, dashes, fish scales, seeds, chevrons, arcs), black outline with white inner line, contour bands, the outline→colour→pattern reveal, and the paper and night grounds |
| `stills/PigeonSheet.png` | Chitragreeva (larger, crest, patterned collar), his four wing drawings, and six flock pigeons, one per pattern |
| `stills/CastSheet.png` | The hunter (standing, scattering grain, crouching), Hiranyaka the mouse, and the family around a thaali of thekua with chai |
| `stills/TreeSheet.png` | The banyan growing from a seed (Scene 1), and the full tree with aerial roots |

## How the Gond look is built

- `src/style/gond.tsx` draws every figure in layers:
  - a flat fill;
  - an inner fill pattern;
  - **contour bands** that follow the outline inward (solid rings, dashes, dots and seeds);
  - a thin white inner line;
  - a bold black outline.
- Patterns are live: a time value moves the dash offsets and the dot positions along the contour, so dots travel along the lines. A pulse value sizes the motifs, which drives the idle, panic, unity and bloom states.
- `reveal` (0–3) draws the outline first, then the flat colour, then grows the patterns inward from the edges.
- `src/style/texture.tsx` adds canvas grain and slightly uneven paint density.

Credit line for captions: *inspired by Gond art of Madhya Pradesh*.
