import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface SplitTextProps {
  text: string;
  startFrame?: number;
  stagger?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  direction?: "up" | "down" | "left" | "right";
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  startFrame = 0,
  stagger = 3,
  fontSize = 64,
  fontWeight = 700,
  color = "#FAFAFA",
  direction = "up",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
      {words.map((word, i) => {
        const delay = startFrame + i * stagger;
        const progress = spring({
          fps,
          frame: frame - delay,
          config: { damping: 15, stiffness: 200, mass: 0.5 },
        });

        const translate = {
          up: `translateY(${(1 - progress) * 40}px)`,
          down: `translateY(${(progress - 1) * 40}px)`,
          left: `translateX(${(1 - progress) * 40}px)`,
          right: `translateX(${(progress - 1) * 40}px)`,
        };

        return (
          <span
            key={i}
            style={{
              fontSize,
              fontWeight,
              color,
              opacity: progress,
              transform: translate[direction],
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

interface TypewriterProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  fontSize?: number;
  color?: string;
  cursorColor?: string;
  showCursor?: boolean;
  fontFamily?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.7,
  fontSize = 32,
  color = "#FAFAFA",
  cursorColor = "#22D3EE",
  showCursor = true,
  fontFamily = "JetBrains Mono, monospace",
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  const visibleText = text.substring(0, charCount);
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <span style={{ fontSize, color, fontFamily, whiteSpace: "pre-wrap" }}>
      {visibleText}
      {showCursor && (
        <span style={{ color: cursorColor, opacity: cursorVisible ? 1 : 0 }}>
          ▌
        </span>
      )}
    </span>
  );
};

interface CounterProps {
  target: number;
  startFrame?: number;
  durationFrames?: number;
  fontSize?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  locale?: string;
}

export const Counter: React.FC<CounterProps> = ({
  target,
  startFrame = 0,
  durationFrames = 60,
  fontSize = 72,
  color = "#FAFAFA",
  prefix = "",
  suffix = "",
  locale = "en-US",
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, target],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <span style={{ fontSize, color, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {Math.round(value).toLocaleString(locale)}
      {suffix}
    </span>
  );
};
