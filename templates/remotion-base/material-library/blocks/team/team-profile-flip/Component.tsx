import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { TeamProfileFlipProps } from "./schema";

export const TeamProfileFlip: React.FC<TeamProfileFlipProps> = ({
  members,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = spring({
    fps,
    frame: frame - 4,
    config: { damping: 16, stiffness: 120 },
  });

  const { scope } = useGsapTimeline(
    (tl, el) => {
      const inners = el.querySelectorAll<HTMLElement>(".tpf-inner");
      if (inners.length) {
        tl.to(inners, {
          rotateY: 180,
          duration: 0.95,
          stagger: 0.18,
          ease: "power2.inOut",
        });
      }
    },
    [members]
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
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: accentColor,
          marginBottom: 28,
          opacity: titleOp,
        }}
      >
        Our team
      </div>
      <div
        ref={scope}
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          width: "100%",
          maxWidth: 1100,
        }}
      >
        {members.map((m, i) => (
          <div
            key={`${m.name}-${i}`}
            className="tpf-scene"
            style={{
              width: 200,
              height: 260,
              position: "relative",
              perspective: 1000,
            }}
          >
            <div
              className="tpf-inner"
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transform: "rotateY(0deg)",
              }}
            >
              <div
                className="tpf-front"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                  transform: "rotateY(0deg)",
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    backgroundColor: m.color,
                    marginBottom: 16,
                    boxShadow: `0 12px 30px ${m.color}55`,
                  }}
                />
                <div style={{ fontSize: 20, fontWeight: 700, color: textColor, textAlign: "center" }}>{m.name}</div>
              </div>
              <div
                className="tpf-back"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: `2px solid ${accentColor}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 18,
                  transform: "rotateY(180deg)",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: accentColor,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  {m.role}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: textColor,
                    textAlign: "center",
                    lineHeight: 1.45,
                  }}
                >
                  {m.bio ?? "Dedicated to shipping great work together."}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 32,
          height: 3,
          width: interpolate(frame, [12, 48], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          borderRadius: 2,
          backgroundColor: accentColor,
          opacity: spring({ fps, frame: frame - 8, config: { damping: 18, stiffness: 140 } }),
        }}
      />
    </AbsoluteFill>
  );
};
