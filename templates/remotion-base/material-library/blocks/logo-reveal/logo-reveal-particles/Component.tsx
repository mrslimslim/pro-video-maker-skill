import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { LogoRevealParticlesProps } from "./schema";

const CONVERGE_END = 60;

const rnd = (i: number, j: number, seed: string) => {
  const s = seed.length + i * 19.19 + j * 31.07;
  const x = Math.sin(s * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const LogoRevealParticles: React.FC<LogoRevealParticlesProps> = ({
  logoText,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  particleCount,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const converge = interpolate(frame, [0, CONVERGE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const easeConverge = 1 - Math.pow(1 - converge, 2.4);

  const fontSize = Math.min(120, Math.max(48, width / (Math.max(logoText.length, 1) * 1.1)));
  const textWidthApprox = logoText.length * fontSize * 0.58;
  const centerX = width / 2;
  const centerY = height / 2;

  const particles = useMemo(() => {
    const list: Array<{
      sx: number;
      sy: number;
      ex: number;
      ey: number;
    }> = [];
    for (let i = 0; i < particleCount; i++) {
      const sx = rnd(i, 0, logoText) * width;
      const sy = rnd(i, 1, logoText) * height;
      const slot = (i / Math.max(particleCount - 1, 1)) * Math.max(logoText.length * 4, 8);
      const along = slot / Math.max(logoText.length * 4, 8);
      const ex =
        centerX -
        textWidthApprox / 2 +
        along * textWidthApprox +
        (rnd(i, 2, logoText) - 0.5) * fontSize * 0.35;
      const ey = centerY + (rnd(i, 3, logoText) - 0.5) * fontSize * 0.85;
      list.push({ sx, sy, ex, ey });
    }
    return list;
  }, [particleCount, logoText, width, height, fontSize, textWidthApprox, centerX, centerY]);

  const particleFade = interpolate(frame, [52, 78], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = spring({
    fps,
    frame: frame - 48,
    config: { damping: 14, stiffness: 120, mass: 0.55 },
  });

  const pulse = Math.sin((frame - CONVERGE_END) * 0.12);
  const glowStrength =
    frame >= CONVERGE_END ? interpolate(pulse, [-1, 1], [0.35, 1]) : 0;
  const shadowBlur = 6 + glowStrength * 28;
  const shadowSpread = glowStrength * 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {particles.map((p, i) => {
        const x = interpolate(easeConverge, [0, 1], [p.sx, p.ex]);
        const y = interpolate(easeConverge, [0, 1], [p.sy, p.ey]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: accentColor,
              opacity: 0.85 * particleFade,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 10px ${accentColor}99`,
            }}
          />
        );
      })}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          fontSize,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: textColor,
          fontFamily,
          opacity: textOpacity,
          textAlign: "center",
          lineHeight: 1.05,
          textTransform: "uppercase",
          boxShadow:
            frame >= CONVERGE_END
              ? `0 0 ${shadowBlur}px ${accentColor}aa, 0 0 ${shadowBlur + shadowSpread}px ${accentColor}66`
              : "none",
        }}
      >
        {logoText}
      </div>
    </AbsoluteFill>
  );
};
