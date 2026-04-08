import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { TransitionMinimalProps } from "./schema";

export const TransitionMinimal: React.FC<TransitionMinimalProps> = ({
  text,
  backgroundColor,
  accentColor,
  textColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          opacity: progress,
          position: "relative",
        }}
      >
        {[0, 1, 2].map((i) => {
          const dotScale = spring({
            fps,
            frame: frame - 5 - i * 4,
            config: { damping: 8, stiffness: 250 },
          });
          const rippleProgress = interpolate(
            frame - 10 - i * 4,
            [0, 30],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div key={i} style={{ position: "relative" }}>
              {/* Ripple ring */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 12 + rippleProgress * 30,
                  height: 12 + rippleProgress * 30,
                  borderRadius: "50%",
                  border: `2px solid ${accentColor}`,
                  opacity: (1 - rippleProgress) * 0.6,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: accentColor,
                  transform: `scale(${dotScale})`,
                  boxShadow: `0 0 ${8 * dotScale}px ${accentColor}55`,
                }}
              />
            </div>
          );
        })}
      </div>

      {text && (
        <span
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: textColor,
            fontFamily,
            opacity: progress,
            transform: `translateY(${(1 - progress) * 15}px)`,
          }}
        >
          {text}
        </span>
      )}
    </AbsoluteFill>
  );
};
