# What if you became a zombie… but never lost your mind?

Curious Mind · *What if?* Episode 2. A 10:40 YouTube film in my style **Colour Stick Explainer v2** ([`my-styles/colour-stick`](../../my-styles/colour-stick/STYLE.md)), English narration and subtitles, 1920×1080, 60 fps, 120 scenes, channel watermark ([`brand/curious-mind`](../../brand/curious-mind/README.md)).

A young man eats a slice of mouldy bread at midnight. A fictional fungus inspired by Cordyceps spreads through his body over seven days, taking his muscles one by one but never his mind. A "control room" inside his head shows the fight: a little him at a desk of levers (ARM L, ARM R, LEGS, MOUTH) while orange threads take them over. At the end his sister Mia, his best friend Leo and an armed survivor find him. He tries to say he is still himself; his mouth won't work and his arm attacks on its own. They see a monster and leave. He watches.

| Path | What it is |
|---|---|
| `what-if-you-became-a-zombie.mp4` | the finished film, with the channel watermark |
| `what-if-you-became-a-zombie.srt` | English subtitles |
| `what-if-you-became-a-zombie-poster.jpg` | poster frame |
| `thumbnail-a.jpg` / `thumbnail-b.jpg` | YouTube thumbnails, 1280×720 (source in `thumb/`) |
| `YOUTUBE.md` | title, description with chapters, tags |
| `TREATMENT.md` | structure, characters, expression and lighting rules, environments used |
| `STORYBOARD.md` | the 120 scenes: action, expression, camera, environment, light, objects, transition, sound |
| `zombie-intro.mp4` / `intro/` | the title sequence (scene 012) on its own, and its code |
| `voice/` | script (`lines.json`): 6 narration lines (Kokoro `am_puck`) and 13 short dialogue lines |
| `film/` | the film as code: `lib.js` (people, light, camera), `sets.js` (environments, control room, body diagram), `a1.js`–`a8.js` (the eight acts), `timeline.py`, `mix.py`, `master.sh` |

Rebuild: `sh my-films/zombie/intro/build.sh && sh my-films/zombie/film/build.sh` (needs the library tiers `deps voice music`).

Environments are only the ones the style and Meow Man already had (house and garden, kitchen, bathroom, bedroom, living room, café, desk, boxes, TV news), re-dressed with props and light.
