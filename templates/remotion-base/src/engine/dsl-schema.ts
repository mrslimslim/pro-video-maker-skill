import { z } from "zod";
import { outputPresets } from "@/styles/motion-tokens";

const durationValueSchema = z.union([z.number().nonnegative(), z.string().min(1)]);
const genericRecordSchema = z.record(z.string(), z.unknown());

const paletteOverrideSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  surface: z.string().optional(),
  text: z.string().optional(),
  textSecondary: z.string().optional(),
});

const typographyOverrideSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional(),
  mono: z.string().optional(),
  sizes1080p: z.object({
    title: z.number().positive().optional(),
    subtitle: z.number().positive().optional(),
    body: z.number().positive().optional(),
    caption: z.number().positive().optional(),
  }).optional(),
  weights: z.object({
    title: z.number().positive().optional(),
    subtitle: z.number().positive().optional(),
    body: z.number().positive().optional(),
    caption: z.number().positive().optional(),
  }).optional(),
});

const motionOverrideSchema = z.object({
  style: z.string().optional(),
  easing: z.string().optional(),
  stagger: z.number().nonnegative().optional(),
  intensity: z.string().optional(),
  duration: z.enum(["fast", "normal", "slow"]).optional(),
  rhythm: z.string().optional(),
});

export const styleOverridesSchema = z.object({
  palette: paletteOverrideSchema.optional(),
  typography: typographyOverrideSchema.optional(),
  motion: motionOverrideSchema.optional(),
});

export const transitionObjectSchema = z.object({
  type: z.string().min(1),
  duration: durationValueSchema.optional(),
  durationFrames: durationValueSchema.optional(),
  pacing: z.enum(["fast", "normal", "slow"]).optional(),
  config: genericRecordSchema.optional(),
}).passthrough();

export const transitionSpecSchema = z.union([z.string().min(1), transitionObjectSchema]);

export const backgroundObjectSchema = z.object({
  type: z.string().min(1),
  props: genericRecordSchema.optional(),
}).passthrough();

export const backgroundSpecSchema = z.union([z.string().min(1), backgroundObjectSchema]);

export const effectObjectSchema = z.object({
  type: z.string().min(1),
  props: genericRecordSchema.optional(),
  startAt: durationValueSchema.optional(),
  duration: durationValueSchema.optional(),
  durationFrames: durationValueSchema.optional(),
}).passthrough();

export const effectSpecSchema = z.union([z.string().min(1), effectObjectSchema]);

export const subtitleEntrySchema = z.object({
  text: z.string().min(1),
  start: durationValueSchema,
  end: durationValueSchema,
}).passthrough();

export const subtitlesSchema = z.object({
  enabled: z.boolean().default(true),
  position: z.enum([
    "top",
    "center",
    "bottom",
    "top-center",
    "center-center",
    "bottom-center",
  ]).default("bottom-center"),
  style: z.enum(["box", "shadow", "outline"]).default("box"),
  fontSize: z.number().positive().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  fontFamily: z.string().optional(),
  entries: z.array(subtitleEntrySchema).default([]),
}).passthrough();

export const videoMetaSchema = z.object({
  title: z.string().min(1),
  platform: z.string().min(1).default("youtube"),
  style: z.string().default("tech-dark-energetic"),
  fps: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  description: z.string().optional(),
}).passthrough();

export const sceneSpecSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  block: z.string().min(1),
  duration: durationValueSchema.optional(),
  durationFrames: durationValueSchema.optional(),
  repeat: z.union([
    z.number().int().nonnegative(),
    z.string().min(1),
    z.array(z.unknown()),
  ]).optional(),
  props: genericRecordSchema.optional(),
  propsTemplate: genericRecordSchema.optional(),
  transition: transitionSpecSchema.optional(),
  background: z.union([backgroundSpecSchema, z.array(backgroundSpecSchema)]).optional(),
  effects: z.array(effectSpecSchema).optional(),
  data: genericRecordSchema.optional(),
}).passthrough().refine(
  (scene) => scene.duration !== undefined || scene.durationFrames !== undefined,
  {
    message: "Each scene must declare either `duration` or `durationFrames`.",
    path: ["duration"],
  }
);

export const videoSpecSchema = z.object({
  version: z.string().default("1.0"),
  video: videoMetaSchema,
  styleOverrides: styleOverridesSchema.optional(),
  scenes: z.array(sceneSpecSchema).min(1),
  data: genericRecordSchema.default({}),
  subtitles: subtitlesSchema.optional(),
}).passthrough();

export type DurationValue = z.infer<typeof durationValueSchema>;
export type StyleOverrides = z.infer<typeof styleOverridesSchema>;
export type TransitionSpec = z.infer<typeof transitionSpecSchema>;
export type BackgroundSpec = z.infer<typeof backgroundSpecSchema>;
export type EffectSpec = z.infer<typeof effectSpecSchema>;
export type SubtitleEntrySpec = z.infer<typeof subtitleEntrySchema>;
export type SubtitlesSpec = z.infer<typeof subtitlesSchema>;
export type VideoMeta = z.infer<typeof videoMetaSchema>;
export type SceneSpec = z.infer<typeof sceneSpecSchema>;
export type VideoSpec = z.infer<typeof videoSpecSchema>;
export type DataSection = z.infer<typeof genericRecordSchema>;

export interface OutputPreset {
  width: number;
  height: number;
  fps: number;
}

export const parseDurationToFrames = (
  value: unknown,
  fps: number,
  defaultUnit: "seconds" | "frames" = "seconds"
): number => {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return defaultUnit === "frames"
      ? Math.max(0, Math.round(value))
      : Math.max(0, Math.round(value * fps));
  }

  if (typeof value !== "string") {
    return 0;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const numericValue = Number(trimmed);
    return defaultUnit === "frames"
      ? Math.max(0, Math.round(numericValue))
      : Math.max(0, Math.round(numericValue * fps));
  }

  const secondsMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*s$/i);
  if (secondsMatch) {
    return Math.max(0, Math.round(Number(secondsMatch[1]) * fps));
  }

  const frameMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*f(?:rames?)?$/i);
  if (frameMatch) {
    return Math.max(0, Math.round(Number(frameMatch[1])));
  }

  const millisecondsMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*ms$/i);
  if (millisecondsMatch) {
    return Math.max(0, Math.round((Number(millisecondsMatch[1]) / 1000) * fps));
  }

  return 0;
};

export const parseDurationToSeconds = (
  value: unknown,
  fps: number,
  defaultUnit: "seconds" | "frames" = "seconds"
): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return defaultUnit === "frames" ? value / fps : value;
  }

  return parseDurationToFrames(value, fps, defaultUnit) / fps;
};

export const getOutputPreset = (video: VideoMeta): OutputPreset => {
  const preset = outputPresets[video.platform as keyof typeof outputPresets];

  return {
    width: video.width ?? preset?.width ?? 1920,
    height: video.height ?? preset?.height ?? 1080,
    fps: video.fps ?? preset?.fps ?? 30,
  };
};
