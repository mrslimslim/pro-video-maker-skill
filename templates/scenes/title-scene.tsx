import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { z } from "zod";

export const titleSceneSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

type TitleSceneProps = z.infer<typeof titleSceneSchema>;

export const TitleScene: React.FC<TitleSceneProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    fps,
    frame,
    config: { damping: 15, stiffness: 150, mass: 0.5 },
  });

  const subtitleProgress = spring({
    fps,
    frame: frame - 12,
    config: { damping: 18, stiffness: 180, mass: 0.4 },
  });

  const accentLineWidth = spring({
    fps,
    frame: frame - 8,
    config: { damping: 20, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10%",
      }}
    >
      <h1
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: textColor,
          fontFamily,
          textAlign: "center",
          opacity: titleProgress,
          transform: `translateY(${(1 - titleProgress) * 40}px)`,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>

      <div
        style={{
          width: `${accentLineWidth * 120}px`,
          height: 4,
          backgroundColor: accentColor,
          borderRadius: 2,
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      {subtitle && (
        <p
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: textColor,
            fontFamily,
            textAlign: "center",
            opacity: subtitleProgress,
            transform: `translateY(${(1 - subtitleProgress) * 20}px)`,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};
