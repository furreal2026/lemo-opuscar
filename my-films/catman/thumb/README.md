# Thumbnails

`thumb.js` draws two YouTube thumbnails with the film's own code (it loads after `../film/film.js`):
`?v=a` → `thumbnail-1-bite.jpg` (recommended), `?v=b` → `thumbnail-cat-powers.jpg`. Both are drawn at 1920×1080 and exported at 1280×720.

To re-render, copy `../film/` into a folder with this `thumb.js`, add `<script src="thumb.js"></script>` after `film.js` in `index.html`, then run:
`node core/render/still.mjs <folder> 0 --q v=a`
