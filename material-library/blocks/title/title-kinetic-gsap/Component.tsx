import React from "react";
import { AbsoluteFill } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { TitleKineticGsapProps } from "./schema";

export const TitleKineticGsap: React.FC<TitleKineticGsapProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const words = title.split(" ");

  const { scope } = useGsapTimeline((tl, el) => {
    const wordEls = el.querySelectorAll<HTMLElement>(".kinetic-word");
    const line = el.querySelector<HTMLElement>(".accent-line");
    const sub = el.querySelector<HTMLElement>(".kinetic-subtitle");

    tl.from(wordEls, {
      y: 80,
      opacity: 0,
      rotationX: -90,
      scale: 0.6,
      stagger: 0.08,
      duration: 0.5,
      ease: "back.out(1.7)",
    });

    if (line) {
      tl.from(
        line,
        { scaleX: 0, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      );
    }

    if (sub) {
      tl.from(
        sub,
        { y: 30, opacity: 0, duration: 0.4, ease: "power2.out" },
        "-=0.15"
      );
    }
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10%",
      }}
    >
      <div ref={scope}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            perspective: 800,
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              className="kinetic-word"
              style={{
                fontSize: 80,
                fontWeight: 800,
                color: textColor,
                fontFamily,
                display: "inline-block",
                transformStyle: "preserve-3d",
              }}
            >
              {word}
            </span>
          ))}
        </div>

        <div
          className="accent-line"
          style={{
            width: 140,
            height: 5,
            backgroundColor: accentColor,
            borderRadius: 3,
            margin: "28px auto",
            transformOrigin: "left center",
          }}
        />

        {subtitle && (
          <p
            className="kinetic-subtitle"
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: textColor,
              fontFamily,
              textAlign: "center",
              margin: 0,
              opacity: 0.85,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
