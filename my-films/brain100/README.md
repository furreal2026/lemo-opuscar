# What if you used 100% of your brain? (in progress)

Colour Stick Explainer v2, English, 1920×1080, ~9:00. Narrator Kokoro `am_puck` (fast, speed 1.25). Curious Mind watermark, top centre.

| Path | What it is |
|---|---|
| `SCRIPT.md` | the user's narration |
| `TREATMENT.md` | structure, colour meaning, cast, transitions |
| `storyboard/storyboard.jpg` | 34 frames with timings, camera and transitions |
| `storyboard/transition_notif_zoom.mp4` | 3.2 s motion test of the notification zoom (`?scene=tz`) |
| `storyboard/frames/` | the same frames full size, watermarked |
| `look/` | the frames as code: `index.html` (engine from Meow Man) + `props.js` + `inkstyle.js` + `chars.js` (cast, shared props) + `board.js` (frames) |

Rebuild the frames and the sheet (from the library root):
```sh
for s in b01 b01z b02 b03 b04 b04n b04z b05 b05p b05c b06 b06z b07e b08 b09 b09a b10 b10z b11 b12 b12q b13 b14 b14n b15 b16 b16p b16r b17 b17n b17m b18 b18a b18e; do node core/render/still.mjs my-films/brain100/look 0 --q scene=$s --prefix $s- --out my-films/brain100/look/out; done
(cd my-films/brain100 && python3 storyboard/make_sheet.py)
```
`look/fonts/Jost.ttf` (OFL) is downloaded, not committed: `curl -sfL -o my-films/brain100/look/fonts/Jost.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"`.
