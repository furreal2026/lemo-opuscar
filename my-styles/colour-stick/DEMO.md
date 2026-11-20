# Colour Stick Explainer: demo

One example among many. Don't reuse its story, arc, shots, props or timings.

Demo: `test.mp4` (27.5 s, 1920×1080, 60 fps, music and foley, no voice, no subtitles) · poster `test.jpg` · source in [`demo/film/`](demo/film/)

## Story & structure

Five moments cut on the beat from the film *What if a cat bit you?* ([`my-films/catman`](../../my-films/catman/README.md)), then one new closing shot.

| # | Demo time | Shot | Shows (CHANGES.md row) |
|---|---|---|---|
| 1 | 0–4.5 | The bite: a guy reaches for Mr. Biscuits on a pink cushion, blue rug, framed fish picture, food bowl. CHOMP | flat-colour world; detailed props; the cat is a prop with a face |
| 2 | 4.5–9 | The mirror: ears spring out, the head turns ginger, whiskers, then the tail | the transformed figure (ears, tail, whiskers in the power colour) |
| 3 | 9–13 | The jump: ruler 0–10 m, a detailed house (roof tiles, chimney, siding, window panes), a ginger dashed arc to the roof, "5×" in ginger | the power colour; detailed props |
| 4 | 13–16.5 | The desk: one finger, the boss's mug falls, NOOO in red | red only for a limit; detailed props (monitor, keyboard, drawers, plant) |
| 5 | 16.5–20.5 | The box in a sunbeam, "12–16 hours" in red, the TV switches on | flat fills, red for the limit |
| 6 | 20.5–27.5 | **The ripple** (native move): nine people on a system line; a ginger pulse runs both ways from Meow Man, each person jumps and gains ears, head, whiskers and tail as it arrives, then all turn to face him. "One bite. / Everyone's a cat." | the native move; the power colour as one meaning |

Camera: push in to the bite; push in on the mirror; the ripple opens close on Meow Man (1.3×) and pulls back as the pulse spreads (one case becomes many). Every cut lands on a beat (120 bpm).

## Score

F major, 120 bpm, 2 s bars: pizzicato double bass on 1 and 3, staccato bassoon on 2 and 4, marimba broken chords in eighths. A glockenspiel tick on each cut, a real silence before the CHOMP and before the mug breaks, a vibraphone sting on the bite and the falling bassoon on the crash. In the ripple, one glockenspiel note per person reached, climbing F G A C D F; a harp sweep as everyone turns; a closing vibraphone chord as the frame fades to paper. Foley from `core/audio/sfx.py` (chomp, boing, whoosh, crash, TV static). −14 LUFS, true peak −1.1 dBTP.

## Palette & props

Paper #F3F0EA, ink #24242C, mute #9C978C, tint #E2DDD2, ginger #F28C28 (power), red #E0402A (limit). Flat fills: sky #A9D8EC, grass #93C86E, wall #F6D47E, roof #D65A3C, blue #4F86D1, box #C99A62, plus the detail tones in `props.js` (`C2`).
Props: 6 px ink outline, 3 px detail lines, flat fill. Meow Man: ginger head, ears, whiskers and tail (`catK` in `film.js`, each part on its own spring). The cat is a prop and may have a face.

## Build notes

- `sh my-styles/colour-stick/demo/film/build.sh`: events → score and foley (`mix.py`) → picture at 60 fps (~1 min with 4 workers) → master (`master.sh`, two-pass loudnorm on the system ffmpeg). Everything it writes goes to `$OUT` (default `my-styles/colour-stick/out-demo/`).
- `demo/film/demo.js`: the cut list (`SEG`), the ripple (`ripple`), the demo's events. It reuses `film.js` (scenes, `catK`, motion helpers), `props.js` (houses, desks, boxes, bedrooms, TV) and `timeline.js` from the film.
- `demo/index.html` + `demo/scenes2.js`: the style frames, model sheet and storyboard stills (`demo/build.sh`).
- Pitfalls met: draw ears before the head disc; keep the camera zoom small where a title sits beside the world (a 1.5× zoom pushed the house under the text column); fade titles when the camera drifts towards a screen.
