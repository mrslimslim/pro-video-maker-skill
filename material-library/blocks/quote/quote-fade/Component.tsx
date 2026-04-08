import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { QuoteFadeProps } from "./schema";

export const QuoteFade: React.FC<QuoteFadeProps> = ({
  quote,
  author,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteMarkProgress = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 100 },
  });

  const textProgress = spring({
    fps,
    frame: frame - 10,
    config: { damping: 15, stiffness: 150, mass: 0.6 },
  });

  const authorProgress = spring({
    fps,
    frame: frame - 25,
    config: { damping: 18, stiffness: 180 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "12%",
      }}
    >
      <span
        style={{
          fontSize: 120,
          color: accentColor,
          fontFamily: "Georgia, serif",
          lineHeight: 0.8,
          opacity: quoteMarkProgress,
          transform: `scale(${0.5 + quoteMarkProgress * 0.5})`,
          display: "block",
          marginBottom: 24,
        }}
      >
        {"\u201C"}
      </span>

      <p
        style={{
          fontSize: 40,
          fontWeight: 500,
          color: textColor,
          fontFamily,
          textAlign: "center",
          lineHeight: 1.6,
          fontStyle: "italic",
          opacity: textProgress,
          transform: `translateY(${(1 - textProgress) * 20}px)`,
          margin: 0,
          maxWidth: 900,
        }}
      >
        {quote}
      </p>

      {author && (
        <p
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: accentColor,
            fontFamily,
            opacity: authorProgress,
            margin: 0,
            marginTop: 32,
          }}
        >
          {"\u2014"} {author}
        </p>
      )}
    </AbsoluteFill>
  );
};
