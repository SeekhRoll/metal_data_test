"""Contact sheet of keyframe stills: python3 scripts/sheet.py out.jpg k1.jpg k2.jpg ..."""
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
W, H = 360, 640
sheet = Image.new("RGB", (W * min(len(files), 6), H * ((len(files) + 5) // 6)), "black")
for i, f in enumerate(files):
    im = Image.open(f).resize((W, H))
    ImageDraw.Draw(im).text((8, 8), f.split("k-")[-1][:-4] + "s", fill="white")
    sheet.paste(im, ((i % 6) * W, (i // 6) * H))
sheet.save(out, quality=85)
