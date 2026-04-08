import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { ImageShowcaseGsapProps } from "./schema";

export const ImageShowcaseGsap: React.FC<ImageShowcaseGsapProps> = ({
  imageSrc,
  overlayText,
  overlaySubtext,
  textColor,
  accentColor,
  fontFamily,
  zoomIntensity,
}) => {
  const endScale = 1 + zoomIntensity;

  const { scope } = useGsapTimeline((tl, el) => {
    const img = el.querySelector<HTMLElement>(".showcase-img");
    const overlay = el.querySelector<HTMLElement>(".showcase-overlay");
    const text = el.querySelector<HTMLElement>(".showcase-text");
    const sub = el.querySelector<HTMLElement>(".showcase-subtext");

    // Ken Burns: slow zoom + slight pan over the entire scene duration
    tl.fromTo(
      img!,
      { scale: 1, x: "0%", y: "0%" },
      { scale: endScale, x: "-2%", y: "-1%", duration: 5, ease: "none" }
    );

    // Overlay fades in
    tl.from(overlay!, { opacity: 0, duration: 0.6, ease: "power2.out" }, 0.3);

    // Text slides up
    if (text) {
      tl.from(text, { y: 50, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.6);
    }
    if (sub) {
      tl.from(sub, { y: 30, opacity: 0, duration: 0.4, ease: "power2.out" }, 0.85);
    }
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div ref={scope} style={{ width: "100%", height: "100%", position: "relative" }}>
        <Img
          className="showcase-img"
          src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transformOrigin: "center center",
          }}
        />

        <div
          className="showcase-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }}
        />

        {/* Cinematic vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 150px 60px rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "8%",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {overlayText && (
            <h2
              className="showcase-text"
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: textColor,
                fontFamily,
                margin: 0,
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {overlayText}
            </h2>
          )}
          {overlaySubtext && (
            <p
              className="showcase-subtext"
              style={{
                fontSize: 28,
                fontWeight: 400,
                color: textColor,
                fontFamily,
                margin: 0,
                opacity: 0.85,
                textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              }}
            >
              {overlaySubtext}
            </p>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
