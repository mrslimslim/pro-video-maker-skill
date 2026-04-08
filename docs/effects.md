# Effects

Visual effects catalog organized by category. Each effect includes implementation
guidance for Remotion + GSAP/D3.

## Effect Categories

### Text Effects (8)

| Effect | Description | Best For |
|--------|-------------|----------|
| typewriter | Characters appear one by one with cursor | Code, quotes, reveals |
| split-text | Words/chars animate in individually | Titles, headings |
| bounce-in | Text bounces into position | Social, playful |
| word-reveal | Words appear sequentially | Narration sync |
| glitch-text | Digital glitch on text | Tech, gaming |
| neon-glow | Text with neon glow + flicker | Nightlife, gaming |
| kinetic-type | Text moves with physics/rhythm | Music, social |
| gradient-text | Animated gradient fill on text | Modern, creative |

### Background Effects (6)

| Effect | Description | Best For |
|--------|-------------|----------|
| gradient-mesh | Animated multi-point gradient | Modern SaaS, creative |
| particle-rain | Floating particles | Celebration, magic |
| noise-grain | Film grain / noise overlay | Cinematic, retro |
| pattern-animate | Repeating pattern with motion | Geometric, abstract |
| color-shift | Gradual background color change | Mood transitions |
| wave | Animated wave shapes | Organic, water |

### Camera Effects (5)

| Effect | Description | Best For |
|--------|-------------|----------|
| ken-burns | Slow zoom on static image | Photos, documentary |
| pan | Horizontal camera movement | Panoramas, reveal |
| dolly | Forward/backward movement | Immersive, focus |
| shake | Camera shake for impact | Action, sports |
| focus-pull | Blur shift between elements | Cinematic, depth |

### Data Effects (5)

| Effect | Description | Best For |
|--------|-------------|----------|
| chart-build | D3 chart animates into view | Data stories |
| counter | Number counts up/down | Statistics, KPIs |
| progress-bar | Bar fills to percentage | Progress, comparison |
| map-highlight | Map regions highlight | Geography, markets |
| draw-line | SVG path draws itself | Connections, flow |

### Decorative Effects (5)

| Effect | Description | Best For |
|--------|-------------|----------|
| float | Elements float gently | Background, ambient |
| light-leak | Film light leak overlay | Cinematic, warm |
| lens-flare | Lens flare animation | Cinematic, dramatic |
| confetti | Confetti burst | Celebration, success |
| sparkle | Twinkling sparkle points | Magic, premium |

## Implementation Patterns

### Text Effects with GSAP + Remotion

```tsx
// Split text animation using useGsapTimeline
const AnimatedTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {words.map((word, i) => {
        const delay = i * 0.08; // stagger
        const entryFrame = delay * fps;
        const opacity = interpolate(
          frame, [entryFrame, entryFrame + 10], [0, 1],
          { extrapolateRight: "clamp" }
        );
        const y = interpolate(
          frame, [entryFrame, entryFrame + 10], [30, 0],
          { extrapolateRight: "clamp" }
        );
        return (
          <span key={i} style={{ opacity, transform: `translateY(${y}px)` }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

### Data Effects with D3 + Remotion

```tsx
// Counter animation
const Counter: React.FC<{ target: number; startFrame: number }> = ({
  target, startFrame
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(
    frame, [startFrame, startFrame + 60], [0, target],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <span>{Math.round(value).toLocaleString()}</span>;
};
```

### Camera Effects

```tsx
// Ken Burns zoom
const KenBurns: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.3]);
  const x = interpolate(frame, [0, durationInFrames], [0, -5]);
  return (
    <Img
      src={staticFile(src)}
      style={{ transform: `scale(${scale}) translateX(${x}%)` }}
    />
  );
};
```

## Combining Effects

Rules for combining effects in a single scene:
- Max 3 simultaneous animations
- Stagger entries by at least 200ms
- Background effects should be subtle (low intensity)
- Text animation takes priority over decorative
- Camera effects apply to the entire scene container

See `data/effects.json` for full parameter definitions.
