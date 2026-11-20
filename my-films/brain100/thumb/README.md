# Thumbnails

`thumb.js` draws two YouTube thumbnails with the film's own code (it loads after `../film/film.js`), at 1920×1080, exported at 1280×720:
`?v=a` → `../thumbnail-1-crash.jpg` (recommended), `?v=b` → `../thumbnail-2-we-need-to-talk.jpg`.

```sh
node core/render/still.mjs my-films/brain100/thumb 0 --q v=a --prefix a- --out my-films/brain100/thumb/out
```
