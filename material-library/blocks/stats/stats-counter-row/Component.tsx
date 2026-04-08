import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { StatsCounterRowProps } from "./schema";

const COUNT_FRAMES = 78;
const LABEL_DELAY = 10;

export const StatsCounterRow: React.FC<StatsCounterRowProps> = ({
  stats,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  showTrendArrow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countProgress = interpolate(frame, [0, COUNT_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowBounce = spring({
    fps,
    frame: frame - COUNT_FRAMES - 8,
    config: { damping: 9, stiffness: 220, mass: 0.38 },
  });

  const labelSprings = stats.map((_, i) =>
    spring({
      fps,
      frame: frame - COUNT_FRAMES - LABEL_DELAY - i * 5,
      config: { damping: 16, stiffness: 155, mass: 0.55 },
    })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8% 6%",
        position: "relative",
        backgroundImage: `radial-gradient(ellipse at 50% 0%, ${accentColor}14 0%, transparent 55%)`,
      }}
    >
      {showTrendArrow ? (
        <div
          style={{
            position: "absolute",
            top: "12%",
            right: "10%",
            opacity: arrowBounce,
            transform: `translateY(${(1 - arrowBounce) * 28}px) scale(${0.6 + arrowBounce * 0.4})`,
          }}
          aria-hidden
        >
          <svg width={56} height={56} viewBox="0 0 24 24">
            <path
              d="M12 4 L12 20 M6 10 L12 4 L18 10"
              fill="none"
              stroke={accentColor}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: 1120,
          gap: 24,
        }}
      >
        {stats.map((s, i) => {
          const displayed = Math.round(s.value * countProgress);
          const labelSpring = labelSprings[i] ?? 0;

          return (
            <div
              key={`${s.label}-${i}`}
              style={{
                flex: 1,
                textAlign: "center",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: textColor,
                  fontFamily,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {s.prefix ?? ""}
                {displayed}
                {s.suffix ?? ""}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 18,
                  fontWeight: 600,
                  color: accentColor,
                  fontFamily,
                  opacity: labelSpring,
                  transform: `translateY(${(1 - labelSpring) * 14}px)`,
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
