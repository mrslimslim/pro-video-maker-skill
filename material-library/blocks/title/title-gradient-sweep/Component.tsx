import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { TitleGradientSweepProps } from "./schema";

export const TitleGradientSweep: React.FC<TitleGradientSweepProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
  gradientFrom,
  gradientTo,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { scope } = useGsapTimeline((tl, el) => {
    const heading = el.querySelector<HTMLElement>(".gs-heading");
    const sub = el.querySelector<HTMLElement>(".gs-subtitle");
    const line = el.querySelector<HTMLElement>(".gs-line");

    if (heading) {
      tl.from(heading, {
        filter: "blur(12px)",
        opacity: 0,
        scale: 1.05,
        duration: 0.6,
        ease: "power3.out",
      });
    }
    if (line) {
      tl.from(line, { scaleX: 0, duration: 0.4, ease: "expo.out" }, "-=0.2");
    }
    if (sub) {
      tl.from(sub, { y: 20, opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.15");
    }
  });

  const sweepProgress = interpolate(frame, [15, 60], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10%",
      }}
    >
      <div ref={scope} style={{ textAlign: "center" }}>
        <h1
          className="gs-heading"
          style={{
            fontSize: 80,
            fontWeight: 800,
            fontFamily,
            margin: 0,
            background: `linear-gradient(120deg, ${gradientFrom} 0%, ${gradientTo} 50%, ${gradientFrom} 100%)`,
            backgroundSize: "200% 100%",
            backgroundPosition: `${sweepProgress}% 0`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>

        <div
          className="gs-line"
          style={{
            width: 120,
            height: 4,
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
            borderRadius: 2,
            margin: "24px auto",
            transformOrigin: "center",
          }}
        />

        {subtitle && (
          <p
            className="gs-subtitle"
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: textColor,
              fontFamily,
              margin: 0,
              opacity: 0.85,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
