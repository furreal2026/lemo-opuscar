# Colour Stick Explainer: demo

One example among many. Don't reuse its story, arc, shots, props or timings.

Status: style frames and storyboard only. The demo film (15–30 s) is added once the first film, *What if a cat bit you?* (Meow Man), is produced.

## What is here

- `styleframe.jpg`: the approved style frame (the jump, 0–10 m ruler, detailed house).
- `styleframe-vs-base.jpg`: the same frame in the base style (left) and this style (right).
- `demo/stills/`: model sheet (`k1`), eight storyboard frames (`s1`–`s8`) and the tiled `storyboard.jpg`.

## Palette & props

Paper #F3F0EA, ink #24242C, mute #9C978C, tint #E2DDD2, ginger #F28C28 (power), red #E0402A (limit). Flat fills: sky #A9D8EC, grass #93C86E, wall #F6D47E, roof #D65A3C, blue #4F86D1, box #C99A62, plus detail tones in `scenes2.js` (`C2`).
Props: 6 px ink outline, 3 px detail lines, flat fill. Transformed figure (Meow Man): ginger head, ears, whiskers, tail. The cat is a prop and may have a face.

## Which file draws what

- `demo/index.html`: paper, skeleton (`joints`), figure drawer (`figure`), Meow Man (`catman`), the cat (`cat`), helpers (`shape`, `poly`, `line`, `subtitle`, `label`), model sheet `k1`. `?mono=1` renders the base look for comparison.
- `demo/scenes2.js`: detailed props (`houseD`, `tree`, `fence`, `box`, `bedroom`, desk, TV, mirror) and the storyboard scenes `s1`–`s8`.
- `demo/png.mjs`: one still: `node my-styles/colour-stick/demo/png.mjs s5 out.png [mono]`.
- `demo/build.sh`: rebuilds all stills.
