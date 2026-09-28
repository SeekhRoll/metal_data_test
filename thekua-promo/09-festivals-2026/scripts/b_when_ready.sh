# Render Format B for each remaining day as soon as that day's takes exist (2 per line).
cd "$(dirname "$0")/.."
for d in ${@:-2 3 4 5 6 7 8 9}; do
  n=$(python3 -c "import json;print(sum(1 for l in json.load(open('vo/navratri-B.json')) if l['id'].startswith('b$d'+'_')))")
  until [ "$(ls assets/vo/takes | grep -c "^b${d}_")" -ge $((n * 2)) ]; do sleep 30; done
  scripts/render_b.sh $d
done
