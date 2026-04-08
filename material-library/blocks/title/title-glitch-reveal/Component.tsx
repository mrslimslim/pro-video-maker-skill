import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { TitleGlitchRevealProps } from "./schema";

export const TitleGlitchReveal: React.FC<TitleGlitchRevealProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glitchPhase = interpolate(frame, [0, 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const settled = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const seed = (frame * 9301 + 49297) % 233280;
  const rand = (n: number) => (((seed * (n + 1)) % 233280) / 233280 - 0.5) * 2;

  const { scope } = useGsapTimeline((tl, el) => {
    const sub = el.querySelector<HTMLElement>(".glitch-sub");
    const line = el.querySelector<HTMLElement>(".glitch-line");

    if (line) {
      tl.from(line, { scaleX: 0, duration: 0.3, ease: "power3.out", delay: 0.7 });
    }
    if (sub) {
      tl.from(sub, { y: 20, opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
    }
  });

  const offsetX = rand(1) * 15 * glitchPhase;
  const offsetY = rand(2) * 5 * glitchPhase;
  const hue = rand(3) * 90 * glitchPhase;

  const sliceCount = 5;
  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const top = (i / sliceCount) * 100;
    const h = 100 / sliceCount;
    const sliceX = rand(i + 10) * 20 * glitchPhase;
    return { top, h, sliceX };
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
      <div ref={scope} style={{ position: "relative", textAlign: "center" }}>
        {/* RGB offset layers */}
        {glitchPhase > 0.05 && (
          <>
            <h1
              style={{
                fontSize: 80,
                fontWeight: 900,
                fontFamily,
                color: "rgba(255,0,0,0.7)",
                position: "absolute",
                inset: 0,
                margin: 0,
                transform: `translate(${-3 * glitchPhase}px, ${1 * glitchPhase}px)`,
                mixBlendMode: "screen",
              }}
            >
              {title}
            </h1>
            <h1
              style={{
                fontSize: 80,
                fontWeight: 900,
                fontFamily,
                color: "rgba(0,255,255,0.7)",
                position: "absolute",
                inset: 0,
                margin: 0,
                transform: `translate(${3 * glitchPhase}px, ${-1 * glitchPhase}px)`,
                mixBlendMode: "screen",
              }}
            >
              {title}
            </h1>
          </>
        )}

        {/* Main title with glitch slices */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: 900,
            fontFamily,
            color: textColor,
            margin: 0,
            position: "relative",
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            filter: `hue-rotate(${hue}deg)`,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>

        <div
          className="glitch-line"
          style={{
            width: 100,
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
            margin: "20px auto",
            transformOrigin: "left center",
          }}
        />

        {subtitle && (
          <p
            className="glitch-sub"
            style={{
              fontSize: 30,
              fontWeight: 400,
              color: textColor,
              fontFamily,
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
