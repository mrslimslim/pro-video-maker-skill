import { useCallback, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import gsap from "gsap";

/**
 * Bridge GSAP timelines with Remotion's frame-based rendering.
 *
 * Creates a GSAP timeline that is seeked to the correct position
 * based on the current Remotion frame, making GSAP animations
 * deterministic and render-safe.
 *
 * Usage:
 * ```tsx
 * const Component = () => {
 *   const { timeline, scope } = useGsapTimeline((tl, el) => {
 *     tl.from(el.querySelectorAll(".item"), {
 *       y: 50, opacity: 0, stagger: 0.1, duration: 0.5
 *     });
 *   });
 *   return <div ref={scope}>
 *     <div className="item">A</div>
 *     <div className="item">B</div>
 *   </div>;
 * };
 * ```
 */
export function useGsapTimeline(
  buildTimeline: (tl: gsap.core.Timeline, container: HTMLElement) => void,
  deps: unknown[] = []
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scope = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const setupTimeline = useCallback(() => {
    if (!scope.current) return;
    if (tlRef.current) {
      tlRef.current.kill();
    }
    const tl = gsap.timeline({ paused: true });
    buildTimeline(tl, scope.current);
    tlRef.current = tl;
  }, deps);

  useEffect(() => {
    setupTimeline();
    return () => {
      tlRef.current?.kill();
    };
  }, [setupTimeline]);

  useEffect(() => {
    if (tlRef.current) {
      const timeInSeconds = frame / fps;
      tlRef.current.seek(timeInSeconds);
    }
  }, [frame, fps]);

  return {
    scope,
    timeline: tlRef.current,
  };
}
