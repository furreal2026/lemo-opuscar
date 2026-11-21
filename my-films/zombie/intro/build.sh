#!/bin/sh
# Rebuild the title sequence: sh my-films/zombie/intro/build.sh   (needs setup.sh deps music)
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}; export LIB
mkdir -p "$HERE/fonts" "$HERE/out"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"
cd "$LIB"
node core/render/events.mjs "$HERE"
.venv/bin/python "$HERE/mix.py"
node core/render/video.mjs "$HERE" --fps 60 --workers ${WORKERS:-4} --out "$HERE/out/video.mp4"
sh "$HERE/master.sh"
sh "$LIB/brand/curious-mind/add-watermark.sh" "$HERE/../zombie-intro.mp4" "$HERE/out/wm.mp4" && mv "$HERE/out/wm.mp4" "$HERE/../zombie-intro.mp4"
