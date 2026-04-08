import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BeforeAfterWipeProps } from "./schema";

export const BeforeAfterWipe: React.FC<BeforeAfterWipeProps> = ({
  beforeLabel,
  afterLabel,
  beforeColor,
  afterColor,
  dividerColor,
  backgroundColor,
  textColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dividerPct = interpolate(frame, [0, 70], [4, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelFade = interpolate(frame, [58, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const handlePulse = spring({
    fps,
    frame: frame - 40,
    config: { damping: 12, stiffness: 200 },
  });

  const panelBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
    fontFamily,
  };

  return (
    <AbsoluteFill style={{ backgroundColor, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          ...panelBase,
          clipPath: `polygon(0 0, ${dividerPct}% 0, ${dividerPct}% 100%, 0 100%)`,
          background: `linear-gradient(135deg, ${beforeColor}22 0%, ${backgroundColor} 55%)`,
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: beforeColor,
            marginBottom: 20,
            opacity: labelFade,
          }}
        >
          {beforeLabel}
        </span>
        <div style={{ fontSize: 44, fontWeight: 800, color: textColor, textAlign: "center", lineHeight: 1.15 }}>
          Messy. Slow. Manual.
        </div>
        <div style={{ marginTop: 18, fontSize: 22, color: `${textColor}bb`, textAlign: "center", maxWidth: 520 }}>
          The old way of working without automation.
        </div>
      </div>

      <div
        style={{
          ...panelBase,
          clipPath: `polygon(${dividerPct}% 0, 100% 0, 100% 100%, ${dividerPct}% 100%)`,
          background: `linear-gradient(225deg, ${afterColor}28 0%, ${backgroundColor} 55%)`,
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: afterColor,
            marginBottom: 20,
            opacity: labelFade,
          }}
        >
          {afterLabel}
        </span>
        <div style={{ fontSize: 44, fontWeight: 800, color: textColor, textAlign: "center", lineHeight: 1.15 }}>
          Clear. Fast. Automated.
        </div>
        <div style={{ marginTop: 18, fontSize: 22, color: `${textColor}bb`, textAlign: "center", maxWidth: 520 }}>
          One workflow that scales with your team.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: `${dividerPct}%`,
          top: 0,
          bottom: 0,
          width: 4,
          marginLeft: -2,
          backgroundColor: dividerColor,
          boxShadow: `0 0 24px ${dividerColor}88`,
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: `${dividerPct}%`,
          top: "50%",
          width: 22,
          height: 22,
          marginLeft: -11,
          marginTop: -11,
          borderRadius: "50%",
          backgroundColor: dividerColor,
          border: `3px solid ${backgroundColor}`,
          zIndex: 4,
          transform: `scale(${0.85 + handlePulse * 0.15})`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.35)`,
        }}
      />
    </AbsoluteFill>
  );
};
