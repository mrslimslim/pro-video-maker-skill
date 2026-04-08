import React from "react";
import { AbsoluteFill } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { CodeBlockTypewriterProps } from "./schema";

export const CodeBlockTypewriter: React.FC<CodeBlockTypewriterProps> = ({
  code,
  language,
  highlightLines = [],
  title,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const lines = code.split("\n");
  const highlightSet = new Set(highlightLines);

  const { scope } = useGsapTimeline((tl, el) => {
    const titleEl = el.querySelector<HTMLElement>(".code-title");
    const headerEl = el.querySelector<HTMLElement>(".code-header");
    const lineEls = el.querySelectorAll<HTMLElement>(".code-line");
    const cursor = el.querySelector<HTMLElement>(".code-cursor");

    if (titleEl) {
      tl.from(titleEl, { y: 20, opacity: 0, duration: 0.3, ease: "power2.out" });
    }

    if (headerEl) {
      tl.from(headerEl, { scaleY: 0, opacity: 0, duration: 0.25, ease: "power2.out" }, titleEl ? "-=0.1" : 0);
    }

    lineEls.forEach((lineEl, i) => {
      const lineDelay = 0.12;
      tl.from(lineEl, { opacity: 0, duration: 0.01 }, `+=${lineDelay}`);
      tl.from(lineEl, { width: 0, duration: 0.2, ease: "none" }, "<");

      if (highlightSet.has(i + 1)) {
        tl.to(lineEl, {
          backgroundColor: `${accentColor}22`,
          borderLeft: `3px solid ${accentColor}`,
          duration: 0.15,
          ease: "power1.out",
        }, "+=0.05");
      }
    });

    if (cursor) {
      tl.to(cursor, { opacity: 0, duration: 0.3, repeat: 3, yoyo: true }, "+=0.1");
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
        padding: "6%",
      }}
    >
      <div ref={scope} style={{ width: "100%", maxWidth: 900 }}>
        {title && (
          <h3
            className="code-title"
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: textColor,
              fontFamily: "Inter, sans-serif",
              marginBottom: 20,
              margin: 0,
              paddingBottom: 20,
            }}
          >
            {title}
          </h3>
        )}

        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: `1px solid ${textColor}18`,
          }}
        >
          <div
            className="code-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              backgroundColor: `${textColor}08`,
              transformOrigin: "top center",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: c,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: 13,
                color: `${textColor}66`,
                fontFamily,
                marginLeft: 8,
              }}
            >
              {language}
            </span>
          </div>

          <div style={{ padding: "20px 24px", position: "relative" }}>
            {lines.map((line, i) => (
              <div
                key={i}
                className="code-line"
                style={{
                  fontSize: 20,
                  fontFamily,
                  lineHeight: 1.7,
                  whiteSpace: "pre",
                  overflow: "hidden",
                  padding: "0 4px",
                  borderLeft: "3px solid transparent",
                  minHeight: "1.7em",
                  display: "flex",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    color: `${textColor}44`,
                    minWidth: 28,
                    textAlign: "right",
                    userSelect: "none",
                    fontSize: 16,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ color: textColor }}>
                  {line || " "}
                </span>
              </div>
            ))}
            <span
              className="code-cursor"
              style={{
                display: "inline-block",
                width: 10,
                height: 22,
                backgroundColor: accentColor,
                marginLeft: 2,
                verticalAlign: "middle",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
