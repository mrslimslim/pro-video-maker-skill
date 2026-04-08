import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { DataChartBuildProps } from "./schema";

/**
 * Requires BarChart, ProgressRing from components/DataViz
 * and Counter from components/AnimatedText in the host project.
 * When assembling, ensure these dependencies are copied from templates/remotion-base/src/components/.
 */
export const DataChartBuild: React.FC<DataChartBuildProps> = ({
  heading,
  vizType,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  data,
  stats,
  percentage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({
    fps,
    frame,
    config: { damping: 15, stiffness: 180, mass: 0.5 },
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
        gap: 40,
      }}
    >
      <h2
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: textColor,
          fontFamily,
          textAlign: "center",
          opacity: headingProgress,
          transform: `translateY(${(1 - headingProgress) * 20}px)`,
          margin: 0,
        }}
      >
        {heading}
      </h2>

      {vizType === "bar-chart" && data && (
        <div style={{ width: "80%", height: "50%" }}>
          {/* BarChart from host project's DataViz component */}
          {data.map((item, i) => {
            const barProgress = spring({
              fps,
              frame: frame - 15 - i * 6,
              config: { damping: 15, stiffness: 200 },
            });
            const maxVal = Math.max(...data.map((d) => d.value));
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    color: textColor,
                    fontFamily,
                    width: 80,
                    textAlign: "right",
                  }}
                >
                  {item.label}
                </span>
                <div
                  style={{
                    height: 32,
                    width: `${(item.value / maxVal) * 100 * barProgress}%`,
                    background: `linear-gradient(90deg, ${item.color || accentColor}, ${item.color || accentColor}BB)`,
                    borderRadius: 8,
                    boxShadow: `0 2px 8px ${(item.color || accentColor)}33`,
                  }}
                />
                <span
                  style={{
                    fontSize: 18,
                    color: textColor,
                    fontFamily,
                    opacity: barProgress,
                  }}
                >
                  {Math.round(item.value * barProgress).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {vizType === "progress-ring" && percentage !== undefined && (
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <svg viewBox="0 0 200 200" width={200} height={200}>
            <circle
              cx={100}
              cy={100}
              r={85}
              fill="none"
              stroke={textColor}
              strokeWidth={8}
              opacity={0.15}
            />
            <circle
              cx={100}
              cy={100}
              r={85}
              fill="none"
              stroke={accentColor}
              strokeWidth={8}
              strokeDasharray={`${2 * Math.PI * 85}`}
              strokeDashoffset={`${2 * Math.PI * 85 * (1 - (percentage / 100) * spring({ fps, frame: frame - 15, config: { damping: 20, stiffness: 100 } }))}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 700,
              color: accentColor,
              fontFamily,
            }}
          >
            {Math.round(percentage * spring({ fps, frame: frame - 15, config: { damping: 20, stiffness: 100 } }))}%
          </div>
        </div>
      )}

      {vizType === "stat-grid" && stats && (
        <div
          style={{
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {stats.map((stat, i) => {
            const statProgress = spring({
              fps,
              frame: frame - 15 - i * 8,
              config: { damping: 15, stiffness: 200 },
            });
            return (
              <div key={i} style={{ textAlign: "center", opacity: statProgress }}>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: accentColor,
                    fontFamily,
                  }}
                >
                  {Math.round(stat.value * statProgress).toLocaleString()}
                  {stat.suffix || ""}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: textColor,
                    fontFamily,
                    marginTop: 8,
                    opacity: 0.8,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
