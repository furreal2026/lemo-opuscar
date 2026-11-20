# What if a cat bit you? (Meow Man)

A 2:59 YouTube explainer in my style **Colour Stick Explainer** ([`my-styles/colour-stick`](../../my-styles/colour-stick/STYLE.md)), English, 1920×1080, 60 fps.

A guy gets bitten by a cat and gains cat powers (night vision, landing on his feet, a 9 m jump, super hearing, reflexes fast enough to steal a burger from his arch-enemy Dr. Woof in 30 ms). His weakness: a red laser dot, and no focus. Then the cat habits (knocking things off edges, no sweet taste, 16 hours of sleep). Amazing powers, terrible schedule.

| Path | What it is |
|---|---|
| `what-if-a-cat-bit-you.mp4` | the finished film, with the channel watermark ([`brand/curious-mind`](../../brand/curious-mind/README.md)) |
| `what-if-a-cat-bit-you.srt` | English subtitles |
| `what-if-a-cat-bit-you-poster.jpg` | poster frame |
| `thumbnail-1-bite.jpg` / `thumbnail-cat-powers.jpg` | YouTube thumbnails, 1280×720 (source in `thumb/`) |
| `TREATMENT.md` | structure and storyboard notes |
| `storyboard/storyboard.jpg` | the 8 key shots |
| `voice/` | script (`lines.json`) and narration (Kokoro `am_puck`), word timings |
| `film/` | the film as code: `index.html` + `props.js` (props) + `film.js` (scenes) + `timeline.js` (from `timeline.py`), score and mix (`mix.py`), mastering (`master.sh`) |

Rebuild everything: `sh my-films/catman/film/build.sh` (needs the library tiers `deps voice music`).

Facts used: cat reaction time 20–70 ms vs ~250 ms for humans; cats chase small fast things (laser pointers); cats see in about 1/6 of the light we need (tapetum lucidum); the righting reflex; jumps up to ~5× body height; hearing to ~64 kHz vs ~20 kHz for humans; the sweet-taste receptor gene (Tas1r2) is broken in cats; cats sleep 12–16 h a day.
