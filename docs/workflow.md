# Director's Workflow

Complete pipeline for generating a video from a user request.
Uses the material library for efficient block assembly when possible,
falling back to code generation only when needed.

## Phase 1 — Pre-production

### Step 1: Parse Requirements

Extract from the user request:

| Parameter | Required | Default |
|-----------|----------|---------|
| Topic / content | Yes | — |
| Target platform | No | YouTube (16:9) |
| Duration | No | 30 seconds |
| Style preference | No | Auto-matched from library |
| Language | No | Same as user message |
| Aspect ratio | No | Derived from platform |
| FPS | No | 30 |

If the user omits required fields, ask before proceeding.

### Step 2: Generate Script

Write the full narration / text content first. Prioritize content quality.

Script format:

```
TITLE: [Video Title]
DURATION: [Target duration]
PLATFORM: [Target platform]
TONE: [Formal / Casual / Energetic / Calm]

---

SCENE 1: [Scene Title]
Duration: Xs
Narration: "..."
Visual intent: [What the viewer should see]
Key text on screen: "..."

SCENE 2: [Scene Title]
Duration: Xs
Narration: "..."
Visual intent: [What the viewer should see]
Key text on screen: "..."

...
```

Rules for script writing:
- Open with a hook (first 3 seconds must capture attention)
- One core idea per scene
- Max 15 words visible on screen at once
- Narration pace: ~150 words/minute for normal, ~180 for energetic
- End with a clear CTA or conclusion

### Step 3: Director Decomposition

Review the script as a director. For each scene, define:

```json
{
  "sceneId": 1,
  "title": "Hook / Opening",
  "startTime": 0,
  "duration": 4,
  "mood": "energetic",
  "pacing": "fast",
  "visualType": "kinetic-text",
  "textContent": "Did you know...?",
  "narration": "...",
  "assetNeeds": ["background-gradient"],
  "effectHints": ["bounce-in", "scale-pop"],
  "transitionOut": "slide-up"
}
```

Guidelines for scene decomposition:
- First scene (Hook): 2-4 seconds, highest energy
- Content scenes: 4-8 seconds each
- Closing scene (CTA): 3-5 seconds
- Vary visual types to maintain interest
- Alternate between text-heavy and visual-heavy scenes

## Phase 2 — Material Library Match

### Step 4: Read Material Library

Load `material-library/index.json` to get the full inventory of:
- Blocks (reusable scene components)
- Styles (palette + typography + motion presets)
- Compositions (full video templates)

### Step 5: Attempt Composition Match

Check if any composition template matches the request:

1. For each composition, read its `meta.json` and `composition.json`.
2. Check `contextMatch` against:
   - `contentType` (tips, explainer, dashboard, etc.)
   - `platform` (douyin, youtube, instagram, etc.)
   - `duration` (within the composition's target range)
3. If a strong match is found, use it as the blueprint.
4. Only substitute `{{variables}}` — no block selection or code generation.

**Current compositions:**
- `social-tips-short` — 30s vertical tips/listicle (TikTok/Douyin/Reels)
- `explainer-standard` — 60s landscape explainer (YouTube/Bilibili)
- `data-viz-story` — 45s square data dashboard (Instagram/Xiaohongshu)

### Step 6: Select Style Preset

From `material-library/styles/`, pick the style whose `contextMatch` best
overlaps with the video's mood, industry, and platform.

**Current styles:**
- `tech-dark-energetic` — Dark indigo/cyan, fast motion, tech content
- `brand-warm-cinematic` — Warm earth tones, slow cinematic, storytelling
- `data-clean-professional` — Light/clean, moderate motion, data content

If no style matches, manually assemble from:
- `data/palettes.json` (color palette)
- `data/typography.json` (font combinations)
- `data/motion-styles.json` (motion tokens)

### Step 7: Match Blocks per Scene

For each scene in the decomposition:

1. Map the scene's `visualType` to a block category:

   | Scene Visual Type | Block Category |
   |-------------------|---------------|
   | title, hook, opener | `title` |
   | content, explanation, tip | `content` |
   | data, chart, counter, stats | `data-viz` |
   | quote, testimonial | `quote` |
   | cta, closing, follow | `cta` |
   | transition, break | `transition` |
   | list, steps, top-N | `list-reveal` |
   | image, photo, hero | `image-showcase` |
   | code, terminal, API | `code-block` |
   | comparison, vs, before-after | `comparison` |

2. Filter library blocks by matching category.
3. Score each candidate block against the scene's context (mood, industry,
   platform, contentType). See [material-matching.md](material-matching.md)
   for the scoring formula.
4. Select the highest-scoring block.
5. If no block scores well (score < 20), mark this scene for code generation.

### Step 8: Select Transitions and Effects

For each scene boundary, pick a transition:
- Match transition mood to the **incoming** scene's mood
- Fast scenes → fast transitions (300-500ms)
- Calm scenes → slow transitions (800-1500ms)
- Same-topic scenes → subtle (fade, dissolve)
- Topic change → pronounced (slide, zoom, wipe)

For each scene, pick effects based on content type:

| Content Type | Recommended Effects |
|-------------|-------------------|
| Text / quote | split-text, typewriter, bounce-in |
| Data / numbers | chart-build, counter, progress-bar |
| Product | float, rotate-3d, spotlight |
| Image gallery | ken-burns, parallax, crossfade |
| Code | code-typewriter, syntax-highlight |
| List / steps | stagger-reveal, step-number |

## DSL Fast Path

When every scene can be expressed with existing material-library blocks, skip
generated scene files and output a single DSL spec instead.

Workflow:

1. Match a global style preset.
2. Choose block IDs for every scene.
3. Encode timing, transitions, subtitles, backgrounds, and effects in
   `video-spec.json` or YAML.
4. Render the `DSLVideo` composition from `templates/remotion-base/`.

Fallback to the TSX generation flow only if a scene truly requires a custom
component that the material library cannot express yet.

## Phase 3 — Assembly Production

### Step 9: Scaffold Remotion Project

Copy `templates/remotion-base/` to workspace root:

```
my-video/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── public/
│   └── assets/          # Downloaded assets go here
└── src/
    ├── Root.tsx
    ├── Video.tsx         # Main composition (generated)
    ├── components/       # Reusable components
    ├── hooks/            # GSAP/D3 bridge hooks
    ├── transitions/      # Transition components
    └── styles/           # Motion tokens
```

Run `npm install` to install dependencies.

### Step 10: Inject Matched Blocks

For each scene that matched a library block:

1. Copy `Component.tsx` and `schema.ts` from
   `material-library/blocks/[category]/[block-id]/` into `src/scenes/`.
2. Update import paths for project dependencies (hooks, shared components).
3. Map the selected style's colors/fonts to the block's props.
4. Fill content props from the script (headings, body text, data, etc.).

This is the key efficiency gain — matched blocks need only prop customization,
not full code generation.

### Step 11: Generate Remaining Scenes

For scenes that didn't match any library block:

1. Create `src/scenes/Scene{N}.tsx` from scratch.
2. Use `templates/scenes/` as reference for the component pattern.
3. Import motion tokens from `styles/motion-tokens.ts`.
4. Use `useGsapTimeline` for complex animations.
5. Use `interpolate()` / `spring()` for simple ones.
6. Use Zod schema for props validation.

Scene component pattern:

```tsx
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { z } from "zod";

export const sceneSchema = z.object({
  title: z.string(),
});

export const SceneN: React.FC<z.infer<typeof sceneSchema>> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div>...</div>;
};
```

### Step 12: Apply Style Globally

Propagate the selected style preset to all scenes:
- Map `palette.primary/secondary/accent/background/text` to block color props.
- Map `typography.heading/body/mono` to `fontFamily` props.
- Use `motion.easing/stagger/intensity` for animation timing consistency.

### Step 13: Wire Transitions

Use `<TransitionSeries>` from `@remotion/transitions`:

```tsx
import { TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={120}>
    <Scene1 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={slide({ direction: "from-bottom" })}
    timing={springTiming({ config: { damping: 200 } })}
  />
  <TransitionSeries.Sequence durationInFrames={180}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

### Step 14: Apply Assets

1. Determine needed assets from scene decomposition.
2. Check `material-library/assets/` for cached assets first.
3. If not found, fetch via `scripts/asset-fetch.py` or manual selection.
4. Place in `public/assets/`.
5. Reference via `staticFile("assets/filename.ext")`.

### Step 15: Add Effects

Apply per-scene effects using the effect components from
`templates/remotion-base/src/components/`.

## Phase 4 — Post-production

### Step 16: Generate Subtitles

From the script narration, generate timed subtitles:

1. Calculate word timing from scene durations.
2. Create subtitle entries: `{ start, end, text }`.
3. Render using `<Subtitle>` component.
4. Optionally export as SRT/VTT.

See [subtitles.md](subtitles.md) for styling options.

### Step 17: TTS Narration (Optional)

If the user wants voiceover:

1. Send script text to TTS API.
2. Download audio files.
3. Place in `public/audio/`.
4. Use `<Audio>` component from Remotion.
5. Sync timing with scenes.

See [tts.md](tts.md) for integration guide.

### Step 18: Pre-delivery Checklist

Run through the aesthetic checklist from SKILL.md for every scene.

Optionally run `scripts/validate-project.py` for automated checks.

### Step 19: Render

**Preview in Remotion Studio:**
```bash
npx remotion studio
```

**Render to MP4:**
```bash
npx remotion render src/index.ts VideoComposition out/video.mp4
```

**Render with custom settings:**
```bash
npx remotion render src/index.ts VideoComposition out/video.mp4 \
  --codec h264 \
  --image-format jpeg \
  --quality 80 \
  --concurrency 50%
```

## Phase 5 — Library Growth (Optional)

### Step 20: Save New Blocks to Library

After delivering the video, check if any scenes were generated from scratch
(not from library blocks). For each:

1. Ask the user if they want to save it to the library.
2. If yes, run the "添加素材" workflow:
   - Extract the component code and schema.
   - Auto-classify category, tags, contextMatch.
   - Write to `material-library/blocks/[category]/[id]/`.
   - Update `material-library/index.json`.

### Step 21: Save Project as Composition

If the overall video structure is reusable (e.g., a standard tips format):

1. Extract the block sequence and prop mappings.
2. Create variable placeholders for content.
3. Save as a new composition template.

This ensures the library grows with every project, making future videos
faster to produce.
