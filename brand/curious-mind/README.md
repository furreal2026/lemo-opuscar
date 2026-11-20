# Curious Mind: channel watermark

A text wordmark for every *What if* video on the channel. It matches the Colour Stick Explainer look: Jost SemiBold in wide-tracked capitals (like the style's small labels), ink #24242C on paper #F3F0EA, a 3 px ink pill outline with a faint inner line, and one orange (#F28C28) dot between the words.

| File | Use |
|---|---|
| `curious-mind-watermark.svg` | vector master (Jost subset embedded, so it renders the same anywhere) |
| `curious-mind-watermark@2x.png` | 586 × 120, transparent: overlay source for 1080p and 4K |
| `curious-mind-watermark.png` | 293 × 60, transparent: 1080p at 1:1 |
| `add-watermark.sh` | burns it into a video, top centre |

**Placement:** top centre, 293 px wide on a 1920 px frame, 26 px from the top (scale both with the frame). Keep the top 100 px of every scene free of important content.

```sh
sh brand/curious-mind/add-watermark.sh film.mp4 film-watermarked.mp4
```

Font: Jost (SIL Open Font License 1.1), subset to the letters used.
