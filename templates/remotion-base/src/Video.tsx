import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { z } from "zod";

const sceneItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  durationFrames: z.number(),
  type: z.enum(["title", "content", "data", "quote", "cta", "transition"]),
});

export const videoSchema = z.object({
  title: z.string(),
  scenes: z.array(sceneItemSchema),
});

type VideoProps = z.infer<typeof videoSchema>;

export const VideoComposition: React.FC<VideoProps> = ({ title, scenes }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Scene sequences are generated here based on the script decomposition.
          Each scene imports its own component from src/scenes/.
          Transitions are wired using <TransitionSeries>. */}
    </AbsoluteFill>
  );
};
