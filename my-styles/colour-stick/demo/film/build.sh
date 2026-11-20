#!/bin/sh
# Rebuild the Colour Stick Explainer demo film (27.5 s, music + foley, no voice):
#   sh my-styles/colour-stick/demo/film/build.sh        → $OUT/test.mp4 (default: my-styles/colour-stick/out-demo/)
# The scenes come from the film "What if a cat bit you?" (film.js, props.js, timeline.js); demo.js cuts them and adds the ripple.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../../../.." && pwd)}; export LIB
OUT=${OUT:-$(cd "$HERE/../.." && pwd)/out-demo}; export OUT
mkdir -p "$HERE/fonts" "$OUT"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"
cd "$LIB"
node core/render/events.mjs "$HERE" --out "$OUT/events.json"
.venv/bin/python core/audio/sampler.py --need "$HERE/mix.py"
EVENTS="$OUT/events.json" .venv/bin/python "$HERE/mix.py"
node core/render/video.mjs "$HERE" --fps 60 --workers ${WORKERS:-4} --out "$OUT/video.mp4"
FINAL="$OUT/test.mp4" sh "$HERE/master.sh"
