import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { TestimonialQuoteCardProps } from "./schema";

export const TestimonialQuoteCard: React.FC<TestimonialQuoteCardProps> = ({
  quote,
  author,
  role,
  rating,
  avatarColor,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardLift = spring({
    fps,
    frame,
    config: { damping: 15, stiffness: 118, mass: 0.7 },
  });

  const cardOpacity = spring({
    fps,
    frame: frame - 4,
    config: { damping: 17, stiffness: 132, mass: 0.58 },
  });

  const avatarScale = spring({
    fps,
    frame: frame - 12,
    config: { damping: 11, stiffness: 210, mass: 0.42 },
  });

  const quoteOpacity = spring({
    fps,
    frame: frame - 28,
    config: { damping: 16, stiffness: 145, mass: 0.55 },
  });

  const authorOpacity = spring({
    fps,
    frame: frame - 62,
    config: { damping: 18, stiffness: 150, mass: 0.55 },
  });

  const initials = useMemo(() => {
    const parts = author.trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "?";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [author]);

  const { scope } = useGsapTimeline(
    (tl, el) => {
      const stars = el.querySelectorAll<HTMLElement>(".tqc-star-active");
      if (!stars.length) return;
      tl.fromTo(
        stars,
        { color: "rgba(148,163,184,0.35)", scale: 0.65 },
        {
          color: "#FBBF24",
          scale: 1,
          duration: 0.22,
          stagger: 0.12,
          ease: "back.out(1.6)",
        },
        1.05
      );
    },
    [rating]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10%",
        backgroundImage: `radial-gradient(ellipse at 20% 0%, ${accentColor}18 0%, transparent 50%)`,
      }}
    >
      <div
        ref={scope}
        style={{
          width: "100%",
          maxWidth: 720,
          opacity: cardOpacity,
          transform: `translateY(${(1 - cardLift) * 64}px)`,
          borderRadius: 24,
          padding: "40px 44px",
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          border: `1px solid ${textColor}22`,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: `0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px ${accentColor}14 inset`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              transform: `scale(${avatarScale})`,
              boxShadow: `0 12px 28px ${avatarColor}55`,
              overflow: "hidden",
            }}
          >
            {initials}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < rating ? "tqc-star-active" : "tqc-star-dim"}
                style={{
                  fontSize: 28,
                  lineHeight: 1,
                  color: i < rating ? "#94A3B8" : "rgba(148,163,184,0.25)",
                  display: "inline-block",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 26,
            lineHeight: 1.55,
            fontWeight: 500,
            color: textColor,
            fontFamily,
            opacity: quoteOpacity,
            transform: `translateY(${(1 - quoteOpacity) * 12}px)`,
          }}
        >
          “{quote}”
        </p>

        <div
          style={{
            marginTop: 28,
            opacity: authorOpacity,
            transform: `translateY(${(1 - authorOpacity) * 10}px)`,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: textColor, fontFamily }}>{author}</div>
          {role ? (
            <div style={{ fontSize: 16, color: accentColor, fontFamily, marginTop: 4 }}>{role}</div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
