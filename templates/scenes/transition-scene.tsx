import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { z } from "zod";

export const transitionSceneSchema = z.object({
  text: z.string().optional(),
  icon: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  accentColor: z.string().default("#6366F1"),
  textColor: z.string().default("#F8FAFC"),
  fontFamily: z.string().default("Inter"),
});

type TransitionSceneProps = z.infer<typeof transitionSceneSchema>;

export const TransitionScene: React.FC<TransitionSceneProps> = ({
  text,
  icon,
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

  const dotScale = spring({
    fps,
    frame: frame - 5,
    config: { damping: 8, stiffness: 200 },
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
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: accentColor,
              transform: `scale(${spring({
                fps,
                frame: frame - 5 - i * 4,
                config: { damping: 8, stiffness: 250 },
              })})`,
            }}
          />
        ))}
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
