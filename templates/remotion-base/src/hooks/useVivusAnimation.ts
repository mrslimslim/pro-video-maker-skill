import { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import Vivus from "vivus";

interface UseVivusAnimationOptions {
  startFrame?: number;
  durationFrames?: number;
  type?: "delayed" | "sync" | "oneByOne" | "scenario";
  animTimingFunction?: (input: number) => number;
}

/**
 * Bridge Vivus.js SVG line-drawing with Remotion's frame-based rendering.
 *
 * Wraps a Vivus instance using `start: 'manual'` and a very high internal
 * duration so that `setFrameProgress(0–1)` gives smooth results.
 * The progress value is derived from the current Remotion frame.
 *
 * Usage:
 * ```tsx
 * const MyScene = () => {
 *   const svgRef = useVivusAnimation({ startFrame: 0, durationFrames: 60 });
 *   return (
 *     <svg ref={svgRef} viewBox="0 0 100 100">
 *       <path d="M10 80 Q 52.5 10, 95 80" fill="none" stroke="#fff" strokeWidth="2" />
 *     </svg>
 *   );
 * };
 * ```
 */
export function useVivusAnimation(options: UseVivusAnimationOptions = {}) {
  const {
    startFrame = 0,
    durationFrames = 60,
    type = "sync",
    animTimingFunction,
  } = options;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const svgRef = useRef<SVGSVGElement>(null);
  const vivusRef = useRef<Vivus | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    if (vivusRef.current) {
      vivusRef.current.destroy();
    }

    vivusRef.current = new Vivus(svgRef.current as unknown as HTMLElement, {
      start: "manual",
      type,
      duration: 1000000,
      animTimingFunction: animTimingFunction || Vivus.EASE,
    });

    vivusRef.current.reset();

    return () => {
      vivusRef.current?.destroy();
      vivusRef.current = null;
    };
  }, [type]);

  useEffect(() => {
    if (!vivusRef.current) return;

    const progress = interpolate(
      frame,
      [startFrame, startFrame + durationFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    vivusRef.current.setFrameProgress(progress);
  }, [frame, startFrame, durationFrames]);

  return svgRef;
}
