#!/bin/sh
# Rebuild the style frames of Colour Stick Explainer:  sh my-styles/colour-stick/demo/build.sh
# Needs the library's core packages (sh plugin/skills/lemo-opuscar/scripts/setup.sh deps).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}
OUT=${OUT:-$HERE/../out}
mkdir -p "$HERE/fonts" "$OUT"
# Jost (OFL) from github.com/google/fonts, not committed
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"
for s in k1 s1 s2 s3 s4 s5 s6 s7 s8; do LIB="$LIB" node "$HERE/png.mjs" "$s" "$OUT/$s.png"; done
LIB="$LIB" node "$HERE/png.mjs" s5 "$OUT/s5_base.png" mono
echo "stills in $OUT"
