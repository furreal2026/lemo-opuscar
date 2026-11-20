#!/bin/sh
# Rebuild "What if a cat bit you?":  sh my-films/catman/film/build.sh   (from anywhere)
# Needs: sh plugin/skills/lemo-opuscar/scripts/setup.sh deps voice music
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}; export LIB
mkdir -p "$HERE/fonts" "$HERE/out"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"
cd "$LIB"
# voice (only if missing) + speech check
[ -f "$HERE/../voice/out/l27.wav" ] || .venv/bin/python core/tts/tts.py "$HERE/../voice/lines.json" "$HERE/../voice/out"
.venv/bin/python core/tts/asr_check.py "$HERE/../voice/lines.json" "$HERE/../voice/out" --lang en
python3 "$HERE/timeline.py"
node core/render/events.mjs "$HERE"
.venv/bin/python core/audio/sampler.py --need "$HERE/mix.py"
.venv/bin/python "$HERE/mix.py"
.venv/bin/python core/render/srt.py "$HERE/cues.json" "$HERE/../what-if-a-cat-bit-you.srt"
node core/render/video.mjs "$HERE" --fps 60 --workers ${WORKERS:-4} --out "$HERE/out/video.mp4"
sh "$HERE/master.sh"
