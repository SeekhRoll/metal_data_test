# Check and render all nine Format C greetings, then mux the shehnai/bell track.
cd "$(dirname "$0")/.."
B="--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --timeout=120000"
for d in ${@:-1 2 3 4 5 6 7 8 9}; do
  npx remotion render src/index.ts NavratriCCheck$d build/checkC$d.mp4 --scale=0.25 $B --log=error || { echo "day $d: text collision FAIL"; exit 1; }
  echo "day $d: check PASS"
  npx remotion render src/index.ts NavratriC$d out/navratri-c$d-silent.mp4 $B --log=error --crf=16 --concurrency=2 && python3 scripts/navratri_c.py mux $d
done
