# What if you used 100% of your brain? (in progress)

Colour Stick Explainer v2, English, 1920×1080, ~9:00. Narrator Kokoro `am_puck` (fast, speed 1.25). Curious Mind watermark, top centre.

| Path | What it is |
|---|---|
| `SCRIPT.md` | the user's narration |
| `TREATMENT.md` | structure, colour meaning, cast, transitions |
| `storyboard/storyboard.jpg` | 19 key frames with timings, camera and transitions |
| `storyboard/frames/` | the same frames full size, watermarked |
| `look/` | the frames as code: `index.html` (engine from Meow Man) + `props.js` + `inkstyle.js` + `chars.js` (cast, shared props) + `board.js` (frames) |

Rebuild the frames and the sheet (from the library root):
```sh
for s in b01 b02 b03 b04 b05 b06 b07e b08 b09 b10 b11 b12 b13 b14 b15 b16 b17 b17n b18; do node core/render/still.mjs my-films/brain100/look 0 --q scene=$s --prefix $s- --out my-films/brain100/look/out; done
(cd my-films/brain100 && python3 storyboard/make_sheet.py)
```
`look/fonts/Jost.ttf` (OFL) is downloaded, not committed: `curl -sfL -o my-films/brain100/look/fonts/Jost.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"`.
