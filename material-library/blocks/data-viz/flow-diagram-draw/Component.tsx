import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { useVivusAnimation } from "@/hooks/useVivusAnimation";
import { FlowDiagramDrawProps } from "./schema";

const NODE_SIZE = 56;
const GAP = 120;

function buildConnectorSvg(
  count: number,
  direction: "horizontal" | "vertical"
): string {
  const paths: string[] = [];
  for (let i = 0; i < count - 1; i++) {
    if (direction === "horizontal") {
      const x1 = i * GAP + NODE_SIZE;
      const x2 = (i + 1) * GAP;
      const y = NODE_SIZE / 2;
      paths.push(
        `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="currentColor" stroke-width="2" />`
      );
    } else {
      const x = NODE_SIZE / 2;
      const y1 = i * GAP + NODE_SIZE;
      const y2 = (i + 1) * GAP;
      paths.push(
        `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="currentColor" stroke-width="2" />`
      );
    }
  }
  return paths.join("");
}

export const FlowDiagramDraw: React.FC<FlowDiagramDrawProps> = ({
  heading,
  steps,
  direction,
  backgroundColor,
  textColor,
  accentColor,
  lineColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = steps.length;

  const connectorSvg = useMemo(
    () => buildConnectorSvg(count, direction),
    [count, direction]
  );

  const totalLineDrawFrames = 40;
  const nodeStagger = 18;

  const svgRef = useVivusAnimation({
    startFrame: 10,
    durationFrames: totalLineDrawFrames,
    type: "oneByOne",
  });

  const { scope } = useGsapTimeline((tl, el) => {
    const nodes = el.querySelectorAll<HTMLElement>(".flow-node");
    const labels = el.querySelectorAll<HTMLElement>(".flow-label");
    const descs = el.querySelectorAll<HTMLElement>(".flow-desc");

    tl.from(nodes, {
      scale: 0,
      opacity: 0,
      stagger: nodeStagger / fps,
      duration: 0.35,
      ease: "back.out(2)",
      delay: (10 + totalLineDrawFrames * 0.3) / fps,
    });

    tl.from(
      labels,
      {
        y: 10,
        opacity: 0,
        stagger: nodeStagger / fps,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.3"
    );

    if (descs.length) {
      tl.from(
        descs,
        {
          opacity: 0,
          stagger: nodeStagger / fps,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.15"
      );
    }
  });

  const headingProgress = heading
    ? spring({ fps, frame, config: { damping: 15, stiffness: 200 } })
    : 0;

  const isHorizontal = direction === "horizontal";
  const svgW = isHorizontal ? (count - 1) * GAP + NODE_SIZE : NODE_SIZE;
  const svgH = isHorizontal ? NODE_SIZE : (count - 1) * GAP + NODE_SIZE;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8%",
        gap: 40,
      }}
    >
      {heading && (
        <h2
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: textColor,
            fontFamily,
            textAlign: "center",
            margin: 0,
            opacity: headingProgress,
            transform: `translateY(${(1 - headingProgress) * 20}px)`,
          }}
        >
          {heading}
        </h2>
      )}

      <div style={{ position: "relative" }}>
        {/* Connector lines drawn by Vivus */}
        {count > 1 && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgW} ${svgH}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: svgW,
              height: svgH,
              color: lineColor,
              overflow: "visible",
            }}
            dangerouslySetInnerHTML={{ __html: connectorSvg }}
          />
        )}

        {/* Nodes overlay */}
        <div
          ref={scope}
          style={{
            display: "flex",
            flexDirection: isHorizontal ? "row" : "column",
            gap: GAP - NODE_SIZE,
            position: "relative",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: NODE_SIZE,
                gap: 10,
              }}
            >
              <div
                className="flow-node"
                style={{
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  borderRadius: NODE_SIZE / 2,
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
                  {i + 1}
                </span>
              </div>
              <span
                className="flow-label"
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: textColor,
                  fontFamily,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
              {step.description && (
                <span
                  className="flow-desc"
                  style={{
                    fontSize: 13,
                    color: `${textColor}AA`,
                    fontFamily,
                    textAlign: "center",
                    maxWidth: 100,
                    lineHeight: 1.3,
                  }}
                >
                  {step.description}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
