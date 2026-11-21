#!/bin/sh
# Master with the system ffmpeg (6.x): two-pass loudnorm to -14 LUFS / -1.5 dBTP, then mux.
# (core/render/mux.sh wants ffmpeg 7+; this does the same steps and checks the audio length itself.)
set -e
HERE=$(cd "$(dirname "$0")" && pwd); O="$HERE/out"
V="$O/video.mp4"; A="$O/mix.wav"; F="$HERE/../zombie-intro.mp4"
J=$(ffmpeg -hide_banner -i "$A" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$A" -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -ar 48000 "$O/master.wav"
VD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
AD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$O/master.wav")
echo "video $VD s  audio $AD s"
awk -v a="$AD" -v v="$VD" 'BEGIN{ if (a < v - 0.5) { print "audio shorter than picture"; exit 1 } }'
ffmpeg -hide_banner -loglevel error -y -i "$V" -i "$O/master.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t "$VD" -movflags +faststart "$F"
ffmpeg -hide_banner -i "$F" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:" 
echo "→ $F"
