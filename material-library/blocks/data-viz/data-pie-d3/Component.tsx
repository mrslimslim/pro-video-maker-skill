import React, { useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { useD3Animation } from "@/hooks/useD3Animation";
import * as d3 from "d3";
import { DataPieD3Props } from "./schema";

const SVG_W = 440;
const SVG_H = 280;

export const DataPieD3: React.FC<DataPieD3Props> = ({
  title,
  data,
  backgroundColor,
  textColor,
  fontFamily,
  innerRadius,
  outerRadius,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const propsRef = useRef({
    data,
    innerRadius,
    outerRadius,
    textColor,
    backgroundColor,
  });
  propsRef.current = { data, innerRadius, outerRadius, textColor, backgroundColor };

  const { ref } = useD3Animation<SVGSVGElement>(
    (svg, progress) => {
      const { data: sliceData, innerRadius: ir, outerRadius: or, backgroundColor: bg } =
        propsRef.current;
      const root = d3.select(svg);
      root.selectAll("*").remove();

      const sum = d3.sum(sliceData, (d) => d.value);
      if (sum <= 0 || sliceData.length === 0) {
        return;
      }

      const cx = SVG_W / 2;
      const cy = SVG_H / 2;
      const g = root.append("g").attr("transform", `translate(${cx},${cy})`);

      const pie = d3
        .pie<DataPieD3Props["data"][number]>()
        .value((d) => d.value)
        .sort(null);

      const arc = d3.arc<d3.PieArcDatum<DataPieD3Props["data"][number]>>().innerRadius(ir).outerRadius(or);

      const arcs = pie(sliceData);

      g.selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d, i) => sliceData[i].color ?? d3.schemeTableau10[i % 10])
        .attr("stroke", bg)
        .attr("stroke-width", 2)
        .attr("d", (d) => {
          const endAngle = d.startAngle + (d.endAngle - d.startAngle) * progress;
          return arc({ ...d, endAngle }) ?? "";
        });
    },
    { startFrame: 12, durationFrames: 110 }
  );

  const titleProgress = title
    ? spring({
        fps,
        frame: frame - 4,
        config: { damping: 15, stiffness: 200, mass: 0.5 },
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
        padding: "7%",
        gap: 28,
      }}
    >
      {title && (
        <h2
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 700,
            color: textColor,
            fontFamily,
            textAlign: "center",
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * 18}px)`,
          }}
        >
          {title}
        </h2>
      )}

      <svg ref={ref} width={SVG_W} height={SVG_H} style={{ display: "block" }} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          maxWidth: 920,
        }}
      >
        {data.map((item, i) => {
          const c = item.color ?? d3.schemeTableau10[i % 10];
          const leg = spring({
            fps,
            frame: frame - 28 - i * 10,
            config: { damping: 14, stiffness: 180, mass: 0.55 },
          });
          return (
            <div
              key={`${item.label}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: leg,
                transform: `translateY(${(1 - leg) * 14}px)`,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  backgroundColor: c,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: textColor,
                  fontFamily,
                }}
              >
                {item.label}
                <span style={{ opacity: 0.75, marginLeft: 6 }}>{item.value.toLocaleString()}</span>
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
