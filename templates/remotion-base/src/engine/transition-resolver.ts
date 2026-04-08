import { linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import transitionCatalog from "../../../../data/transitions.json";
import { TransitionSpec, parseDurationToFrames } from "./dsl-schema";

type TimingFactory = ReturnType<typeof linearTiming>;
type PresentationFactory = any;

interface TransitionCatalogEntry {
  id: string;
  durationFrames?: Partial<Record<"fast" | "normal" | "slow", number>>;
  config?: Record<string, unknown>;
}

interface TransitionObjectValue {
  type: string;
  duration?: unknown;
  durationFrames?: unknown;
  pacing?: "fast" | "normal" | "slow";
  config?: Record<string, unknown>;
}

export interface ResolvedTransition {
  presentation: PresentationFactory;
  timing: TimingFactory;
}

const transitionById = Object.fromEntries(
  (transitionCatalog as TransitionCatalogEntry[]).map((entry) => [entry.id, entry])
) as Record<string, TransitionCatalogEntry>;

const springTransitions = new Set([
  "flip",
  "zoom-in",
  "zoom-out",
  "push-up",
  "push-left",
  "cover",
  "reveal",
]);

const createPresentation = (
  type: string,
  config: Record<string, unknown>
): PresentationFactory => {
  switch (type) {
    case "fade":
    case "crossfade":
    case "dissolve":
    case "blur-through":
    case "color-flash":
    case "pixel":
      return fade();
    case "slide-up":
    case "push-up":
      return slide({ direction: "from-bottom", ...config }) as PresentationFactory;
    case "slide-down":
      return slide({ direction: "from-top", ...config }) as PresentationFactory;
    case "slide-left":
    case "push-left":
    case "cover":
      return slide({ direction: "from-right", ...config }) as PresentationFactory;
    case "slide-right":
    case "reveal":
      return slide({ direction: "from-left", ...config }) as PresentationFactory;
    case "wipe-right":
      return wipe({ direction: "from-left", ...config }) as PresentationFactory;
    case "wipe-down":
      return wipe({ direction: "from-top", ...config }) as PresentationFactory;
    case "wipe-circle":
    case "clock-wipe":
      return fade();
    case "flip":
    case "rotate":
    case "cube":
    case "page-turn":
    case "fold":
      return flip({ ...config }) as PresentationFactory;
    default:
      return fade();
  }
};

const normalizeTransition = (
  spec: TransitionSpec
): TransitionObjectValue => {
  return typeof spec === "string" ? { type: spec } : spec;
};

export const resolveTransition = (
  spec: TransitionSpec | undefined,
  fps: number
): ResolvedTransition | null => {
  if (!spec) {
    return null;
  }

  const normalized = normalizeTransition(spec);
  if (normalized.type === "cut") {
    return null;
  }

  const catalogEntry = transitionById[normalized.type];
  const pacing = normalized.pacing ?? "normal";
  const durationFrames =
    (normalized.durationFrames
      ? parseDurationToFrames(normalized.durationFrames, fps, "frames")
      : 0) ||
    (normalized.duration
      ? parseDurationToFrames(normalized.duration, fps, "seconds")
      : 0) ||
    catalogEntry?.durationFrames?.[pacing] ||
    18;

  const config = {
    ...catalogEntry?.config,
    ...normalized.config,
  };

  return {
    presentation: createPresentation(normalized.type, config),
    timing: springTransitions.has(normalized.type)
      ? springTiming({ durationInFrames: durationFrames })
      : linearTiming({ durationInFrames: durationFrames }),
  };
};
