# Material Matching

How the AI selects materials from the library based on content context.

## Matching Pipeline

When the user requests a video, after Pre-production (script + scene
decomposition), the matching engine runs in this priority order:

### Priority 1: Composition Match

Check if a full composition template matches the request.

**Match criteria** (all must roughly align):
- `contentType` matches (e.g., "tips" matches `social-tips-short`)
- `platform` matches or is compatible
- `duration` falls within the composition's range

**If matched**: Use the composition as the blueprint. Only substitute
variables — no block selection needed.

### Priority 2: Block-by-Block Match

For each scene in the decomposition, find the best block.

**Scoring formula** (higher = better match):

```
score = categoryMatch * 40
      + moodOverlap * 20
      + industryOverlap * 15
      + platformOverlap * 10
      + contentTypeOverlap * 10
      + tagOverlap * 5
```

Where:
- `categoryMatch`: 1 if the scene type matches the block category, 0 otherwise
- `moodOverlap`: fraction of scene moods found in block's `contextMatch.mood`
- `industryOverlap`: fraction of project industry in `contextMatch.industry`
- `platformOverlap`: 1 if target platform in `contextMatch.platform`, 0 otherwise
- `contentTypeOverlap`: fraction of scene content type in `contextMatch.contentType`
- `tagOverlap`: fraction of scene keywords found in block tags

**Selection rule**: Pick the block with the highest score. If score < 20
(poor match), fall back to generating from scratch using `templates/scenes/`.

### Priority 3: Style Match

Select a style preset for the whole video.

**Match criteria**:
- `mood` overlap with the video's overall mood
- `industry` overlap with the content's industry
- `platform` compatibility

If no style matches well, fall back to manual assembly from
`data/palettes.json` + `data/typography.json` + `data/motion-styles.json`.

## Matching Procedure (Step-by-Step)

1. **Read `material-library/index.json`** to get the list of all materials.

2. **Attempt Composition match**:
   - For each composition, read its `meta.json`.
   - Check `contextMatch` against the parsed requirements.
   - If a strong match is found (contentType + platform + duration), use it.

3. **Select Style**:
   - For each style in `material-library/styles/`, read its JSON.
   - Score against project mood + industry + platform.
   - Pick the best-scoring style.

4. **Match Blocks per scene**:
   - For each scene in the decomposition:
     a. Filter blocks by `category` (scene type → block category mapping).
     b. Score remaining blocks using the formula above.
     c. Select top scorer or fall back to template generation.

5. **Resolve dependencies**:
   - Check each selected block's `meta.json` for `dependencies`.
   - Ensure required shared components exist in `templates/remotion-base/`.

6. **Apply Style to Props**:
   - Map the selected style's palette colors to each block's color props.
   - Map typography to `fontFamily` props.
   - Use motion tokens for animation timing.

## Scene Type → Block Category Mapping

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

## Fallback Strategy

When the library doesn't have a matching block:

1. Use the closest-scoring block as a **starting point** and modify its code.
2. If no block scores > 10, generate from scratch using `templates/scenes/`
   and the existing `data/` JSON configs (original workflow).
3. After generation, offer to **add the new component to the library**
   for future reuse (triggers the "添加素材" workflow).

## Example

**Request**: "Make a 30s TikTok about 5 JavaScript tips"

1. **Composition match**: `social-tips-short` matches (tips + tiktok + 30s) → use it.
2. **Style match**: `tech-dark-energetic` (tech + energetic + tiktok).
3. **Blocks come from composition**: `title-spring-basic` → `content-bullet-stagger` ×5 → `cta-bounce`.
4. **Variable substitution**: Fill in tip titles, bodies, hook text, CTA text.
5. **Style application**: Apply tech-dark palette colors to all block props.
6. Result: Complete video assembled from library with minimal generation.
