import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { z } from "zod";
import { BarChart, ProgressRing } from "../remotion-base/src/components/DataViz";
import { Counter } from "../remotion-base/src/components/AnimatedText";

export const dataSceneSchema = z.object({
  heading: z.string(),
  vizType: z.enum(["bar-chart", "counter", "progress-ring", "stat-grid"]),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

type DataSceneProps = z.infer<typeof dataSceneSchema> & {
  data?: { label: string; value: number; color?: string }[];
  stats?: { label: string; value: number; suffix?: string }[];
  percentage?: number;
};

export const DataScene: React.FC<DataSceneProps> = ({
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
    fps, frame,
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
        <BarChart
          data={data}
          startFrame={15}
          barColor={accentColor}
          labelColor={textColor}
        />
      )}

      {vizType === "progress-ring" && percentage !== undefined && (
        <ProgressRing
          percentage={percentage}
          startFrame={15}
          color={accentColor}
          textColor={textColor}
        />
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
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: spring({
                  fps, frame: frame - 15 - i * 8,
                  config: { damping: 15, stiffness: 200 },
                }),
              }}
            >
              <Counter
                target={stat.value}
                startFrame={20 + i * 8}
                durationFrames={50}
                fontSize={56}
                color={accentColor}
                suffix={stat.suffix || ""}
              />
              <div style={{
                fontSize: 20, color: textColor, fontFamily,
                marginTop: 8, opacity: 0.8,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
