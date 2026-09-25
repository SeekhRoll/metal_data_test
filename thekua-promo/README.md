# ठेकुआ — 30s promo for Dwarka, New Delhi

A vertical (9:16) promo for homemade thekua, made for Instagram Reels, YouTube Shorts and WhatsApp Status and aimed at people living in Dwarka.

| File | Use |
|---|---|
| `output/thekua-promo-dwarka.mp4` | Full quality: 1080×1920, 30 fps, 30 s, H.264 + AAC |
| `output/thekua-promo-dwarka-whatsapp.mp4` | 720p, about 12 MB, for WhatsApp groups and Status |
| `output/poster.jpg` | Thumbnail or cover frame |
| `output/thekua-promo-dwarka-cute.mp4` | **Hand-drawn cut**: the same 30s story as cute, doodled animation |
| `output/thekua-promo-dwarka-cute-whatsapp.mp4` | Hand-drawn cut at 720p, about 12 MB |
| `output/poster-cute.jpg` | Hand-drawn end card |

## Hand-drawn cut (`promo-cute.html` + `soundtrack_cute.py`)

This version uses wobbly ink outlines that are redrawn 8 times a second, crayon-textured pastel fills on paper grain, and kawaii characters. It opens on a doodled Dwarka skyline with a smiling Blue Line metro. A thekua mascot waves hello, and the ingredient friends (the atta sack, jaggery cube, ghee katori, coconut and cardamom with fennel buddies) hop in and dive into the parat. The dough gets squished in the sancha, then the thekuas relax in a kadhai "hot tub" as they turn golden. After a **CRUNCH!**, the promises appear as taped-on sticky notes and a scooter delivers across the Dwarka sectors. It ends with the mascot and a chai cup on the WhatsApp end card. The music is a bouncy marimba, kalimba and dholak track with boings and pops, on the same 120 BPM grid.

## Storyboard (120 BPM, every cut lands on a beat)

| Time | Scene |
|---|---|
| 0–2s | Cold open: a diya lights in the dark. *"Dwarka, कुछ मीठा हो जाए?"* |
| 2–4s | Title hit: **ठेकुआ** in gold foil with a spinning thekua. *बिहार का असली स्वाद, अब आपके द्वारका में* |
| 4–9s | Ingredients, one per second: आटा · गुड़ · देसी घी · नारियल · सौंफ-इलायची |
| 9–10s | Everything swirls into a dough ball: *प्यार से गूँधा* |
| 10–12.5s | Pressed in a wooden sancha: *हाथ से बना, साँचे में ढला* |
| 12.5–15s | Fried in a kadhai, going from raw to golden: *Golden. Crispy. Perfect.* |
| 15–18.5s | Hero shot of a brass thali on a banana leaf, with steam and diyas: *बाहर से कुरकुरा, अंदर से नरम* |
| 18.5–20s | Close-up snap with crumbs flying: *Crrrunch!* |
| 20–25s | Five promises: 100% homemade · pure desi ghee · no preservatives · fresh every week · delivery to Dwarka sectors 1–29 |
| 25–30s | End card with marigold garland, logo and the WhatsApp CTA. *छठ स्पेशल · चाय के साथ परफ़ेक्ट* |

Every visual is drawn in code and the music is an original synthesized bhangra-style track (dhol, tumbi, sitar, shehnai), so there is no stock footage and no licensing to worry about.

## Customize and re-render

1. Edit the top of `promo.html` (or `promo-cute.html`): `BRAND` (currently `Sri Desi Thekua`), `PHONE` (currently `+91 81782 26605`) and `AREA`. The promise claims are in `PROPS`. Change any that don't match your kitchen, such as the "no preservatives" or "fresh every week" cards or the sectors 1–29 delivery area.
2. Open `promo.html` in a browser to see a live, looping preview.
3. Build:

```bash
pip install numpy scipy imageio-ffmpeg     # ffmpeg binary comes with imageio-ffmpeg
npm i -g playwright                        # or use an existing install
python3 soundtrack.py                      # -> build/soundtrack.wav
node render.js                             # -> build/thekua-promo-dwarka.mp4  (~4 min)
node render.js --stills 2.5,16,27          # quick JPG previews of chosen moments

# hand-drawn cut
python3 soundtrack_cute.py                 # -> build/soundtrack_cute.wav
node render.js --page promo-cute.html --audio soundtrack_cute.wav --name thekua-promo-dwarka-cute
```
