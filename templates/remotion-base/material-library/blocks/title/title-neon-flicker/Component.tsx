import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { TitleNeonFlickerProps } from "./schema";

export const TitleNeonFlicker: React.FC<TitleNeonFlickerProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
  glowColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const powerOn = spring({
    fps,
    frame: frame - 5,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  // Flicker sequence during "power-on" (first ~25 frames)
  const flickerPattern = [0, 1, 0, 1, 0.3, 1, 0.6, 1, 0.2, 1, 1];
  const flickerIdx = Math.min(
    Math.floor(frame / 2.5),
    flickerPattern.length - 1
  );
  const flickerValue = frame < 25 ? flickerPattern[flickerIdx] : 1;

  const breathe = frame >= 25
    ? 0.85 + 0.15 * Math.sin((frame - 25) * 0.04)
    : flickerValue;

  const glowIntensity = powerOn * breathe;
  const glowSize = 20 * glowIntensity;

  const textShadow = [
    `0 0 ${glowSize * 0.4}px ${glowColor}`,
    `0 0 ${glowSize}px ${glowColor}`,
    `0 0 ${glowSize * 2}px ${glowColor}88`,
    `0 0 ${glowSize * 4}px ${glowColor}44`,
  ].join(", ");

  const subProgress = spring({
    fps,
    frame: frame - 30,
    config: { damping: 18, stiffness: 160 },
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
      <h1
        style={{
          fontSize: 80,
          fontWeight: 800,
          fontFamily,
          color: textColor,
          textShadow,
          opacity: glowIntensity,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>

      {/* Neon reflection line */}
      <div
        style={{
          width: 200,
          height: 2,
          background: glowColor,
          boxShadow: `0 0 ${glowSize}px ${glowColor}, 0 0 ${glowSize * 2}px ${glowColor}66`,
          opacity: glowIntensity * 0.8,
          margin: "24px auto",
          borderRadius: 1,
        }}
      />

      {subtitle && (
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            fontFamily,
            color: textColor,
            opacity: subProgress * 0.8,
            transform: `translateY(${(1 - subProgress) * 15}px)`,
            textAlign: "center",
            margin: 0,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};
