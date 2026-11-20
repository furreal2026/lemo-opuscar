#!/bin/sh
# Burn the Curious Mind watermark into a video, top centre.
#   sh brand/curious-mind/add-watermark.sh in.mp4 out.mp4
# Size scales with the frame width (293 px wide at 1920, 26 px from the top); audio is copied unchanged.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
IN="$1"; OUT="$2"; [ -n "$IN" ] && [ -n "$OUT" ] || { echo "usage: add-watermark.sh in.mp4 out.mp4"; exit 2; }
VW=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$IN")
VH=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$IN")
WW=$(( VW * 293 / 1920 / 2 * 2 )); WH=$(( WW * 120 / 586 / 2 * 2 )); WY=$(( VH * 26 / 1080 ))
ffmpeg -hide_banner -loglevel error -y -i "$IN" -i "$HERE/curious-mind-watermark@2x.png" \
  -filter_complex "[1]scale=${WW}:${WH}:flags=lanczos[wm];[0][wm]overlay=x=(W-w)/2:y=${WY}:format=auto[v]" \
  -map "[v]" -map 0:a? -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT"
echo "→ $OUT"
