import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { ContentCardStackProps } from "./schema";

export const ContentCardStack: React.FC<ContentCardStackProps> = ({
  title,
  cards,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const underlineW = interpolate(frame, [18, 72], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentPop = spring({
    fps,
    frame: frame - 52,
    config: { damping: 14, stiffness: 170, mass: 0.55 },
  });

  const { scope } = useGsapTimeline((tl, el) => {
    const titleEl = el.querySelector<HTMLElement>(".ccs-title");
    const cardEls = el.querySelectorAll<HTMLElement>(".ccs-card");
    const n = cardEls.length;

    if (titleEl) {
      tl.from(titleEl, {
        y: -28,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    if (n > 0) {
      const spread = Math.min(48, 12 + n * 8);
      tl.to(
        cardEls,
        {
          rotateZ: (i: number) => {
            if (n <= 1) return 0;
            return -spread / 2 + (i / (n - 1)) * spread;
          },
          y: (i: number) => i * 26,
          stagger: 0.11,
          duration: 0.9,
          ease: "power3.out",
          transformOrigin: "50% 100%",
        },
        titleEl ? "-=0.2" : 0
      );
    }
  }, [title, cards.length]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8% 10%",
      }}
    >
      <div
        ref={scope}
        style={{
          perspective: 1000,
          width: "100%",
          maxWidth: 960,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          className="ccs-title"
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: textColor,
            fontFamily,
            margin: 0,
            marginBottom: 48,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>

        <div
          className="ccs-stage"
          style={{
            position: "relative",
            width: 360,
            height: 440,
            transformStyle: "preserve-3d",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={`${card.title}-${i}`}
              className="ccs-card"
              style={{
                position: "absolute",
                left: "50%",
                top: "42%",
                width: 320,
                marginLeft: -160,
                marginTop: -180,
                padding: "28px 32px",
                borderRadius: 16,
                backgroundColor: "rgba(255, 255, 255, 0.96)",
                boxShadow: "0 18px 40px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0,0,0,0.06)",
                zIndex: i + 1,
                transform: "rotateZ(0deg) translateY(0px)",
                transformOrigin: "50% 100%",
                borderLeft: `4px solid ${accentColor}`,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: 12,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#0F172A",
                  fontFamily,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#334155",
                  fontFamily,
                  lineHeight: 1.55,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            width: 140,
            height: 4,
            borderRadius: 2,
            backgroundColor: `${accentColor}33`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${underlineW}%`,
              borderRadius: 2,
              backgroundColor: accentColor,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 16,
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: accentColor,
            opacity: accentPop,
            transform: `scale(${0.4 + accentPop * 0.6})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
