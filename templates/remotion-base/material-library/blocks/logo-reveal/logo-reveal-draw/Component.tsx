import React, { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { LogoRevealDrawProps } from "./schema";

const DRAW_FRAMES = 90;
const FILL_FRAMES_START = 78;
const FILL_FRAMES_END = 130;

export const LogoRevealDraw: React.FC<LogoRevealDrawProps> = ({
  svgPath,
  label,
  backgroundColor,
  strokeColor,
  fillColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(800);

  useLayoutEffect(() => {
    const el = pathRef.current;
    if (el) {
      try {
        setPathLen(el.getTotalLength());
      } catch {
        setPathLen(800);
      }
    }
  }, [svgPath]);

  const drawT = interpolate(frame, [0, DRAW_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashOffset = interpolate(drawT, [0, 1], [pathLen, 0]);

  const fillOpacity = interpolate(frame, [FILL_FRAMES_START, FILL_FRAMES_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelSpring = spring({
    fps,
    frame: frame - FILL_FRAMES_END - 6,
    config: { damping: 14, stiffness: 140, mass: 0.55 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8%",
      }}
    >
      <svg width={420} height={320} viewBox="0 0 420 320" style={{ overflow: "visible" }}>
        <path
          ref={pathRef}
          d={svgPath}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLen}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {label ? (
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            fontWeight: 600,
            color: strokeColor,
            fontFamily,
            opacity: labelSpring,
            transform: `translateY(${(1 - labelSpring) * 18}px)`,
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
