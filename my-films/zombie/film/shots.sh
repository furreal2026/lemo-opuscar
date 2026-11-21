#!/bin/sh
# Review stills: sh shots.sh out.jpg 001:2 003:1.5 ...   (scene:local seconds)
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=$(cd "$HERE/../../.." && pwd); OUT=$1; shift
TS=$(python3 -c "
import json,sys; T=json.load(open('$HERE/timeline.json')); S={s['id']:s for s in T['scenes']}
print(' '.join('%.3f'%(S[a.split(':')[0]]['t0']+float(a.split(':')[1])) for a in sys.argv[1:]))" "$@")
rm -rf "$HERE/stills"; cd "$LIB"; node core/render/still.mjs "$HERE" $TS --out "$HERE/stills" 2>&1 | grep -iv "webgl\|^my-films" || true
.venv/bin/python core/render/sheet.py "$OUT" $(for t in $TS; do echo "$HERE/stills/t_$t.jpg"; done) --cols ${COLS:-3} --w ${SW:-640} | tail -1
