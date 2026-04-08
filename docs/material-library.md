# Material Library

The material library is a persistent, growing collection of reusable blocks,
assets, styles, and compositions that accelerate video production. Instead of
generating every component from scratch, the library provides pre-built,
tested building blocks that can be assembled and customized via props.

## Directory Structure

```
material-library/
├── index.json              # Central registry (auto-maintained)
├── blocks/                 # Reusable scene blocks
│   ├── title/
│   ├── content/
│   ├── data-viz/
│   ├── cta/
│   ├── quote/
│   ├── transition/
│   ├── list-reveal/
│   ├── image-showcase/
│   ├── code-block/
│   ├── comparison/
│   └── custom/
├── assets/                 # Media files
│   ├── backgrounds/
│   ├── overlays/
│   ├── icons/
│   ├── audio/
│   └── lottie/
├── styles/                 # Style presets (palette + typography + motion)
└── compositions/           # Full video templates (block sequences)
```

## Blocks

A block is a self-contained, reusable scene component. Each block lives in
its own directory with three files:

| File | Purpose |
|------|---------|
| `meta.json` | Metadata, tags, contextMatch rules, prop definitions |
| `Component.tsx` | React component (Remotion-compatible) |
| `schema.ts` | Zod prop schema + TypeScript type export |

### Using a Block

1. Read `meta.json` to understand its props and context fit.
2. Copy `Component.tsx` and `schema.ts` into your project's `src/scenes/`.
3. Update import paths for any dependencies (hooks, shared components).
4. Pass props from your video script to customize content and colors.

### Block Categories

| Category | Description |
|----------|-------------|
| `title` | Opening / chapter title scenes |
| `content` | Text, bullet points, explanations |
| `data-viz` | Charts, counters, progress rings, stat grids |
| `cta` | Call-to-action closing scenes |
| `quote` | Testimonials, famous quotes |
| `transition` | Brief section break scenes |
| `list-reveal` | Numbered/icon lists with stagger |
| `image-showcase` | Full-screen images with Ken Burns |
| `code-block` | Code snippets with syntax highlighting |
| `comparison` | Side-by-side / before-after |
| `custom` | User-defined blocks |

## Styles

A style preset bundles palette, typography, and motion parameters into a
single JSON file. It replaces the manual cross-referencing of `palettes.json`,
`typography.json`, and `motion-styles.json`.

### Style Structure

```json
{
  "id": "tech-dark-energetic",
  "palette": { "primary": "...", "background": "...", "text": "..." },
  "typography": { "heading": "Inter", "body": "Inter", "mono": "JetBrains Mono" },
  "motion": { "easing": "power2.out", "stagger": 0.04, "intensity": "high" },
  "contextMatch": { "mood": [...], "industry": [...] }
}
```

### Applying a Style

When assembling a video, pick a style and propagate its values to every
block's color/font/motion props. This ensures visual consistency.

## Compositions

A composition is a reusable video template: a predefined sequence of blocks
with variable placeholders for content.

| File | Purpose |
|------|---------|
| `meta.json` | Platform, resolution, duration, tags |
| `composition.json` | Block sequence with prop mappings and variables |

### Using a Composition

1. Match the user's request to a composition via `contextMatch`.
2. Read `composition.json` for the block sequence.
3. Substitute `{{variables}}` with actual content from the script.
4. Copy referenced blocks into the project.
5. Generate `Video.tsx` that wires the blocks in sequence.

### Variable Syntax

Props use `{{variableName}}` for template substitution.
Arrays use `{{items[i].field}}` with a `repeat` count.

## CLI Tool

The `scripts/material-manager.py` script manages the library:

```bash
# List all materials
python scripts/material-manager.py list
python scripts/material-manager.py list --type block

# Search
python scripts/material-manager.py search --query "chart data"

# Add materials
python scripts/material-manager.py add-block --id my-block --category title --source Component.tsx
python scripts/material-manager.py add-asset --file bg.jpg --category backgrounds
python scripts/material-manager.py add-style --file my-style.json
python scripts/material-manager.py add-composition --dir ./my-comp/

# Rebuild index from disk
python scripts/material-manager.py rebuild-index

# Show statistics
python scripts/material-manager.py stats
```

## Adding Materials ("添加素材" Workflow)

When the user says "添加素材" or similar, follow this workflow:

### Adding a Block

1. Receive the component code (`.tsx`) or a description.
2. Analyze the code to extract props (from Zod schema or TypeScript interface).
3. Infer `category` from component name and props structure.
4. Generate `tags` from animation types, color usage, layout patterns.
5. Generate `contextMatch` rules based on tags and category.
6. Create `material-library/blocks/[category]/[id]/` with three files.
7. Update `index.json` (or run `rebuild-index`).

### Adding an Asset

1. Receive a file path or URL.
2. Detect file type (image/video/audio/lottie/svg).
3. Auto-categorize to the appropriate subdirectory.
4. Generate metadata (resolution, duration, format, semantic tags).
5. Copy file to library and update `index.json`.

### Adding a Style

1. Receive palette/typography/motion parameters (or extract from project).
2. Combine into a style preset JSON.
3. Generate `contextMatch` rules.
4. Write to `material-library/styles/`.

### Recycling from a Completed Project

1. Scan the project's `src/scenes/` directory.
2. For each scene component, run the "Add Block" flow.
3. Extract the project's color/font/motion config as a Style preset.
4. Save the overall block arrangement as a Composition.
