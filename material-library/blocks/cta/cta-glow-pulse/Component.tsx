import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { CtaGlowPulseProps } from "./schema";

export const CtaGlowPulse: React.FC<CtaGlowPulseProps> = ({
  headline,
  subtext,
  buttonText,
  backgroundColor,
  textColor,
  accentColor,
  glowColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = glowColor ?? accentColor;

  const headScale = spring({
    fps,
    frame: frame - 4,
    config: { damping: 11, stiffness: 95, mass: 0.85 },
  });

  const subOp = spring({
    fps,
    frame: frame - 22,
    config: { damping: 18, stiffness: 120 },
  });

  const btnOp = spring({
    fps,
    frame: frame - 36,
    config: { damping: 16, stiffness: 160 },
  });

  const gradShift = (frame * 1.8) % 200;
  const breathe = 0.55 + 0.45 * Math.sin((frame / fps) * Math.PI * 2 * 1.2);
  const arrowX = 6 * Math.sin((frame / fps) * Math.PI * 2 * 0.9);

  const label = buttonText ?? "Start free trial";

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10% 8%",
        fontFamily,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 56,
          fontWeight: 900,
          color: textColor,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.12,
          transform: `scale(${0.88 + headScale * 0.12})`,
          letterSpacing: -0.5,
        }}
      >
        {headline}
      </h1>

      {subtext && (
        <p
          style={{
            marginTop: 22,
            fontSize: 22,
            color: `${textColor}cc`,
            textAlign: "center",
            maxWidth: 640,
            lineHeight: 1.5,
            opacity: subOp,
            transform: `translateY(${(1 - subOp) * 12}px)`,
          }}
        >
          {subtext}
        </p>
      )}

      <div
        style={{
          marginTop: 40,
          opacity: btnOp,
          transform: `translateY(${(1 - btnOp) * 18}px) scale(${0.96 + btnOp * 0.04})`,
        }}
      >
        <button
          type="button"
          style={{
            position: "relative",
            border: "none",
            borderRadius: 999,
            padding: "16px 36px 16px 32px",
            fontSize: 19,
            fontWeight: 800,
            fontFamily,
            color: "#0f172a",
            cursor: "default",
            backgroundImage: `linear-gradient(110deg, ${accentColor} 0%, #f472b6 45%, ${accentColor} 90%)`,
            backgroundSize: "220% 100%",
            backgroundPosition: `${gradShift}% 50%`,
            boxShadow: `0 0 ${28 + 22 * breathe}px ${glow}aa, 0 12px 40px rgba(0,0,0,0.35)`,
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>{label}</span>
          <span
            style={{
              display: "inline-flex",
              fontSize: 22,
              fontWeight: 900,
              transform: `translateX(${arrowX}px)`,
            }}
          >
            →
          </span>
        </button>
      </div>
    </AbsoluteFill>
  );
};
