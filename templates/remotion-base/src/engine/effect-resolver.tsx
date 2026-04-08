import React from "react";
import {
  AuroraWave,
  GeometricGrid,
  GlowOrbs,
  Gradient,
  GradientMesh,
  NoiseGrain,
  ParticleField,
  Solid,
  StarField,
  WaveLines,
} from "@/components/Background";
import {
  Confetti,
  GlitchOverlay,
  LightSweep,
  Sparkles,
} from "@/components/Decorations";
import type { BackgroundSpec, EffectSpec } from "./dsl-schema";
import { parseDurationToFrames } from "./dsl-schema";
import type { ResolvedStyle } from "./style-resolver";

interface ResolveOptions {
  fps: number;
  durationFrames?: number;
  style: ResolvedStyle;
}

type NamedSpec = {
  type: string;
  props?: Record<string, unknown>;
  startAt?: unknown;
  duration?: unknown;
  durationFrames?: unknown;
};

const normalizeNamedSpec = <T extends NamedSpec>(spec: string | T): T => {
  return typeof spec === "string"
    ? ({ type: spec, props: {} } as T)
    : spec;
};

export const resolveBackground = (
  spec: BackgroundSpec,
  style: ResolvedStyle
): React.ReactElement | null => {
  const normalized = normalizeNamedSpec(spec);
  const type = normalized.type.toLowerCase();
  const props = normalized.props ?? {};

  switch (type) {
    case "solid":
      return <Solid color={style.palette.background} {...props} />;
    case "gradient":
      return (
        <Gradient
          from={style.palette.background}
          to={style.palette.surface}
          {...props}
        />
      );
    case "gradient-mesh":
      return (
        <GradientMesh
          colors={[
            style.palette.primary,
            style.palette.secondary,
            style.palette.accent,
          ]}
          {...props}
        />
      );
    case "particle-rain":
    case "particle-field":
      return <ParticleField color={`${style.palette.text}22`} {...props} />;
    case "starfield":
    case "star-field":
      return <StarField color={style.palette.text} {...props} />;
    case "aurora":
    case "aurora-wave":
      return (
        <AuroraWave
          colors={[
            style.palette.accent,
            style.palette.primary,
            style.palette.secondary,
          ]}
          {...props}
        />
      );
    case "pattern-animate":
    case "geometric-grid":
      return (
        <GeometricGrid
          color={`${style.palette.textSecondary}44`}
          {...props}
        />
      );
    case "glow-orbs":
      return (
        <GlowOrbs
          colors={[
            style.palette.primary,
            style.palette.secondary,
            style.palette.accent,
          ]}
          {...props}
        />
      );
    case "wave":
    case "wave-lines":
      return <WaveLines color={`${style.palette.surface}cc`} {...props} />;
    case "noise-grain":
      return <NoiseGrain {...props} />;
    default:
      return null;
  }
};

const effectElementForType = (
  type: string,
  props: Record<string, unknown>
): React.ReactElement | null => {
  switch (type) {
    case "confetti":
      return <Confetti {...props} />;
    case "sparkle":
    case "sparkles":
      return <Sparkles {...props} />;
    case "light-sweep":
      return <LightSweep {...props} />;
    case "glitch-cut":
    case "glitch-overlay":
    case "glitch-text":
      return <GlitchOverlay {...props} />;
    case "noise-grain":
      return <NoiseGrain {...props} />;
    case "particle-rain":
      return <ParticleField {...props} />;
    default:
      return null;
  }
};

export const resolveEffects = (
  specs: EffectSpec[],
  options: ResolveOptions
): React.ReactElement[] => {
  return specs.flatMap((spec, index) => {
    const normalized = normalizeNamedSpec(spec);
    const type = normalized.type.toLowerCase();
    const startFrame = normalized.startAt
      ? parseDurationToFrames(normalized.startAt, options.fps, "seconds")
      : 0;
    const durationFrames =
      (normalized.durationFrames
        ? parseDurationToFrames(normalized.durationFrames, options.fps, "frames")
        : 0) ||
      (normalized.duration
        ? parseDurationToFrames(normalized.duration, options.fps, "seconds")
        : 0) ||
      options.durationFrames;

    const effect = effectElementForType(type, {
      startFrame,
      durationFrames,
      color: options.style.palette.accent,
      colors: [
        options.style.palette.primary,
        options.style.palette.secondary,
        options.style.palette.accent,
      ],
      ...(normalized.props ?? {}),
    });

    return effect
      ? [
          React.cloneElement(effect, {
            key: `${type}-${index}`,
          }),
        ]
      : [];
  });
};
