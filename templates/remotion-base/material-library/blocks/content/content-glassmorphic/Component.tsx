import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { ContentGlassmorphicProps } from "./schema";

export const ContentGlassmorphic: React.FC<ContentGlassmorphicProps> = ({
  title,
  body,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  blurAmount,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardLift = spring({
    fps,
    frame,
    config: { damping: 16, stiffness: 115, mass: 0.72 },
  });

  const cardOpacity = spring({
    fps,
    frame,
    config: { damping: 18, stiffness: 135, mass: 0.55 },
  });

  const titleReveal = spring({
    fps,
    frame: frame - 14,
    config: { damping: 15, stiffness: 165, mass: 0.48 },
  });

  const bodyReveal = spring({
    fps,
    frame: frame - 28,
    config: { damping: 16, stiffness: 155, mass: 0.52 },
  });

  const gradientAngle = interpolate(frame, [0, 150], [125, 245], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
  });

  const { scope } = useGsapTimeline((tl, el) => {
    const bar = el.querySelector<HTMLElement>(".glass-accent-bar");
    if (bar) {
      tl.from(
        bar,
        {
          scaleX: 0,
          transformOrigin: "left center",
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        0.48
      );
    }
  }, [accentColor]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10%",
        backgroundImage: `radial-gradient(ellipse at 30% 20%, ${accentColor}22 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, ${accentColor}18 0%, transparent 50%)`,
      }}
    >
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${(1 - cardLift) * 72}px)`,
          maxWidth: 720,
          width: "100%",
        }}
      >
        <div
          ref={scope}
          style={{
            padding: 1,
            borderRadius: 26,
            background: `linear-gradient(${gradientAngle}deg, ${accentColor}99, rgba(255,255,255,0.45), ${accentColor}77)`,
            boxShadow: `0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        >
          <div
            style={{
              borderRadius: 25,
              padding: "40px 44px",
              backgroundColor: "rgba(15, 23, 42, 0.35)",
              backdropFilter: `blur(${blurAmount}px) saturate(1.35)`,
              WebkitBackdropFilter: `blur(${blurAmount}px) saturate(1.35)`,
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 18,
                fontSize: 44,
                fontWeight: 800,
                color: textColor,
                fontFamily,
                lineHeight: 1.15,
                opacity: titleReveal,
                transform: `translateY(${(1 - titleReveal) * 22}px)`,
              }}
            >
              {title}
            </h2>

            <div
              className="glass-accent-bar"
              style={{
                height: 3,
                width: "100%",
                maxWidth: 200,
                borderRadius: 2,
                marginBottom: 22,
                background: `linear-gradient(90deg, ${accentColor}, rgba(255,255,255,0.85))`,
                transformOrigin: "left center",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 400,
                color: textColor,
                fontFamily,
                lineHeight: 1.65,
                opacity: 0.92 * bodyReveal,
                transform: `translateY(${(1 - bodyReveal) * 16}px)`,
              }}
            >
              {body}
            </p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
