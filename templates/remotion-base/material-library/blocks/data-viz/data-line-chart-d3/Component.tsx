import React, { useMemo, useRef } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { useD3Animation } from "@/hooks/useD3Animation";
import * as d3 from "d3";
import { DataLineChartD3Props } from "./schema";

const CHART_W = 760;
const CHART_H = 400;
const M = { top: 52, right: 36, bottom: 56, left: 72 };
const LINE_START = 16;
const LINE_DURATION = 96;
const LINE_END = LINE_START + LINE_DURATION;

function computeLayout(data: DataLineChartD3Props["data"]) {
  const innerW = CHART_W - M.left - M.right;
  const innerH = CHART_H - M.top - M.bottom;
  if (data.length === 0) {
    return null;
  }
  const xMin = d3.min(data, (d) => d.x) ?? 0;
  const xMax = d3.max(data, (d) => d.x) ?? 0;
  const yMin = d3.min(data, (d) => d.y) ?? 0;
  const yMax = d3.max(data, (d) => d.y) ?? 0;
  const xPad = Math.abs(xMax - xMin) * 0.06 || 1;
  const yPad = Math.abs(yMax - yMin) * 0.08 || 1;
  const xScale = d3.scaleLinear().domain([xMin - xPad, xMax + xPad]).range([0, innerW]);
  const yScale = d3.scaleLinear().domain([yMin - yPad, yMax + yPad]).range([innerH, 0]);
  return { innerW, innerH, xScale, yScale };
}

export const DataLineChartD3: React.FC<DataLineChartD3Props> = ({
  title,
  data,
  lineColor,
  backgroundColor,
  textColor,
  fontFamily,
  showDots,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const layout = useMemo(() => computeLayout(data), [data]);

  const propsRef = useRef({
    data,
    lineColor,
    textColor,
    fontFamily,
  });
  propsRef.current = { data, lineColor, textColor, fontFamily };

  const { ref } = useD3Animation<SVGSVGElement>(
    (svg, progress) => {
      const { data: series, lineColor: stroke, textColor: fg, fontFamily: ff } = propsRef.current;
      const root = d3.select(svg);
      root.selectAll("*").remove();

      const lay = computeLayout(series);
      if (!lay || series.length === 0) {
        return;
      }
      const { innerW, innerH, xScale, yScale } = lay;

      const g = root.append("g").attr("transform", `translate(${M.left},${M.top})`);

      const tickMuted = d3.color(fg);
      const axisStroke = tickMuted ? tickMuted.copy({ opacity: 0.35 }).formatRgb() : fg;

      const xAxis = d3.axisBottom(xScale).ticks(Math.min(8, Math.max(3, series.length)));
      const yAxis = d3.axisLeft(yScale).ticks(6);

      const xG = g.append("g").attr("transform", `translate(0,${innerH})`).call(xAxis);
      const yG = g.append("g").call(yAxis);

      xG.selectAll(".domain, .tick line").attr("stroke", axisStroke);
      yG.selectAll(".domain, .tick line").attr("stroke", axisStroke);
      xG.selectAll(".tick text").attr("fill", fg).style("font-family", ff).style("font-size", "13px");
      yG.selectAll(".tick text").attr("fill", fg).style("font-family", ff).style("font-size", "13px");

      const lineGen = d3
        .line<(typeof series)[number]>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
        .curve(d3.curveMonotoneX);

      const dPath = lineGen(series) ?? "";
      const path = g
        .append("path")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("d", dPath);

      const node = path.node();
      const len = node?.getTotalLength() ?? 0;
      if (len > 0) {
        path.attr("stroke-dasharray", len).attr("stroke-dashoffset", len * (1 - progress));
      }
    },
    { startFrame: LINE_START, durationFrames: LINE_DURATION }
  );

  const titleProgress = title
    ? spring({
        fps,
        frame: frame - 4,
        config: { damping: 15, stiffness: 200, mass: 0.5 },
      })
    : 0;

  const dotGate = interpolate(frame, [LINE_END, LINE_END + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        gap: 24,
      }}
    >
      {title && (
        <h2
          style={{
            margin: 0,
            fontSize: 38,
            fontWeight: 700,
            color: textColor,
            fontFamily,
            textAlign: "center",
            opacity: titleProgress,
            transform: `translateY(${(1 - titleProgress) * 16}px)`,
          }}
        >
          {title}
        </h2>
      )}

      <div style={{ position: "relative", width: CHART_W, height: CHART_H }}>
        <svg
          ref={ref}
          width={CHART_W}
          height={CHART_H}
          style={{ display: "block", overflow: "visible" }}
        />

        {showDots &&
          layout &&
          data.map((pt, i) => {
            const dotSpring = spring({
              fps,
              frame: frame - LINE_END - 10 - i * 9,
              config: { damping: 12, stiffness: 220, mass: 0.45 },
            });
            const x = M.left + layout.xScale(pt.x);
            const y = M.top + layout.yScale(pt.y);
            return (
              <div
                key={`${pt.x}-${pt.y}-${i}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 14,
                  height: 14,
                  marginLeft: -7,
                  marginTop: -7,
                  borderRadius: "50%",
                  backgroundColor: lineColor,
                  border: `2px solid ${backgroundColor}`,
                  boxSizing: "border-box",
                  opacity: dotSpring * dotGate,
                  transform: `scale(${0.35 + dotSpring * 0.65})`,
                }}
              />
            );
          })}
      </div>
    </AbsoluteFill>
  );
};
