# गिलहरी का योगदान: Chhaya Katha (shadow-puppet series), Episode 1

This is a 60 s, 9:16, 24 fps Tholu Bommalata (Andhra leather shadow puppetry) story film, sponsored by Sri Desi Thekua. It is built with **Remotion + SVG** following the brief.

## Status: waiting for stage and puppet approval (brief §3.5, steps 1–2)

| Still | What to review |
|---|---|
| `stills/StageSheet.png` | Lamp-lit cloth screen (weave, stains, uneven brightness, hot spot), carved frame, base panel with the subtitle text zone, depth system (pressed = sharp; pulled back = larger, blurred, dimmer) |
| `stills/HeroesSheet.png` | Ram (blue-green, tall crown, bow and quiver), Lakshman (golden, crown, bow), Hanuman (mace, curled tail, crown) |
| `stills/VanarSheet.png` | Generic monkey, laughing monkey, the palm squirrel without and with its three glowing stripes |
| `stills/PropsSheet.png` | Title placard (letters cut through), rock carved with "राम", wave, wooden sancha, thekua-making hands (open / pinch), thekua on a thaali |

Next, after approval: the rig test (a walk, and a swing with pendulum settle), then each scene with keyframes and the text-collision check, then assembly.

## How the look is built
- **Leather** (`src/stage/leather.tsx`): each piece is a dyed fill at partial opacity with a multiply blend over the glowing cloth, and its thicker edge reads darker. The punched holes (dots, slits, rosettes, even lettering) are masked out and bloom where the lamp shines through.
- **Rigs** (`src/stage/rig.tsx`): hierarchical parts with pivots at visible rivets. Forward kinematics puts each control rod exactly on a hand or the back, and rods run off the bottom of the screen.
- **Stage** (`src/stage/Stage.tsx`): the screen fills the upper 78%. The lamp flickers with low-frequency noise, about ±6%, with occasional gutters. All text lives in `TEXT_ZONES` on the base panel.

```bash
npm install
node scripts/stills.mjs      # re-render the review stills
```
