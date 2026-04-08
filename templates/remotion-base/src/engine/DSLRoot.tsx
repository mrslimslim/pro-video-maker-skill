import React from "react";
import { Composition, getInputProps } from "remotion";
import { load } from "js-yaml";
import { z } from "zod";
import defaultVideoSpec from "../../public/video-spec.json";
import { DSLVideoComposition } from "./DSLVideoComposition";
import { getOutputPreset, type VideoSpec, videoSpecSchema } from "./dsl-schema";
import { calculateTotalFrames } from "./template-engine";

const dslCompositionSchema = z.object({
  spec: videoSpecSchema,
});

const parseSpecSource = (source: unknown): unknown => {
  if (typeof source !== "string") {
    return source;
  }

  const trimmed = source.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }

  return load(trimmed);
};

export const loadVideoSpec = (
  inputProps: Record<string, unknown> = {}
): VideoSpec => {
  const rawSpec =
    parseSpecSource(inputProps.spec) ??
    parseSpecSource(inputProps.videoSpec) ??
    parseSpecSource(inputProps.dsl) ??
    parseSpecSource(inputProps.specSource) ??
    defaultVideoSpec;

  return videoSpecSchema.parse(rawSpec);
};

export const DSLRoot: React.FC = () => {
  const inputProps = getInputProps() as Record<string, unknown>;
  const spec = loadVideoSpec(inputProps);
  const preset = getOutputPreset(spec.video);
  const durationInFrames = calculateTotalFrames({
    ...spec,
    video: {
      ...spec.video,
      fps: preset.fps,
    },
  });

  return (
    <Composition
      id="DSLVideo"
      component={DSLVideoComposition}
      schema={dslCompositionSchema}
      defaultProps={{ spec }}
      durationInFrames={durationInFrames}
      fps={preset.fps}
      width={preset.width}
      height={preset.height}
    />
  );
};
