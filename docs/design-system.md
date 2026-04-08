# Motion Design System

The motion design system provides structured recommendations for video aesthetics.
It mirrors the approach of ui-ux-pro-max-skill but is adapted for **animated video**
rather than static UI.

## Core Concepts

### Motion Tokens

Every video uses a set of motion tokens that define its kinetic personality:

```json
{
  "duration": "fast | normal | slow",
  "easing": "power2.out | power3.inOut | elastic.out | bounce.out | expo.out",
  "stagger": 0.05 - 0.2,
  "rhythm": "upbeat | calm | dramatic | playful | corporate",
  "intensity": "subtle | moderate | high"
}
```

| Token | Fast | Normal | Slow |
|-------|------|--------|------|
| Scene duration | 2-4s | 4-8s | 8-15s |
| Element entry | 200-400ms | 400-800ms | 800-1200ms |
| Stagger delay | 0.03-0.06s | 0.06-0.12s | 0.12-0.2s |
| Transition | 300-500ms | 500-800ms | 800-1500ms |

### Easing Guide

| Easing | Mood | Use For |
|--------|------|---------|
| `power2.out` | Professional, smooth | Default for most elements |
| `power3.inOut` | Elegant, deliberate | Scene transitions, hero text |
| `elastic.out` | Playful, bouncy | Icons, badges, social content |
| `bounce.out` | Fun, energetic | Counters, notifications |
| `expo.out` | Dramatic, impactful | Title reveals, key moments |
| `linear` | Mechanical, continuous | Progress bars, tickers |

## Design System Search

When a user requests a video, search across these dimensions:

1. **Motion Style** — `data/motion-styles.json` (40+ styles)
2. **Color Palette** — `data/palettes.json` (industry-specific)
3. **Typography** — `data/typography.json` (font pairings for video)
4. **Scene Template** — `data/scene-templates.json` (layout patterns)
5. **Reasoning Rules** — `data/reasoning-rules.json` (industry logic)

### Search Algorithm

```
INPUT: user request keywords + target platform + content type

FOR EACH dimension:
  1. Tokenize input into keywords
  2. Match against "keywords" and "bestFor" fields in JSON data
  3. Score by BM25-style relevance
  4. Return top 3 matches per dimension

OUTPUT: Complete Motion Design System recommendation
```

Alternatively, run `scripts/search.py`:

```bash
python scripts/search.py "tech product launch vertical short" --design-system
```

## Motion Styles Overview

Styles are categorized by primary use case:

### Content / Storytelling
- Cinematic — slow, dramatic, film-grain
- Documentary — steady, informative, clean
- Parallax Depth — layered, immersive, 2.5D
- Storytelling Flow — sequential, narrative, guided

### Social / Short-form
- Kinetic Typography — text-driven, bold, rhythmic
- Social Punch — fast cuts, bold colors, high energy
- Meme Style — quick, irreverent, bold text overlays
- Vertical Snap — optimized for 9:16, swipe-native

### Data / Education
- Data Story — chart builds, number counters, clean
- Infographic Motion — icon-driven, structured, clear
- Tutorial Step — numbered, progressive, focused
- Whiteboard — hand-drawn feel, progressive reveal

### Marketing / Product
- Product Showcase — floating product, subtle rotation
- Minimal Motion — restrained, elegant, premium feel
- Neon Pulse — dark background, glowing accents
- Gradient Flow — smooth color transitions, modern

### Creative / Artistic
- Glitch — digital artifacts, RGB split, distortion
- Comic / Manga — panels, speech bubbles, action lines
- Retro VHS — scan lines, tracking errors, warm tones
- Organic Flow — fluid shapes, natural movement

See `data/motion-styles.json` for the full catalog with parameters.

## Color Palette Selection

Palettes are chosen based on:
1. **Industry** — tech=blue/purple, health=green/white, food=warm/orange
2. **Mood** — energetic=vibrant saturated, calm=muted pastels, dramatic=dark+accent
3. **Platform** — small screens need higher contrast, dark backgrounds work well vertical

Rules:
- Always define: primary, secondary, accent, background, text colors
- Maintain contrast ratio >= 4.5:1 for text
- Limit to 3-4 colors per scene (plus white/black)
- Use accent color sparingly for emphasis

See `data/palettes.json` for the full catalog.

## Typography for Video

Video typography differs from web typography:
- **Readability at speed** — viewers see text briefly, must read instantly
- **Motion safety** — some fonts break down when animated quickly
- **Hierarchy** — title/subtitle/body must be instantly distinguishable
- **Weight** — prefer bold/semibold for titles, regular for body

Rules:
- Max 2 font families per video
- Title size >= 48px at 1080p, body >= 24px
- Monospace for code snippets only
- Chinese/CJK: use Noto Sans SC, Source Han Sans, or PingFang SC
- Line height >= 1.4 for subtitle readability

See `data/typography.json` for curated pairings.

## Anti-patterns

| Anti-pattern | Why It's Bad | Fix |
|-------------|-------------|-----|
| Simultaneous text + image + icon animation | Visual overload | Stagger entries, max 3 concurrent |
| Flash/strobe > 3Hz | Seizure risk, accessibility | Slow down or remove |
| Low contrast text on video background | Unreadable | Add semi-transparent backdrop |
| Mismatched audio-visual rhythm | Feels jarring | Sync animation beats to audio |
| Generic stock imagery | Feels cheap | Use purposeful, on-topic assets |
| Too many words on screen | Can't read in time | Max 15 words, 5s minimum |
| Inconsistent easing | Feels chaotic | One easing family per video |
| No safe zone on vertical | Text cut by UI | 10% margin on all edges |
