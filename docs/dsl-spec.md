# Video DSL Spec

The DSL engine renders a full video from a single JSON or YAML spec without
generating scene TSX files first.

## Entry Points

- Runtime spec: `templates/remotion-base/public/video-spec.json`
- Engine root: `templates/remotion-base/src/engine/DSLRoot.tsx`
- Composition: `templates/remotion-base/src/engine/DSLVideoComposition.tsx`

## Top-Level Shape

```json
{
  "version": "1.0",
  "video": {
    "title": "5 Python Tips",
    "platform": "tiktok",
    "style": "tech-dark-energetic"
  },
  "styleOverrides": {
    "palette": {
      "accent": "#22D3EE"
    }
  },
  "scenes": [],
  "data": {},
  "subtitles": {
    "enabled": true,
    "entries": []
  }
}
```

## Scene Fields

- `block`: Material-library block ID.
- `duration`: Scene duration in seconds, for example `"3s"` or `3`.
- `durationFrames`: Scene duration in frames.
- `props`: Direct props passed to the block.
- `propsTemplate`: Template-driven props resolved from `data`, `item`, and `i`.
- `repeat`: Number, array, or template expression. If the expression ends with
  `.length`, the engine also derives the repeated `item` source automatically.
- `transition`: String ID or object `{type, duration, durationFrames, pacing, config}`.
- `background`: String or object `{type, props}`.
- `effects`: Array of effect declarations.

## Templates

Supported forms:

- Full replacement: `${{ data.tips[0].title }}`
- Inline replacement: `Tip ${{ i + 1 }}`
- Legacy compatibility: `{{tips[i].title}}`

Template context exposes:

- `data`: Full data payload
- `item`: Current repeated item
- `i`: Current repeated index
- `repeatIndex`: Same as `i`
- `index`: Expanded scene index

## Styles

`video.style` references a preset in `material-library/styles/`.

`styleOverrides` supports:

- `palette`
- `typography`
- `motion`

The engine auto-injects style values into common block props such as:

- `backgroundColor`
- `textColor`
- `accentColor`
- `fontFamily`
- `glowColor`
- `lineColor`

Explicit scene props always override auto-injected style props.

## Backgrounds And Effects

Backgrounds currently support:

- `solid`
- `gradient`
- `gradient-mesh`
- `particle-rain`
- `starfield`
- `aurora-wave`
- `geometric-grid`
- `glow-orbs`
- `wave`
- `noise-grain`

Effects currently support:

- `confetti`
- `sparkle`
- `light-sweep`
- `glitch-overlay`
- `glitch-text`
- `noise-grain`

Unsupported effect IDs safely fall back to no-op rendering.

## Rendering

Use the default spec:

```bash
npm run render:dsl
```

Or pass a spec through input props:

```bash
npx remotion render src/index.ts DSLVideo out/video.mp4 --props "{\"spec\": { ... }}"
```

`DSLRoot` also accepts a JSON or YAML string through `spec`, `videoSpec`,
`dsl`, or `specSource`.

## Notes

- `templates/remotion-base/remotion.config.ts` wires webpack aliases for `@`,
  `@engine`, and `@blocks`.
- `templates/remotion-base/material-library/` links to the shared repository
  material library so the engine can reuse blocks without duplicating source.
