import { useCurrentFrame, interpolate } from "remotion";
import React from "react";

interface GlitchEffectOptions {
  startFrame?: number;
  durationFrames?: number;
  intensity?: number;
  rgbOffset?: number;
}

interface GlitchValues {
  translateX: number;
  translateY: number;
  hueRotate: number;
  clipPath: string;
  rgbShiftLeft: string;
  rgbShiftRight: string;
  opacity: number;
  style: React.CSSProperties;
  isActive: boolean;
}

/**
 * Produces deterministic per-frame glitch effect values.
 *
 * Uses frame-seeded pseudo-random numbers so the output is
 * reproducible across Remotion renders.
 */
export function useGlitchEffect(options: GlitchEffectOptions = {}): GlitchValues {
  const {
    startFrame = 0,
    durationFrames = 15,
    intensity = 1,
    rgbOffset = 5,
  } = options;

  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  const isActive = elapsed >= 0 && elapsed <= durationFrames;

  if (!isActive) {
    return {
      translateX: 0,
      translateY: 0,
      hueRotate: 0,
      clipPath: "none",
      rgbShiftLeft: "0px",
      rgbShiftRight: "0px",
      opacity: 1,
      style: {},
      isActive: false,
    };
  }

  const envelope = interpolate(
    elapsed,
    [0, durationFrames * 0.2, durationFrames * 0.8, durationFrames],
    [0, intensity, intensity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const seed = frame * 9301 + 49297;
  const rand = (n: number) => (((seed * (n + 1)) % 233280) / 233280 - 0.5) * 2;

  const tx = rand(1) * 12 * envelope;
  const ty = rand(2) * 4 * envelope;
  const hue = rand(3) * 60 * envelope;

  const sliceTop = Math.abs(rand(4)) * 80;
  const sliceHeight = 5 + Math.abs(rand(5)) * 15;
  const clipPath =
    envelope > 0.3
      ? `inset(${sliceTop}% 0 ${100 - sliceTop - sliceHeight}% 0)`
      : "none";

  const shift = rgbOffset * envelope;

  return {
    translateX: tx,
    translateY: ty,
    hueRotate: hue,
    clipPath,
    rgbShiftLeft: `${-shift}px`,
    rgbShiftRight: `${shift}px`,
    opacity: 1 - Math.abs(rand(6)) * 0.15 * envelope,
    style: {
      transform: `translate(${tx}px, ${ty}px)`,
      filter: `hue-rotate(${hue}deg)`,
    },
    isActive: true,
  };
}
