import React from "react";
import { AbsoluteFill } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { ListRevealGsapProps } from "./schema";

export const ListRevealGsap: React.FC<ListRevealGsapProps> = ({
  heading,
  items,
  numbered,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const { scope } = useGsapTimeline((tl, el) => {
    const headingEl = el.querySelector<HTMLElement>(".list-heading");
    const rows = el.querySelectorAll<HTMLElement>(".list-row");
    const badges = el.querySelectorAll<HTMLElement>(".list-badge");
    const texts = el.querySelectorAll<HTMLElement>(".list-text");

    if (headingEl) {
      tl.from(headingEl, {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    tl.from(
      badges,
      {
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 0.35,
        ease: "back.out(2)",
      },
      headingEl ? "-=0.1" : 0
    );

    tl.from(
      texts,
      {
        x: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.35,
        ease: "power2.out",
      },
      "<0.05"
    );
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8% 12%",
      }}
    >
      <div ref={scope}>
        {heading && (
          <h2
            className="list-heading"
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: textColor,
              fontFamily,
              marginBottom: 36,
              margin: 0,
              paddingBottom: 36,
            }}
          >
            {heading}
          </h2>
        )}

        {items.map((item, i) => (
          <div
            key={i}
            className="list-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div
              className="list-badge"
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily,
                }}
              >
                {numbered ? i + 1 : "•"}
              </span>
            </div>
            <span
              className="list-text"
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: textColor,
                fontFamily,
                lineHeight: 1.4,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
