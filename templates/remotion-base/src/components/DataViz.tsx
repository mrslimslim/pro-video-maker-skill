import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  startFrame?: number;
  buildDuration?: number;
  width?: number;
  height?: number;
  barColor?: string;
  labelColor?: string;
  fontSize?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  startFrame = 0,
  buildDuration = 45,
  width = 800,
  height = 400,
  barColor = "#6366F1",
  labelColor = "#F8FAFC",
  fontSize = 18,
}) => {
  const frame = useCurrentFrame();
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = (width - 40) / data.length - 12;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((item, i) => {
        const staggerDelay = startFrame + i * 4;
        const progress = interpolate(
          frame,
          [staggerDelay, staggerDelay + buildDuration],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const barHeight = (item.value / maxValue) * (height - 80) * progress;
        const x = 20 + i * (barWidth + 12);
        const y = height - 40 - barHeight;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={item.color || barColor}
            />
            <text
              x={x + barWidth / 2}
              y={height - 16}
              textAnchor="middle"
              fill={labelColor}
              fontSize={fontSize}
              fontFamily="Inter, sans-serif"
            >
              {item.label}
            </text>
            {progress > 0.5 && (
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fill={labelColor}
                fontSize={fontSize - 2}
                fontFamily="Inter, sans-serif"
                fontWeight={600}
                opacity={interpolate(progress, [0.5, 0.8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              >
                {item.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

interface ProgressRingProps {
  percentage: number;
  startFrame?: number;
  durationFrames?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
  fontSize?: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  startFrame = 0,
  durationFrames = 60,
  size = 200,
  strokeWidth = 12,
  color = "#6366F1",
  trackColor = "rgba(255,255,255,0.1)",
  textColor = "#FAFAFA",
  fontSize = 36,
  label,
}) => {
  const frame = useCurrentFrame();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, percentage / 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const dashOffset = circumference * (1 - progress);
  const displayValue = Math.round(progress * 100);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize={fontSize}
          fontWeight={700}
          fontFamily="Inter, sans-serif"
        >
          {displayValue}%
        </text>
      </svg>
      {label && (
        <div
          style={{
            color: textColor,
            fontSize: fontSize * 0.5,
            marginTop: 8,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
