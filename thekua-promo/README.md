# Sri Desi Thekua: 30-second promos for Dwarka

These are vertical (9:16) promos for homemade thekua, sized for Instagram Reels, YouTube Shorts and WhatsApp Status and aimed at people who live in Dwarka, New Delhi. Each concept has its own folder:

| Folder | Concept | Look & feel |
|---|---|---|
| [`01-cinematic/`](01-cinematic) | Premium product film | Dark wood, gold foil type, diya light, bhangra dhol track |
| [`02-hand-drawn/`](02-hand-drawn) | Cute doodle animation | Wobbly ink lines, pastel crayon, kawaii characters, bouncy marimba |
| [`03-ghar-ki-mithas/`](03-ghar-ki-mithas) | "घर की मिठास" (the sweetness of home) | Vivid flat illustration, one continuous shot through family life, bansuri and santoor |

Every concept folder has the same layout:

```
<concept>/
  promo.html        the animation (open it in a browser for a live, looping preview)
  soundtrack.py     original synthesized music, timed to the scene cuts
  output/
    promo.mp4           1080×1920, 30 fps, 30 s, H.264 + AAC
    promo-whatsapp.mp4  720p, about 12 MB, for WhatsApp groups and Status
    poster.jpg          cover or thumbnail frame
```

Every visual is drawn in code and all music is synthesized from scratch, so there is no stock footage or music licensing to worry about.

## 03: घर की मिठास

The film follows one thekua in a single unbroken camera move. The camera flies through windows and screens instead of cutting.

| Time | Scene | Words on screen |
|---|---|---|
| 0–4.8s | Dawn kitchen. Nani presses a thekua in the sancha and it floats up into the window… | कुछ स्वाद सिर्फ़ स्वाद नहीं होते… |
| 4.8–9.6s | …which *is* the Chhath ghat at sunrise. The thekua lands in a mother's soop and the camera dives into it… | वो दुआ होते हैं, |
| 9.6–14.4s | …and comes out of mom's tiffin in a hostel room at night ("खाना टाइम पे खाना — माँ ♥"). The student video-calls home and the camera flies into the phone… | घर की याद होते हैं, |
| 14.4–19.2s | …to the family on a rainy evening: Dadaji dunks thekua in chai, the kids grab from the plate, and the cat naps on the sill. The camera pulls back out through the window… | सबका साथ होते हैं… |
| 19.2–24s | …to the whole building at dusk. Neighbours share with a basket on a rope, and the camera rises past kites and sky lanterns… | हर घर में, हर त्योहार में |
| 24–30s | …to the thekua glowing like the sun, with the brand and WhatsApp CTA. | घर की मिठास, आपके घर तक |

The music is at 100 BPM, with each scene lasting exactly two bars. It uses santoor arpeggios over a D–A–Bm–G progression, a bansuri melody and soft tabla that grows into dholak and claps for the family scene. There's a temple bell when the thekua lands in the soop and a rain bed at home.

## Customize and re-render

1. Each `promo.html` has `BRAND`, `PHONE` and `AREA` at the top (currently `Sri Desi Thekua`, `+91 81782 26605` and Dwarka, New Delhi). Change any promise that doesn't match your kitchen. In 01 these are in `PROPS`, and in 02 they're in `NOTES`: the no-preservatives, fresh-every-week and sectors 1–29 delivery claims.
2. Build (run from this folder):

```bash
pip install numpy scipy imageio-ffmpeg     # ffmpeg binary comes with imageio-ffmpeg
npm i -g playwright                        # or use an existing install

python3 03-ghar-ki-mithas/soundtrack.py    # -> 03-ghar-ki-mithas/build/soundtrack.wav
node render.js 03-ghar-ki-mithas           # -> 03-ghar-ki-mithas/output/{promo.mp4, promo-whatsapp.mp4, poster.jpg}
node render.js 03-ghar-ki-mithas --stills 4.4,9.5,14   # quick JPG previews in <concept>/build/
```

To start a new concept, copy a concept folder to a new number (for example `04-…`), edit its `promo.html` and `soundtrack.py`, and run the same two commands. Shared fonts live in `fonts/`.
