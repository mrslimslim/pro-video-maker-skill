import { useRef, useEffect, useCallback } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Bridge D3.js animations with Remotion's frame-based rendering.
 *
 * Provides a ref and frame-synced render callback for D3 visualizations.
 * The render function is called every frame with the current progress (0-1).
 *
 * Usage:
 * ```tsx
 * const Component = () => {
 *   const { ref } = useD3Animation((svg, progress) => {
 *     const data = [10, 20, 30, 40];
 *     const scale = d3.scaleLinear().domain([0, 40]).range([0, 300 * progress]);
 *     d3.select(svg)
 *       .selectAll("rect")
 *       .data(data)
 *       .join("rect")
 *       .attr("width", d => scale(d));
 *   }, { startFrame: 0, durationFrames: 60 });
 *   return <svg ref={ref} width={800} height={400} />;
 * };
 * ```
 */
export function useD3Animation<T extends SVGSVGElement | HTMLDivElement>(
  render: (element: T, progress: number, frame: number) => void,
  options: {
    startFrame?: number;
    durationFrames?: number;
  } = {}
) {
  const { startFrame = 0, durationFrames = 60 } = options;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<T>(null);

  const progress = Math.max(
    0,
    Math.min(1, (frame - startFrame) / durationFrames)
  );

  useEffect(() => {
    if (ref.current) {
      render(ref.current, progress, frame);
    }
  }, [frame, progress]);

  return {
    ref,
    progress,
    frame,
    fps,
  };
}
