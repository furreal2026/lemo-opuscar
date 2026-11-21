#!/bin/sh
# Splice the title sequence (../intro) into scene 012, master the mix (two-pass loudnorm, ffmpeg 6), mux, add the channel watermark.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); O="$HERE/out"; LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}
F="$HERE/../what-if-you-became-a-zombie.mp4"
T0=$(python3 -c "import json;T=json.load(open('$HERE/timeline.json'));print([s for s in T['scenes'] if s['id']=='012'][0]['t0'])")
ffmpeg -hide_banner -loglevel error -y -i "$O/video.mp4" -itsoffset "$T0" -i "$HERE/../intro/out/video.mp4" \
  -filter_complex "[0:v][1:v]overlay=0:0:eof_action=pass:enable='between(t,$T0,$T0+14)'[v]" -map "[v]" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$O/spliced.mp4"
A="$O/mix.wav"
J=$(ffmpeg -hide_banner -i "$A" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$A" -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ar 48000 "$O/master.wav"
VD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$O/spliced.mp4")
ffmpeg -hide_banner -loglevel error -y -i "$O/spliced.mp4" -i "$O/master.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t "$VD" -movflags +faststart "$O/muxed.mp4"
sh "$LIB/brand/curious-mind/add-watermark.sh" "$O/muxed.mp4" "$F"
ffmpeg -hide_banner -i "$F" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:"
echo "→ $F"
