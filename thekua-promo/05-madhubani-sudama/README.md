# सुदामा की पोटली: Madhubani story series, Episode 1

This is a 60 s, 9:16, 24 fps story film sponsored by Sri Desi Thekua. It is built with **Remotion (React + SVG)** following the brief.

## Status

- ✅ Style sheet and character sheets approved (Krishna's depiction approved; the wife is named Susheela).
- ✅ All 8 scenes built and keyframes checked against §3.2 and §3.3 (`stills/keyframes/`).
- ✅ Original folk score (sitar, dholak, bansuri, tanpura) composed and timed to the scenes: `assets/music/music.wav`. It's royalty-free because it was written for this film.
- ✅ Burned-in Devanagari subtitles and `assets/subtitles/subs.srt`.
- ✅ End card in the style of the Sri Desi Thekua box sticker (cream, maroon, gold, "Cookies (Crunchy)", veg mark), inside the Madhubani frame.
- ⏳ **Voice-over.** A soothing, erudite female narrator will be generated with AI4Bharat Indic Parler-TTS (Apache-2.0), which needs network access to `huggingface.co`. Once that's allowed, run `pip install parler-tts soundfile && python3 scripts/vo.py && python3 scripts/mix.py`. Each line is placed on its subtitle cue and the music ducks under the voice.

### Output
| File | |
|---|---|
| `output/sudama-ki-potli.mp4` | 1080×1920, 24 fps, exactly 60 s |
| `output/sudama-ki-potli-whatsapp.mp4` | 720p copy for WhatsApp |
| `output/poster.jpg` | end-card frame |

### How the motion follows the brief (§3.3)
- **On twos everywhere.** `Film.tsx` samples every scene at `frame - frame % 2`, and the line boil re-seeds every 2 frames.
- **Replacement drawings.** Poses are swapped, never rotated at a joint. Sudama's 4-drawing walk holds each drawing for 6 frames, which is one step per beat of the dholak. Krishna's run alternates two drawings every 4 frames, and Susheela's tying alternates two drawings.
- **Eased timing with slight overshoot** (`anim.ts → back()`) for blooms, reveals and props. Nothing moves linearly.
- **Stroke-draw reveals** for the border and title, **pattern blooms** from the embrace and the doorway, and **three-layer parallax** in the journey (sky, world, then foreground vines and lotuses).
- **Idle life:** blinks, diya flames, swimming fish, swaying toran and vines, flapping birds, waving flags.

## Layout

```
src/styles/      palette.ts (pigment tokens), filters.tsx (paper, pigment, line-boil filters), paint.tsx (Bharni, Line, tube/lens helpers), fonts.ts
src/motifs/      Fish, Lotus, LotusTop, Peacock, Sun, Vine, Wave, Bamboo
src/borders/     MadhubaniBorder (paints itself on with a `draw` 0..1 prop)
src/characters/  parts.tsx (profile head, hands, feet, garments, potli, flute, Figure)
                 Sudama/ Wife/ Krishna/ poses.tsx: each export is one drawing (replacement animation, no joint rigs)
src/sheets/      StyleSheet, CharacterSheet (review compositions)
src/film/        timeline.ts (scene windows + subtitle cues), anim.ts, Frame.tsx, Film.tsx, scenes/S1_S4.tsx, scenes/S5_S8.tsx
scripts/         stills.mjs, keyframes.mjs, render.mjs, music.py, vo.py, mix.py
stills/          review renders
```

## Commands

```bash
npm install
npm run studio              # Remotion Studio preview
node scripts/stills.mjs     # re-render all review stills into stills/
node scripts/keyframes.mjs 9 17 26.5   # film keyframes into stills/keyframes/
python3 scripts/music.py    # original score -> assets/music/music.wav
node scripts/render.mjs     # silent film -> out/film-silent.mp4
python3 scripts/vo.py       # (needs huggingface.co) narration -> assets/vo/
python3 scripts/mix.py      # subtitles .srt, VO placement + ducking, FFmpeg mux -> output/
```

`scripts/stills.mjs` points Remotion at the Chromium headless shell that ships with Playwright, so nothing needs downloading.
