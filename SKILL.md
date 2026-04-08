---
name: pro-video-maker
description: >-
  Generate professional videos programmatically using Remotion, GSAP, and D3.js.
  Provides a director-driven workflow with a material library for low-code
  assembly: content analysis, script generation, scene decomposition, material
  library matching, block assembly, animation choreography, transitions,
  effects, subtitles, and TTS.

  Use when the user asks to create a video, generate an animation, make a
  short-form video, build an explainer video, produce a data visualization
  video, or any video/motion graphics task.

  Also use when the user says "添加素材" / "add material" / "add block" /
  "add asset" — this triggers the material ingestion workflow to classify
  and package new reusable materials into the library.
---

# Pro Video Maker

AI-powered video generation skill based on Remotion + GSAP + D3.js with a
director-driven production pipeline and a **growing material library** for
low-code assembly.

## Supported Video Types

- Social media shorts (TikTok/Douyin/Reels/Xiaohongshu) — 9:16
- Explainer / tutorial videos — 16:9
- Marketing / product videos — 16:9 or 1:1
- Data visualization stories — any ratio
- Custom dimensions and FPS

## Output Presets

| Platform | Resolution | Aspect | FPS |
|----------|-----------|--------|-----|
| Douyin/TikTok/Reels | 1080x1920 | 9:16 | 30 |
| YouTube/Bilibili | 1920x1080 | 16:9 | 30 |
| Instagram Feed | 1080x1080 | 1:1 | 30 |
| Xiaohongshu | 1080x1440 | 3:4 | 30 |
| Custom | user-specified | — | 24/30/60 |

## Tech Stack

| Tech | Purpose |
|------|---------|
| Remotion | Core video renderer (React, frame-driven) |
| GSAP | Complex animation timelines |
| D3.js | Data visualization animation |
| Motion (Framer Motion) | Declarative component animation |
| React Three Fiber | 3D effects (optional) |
| lottie-react | Vector animation playback |
| Zod | Remotion props validation |

## Material Library

The material library (`material-library/`) is a persistent collection of
reusable blocks, assets, styles, and compositions that grows over time.
Instead of generating every component from scratch, the library provides
pre-built, tested building blocks.

| Material Type | Location | Description |
|---------------|----------|-------------|
| Blocks | `material-library/blocks/` | Reusable scene components (React + Zod) |
| Assets | `material-library/assets/` | Media files (images, video, audio, lottie) |
| Styles | `material-library/styles/` | Pre-combined palette + typography + motion |
| Compositions | `material-library/compositions/` | Full video templates (block sequences) |

Read `material-library/index.json` to browse all available materials.
For details, see [docs/material-library.md](docs/material-library.md).

## Director's Workflow

When the user requests a video, follow this pipeline **in order**:

### Phase 1 — Pre-production

1. **Parse requirements**: Extract content topic, target platform, duration,
   style preferences, and output dimensions.
2. **Generate script**: Write high-quality copy/narration first. Content quality
   is the top priority — do not rush to visuals.
3. **Director decomposition**: Split the script into scenes. For each scene
   define: duration (seconds), mood (energetic/calm/dramatic/playful), pacing
   (fast/normal/slow), and key visual intent.

### Phase 2 — Material Library Match

4. **Read material library index**: Load `material-library/index.json` to
   see all available blocks, styles, and compositions.

5. **Attempt composition match**: Check if any composition template matches
   the request (content type + platform + duration). If matched, use it as
   the blueprint — only substitute variable content.
   See [docs/material-matching.md](docs/material-matching.md) for matching logic.

6. **Select style preset**: From `material-library/styles/`, pick the style
   whose `contextMatch` best fits the video's mood, industry, and platform.
   Apply its palette, typography, and motion tokens globally.

7. **Match blocks per scene**: For each scene in the decomposition:
   - Filter blocks by category (scene type → block category).
   - Score against mood, industry, platform, contentType overlap.
   - Select the highest-scoring block.
   - If no block scores well, fall back to `templates/scenes/` or generate.

8. **Select transitions and effects**: Pick transitions from
   `data/transitions.json` and effects from `data/effects.json` matching the
   mood and pacing. (Same as before, but informed by block compatibility.)

### DSL Fast Path

When all scenes can be represented with existing material-library blocks,
prefer outputting a single DSL spec instead of generating scene TSX files.

Use this path when:
- Every scene matched a reusable block
- The visual system can be expressed by style preset + overrides
- Scene wiring is limited to props, repeats, transitions, backgrounds,
  effects, and subtitles

Output:
- `video-spec.json` or YAML
- `templates/remotion-base/` as the runtime host
- `DSLVideo` as the render target

Keep the old code-generation flow as the fallback for scenes that still need
custom components.

### Phase 3 — Assembly Production

9. **Scaffold Remotion project**: Copy `templates/remotion-base/` into the
    workspace root. Run `npm install`.

10. **Inject matched blocks**: For each scene that matched a library block:
    - Copy `Component.tsx` and `schema.ts` from the block directory into
      `src/scenes/`.
    - Update import paths for project dependencies (hooks, shared components).
    - Pass props derived from the script + style preset.

11. **Generate remaining scenes**: For scenes where no block matched:
    - Generate components from scratch using `templates/scenes/` as reference.
    - Use `useGsapTimeline` hook for GSAP animations.
    - Use `useD3Animation` hook for data visualizations.

12. **Apply style globally**: Propagate the selected style's colors, fonts,
    and motion tokens to all scene props, ensuring visual consistency.

13. **Wire transitions**: Connect scenes with transition components from
    `templates/remotion-base/src/transitions/`.

14. **Add effects**: Apply text animations, background effects, camera
    movements per the design system.

For component reference, read templates directly in `templates/`.

### Phase 4 — Post-production

15. **Generate subtitles**: Auto-generate from the script with timing aligned
    to scenes. See [docs/subtitles.md](docs/subtitles.md).
16. **TTS narration** (if requested): See [docs/tts.md](docs/tts.md). (TODO)
17. **Pre-delivery checklist**: Validate each scene against the checklist below.
18. **Render**: Output as Remotion project (editable) and/or MP4 via CLI.

### Phase 5 — Library Growth (Optional)

19. **Offer to save new blocks**: If any scenes were generated from scratch
    and turned out well, offer to save them to the material library using
    the "添加素材" workflow. This grows the library for future use.

## 添加素材 (Add Material) Workflow

When the user says "添加素材", "add material", "add block", "add asset",
or similar, follow this workflow:

### Step 1: Identify Material Type

Ask the user what they want to add (or infer from context):
- **Block**: A reusable scene component (React + Props)
- **Asset**: A media file (image/video/audio/Lottie/SVG)
- **Style**: A style preset (palette + typography + motion combination)
- **Composition**: A full video template (block arrangement)

### Step 2: Ingest and Classify

**For Blocks:**
1. Receive the component code (.tsx) or natural language description.
2. If code: extract props from Zod schema or TypeScript interface.
3. Infer `category` from component name, props, and visual purpose.
4. Generate `tags` from animation types, color patterns, layout.
5. Generate `contextMatch` rules (mood, industry, platform, contentType).
6. Create `material-library/blocks/[category]/[id]/` with meta.json,
   Component.tsx, and schema.ts.
7. Update `material-library/index.json`.

**For Assets:**
1. Receive file path or URL.
2. Detect file type (image/video/audio/lottie/svg).
3. Auto-categorize to backgrounds/overlays/icons/audio/lottie.
4. Generate metadata (resolution, format, semantic tags).
5. Copy to library and update index.

**For Styles:**
1. Receive palette/typography/motion parameters.
2. Package as a style preset JSON with contextMatch.
3. Write to `material-library/styles/`.

**For Compositions:**
1. Receive a completed video project or block arrangement.
2. Extract the block sequence and prop mappings.
3. Create variable placeholders for reusable content.
4. Save as composition template.

### Step 3: Confirm

Show the user what was added, including the auto-generated metadata.
Suggest edits to tags or contextMatch if needed.

### Recycling from Projects

To batch-add materials from a completed video project:
1. Scan the project's `src/scenes/` directory.
2. For each scene component, run the Block ingestion flow.
3. Extract the project's style as a Style preset.
4. Save the block arrangement as a Composition.

CLI helper: `python scripts/material-manager.py add-block --id ID --category CAT --source file.tsx`

## Aesthetic Checklist

Before delivering, verify **every scene**:

- [ ] Text contrast ratio >= 4.5:1 against background
- [ ] No emoji as icons — use SVG icons (Lucide)
- [ ] Animation duration between 200ms–1200ms per element
- [ ] No more than 3 simultaneous animations per scene
- [ ] Consistent color palette across all scenes
- [ ] Typography hierarchy: max 2 font families
- [ ] Scene transitions match mood (energetic=fast, calm=slow)
- [ ] No animation on scene entry lasts longer than the scene itself
- [ ] Subtitles readable at target resolution
- [ ] Safe zones respected (10% margin on social vertical)
- [ ] `prefers-reduced-motion` alternative provided
- [ ] Total video duration matches user requirement (+/- 10%)

## Motion Design Anti-patterns

NEVER do these:

- Excessive animations (more than 3 simultaneous per scene)
- Flash/strobe effects faster than 3Hz (accessibility hazard)
- Low-contrast text over busy backgrounds without backdrop
- Mismatched rhythm (upbeat music with slow-motion text)
- Generic stock-photo montage without purposeful composition
- Walls of text — max 15 words visible at any moment
- Inconsistent easing — pick one easing family per video
- Abrupt cuts without motivation (always use transitions)

## Code Generation Standards

When generating Remotion components:

- Use TypeScript with strict mode
- Define prop types with Zod schemas for Remotion visual editing
- Use `useCurrentFrame()` and `useVideoConfig()` for all timing
- Bridge GSAP via `useGsapTimeline` hook (never raw GSAP in render)
- Keep components pure — no side effects in render
- Use `<Sequence>` for scene timing, `<Series>` for sequential flow
- Use `interpolate()` with `Easing` for simple animations
- Use `spring()` for physics-based motion
- Use `staticFile()` for local assets in `public/`
- All colors from the design system palette — no hardcoded hex

## Reference Documentation

- [Director's Workflow](docs/workflow.md) — detailed pipeline steps
- [Material Library](docs/material-library.md) — library structure and usage
- [Material Matching](docs/material-matching.md) — context matching algorithm
- [Motion Design System](docs/design-system.md) — styles, tokens, rules
- [Asset Library](docs/assets.md) — sources and fetching guide
- [Transitions](docs/transitions.md) — 30+ transition presets
- [Effects](docs/effects.md) — text, background, camera, data effects
- [Subtitles](docs/subtitles.md) — subtitle generation and styling
- [TTS](docs/tts.md) — text-to-speech integration (TODO)

## Quick Start Example

```
User: "Make a 30-second TikTok video about 5 Python tips"

Phase 1 — Pre-production:
  Script: 7 scenes (hook + 5 tips + CTA)

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
