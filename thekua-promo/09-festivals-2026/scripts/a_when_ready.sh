# For each day with a story built, wait for its A takes, then pick, fit, check, render and mix.
cd "$(dirname "$0")/.."
B="--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --timeout=120000"
for d in "$@"; do
  n=$(python3 -c "import json;print(len(json.load(open('vo/navratri-A$d.json'))))")
  until [ "$(ls assets/vo/takes | grep -c "^a${d}_")" -ge $((n * 2)) ]; do sleep 30; done
  # skip picking when every line already has a picked take (e.g. after a machine restart)
  [ "$(ls assets/vo | grep -c "^a${d}_.*\.wav$")" -ge "$n" ] || python3 scripts/pick_vo.py vo/navratri-A$d.json > /dev/null 2>&1
  python3 scripts/fit_a.py $d
  npx remotion render src/index.ts NavratriACheck$d build/checkA$d.mp4 --scale=0.25 $B --log=error || { echo "day $d: text collision FAIL"; exit 1; }
  echo "day $d: check PASS"
  npx remotion render src/index.ts NavratriA$d out/navratri-a$d-silent.mp4 $B --log=error --crf=16 --concurrency=2 && python3 scripts/navratri_a.py $d
done
