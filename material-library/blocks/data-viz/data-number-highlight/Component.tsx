import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { DataNumberHighlightProps } from "./schema";

const COUNT_FRAMES = 100;
const RING_RADIUS = 140;
const RING_STROKE = 10;
const RING_C = 2 * Math.PI * RING_RADIUS;

export const DataNumberHighlight: React.FC<DataNumberHighlightProps> = ({
  value,
  label,
  prefix = "",
  suffix = "",
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countProgress = interpolate(frame, [0, COUNT_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayed = Math.round(value * countProgress);

  const pulseAtFrame = COUNT_FRAMES * 0.8;
  const numberScale =
    1 +
    interpolate(frame, [pulseAtFrame, pulseAtFrame + 9, pulseAtFrame + 18], [0, 0.1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const ringOffset = RING_C * (1 - countProgress);

  const digitLen = `${Math.round(Math.abs(value))}`.length + prefix.length + suffix.length;
  const numberFontSize = Math.min(112, Math.max(56, 128 - digitLen * 6));

  const labelProgress = spring({
    fps,
    frame: frame - COUNT_FRAMES - 8,
    config: { damping: 16, stiffness: 140, mass: 0.55 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8%",
      }}
    >
      <div style={{ position: "relative", width: RING_RADIUS * 2 + 80, height: RING_RADIUS * 2 + 80 }}>
        <svg
          width={RING_RADIUS * 2 + 80}
          height={RING_RADIUS * 2 + 80}
          style={{ position: "absolute", inset: 0 }}
          viewBox={`0 0 ${RING_RADIUS * 2 + 80} ${RING_RADIUS * 2 + 80}`}
        >
          <g transform={`translate(${(RING_RADIUS * 2 + 80) / 2}, ${(RING_RADIUS * 2 + 80) / 2})`}>
            <circle
              r={RING_RADIUS}
              fill="none"
              stroke={textColor}
              strokeWidth={RING_STROKE}
              opacity={0.12}
            />
            <circle
              r={RING_RADIUS}
              fill="none"
              stroke={accentColor}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={ringOffset}
              transform="rotate(-90)"
            />
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            transform: `scale(${numberScale})`,
          }}
        >
          <span
            style={{
              fontSize: numberFontSize,
              fontWeight: 800,
              color: accentColor,
              fontFamily,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {prefix}
            {displayed.toLocaleString()}
            {suffix}
          </span>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          marginTop: 28,
          fontSize: 28,
          fontWeight: 600,
          color: textColor,
          fontFamily,
          textAlign: "center",
          maxWidth: 900,
          opacity: labelProgress,
          transform: `translateY(${(1 - labelProgress) * 16}px)`,
        }}
      >
        {label}
      </p>
    </AbsoluteFill>
  );
};
