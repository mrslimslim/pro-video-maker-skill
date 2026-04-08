import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { CountdownFlipProps } from "./schema";

const FRAMES_PER_STEP = 30;

export const CountdownFlip: React.FC<CountdownFlipProps> = ({
  from,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const label = useMemo(() => {
    const seg = Math.floor(t);
    if (seg >= from) {
      return "GO!";
    }
    return String(from - seg);
  }, [t, from]);

  const colonOpacity = interpolate(Math.sin(frame * 0.35), [-1, 1], [0.25, 1]);

  const { scope } = useGsapTimeline(
    (tl, el) => {
      const inner = el.querySelector<HTMLElement>(".countdown-flip-inner");
      if (!inner) return;
      for (let i = 0; i < from; i++) {
        tl.fromTo(
          inner,
          { rotationX: -88, transformOrigin: "50% 50%" },
          {
            rotationX: 0,
            duration: 0.4,
            ease: "back.out(1.35)",
          },
          i
        );
      }
      tl.fromTo(
        inner,
        { rotationX: -92, transformOrigin: "50% 50%" },
        {
          rotationX: 0,
          duration: 0.52,
          ease: "elastic.out(1)",
        },
        from
      );
    },
    [from]
  );

  const accentSpring = spring({
    fps,
    frame: frame - from * FRAMES_PER_STEP,
    config: { damping: 12, stiffness: 180, mass: 0.45 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `radial-gradient(circle at 50% 40%, ${accentColor}22 0%, transparent 55%)`,
      }}
    >
      <div
        ref={scope}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          perspective: 1100,
        }}
      >
        <span
          style={{
            fontSize: 160,
            fontWeight: 800,
            color: accentColor,
            fontFamily,
            lineHeight: 1,
            opacity: colonOpacity,
            transform: "translateY(-8px)",
          }}
        >
          :
        </span>

        <div
          className="countdown-flip-inner"
          style={{
            transformStyle: "preserve-3d",
            fontSize: label === "GO!" ? 140 : 160,
            fontWeight: 900,
            color: textColor,
            fontFamily,
            letterSpacing: label === "GO!" ? "0.04em" : "0",
            minWidth: 280,
            textAlign: "center",
            lineHeight: 1,
            textShadow:
              label === "GO!"
                ? `0 0 ${24 + accentSpring * 20}px ${accentColor}88`
                : `0 8px 32px ${accentColor}33`,
          }}
        >
          {label}
        </div>

        <span
          style={{
            fontSize: 160,
            fontWeight: 800,
            color: accentColor,
            fontFamily,
            lineHeight: 1,
            opacity: colonOpacity,
            transform: "translateY(-8px)",
          }}
        >
          :
        </span>
      </div>
    </AbsoluteFill>
  );
};
