import { defaultPalette, defaultTypography } from "@/styles/motion-tokens";
import type { StyleOverrides } from "./dsl-schema";
import brandWarmCinematic from "../../material-library/styles/brand-warm-cinematic.json";
import corporateBlue from "../../material-library/styles/corporate-blue.json";
import dataCleanProfessional from "../../material-library/styles/data-clean-professional.json";
import gradientDreamy from "../../material-library/styles/gradient-dreamy.json";
import minimalZen from "../../material-library/styles/minimal-zen.json";
import neonCyberpunk from "../../material-library/styles/neon-cyberpunk.json";
import retroFilm from "../../material-library/styles/retro-film.json";
import techDarkEnergetic from "../../material-library/styles/tech-dark-energetic.json";

type DurationPreset = string;

interface StylePresetFile {
  id: string;
  palette?: Partial<typeof defaultPalette>;
  typography?: {
    heading?: string;
    body?: string;
    mono?: string;
    sizes1080p?: Partial<typeof defaultTypography.sizes>;
    weights?: Partial<typeof defaultTypography.weights>;
  };
  motion?: {
    style?: string;
    easing?: string;
    stagger?: number;
    intensity?: string;
    duration?: DurationPreset;
    rhythm?: string;
  };
}

export interface ResolvedStyle {
  id: string;
  palette: typeof defaultPalette;
  typography: typeof defaultTypography;
  motion: {
    style: string;
    easing: string;
    stagger: number;
    intensity: string;
    duration: DurationPreset;
    rhythm: string;
  };
}

const styleRegistry: Record<string, StylePresetFile> = {
  [brandWarmCinematic.id]: brandWarmCinematic,
  [corporateBlue.id]: corporateBlue,
  [dataCleanProfessional.id]: dataCleanProfessional,
  [gradientDreamy.id]: gradientDreamy,
  [minimalZen.id]: minimalZen,
  [neonCyberpunk.id]: neonCyberpunk,
  [retroFilm.id]: retroFilm,
  [techDarkEnergetic.id]: techDarkEnergetic,
};

const DEFAULT_STYLE_ID = techDarkEnergetic.id;

export const resolveStyle = (
  styleId: string,
  overrides?: StyleOverrides
): ResolvedStyle => {
  const preset = styleRegistry[styleId] ?? styleRegistry[DEFAULT_STYLE_ID];

  return {
    id: preset.id,
    palette: {
      ...defaultPalette,
      ...preset.palette,
      ...overrides?.palette,
    },
    typography: {
      ...defaultTypography,
      ...preset.typography,
      ...overrides?.typography,
      sizes: {
        ...defaultTypography.sizes,
        ...preset.typography?.sizes1080p,
        ...overrides?.typography?.sizes1080p,
      },
      weights: {
        ...defaultTypography.weights,
        ...preset.typography?.weights,
        ...overrides?.typography?.weights,
      },
    },
    motion: {
      style: preset.motion?.style ?? "balanced",
      easing: preset.motion?.easing ?? "power2.out",
      stagger: preset.motion?.stagger ?? 0.06,
      intensity: preset.motion?.intensity ?? "moderate",
      duration: preset.motion?.duration ?? "normal",
      rhythm: preset.motion?.rhythm ?? "steady",
      ...preset.motion,
      ...overrides?.motion,
    },
  };
};

const stylePropDefaults = (style: ResolvedStyle): Record<string, unknown> => ({
  backgroundColor: style.palette.background,
  textColor: style.palette.text,
  accentColor: style.palette.accent,
  glowColor: style.palette.accent,
  lineColor: style.palette.accent,
  dividerColor: style.palette.accent,
  strokeColor: style.palette.accent,
  fillColor: style.palette.primary,
  beforeColor: style.palette.primary,
  afterColor: style.palette.secondary,
  leftColor: style.palette.primary,
  rightColor: style.palette.secondary,
  avatarColor: style.palette.surface,
  primaryColor: style.palette.primary,
  secondaryColor: style.palette.secondary,
  surfaceColor: style.palette.surface,
  textSecondaryColor: style.palette.textSecondary,
  fontFamily: style.typography.heading,
  headingFontFamily: style.typography.heading,
  bodyFontFamily: style.typography.body,
  monoFontFamily: style.typography.mono,
});

export const applyStyle = (
  blockProps: Record<string, unknown>,
  style: ResolvedStyle
): Record<string, unknown> => {
  return {
    ...stylePropDefaults(style),
    ...blockProps,
  };
};
