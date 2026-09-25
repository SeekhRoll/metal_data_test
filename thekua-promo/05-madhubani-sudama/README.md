# सुदामा की पोटली: Madhubani story series, Episode 1

This is a 60 s, 9:16, 24 fps story film sponsored by Sri Desi Thekua. It is built with **Remotion (React + SVG)** following the brief.

## Status: waiting for style and character approval (brief §3.4, steps 1–2)

| Still | What to review |
|---|---|
| `stills/StyleSheet.png` | Palette tokens, bharni fill (double ink line + kachni hatching), single-line style, motif library (fish, lotus, peacock, sun, bamboo, vine, water), border |
| `stills/SudamaSheet.png` | 8 drawings: sitting, the 4-drawing walk cycle, hiding the potli, the embrace, walking home |
| `stills/WifeSheet.png` | 4 drawings: tying the potli (A/B), handing it over, farewell |
| `stills/KrishnaSheet.png` | 6 drawings: with flute, running A/B, the embrace, pulling the potli, eating chivda |

No scene animation is built until these are approved.

## Layout

```
src/styles/      palette.ts (pigment tokens), filters.tsx (paper, pigment, line-boil filters), paint.tsx (Bharni, Line, tube/lens helpers), fonts.ts
src/motifs/      Fish, Lotus, LotusTop, Peacock, Sun, Vine, Wave, Bamboo
src/borders/     MadhubaniBorder (paints itself on with a `draw` 0..1 prop)
src/characters/  parts.tsx (profile head, hands, feet, garments, potli, flute, Figure)
                 Sudama/ Wife/ Krishna/ poses.tsx: each export is one drawing (replacement animation, no joint rigs)
src/sheets/      StyleSheet, CharacterSheet (review compositions)
stills/          review renders
```

## Commands

```bash
npm install
npm run studio              # Remotion Studio preview
node scripts/stills.mjs     # re-render all review stills into stills/
```

`scripts/stills.mjs` points Remotion at the Chromium headless shell that ships with Playwright, so nothing needs downloading.
