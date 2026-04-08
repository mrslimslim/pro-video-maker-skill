import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface SubtitleEntry {
  start: number;
  end: number;
  text: string;
}

interface SubtitleProps {
  entries: SubtitleEntry[];
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  position?: "top" | "center" | "bottom";
  style?: "box" | "shadow" | "outline";
  fontFamily?: string;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  entries,
  fontSize = 32,
  color = "#FFFFFF",
  backgroundColor = "rgba(0, 0, 0, 0.6)",
  position = "bottom",
  style = "box",
  fontFamily = "Inter, sans-serif",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const active = entries.find(
    (e) => currentTime >= e.start && currentTime < e.end
  );

  if (!active) return null;

  const entryFrame = active.start * fps;
  const progress = spring({
    fps,
    frame: frame - entryFrame,
    config: { damping: 15, stiffness: 200 },
  });

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { top: "10%", left: "50%", transform: "translateX(-50%)" },
    center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    bottom: { bottom: "10%", left: "50%", transform: "translateX(-50%)" },
  };

  const textStyles: Record<string, React.CSSProperties> = {
    box: {
      backgroundColor,
      padding: "8px 20px",
      borderRadius: 8,
    },
    shadow: {
      textShadow: "0 2px 8px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.6)",
    },
    outline: {
      WebkitTextStroke: "1.5px rgba(0, 0, 0, 0.8)",
      paintOrder: "stroke fill",
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        maxWidth: "80%",
        textAlign: "center",
        opacity: progress,
        scale: String(0.9 + progress * 0.1),
        zIndex: 100,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color,
          fontFamily,
          lineHeight: 1.5,
          letterSpacing: "0.02em",
          ...textStyles[style],
        }}
      >
        {active.text}
      </span>
    </div>
  );
};
