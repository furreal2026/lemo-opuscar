#!/bin/sh
# Rebuild "What if you became a zombie… but never lost your mind?":  sh my-films/zombie/film/build.sh
# Needs: sh plugin/skills/lemo-opuscar/scripts/setup.sh deps voice music ; the title sequence first: sh my-films/zombie/intro/build.sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}; export LIB
mkdir -p "$HERE/fonts" "$HERE/out"
[ -f "$HERE/fonts/Jost.ttf" ] || curl -sfL -o "$HERE/fonts/Jost.ttf" "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"
cd "$LIB"
[ -f "$HERE/../voice/out/n6.wav" ] || .venv/bin/python core/tts/tts.py "$HERE/../voice/lines.json" "$HERE/../voice/out"
.venv/bin/python core/tts/asr_check.py "$HERE/../voice/lines.json" "$HERE/../voice/out" --lang en
python3 "$HERE/timeline.py"
node core/render/events.mjs "$HERE"
.venv/bin/python core/audio/sampler.py --need "$HERE/mix.py"
.venv/bin/python "$HERE/mix.py"
.venv/bin/python core/render/srt.py "$HERE/cues.json" "$HERE/../what-if-you-became-a-zombie.srt"
node core/render/video.mjs "$HERE" --fps 60 --workers ${WORKERS:-6} --out "$HERE/out/video.mp4"
sh "$HERE/master.sh"
