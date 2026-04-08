import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SocialProofScrollProps } from "./schema";

const CARD_W = 300;
const GAP = 20;

export const SocialProofScroll: React.FC<SocialProofScrollProps> = ({
  items,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  speed,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const loopW = items.length * (CARD_W + GAP);
  const pixelsPerFrame = 2.4 * speed;
  const offset = loopW > 0 ? (frame * pixelsPerFrame) % loopW : 0;

  const headlineOp = spring({
    fps,
    frame: frame - 6,
    config: { damping: 14, stiffness: 100 },
  });

  const doubled = [...items, ...items];

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "7% 0",
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 800,
          color: textColor,
          textAlign: "center",
          marginBottom: 36,
          padding: "0 8%",
          opacity: headlineOp,
          transform: `translateY(${(1 - headlineOp) * 16}px)`,
        }}
      >
        Loved by teams everywhere
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 200,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "14%",
            zIndex: 2,
            pointerEvents: "none",
            background: `linear-gradient(90deg, ${backgroundColor} 0%, transparent 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "14%",
            zIndex: 2,
            pointerEvents: "none",
            background: `linear-gradient(270deg, ${backgroundColor} 0%, transparent 100%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: GAP,
            width: "max-content",
            transform: `translateX(-${offset}px)`,
            paddingLeft: GAP,
          }}
        >
          {doubled.map((it, i) => (
            <div
              key={`${it.author}-${i}`}
              style={{
                width: CARD_W,
                flexShrink: 0,
                padding: "22px 24px",
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.06)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {it.platform && (
                <span style={{ fontSize: 12, fontWeight: 700, color: accentColor, letterSpacing: 0.5 }}>{it.platform}</span>
              )}
              <p style={{ margin: 0, fontSize: 17, color: textColor, lineHeight: 1.5, fontWeight: 500 }}>{it.text}</p>
              <span style={{ fontSize: 14, color: `${textColor}99` }}>— {it.author}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
