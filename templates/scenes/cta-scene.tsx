import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { z } from "zod";

export const ctaSceneSchema = z.object({
  headline: z.string(),
  subtext: z.string().optional(),
  buttonText: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

type CtaSceneProps = z.infer<typeof ctaSceneSchema>;

export const CtaScene: React.FC<CtaSceneProps> = ({
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
    fps, frame,
    config: { damping: 12, stiffness: 150, mass: 0.6 },
  });

  const subtextProgress = spring({
    fps, frame: frame - 12,
    config: { damping: 15, stiffness: 180 },
  });

  const buttonProgress = spring({
    fps, frame: frame - 20,
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
              backgroundColor: accentColor,
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
              fontFamily,
              padding: "16px 48px",
              borderRadius: 12,
              boxShadow: `0 8px 32px ${accentColor}66`,
            }}
          >
            {buttonText}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
