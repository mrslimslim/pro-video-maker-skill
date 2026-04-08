import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { FeatureGridIconProps } from "./schema";

export const FeatureGridIcon: React.FC<FeatureGridIconProps> = ({
  title,
  features,
  columns,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    fps,
    frame: frame - 6,
    config: { damping: 14, stiffness: 150, mass: 0.52 },
  });

  const { scope } = useGsapTimeline(
    (tl, el) => {
      const cards = el.querySelectorAll<HTMLElement>(".fg-card");
      const icons = el.querySelectorAll<HTMLElement>(".fg-icon-ring");
      const titles = el.querySelectorAll<HTMLElement>(".fg-card-title");
      const descs = el.querySelectorAll<HTMLElement>(".fg-card-desc");
      if (!cards.length) return;

      tl.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.58,
          stagger: 0.12,
          ease: "back.out(1.35)",
        },
        title ? 0.42 : 0.12
      );

      tl.fromTo(
        icons,
        { scale: 0.35, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.48,
          stagger: 0.12,
          ease: "back.out(1.7)",
        },
        title ? 0.52 : 0.22
      );

      tl.fromTo(
        titles,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power3.out",
        },
        title ? 0.68 : 0.38
      );

      tl.fromTo(
        descs,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.42,
          stagger: 0.1,
          ease: "power2.out",
        },
        title ? 0.82 : 0.52
      );
    },
    [title, features.length, columns]
  );

  const lift = interpolate(frame, [0, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        padding: "7% 9%",
        backgroundImage: `linear-gradient(165deg, ${accentColor}12 0%, transparent 45%)`,
      }}
    >
      <div ref={scope} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        {title ? (
          <h2
            style={{
              margin: 0,
              marginBottom: 40,
              fontSize: 44,
              fontWeight: 800,
              color: textColor,
              fontFamily,
              opacity: titleProgress,
              transform: `translateY(${(1 - titleProgress) * 24}px)`,
            }}
          >
            {title}
          </h2>
        ) : null}

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: columns === 2 ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
            gap: 28,
            alignContent: "start",
          }}
        >
          {features.map((f, i) => (
            <div
              key={`${f.title}-${i}`}
              className="fg-card"
              style={{
                borderRadius: 20,
                padding: "28px 26px",
                backgroundColor: "rgba(15, 23, 42, 0.55)",
                border: `1px solid ${textColor}14`,
                boxShadow: `0 18px 40px rgba(0,0,0,0.28), 0 0 0 1px ${accentColor}0f inset`,
                transform: `translateY(${-2 * lift}px)`,
              }}
            >
              <div
                className="fg-icon-ring"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: `linear-gradient(145deg, ${accentColor}33, ${accentColor}12)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  boxShadow: `0 10px 24px ${accentColor}22`,
                }}
              >
                <svg width={34} height={34} viewBox="0 0 24 24" aria-hidden>
                  <path d={f.icon} fill={accentColor} />
                </svg>
              </div>
              <div
                className="fg-card-title"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: textColor,
                  fontFamily,
                  marginBottom: 10,
                }}
              >
                {f.title}
              </div>
              <p
                className="fg-card-desc"
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: `${textColor}cc`,
                  fontFamily,
                }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
