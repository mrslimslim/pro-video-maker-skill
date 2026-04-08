# Transitions

30+ transition presets for connecting scenes. Each transition has GSAP parameters
and a Remotion `<TransitionSeries>` implementation approach.

## Selection Guide

| Scene Mood Change | Recommended |
|-------------------|-------------|
| Same topic, smooth flow | fade, dissolve, crossfade |
| New topic, same energy | slide-left, slide-up, push |
| Energy increase | zoom-in, scale, push |
| Energy decrease | fade, dissolve |
| Dramatic shift | wipe, glitch-cut, zoom |
| Playful | bounce-slide, flip, cube |
| Technical | pixel, morph |

## Timing Rules

| Pacing | Transition Duration | GSAP Duration |
|--------|-------------------|---------------|
| Fast | 8-15 frames (at 30fps) | 0.27-0.5s |
| Normal | 15-24 frames | 0.5-0.8s |
| Slow | 24-45 frames | 0.8-1.5s |

## Using Remotion Built-in Transitions

Remotion provides `@remotion/transitions` with built-in presentations:

```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
```

Use `springTiming()` for organic feel, `linearTiming()` for mechanical.

## Custom Transitions with GSAP

For transitions not in `@remotion/transitions`, use the `useGsapTimeline` hook
to animate exit/entry of scenes. Pattern:

```tsx
const CustomTransition: React.FC<{ progress: number }> = ({ progress }) => {
  const exitOpacity = interpolate(progress, [0, 1], [1, 0]);
  const entryOpacity = interpolate(progress, [0, 1], [0, 1]);
  // ...
};
```

## Transition Categories

### Basic (4)
- **fade** — opacity 1→0 / 0→1
- **cut** — instant switch (0 duration)
- **dissolve** — cross-fade with slight blur
- **crossfade** — simultaneous fade out/in overlap

### Directional (8)
- **slide-up** — scene slides up to reveal next
- **slide-down** — scene slides down
- **slide-left** — scene slides left
- **slide-right** — scene slides right
- **push-up** — both scenes move together upward
- **push-left** — both scenes push left
- **cover** — new scene covers old from direction
- **reveal** — old scene moves to reveal new underneath

### Transform (4)
- **zoom-in** — scale up into next scene
- **zoom-out** — scale down to reveal next scene
- **rotate** — rotation along Z-axis
- **flip** — 3D flip on Y-axis

### Wipe (5)
- **wipe-right** — linear wipe from left to right
- **wipe-down** — linear wipe top to bottom
- **wipe-circle** — circular iris wipe from center
- **wipe-diamond** — diamond-shape expand
- **clock-wipe** — clockwise radial wipe

### Creative (6)
- **glitch-cut** — glitch artifacts during transition
- **pixel** — pixelation dissolve
- **morph** — shape morphing between scenes
- **blur-through** — blur out → blur in
- **color-flash** — flash to solid color then reveal
- **split-reveal** — scene splits in half to reveal next

### 3D (3)
- **cube** — 3D cube rotation
- **page-turn** — page turning effect
- **fold** — accordion fold

See `data/transitions.json` for full parameter definitions.
