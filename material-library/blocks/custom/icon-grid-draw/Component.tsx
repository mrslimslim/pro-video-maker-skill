import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useVivusAnimation } from "@/hooks/useVivusAnimation";
import { IconGridDrawProps } from "./schema";

interface IconCellProps {
  svgContent: string;
  label: string;
  startFrame: number;
  drawDuration: number;
  strokeColor: string;
  textColor: string;
  fontFamily: string;
}

const IconCell: React.FC<IconCellProps> = ({
  svgContent,
  label,
  startFrame,
  drawDuration,
  strokeColor,
  textColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const svgRef = useVivusAnimation({
    startFrame,
    durationFrames: drawDuration,
    type: "oneByOne",
  });

  const labelProgress = spring({
    fps,
    frame: frame - startFrame - drawDuration,
    config: { damping: 15, stiffness: 180 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <svg
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          width: 72,
          height: 72,
          stroke: strokeColor,
          strokeWidth: 2,
          fill: "none",
        }}
      />
      <span
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: textColor,
          fontFamily,
          textAlign: "center",
          opacity: labelProgress,
          transform: `translateY(${(1 - labelProgress) * 10}px)`,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const IconGridDraw: React.FC<IconGridDrawProps> = ({
  heading,
  icons,
  columns,
  backgroundColor,
  strokeColor,
  textColor,
  fontFamily,
  drawDurationFrames,
  staggerFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = heading
    ? spring({
        fps,
        frame: frame - 0,
        config: { damping: 15, stiffness: 200 },
      })
    : 0;

  const iconStartBase = heading ? 15 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8%",
        gap: 40,
      }}
    >
      {heading && (
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: textColor,
            fontFamily,
            textAlign: "center",
            margin: 0,
            opacity: headingProgress,
            transform: `translateY(${(1 - headingProgress) * 20}px)`,
          }}
        >
          {heading}
        </h2>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 48,
          width: "100%",
          maxWidth: columns === 2 ? 480 : 640,
        }}
      >
        {icons.map((icon, i) => (
          <IconCell
            key={i}
            svgContent={icon.svgContent}
            label={icon.label}
            startFrame={iconStartBase + i * staggerFrames}
            drawDuration={drawDurationFrames}
            strokeColor={strokeColor}
            textColor={textColor}
            fontFamily={fontFamily}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
