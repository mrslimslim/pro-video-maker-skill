import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { PricingTableSlideProps } from "./schema";

export const PricingTableSlide: React.FC<PricingTableSlideProps> = ({
  plans,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaEnter = spring({
    fps,
    frame: frame - 48,
    config: { damping: 14, stiffness: 160, mass: 0.55 },
  });
  const ctaPulse = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2 * 1.6);

  const { scope } = useGsapTimeline(
    (tl, el) => {
      const cards = el.querySelectorAll<HTMLElement>(".pts-card");
      const feats = el.querySelectorAll<HTMLElement>(".pts-feature");
      const hi = el.querySelectorAll<HTMLElement>(".pts-card--highlight");

      if (cards.length) {
        tl.from(cards, {
          x: (i: number) => (i % 2 === 0 ? -100 : 100),
          opacity: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: "power3.out",
        });
      }

      if (hi.length) {
        tl.to(
          hi,
          {
            scale: 1.05,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.25"
        );
      }

      if (feats.length) {
        tl.from(
          feats,
          {
            x: -14,
            opacity: 0,
            stagger: 0.035,
            duration: 0.28,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }
    },
    [plans]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "6% 5%",
        fontFamily,
      }}
    >
      <div
        ref={scope}
        style={{
          width: "100%",
          maxWidth: 1120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 20,
            width: "100%",
          }}
        >
          {plans.map((plan, i) => {
            const start = 20 + i * 10;
            const count = Math.round(
              interpolate(frame, [start, start + 40], [0, plan.price], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            );
            const isHi = Boolean(plan.highlighted);
            return (
              <div
                key={`${plan.name}-${i}`}
                className={`pts-card${isHi ? " pts-card--highlight" : ""}`}
                style={{
                  flex: "1 1 220px",
                  maxWidth: 320,
                  minWidth: 200,
                  padding: "24px 22px",
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `2px solid ${isHi ? accentColor : "rgba(255,255,255,0.12)"}`,
                  boxShadow: isHi ? `0 0 0 1px ${accentColor}44, 0 20px 50px rgba(0,0,0,0.35)` : "0 12px 32px rgba(0,0,0,0.25)",
                  transform: "scale(1)",
                  transformOrigin: "50% 50%",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: textColor,
                    marginBottom: 12,
                  }}
                >
                  {plan.name}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 38, fontWeight: 800, color: accentColor }}>${count}</span>
                  {plan.period && (
                    <span style={{ fontSize: 16, color: `${textColor}aa`, marginLeft: 6 }}>{plan.period}</span>
                  )}
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {plan.features.map((f, j) => (
                    <li
                      key={`${i}-${j}`}
                      className="pts-feature"
                      style={{
                        fontSize: 15,
                        color: `${textColor}dd`,
                        padding: "6px 0",
                        borderBottom: j < plan.features.length - 1 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                      }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="pts-cta"
          style={{
            border: "none",
            cursor: "default",
            padding: "14px 36px",
            borderRadius: 999,
            backgroundColor: accentColor,
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            fontFamily,
            opacity: ctaEnter,
            transform: `scale(${ctaEnter * ctaPulse})`,
            boxShadow: `0 8px 28px ${accentColor}66`,
          }}
        >
          Get started
        </button>
      </div>
    </AbsoluteFill>
  );
};
