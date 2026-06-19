# Video assets

Drop the hero background video here:

| File | Used for | Notes |
|------|----------|-------|
| `hero.mp4` | Hero background loop | Muted, looping, autoplaying. Lazy-loaded after first paint. |

Keep it lean — this is a background video on phones. Aim for:
- H.264 MP4, 1080p (or 720p), no audio track
- A few seconds, seamless loop
- Ideally under ~3–5 MB

Until this file exists, the hero shows `/img/hero-poster.jpg` (or a styled
gradient if that's also missing). Nothing breaks.
