import React from "react";
import { AbsoluteFill } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { ComparisonSplitGsapProps } from "./schema";

export const ComparisonSplitGsap: React.FC<ComparisonSplitGsapProps> = ({
  leftLabel,
  rightLabel,
  leftContent,
  rightContent,
  backgroundColor,
  textColor,
  accentColor,
  leftColor,
  rightColor,
  fontFamily,
}) => {
  const { scope } = useGsapTimeline((tl, el) => {
    const divider = el.querySelector<HTMLElement>(".comp-divider");
    const leftSide = el.querySelector<HTMLElement>(".comp-left");
    const rightSide = el.querySelector<HTMLElement>(".comp-right");
    const leftLabelEl = el.querySelector<HTMLElement>(".comp-left-label");
    const rightLabelEl = el.querySelector<HTMLElement>(".comp-right-label");
    const leftBody = el.querySelector<HTMLElement>(".comp-left-body");
    const rightBody = el.querySelector<HTMLElement>(".comp-right-body");

    tl.from(divider!, { scaleY: 0, duration: 0.4, ease: "power3.out" });

    tl.from(leftSide!, { x: -60, opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.15");
    tl.from(rightSide!, { x: 60, opacity: 0, duration: 0.4, ease: "power2.out" }, "<");

    tl.from(leftLabelEl!, { y: 15, opacity: 0, duration: 0.3, ease: "power2.out" }, "-=0.1");
    tl.from(rightLabelEl!, { y: 15, opacity: 0, duration: 0.3, ease: "power2.out" }, "<");

    tl.from(leftBody!, { y: 20, opacity: 0, duration: 0.35, ease: "power2.out" }, "-=0.1");
    tl.from(rightBody!, { y: 20, opacity: 0, duration: 0.35, ease: "power2.out" }, "<");
  });

  const sideStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "5%",
    gap: 20,
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
      }}
    >
      <div ref={scope} style={{ display: "flex", width: "100%", height: "100%" }}>
        <div className="comp-left" style={sideStyle}>
          <div
            className="comp-left-label"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: leftColor,
              fontFamily,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {leftLabel}
          </div>
          <div
            className="comp-left-body"
            style={{
              fontSize: 28,
              color: textColor,
              fontFamily,
              lineHeight: 1.5,
            }}
          >
            {leftContent}
          </div>
        </div>

        <div
          className="comp-divider"
          style={{
            width: 4,
            backgroundColor: accentColor,
            alignSelf: "center",
            height: "60%",
            borderRadius: 2,
            transformOrigin: "center center",
          }}
        />

        <div className="comp-right" style={sideStyle}>
          <div
            className="comp-right-label"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: rightColor,
              fontFamily,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {rightLabel}
          </div>
          <div
            className="comp-right-body"
            style={{
              fontSize: 28,
              color: textColor,
              fontFamily,
              lineHeight: 1.5,
            }}
          >
            {rightContent}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
