# What if you used 100% of your brain?

Colour Stick Explainer v2, English, 1920×1080, 60 fps, 11:16. Narrator Kokoro `am_puck` (fast, speed 1.25). Curious Mind watermark, top centre.

| Path | What it is |
|---|---|
| `SCRIPT.md` | the user's narration |
| `TREATMENT.md` | structure, colour meaning, cast, transitions |
| `storyboard/storyboard.jpg` | 34 frames with timings, camera and transitions |
| `storyboard/transition_notif_zoom.mp4` | 3.2 s motion test of the notification zoom (`?scene=tz`) |
| `storyboard/frames/` | the same frames full size, watermarked |
| `voice/` | narration lines (`lines.json`, Kokoro `am_puck`, speed 1.25) and the recorded WAVs + word times |
| `film/` | the film as code: `index.html` + `film.js` (scenes) + `timeline.py` (from the voice) + `mix.py` (score, foley, voice) + `master.sh` (loudness, watermark) |
| `what-if-you-used-100-of-your-brain.mp4` | the finished film (11:16), Curious Mind watermark burnt in |
| `what-if-you-used-100-of-your-brain.srt` | English subtitles |
| `preview/brain100_hook_ch1_preview.mp4` | the earlier preview: Hook + Chapter 1 |
| `look/` | the frames as code: `index.html` (engine from Meow Man) + `props.js` + `inkstyle.js` + `chars.js` (cast, shared props) + `board.js` (frames) |

Rebuild the frames and the sheet (from the library root):
```sh
for s in b01 b01z b02 b03 b04 b04n b04z b05 b05p b05c b06 b06z b07e b08 b09 b09a b10 b10z b11 b12 b12q b13 b14 b14n b15 b16 b16p b16r b17 b17n b17m b18 b18a b18e; do node core/render/still.mjs my-films/brain100/look 0 --q scene=$s --prefix $s- --out my-films/brain100/look/out; done
(cd my-films/brain100 && python3 storyboard/make_sheet.py)
```
`look/fonts/Jost.ttf` (OFL) is downloaded, not committed: `curl -sfL -o my-films/brain100/look/fonts/Jost.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"`.

Build the preview (from the library root; needs `setup.sh deps voice music`):
```sh
P=my-films/brain100/film
python3 $P/timeline.py && node core/render/events.mjs $P --q to=139 && .venv/bin/python $P/mix.py
node core/render/video.mjs $P --fps 60 --workers 4 --q to=139 --out $P/out/video.mp4
sh $P/master.sh my-films/brain100/preview/brain100_hook_ch1_preview.mp4
```

Build the whole film (from the library root):
```sh
P=my-films/brain100/film
python3 $P/timeline.py && node core/render/events.mjs $P && .venv/bin/python $P/mix.py
.venv/bin/python core/render/srt.py $P/cues.json my-films/brain100/what-if-you-used-100-of-your-brain.srt
node core/render/video.mjs $P --fps 60 --workers 6 --out $P/out/video.mp4
sh $P/master.sh my-films/brain100/what-if-you-used-100-of-your-brain.mp4
```

Camera comfort rules used throughout: fast pushes ≤ 0.4 s, always followed by a ≥ 0.8 s hold; rotation ≤ 1.5°; never two fast moves in a row; zooms into and out of a point stay anchored on it (no sideways swing). Subtitles: ≤ 47 characters per cue, measured on screen and shrunk if they would ever pass 1640 px.
