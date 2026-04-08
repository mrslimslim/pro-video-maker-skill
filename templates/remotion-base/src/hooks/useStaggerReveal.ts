import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface StaggerRevealOptions {
  count: number;
  startFrame?: number;
  staggerFrames?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  distance?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
}

interface StaggerRevealItem {
  opacity: number;
  transform: string;
  style: React.CSSProperties;
}

/**
 * Generates per-item animation values for staggered reveal sequences.
 *
 * Returns an array of style objects (one per item) that can be spread
 * directly onto element style props.
 */
export function useStaggerReveal(options: StaggerRevealOptions): StaggerRevealItem[] {
  const {
    count,
    startFrame = 0,
    staggerFrames = 4,
    direction = "up",
    distance = 40,
    springConfig = { damping: 15, stiffness: 200, mass: 0.5 },
  } = options;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return Array.from({ length: count }, (_, i) => {
    const itemStart = startFrame + i * staggerFrames;
    const progress = spring({
      fps,
      frame: frame - itemStart,
      config: springConfig,
    });

    const inv = 1 - progress;
    let transform: string;
    switch (direction) {
      case "up":
        transform = `translateY(${inv * distance}px)`;
        break;
      case "down":
        transform = `translateY(${-inv * distance}px)`;
        break;
      case "left":
        transform = `translateX(${inv * distance}px)`;
        break;
      case "right":
        transform = `translateX(${-inv * distance}px)`;
        break;
      case "scale":
        transform = `scale(${0.5 + progress * 0.5})`;
        break;
      default:
        transform = `translateY(${inv * distance}px)`;
    }

    return {
      opacity: progress,
      transform,
      style: { opacity: progress, transform },
    };
  });
}
