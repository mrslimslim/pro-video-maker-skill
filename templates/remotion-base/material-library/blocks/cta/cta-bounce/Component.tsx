import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { CtaBounceProps } from "./schema";

export const CtaBounce: React.FC<CtaBounceProps> = ({
  headline,
  subtext,
  buttonText,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineProgress = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 150, mass: 0.6 },
  });

  const subtextProgress = spring({
    fps,
    frame: frame - 12,
    config: { damping: 15, stiffness: 180 },
  });

  const buttonProgress = spring({
    fps,
    frame: frame - 20,
    config: { damping: 10, stiffness: 200, mass: 0.8 },
  });

  const buttonPulse = Math.sin((frame - 30) * 0.1) * 0.03 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10%",
        gap: 24,
      }}
    >
      <h2
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: textColor,
          fontFamily,
          textAlign: "center",
          opacity: headlineProgress,
          transform: `scale(${0.8 + headlineProgress * 0.2})`,
          margin: 0,
        }}
      >
        {headline}
      </h2>

      {subtext && (
        <p
          style={{
            fontSize: 28,
            color: textColor,
            fontFamily,
            opacity: subtextProgress * 0.8,
            textAlign: "center",
            margin: 0,
          }}
        >
          {subtext}
        </p>
      )}

      {buttonText && (
        <div
          style={{
            marginTop: 16,
            opacity: buttonProgress,
            transform: `scale(${buttonProgress * (frame > 50 ? buttonPulse : 1)})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
              fontFamily,
              padding: "18px 52px",
              borderRadius: 14,
              boxShadow: [
                `0 8px 32px ${accentColor}55`,
                `0 0 ${20 + Math.sin(frame * 0.08) * 10}px ${accentColor}33`,
              ].join(", "),
            }}
          >
            {buttonText}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
