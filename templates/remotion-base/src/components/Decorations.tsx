import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

/* ---------- Confetti ---------- */

interface ConfettiProps {
  count?: number;
  colors?: string[];
  gravity?: number;
  startFrame?: number;
  spread?: number;
  origin?: { x: number; y: number };
}

export const Confetti: React.FC<ConfettiProps> = ({
  count = 80,
  colors = ["#FF006E", "#00F5D4", "#FFBE0B", "#6366F1", "#FB5607"],
  gravity = 0.12,
  startFrame = 0,
  spread = 15,
  origin = { x: 50, y: 40 },
}) => {
  const frame = useCurrentFrame();

  const pieces = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = ((i * 137.5) % 360) * (Math.PI / 180);
        const velocity = 3 + ((i * 7 + 13) % 10) * 0.8;
        return {
          vx: Math.cos(angle) * velocity * (0.6 + Math.random() * 0.4) * (spread / 10),
          vy: -Math.abs(Math.sin(angle)) * velocity * 1.2 - 2,
          rotation: (i * 47) % 360,
          rotSpeed: ((i % 11) - 5) * 6,
          color: colors[i % colors.length],
          width: 6 + (i % 4) * 2,
          height: 4 + (i % 3) * 3,
          wobble: (i * 0.13) % (Math.PI * 2),
          wobbleSpeed: 0.05 + (i % 7) * 0.01,
        };
      }),
    [count, colors, spread]
  );

  const elapsed = Math.max(0, frame - startFrame);
  if (elapsed <= 0) return null;

  const t = elapsed / 30;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((p, i) => {
        const x = origin.x + p.vx * t * 20;
        const y = origin.y + (p.vy * t * 20 + 0.5 * gravity * t * t * 400);
        const wobble = Math.sin(elapsed * p.wobbleSpeed + p.wobble) * 8;
        const rot = p.rotation + p.rotSpeed * t * 10;
        const fadeOut = interpolate(elapsed, [60, 120], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x + wobble}%`,
              top: `${y}%`,
              width: p.width,
              height: p.height,
              backgroundColor: p.color,
              borderRadius: i % 3 === 0 ? "50%" : 1,
              transform: `rotate(${rot}deg)`,
              opacity: fadeOut,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- Sparkles ---------- */

interface SparklesProps {
  count?: number;
  color?: string;
  maxSize?: number;
  area?: { top: string; left: string; width: string; height: string };
}

export const Sparkles: React.FC<SparklesProps> = ({
  count = 12,
  color = "#FFFFFF",
  maxSize = 8,
  area = { top: "10%", left: "10%", width: "80%", height: "80%" },
}) => {
  const frame = useCurrentFrame();

  const sparks = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 67 + 23) % 100),
        y: ((i * 43 + 17) % 100),
        size: 3 + (i % 3) * ((maxSize - 3) / 2),
        period: 20 + (i % 8) * 5,
        phase: (i * 3.1) % (Math.PI * 2),
        burstFrame: (i * 19 + 7) % 90,
      })),
    [count, maxSize]
  );

  return (
    <div
      style={{
        position: "absolute",
        ...area,
        pointerEvents: "none",
      }}
    >
      {sparks.map((s, i) => {
        const cycle = (frame + s.burstFrame) % s.period;
        const sparkProgress = cycle / s.period;
        const opacity =
          sparkProgress < 0.3
            ? interpolate(sparkProgress, [0, 0.3], [0, 1])
            : sparkProgress < 0.5
              ? 1
              : interpolate(sparkProgress, [0.5, 1], [1, 0]);
        const scale = 0.5 + opacity * 0.5;

        return (
          <svg
            key={i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size * 2,
              height: s.size * 2,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${frame * 2 + i * 45}deg)`,
            }}
            viewBox="0 0 20 20"
          >
            <path
              d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
              fill={color}
            />
          </svg>
        );
      })}
    </div>
  );
};

/* ---------- LightSweep ---------- */

interface LightSweepProps {
  color?: string;
  width?: number;
  angle?: number;
  startFrame?: number;
  durationFrames?: number;
  repeat?: boolean;
  repeatInterval?: number;
}

export const LightSweep: React.FC<LightSweepProps> = ({
  color = "rgba(255,255,255,0.15)",
  width: sweepWidth = 200,
  angle = -20,
  startFrame = 10,
  durationFrames = 30,
  repeat = false,
  repeatInterval = 90,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  let effectiveFrame = frame - startFrame;
  if (repeat && effectiveFrame > 0) {
    effectiveFrame = effectiveFrame % repeatInterval;
  }

  const progress = interpolate(effectiveFrame, [0, durationFrames], [-0.3, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (progress <= -0.3 || progress >= 1.3) return null;

  const xPos = progress * (width + sweepWidth * 2) - sweepWidth;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: xPos,
          width: sweepWidth,
          height: "140%",
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          transform: `skewX(${angle}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- GlitchOverlay ---------- */

interface GlitchOverlayProps {
  intensity?: number;
  startFrame?: number;
  durationFrames?: number;
  rgbOffset?: number;
  slices?: number;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({
  intensity = 1,
  startFrame = 0,
  durationFrames = 15,
  rgbOffset = 4,
  slices = 6,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  if (elapsed < 0 || elapsed > durationFrames) return null;

  const glitchIntensity = interpolate(
    elapsed,
    [0, durationFrames * 0.3, durationFrames * 0.7, durationFrames],
    [0, intensity, intensity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const seed = (frame * 7 + 13) % 97;
  const pseudoRandom = (n: number) => ((seed * (n + 1) * 9301 + 49297) % 233280) / 233280;

  const sliceElements = Array.from({ length: slices }, (_, i) => {
    const top = (i / slices) * 100;
    const height = 100 / slices;
    const offsetX = (pseudoRandom(i) - 0.5) * 20 * glitchIntensity;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          top: `${top}%`,
          left: 0,
          right: 0,
          height: `${height}%`,
          transform: `translateX(${offsetX}px)`,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {sliceElements}
      <AbsoluteFill
        style={{
          background: `rgba(255,0,0,${0.08 * glitchIntensity})`,
          transform: `translateX(${rgbOffset * glitchIntensity}px)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background: `rgba(0,255,255,${0.06 * glitchIntensity})`,
          transform: `translateX(${-rgbOffset * glitchIntensity}px)`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- NeonGlow ---------- */

interface NeonGlowProps {
  color?: string;
  size?: number;
  pulseSpeed?: number;
  children: React.ReactNode;
  mode?: "text" | "box";
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  color = "#22D3EE",
  size = 20,
  pulseSpeed = 0.06,
  children,
  mode = "text",
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.sin(frame * pulseSpeed);
  const glowSize = size * pulse;

  const shadowValue =
    mode === "text"
      ? `0 0 ${glowSize * 0.3}px ${color}, 0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}88`
      : `0 0 ${glowSize * 0.5}px ${color}, 0 0 ${glowSize * 1.5}px ${color}66, inset 0 0 ${glowSize * 0.3}px ${color}44`;

  const style: React.CSSProperties =
    mode === "text"
      ? { textShadow: shadowValue, display: "inline-block" }
      : { boxShadow: shadowValue, display: "inline-block" };

  return <div style={style}>{children}</div>;
};
