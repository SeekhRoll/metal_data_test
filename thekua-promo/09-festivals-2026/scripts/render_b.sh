# Pick, fit, check, render and mix Format B for the given days (their takes must exist).
cd "$(dirname "$0")/.."
B="--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --timeout=120000"
for d in "$@"; do
  ids=$(python3 -c "import json;print(','.join(l['id'] for l in json.load(open('vo/navratri-B.json')) if l['id'].startswith('b$d'+'_')))")
  [ -f assets/vo/$(echo $ids | tr ',' '\n' | tail -1).wav ] || VO_ONLY=$ids python3 scripts/pick_vo.py vo/navratri-B.json > /dev/null 2>&1
  python3 scripts/fit_b.py $d
  npx remotion render src/index.ts NavratriBCheck$d build/checkB$d.mp4 --scale=0.25 $B --log=error || { echo "day $d: text collision FAIL"; exit 1; }
  echo "day $d: check PASS"
  npx remotion render src/index.ts NavratriB$d out/navratri-b$d-silent.mp4 $B --log=error --crf=16 --concurrency=2 && python3 scripts/navratri_b.py $d
done
