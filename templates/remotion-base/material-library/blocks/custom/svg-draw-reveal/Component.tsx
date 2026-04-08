import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useVivusAnimation } from "@/hooks/useVivusAnimation";
import { SvgDrawRevealProps } from "./schema";

export const SvgDrawReveal: React.FC<SvgDrawRevealProps> = ({
  svgContent,
  heading,
  showFill,
  strokeColor,
  fillColor,
  backgroundColor,
  textColor,
  fontFamily,
  drawDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const svgRef = useVivusAnimation({
    startFrame: 0,
    durationFrames: drawDurationFrames,
    type: "sync",
  });

  const fillOpacity = showFill
    ? interpolate(
        frame,
        [drawDurationFrames, drawDurationFrames + 20],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const headingProgress = heading
    ? spring({
        fps,
        frame: frame - drawDurationFrames - 10,
        config: { damping: 15, stiffness: 180 },
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10%",
        gap: 32,
      }}
    >
      <div
        style={{
          width: "50%",
          maxWidth: 400,
          position: "relative",
        }}
      >
        {/* Vivus-controlled stroke layer */}
        <svg
          ref={svgRef}
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{
            width: "100%",
            height: "auto",
            stroke: strokeColor,
            strokeWidth: 2,
            fill: "none",
          }}
        />

        {/* Fill layer that fades in after draw completes */}
        {showFill && (
          <svg
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "auto",
              stroke: "none",
              fill: fillColor,
              opacity: fillOpacity,
            }}
          />
        )}
      </div>

      {heading && (
        <h3
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: textColor,
            fontFamily,
            textAlign: "center",
            margin: 0,
            opacity: headingProgress,
            transform: `translateY(${(1 - headingProgress) * 20}px)`,
          }}
        >
          {heading}
        </h3>
      )}
    </AbsoluteFill>
  );
};
