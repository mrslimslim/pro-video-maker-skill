import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { ContentBulletStaggerProps } from "./schema";

export const ContentBulletStagger: React.FC<ContentBulletStaggerProps> = ({
  heading,
  body,
  bulletPoints,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({
    fps,
    frame,
    config: { damping: 15, stiffness: 180, mass: 0.5 },
  });

  const alignMap = {
    centered: "center" as const,
    "left-aligned": "flex-start" as const,
    split: "flex-start" as const,
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: alignMap[layout],
        padding: "10%",
      }}
    >
      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: textColor,
          fontFamily,
          textAlign: layout === "centered" ? "center" : "left",
          opacity: headingProgress,
          transform: `translateY(${(1 - headingProgress) * 30}px)`,
          margin: 0,
          marginBottom: 32,
        }}
      >
        {heading}
      </h2>

      {body && (
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: textColor,
            fontFamily,
            textAlign: layout === "centered" ? "center" : "left",
            opacity: spring({
              fps,
              frame: frame - 10,
              config: { damping: 18, stiffness: 180 },
            }),
            margin: 0,
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          {body}
        </p>
      )}

      {bulletPoints && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: 24 }}>
          {bulletPoints.map((point, i) => {
            const itemProgress = spring({
              fps,
              frame: frame - 15 - i * 6,
              config: { damping: 15, stiffness: 200 },
            });
            return (
              <li
                key={i}
                style={{
                  fontSize: 28,
                  color: textColor,
                  fontFamily,
                  opacity: itemProgress,
                  transform: `translateX(${(1 - itemProgress) * 30}px)`,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: accentColor,
                    flexShrink: 0,
                    transform: `scale(${spring({
                      fps,
                      frame: frame - 15 - i * 6,
                      config: { damping: 8, stiffness: 300, mass: 0.4 },
                    })})`,
                    boxShadow: `0 0 8px ${accentColor}44`,
                  }}
                />
                {point}
              </li>
            );
          })}
        </ul>
      )}
    </AbsoluteFill>
  );
};
