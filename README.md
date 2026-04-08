# Pro Video Maker

AI-powered programmatic video generation using **Remotion**, **GSAP**, and **D3.js**. Features a director-driven production pipeline and a growing **material library** for low-code assembly — describe what you want, and the system scripts, decomposes, matches, assembles, and renders a finished video.

## Key Features

- **Director-driven pipeline** — 5-phase workflow from script writing to final render
- **Material library** — 35+ reusable blocks, 8 style presets, 6 composition templates
- **DSL fast path** — when every scene maps to an existing block, a single JSON spec drives the entire video with zero code generation
- **Multi-platform output** — TikTok/Douyin (9:16), YouTube/Bilibili (16:9), Instagram (1:1), Xiaohongshu (3:4), or custom dimensions
- **Context-aware matching** — blocks and styles are scored against mood, industry, platform, and content type to find the best fit automatically
- **Self-growing library** — new blocks created during a project can be saved back for future reuse

## Tech Stack

| Technology | Role |
|---|---|
| [Remotion](https://www.remotion.dev/) | Core video renderer (React, frame-driven) |
| [GSAP](https://gsap.com/) | Complex animation timelines |
| [D3.js](https://d3js.org/) | Data visualization animation |
| [Zod](https://zod.dev/) | Props validation for Remotion visual editing |
| [Lucide React](https://lucide.dev/) | SVG icon system |
| TypeScript | Strict-mode throughout |

## Project Structure

```
pro-video-maker/
├── SKILL.md                        # Skill definition & pipeline instructions
├── data/                           # Design tokens & preset databases
│   ├── effects.json                #   30+ effect presets
│   ├── transitions.json            #   30+ transition presets
│   ├── palettes.json               #   Color palette collection
│   ├── typography.json             #   Font combination presets
│   ├── motion-styles.json          #   Motion easing/timing tokens
│   ├── scene-templates.json        #   Scene type → block category mapping
│   └── reasoning-rules.json        #   AI decision heuristics
├── docs/                           # Reference documentation
│   ├── workflow.md                 #   Full pipeline walkthrough
│   ├── material-library.md         #   Library structure & usage
│   ├── material-matching.md        #   Context matching algorithm
│   ├── design-system.md            #   Motion design system
│   ├── dsl-spec.md                 #   DSL specification
│   ├── transitions.md              #   Transition catalog
│   ├── effects.md                  #   Effect catalog
│   ├── subtitles.md                #   Subtitle generation & styling
│   ├── assets.md                   #   Asset sourcing guide
│   └── tts.md                      #   Text-to-speech integration (planned)
├── material-library/               # Persistent reusable material collection
│   ├── index.json                  #   Master index of all materials
│   ├── blocks/                     #   Reusable scene components (React + Zod)
│   │   ├── title/                  #     5 title blocks (spring, kinetic, gradient, glitch, neon)
│   │   ├── content/                #     4 content blocks (bullet, card-stack, timeline, glassmorphic)
│   │   ├── data-viz/               #     5 data-viz blocks (chart, pie, line, number, flow-diagram)
│   │   ├── cta/                    #     2 CTA blocks (bounce, glow-pulse)
│   │   ├── code-block/             #     Code typewriter block
│   │   ├── comparison/             #     Split-screen comparison block
│   │   ├── image-showcase/         #     Ken-burns image showcase block
│   │   ├── list-reveal/            #     Staggered list reveal block
│   │   ├── logo-reveal/            #     2 logo reveal blocks (particles, draw)
│   │   ├── custom/                 #     SVG draw reveal, icon grid draw
│   │   └── ...                     #     + quote, stats, pricing, team, testimonial, etc.
│   ├── styles/                     #   8 style presets (palette + typography + motion)
│   ├── compositions/               #   6 full video templates
│   └── assets/                     #   Media files (icons, backgrounds, audio, lottie)
├── templates/                      # Project scaffolding templates
│   ├── remotion-base/              #   Complete Remotion project template
│   │   ├── src/
│   │   │   ├── engine/             #     DSL runtime (block registry, spec parser, resolvers)
│   │   │   ├── components/         #     Shared components (Background, Subtitle, AnimatedText, etc.)
│   │   │   ├── hooks/              #     Animation bridge hooks (useGsapTimeline, useD3Animation, etc.)
│   │   │   ├── transitions/        #     Transition components (fade, slide, wipe, zoom)
│   │   │   └── styles/             #     Motion token definitions
│   │   └── package.json
│   ├── scenes/                     #   Reference scene templates (title, content, data, CTA, etc.)
│   └── presets/                    #   Output dimension presets (landscape, social-vertical, square)
├── scripts/                        # Utility scripts
│   ├── material-manager.py         #   CLI for adding/managing materials
│   ├── asset-fetch.py              #   Asset downloading helper
│   ├── search.py                   #   Material search utility
│   └── validate-project.py         #   Project validation checker
└── examples/                       # Demo walkthroughs
    ├── social-demo.md
    ├── explainer-demo.md
    └── data-viz-demo.md
```

## How It Works

The pipeline follows 5 phases:

### Phase 1 — Pre-production

1. **Parse requirements** — extract topic, platform, duration, style, and dimensions from the user request
2. **Generate script** — write high-quality narration and on-screen text; content quality is the top priority
3. **Director decomposition** — split the script into scenes with duration, mood, pacing, and visual intent

### Phase 2 — Material Library Match

4. **Read library index** — load `material-library/index.json` for all available blocks, styles, and compositions
5. **Composition match** — check if a full composition template fits (e.g., `social-tips-short` for a 30s TikTok tips video)
6. **Style selection** — pick the best-matching style preset based on mood, industry, and platform
7. **Block matching** — for each scene, find the highest-scoring reusable block by category and context overlap
8. **Transition & effect selection** — pick transitions and effects that match mood and pacing

### Phase 3 — Assembly

9. **Scaffold project** — copy `templates/remotion-base/` and install dependencies
10. **Inject matched blocks** — copy library blocks into the project, fill in content props
11. **Generate remaining scenes** — code-generate any scenes that didn't match a library block
12. **Apply style** — propagate palette, typography, and motion tokens globally
13. **Wire transitions** — connect scenes with `<TransitionSeries>`
14. **Add effects** — apply text, background, and camera effects

### Phase 4 — Post-production

15. **Subtitles** — auto-generate timed subtitles from the script
16. **TTS** — optional text-to-speech narration (planned)
17. **Validation** — run the aesthetic checklist on every scene
18. **Render** — output as an editable Remotion project and/or MP4

### Phase 5 — Library Growth

19. **Save new blocks** — offer to add well-crafted generated scenes back into the material library for future reuse

## Output Presets

| Platform | Resolution | Aspect Ratio | FPS |
|---|---|---|---|
| Douyin / TikTok / Reels | 1080 x 1920 | 9:16 | 30 |
| YouTube / Bilibili | 1920 x 1080 | 16:9 | 30 |
| Instagram Feed | 1080 x 1080 | 1:1 | 30 |
| Xiaohongshu | 1080 x 1440 | 3:4 | 30 |
| Custom | User-specified | — | 24 / 30 / 60 |

## Material Library at a Glance

**35 blocks** across 20 categories — title, content, data-viz, CTA, code-block, comparison, image-showcase, list-reveal, logo-reveal, quote, stats, pricing, team, testimonial, text-effect, feature, countdown, social-proof, before-after, transition, and more.

**8 style presets** — `tech-dark-energetic`, `brand-warm-cinematic`, `data-clean-professional`, `neon-cyberpunk`, `minimal-zen`, `gradient-dreamy`, `retro-film`, `corporate-blue`.

**6 composition templates** — `social-tips-short`, `explainer-standard`, `data-viz-story`, `product-launch-showcase`, `brand-story-cinematic`, `data-report-dashboard`.

## Quick Start Example

```
User: "Make a 30-second TikTok video about 5 Python tips"

Phase 1 — Pre-production:
  Script → 7 scenes (hook + 5 tips + CTA)

Phase 2 — Material Library Match:
  Composition: social-tips-short (matches: tips + tiktok + 30s)
  Style: tech-dark-energetic (matches: tech + energetic)
  Blocks: title-spring-basic → content-bullet-stagger ×5 → cta-bounce
  (All blocks from library — zero code generation needed!)

Phase 3 — Assembly:
  1. Scaffold from templates/remotion-base/
  2. Copy 3 block types into src/scenes/
  3. Substitute variables: tip titles, bodies, hook text, CTA
  4. Apply tech-dark palette to all color props
  5. Wire slide-up transitions between tips, fade for CTA

Phase 4 — Post-production:
  Subtitles, checklist validation, render to MP4
```

## Rendering

Once a project is assembled:

```bash
# Preview in Remotion Studio
npx remotion studio

# Render to MP4
npx remotion render src/index.ts VideoComposition out/video.mp4

# Render DSL-driven video
npx remotion render src/index.ts DSLVideo out/dsl-video.mp4

# Render for specific platforms
npx remotion render src/index.ts VideoComposition out/video.mp4 --height 1920 --width 1080   # vertical
npx remotion render src/index.ts VideoComposition out/video.mp4 --height 1080 --width 1920   # landscape
npx remotion render src/index.ts VideoComposition out/video.mp4 --height 1080 --width 1080   # square
```

## Adding Materials

The library grows over time. New materials can be added via:

- **Natural language** — say "add material" / "add block" / "add asset" to trigger the ingestion workflow
- **CLI** — `python scripts/material-manager.py add-block --id ID --category CAT --source file.tsx`
- **Project recycling** — after completing a video, well-crafted scenes can be saved back to the library

## Documentation

| Document | Description |
|---|---|
| [Director's Workflow](docs/workflow.md) | Full pipeline walkthrough |
| [Material Library](docs/material-library.md) | Library structure and usage guide |
| [Material Matching](docs/material-matching.md) | Context matching scoring algorithm |
| [DSL Specification](docs/dsl-spec.md) | Video spec JSON/YAML format |
| [Design System](docs/design-system.md) | Motion design tokens and rules |
| [Transitions](docs/transitions.md) | 30+ transition presets catalog |
| [Effects](docs/effects.md) | Text, background, camera, data effects |
| [Subtitles](docs/subtitles.md) | Subtitle generation and styling |
| [Assets](docs/assets.md) | Asset sourcing and fetching guide |
| [TTS](docs/tts.md) | Text-to-speech integration (planned) |

## License

This project is an AI agent skill for programmatic video generation. See the skill definition in `SKILL.md` for full usage instructions.
