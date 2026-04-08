import {
  BackgroundSpec,
  DataSection,
  EffectSpec,
  SceneSpec,
  VideoSpec,
  parseDurationToFrames,
} from "./dsl-schema";

const WHOLE_TEMPLATE_PATTERN =
  /^\s*(?:\$\{\{\s*(.+?)\s*\}\}|\{\{\s*(.+?)\s*\}\})\s*$/;
const INLINE_TEMPLATE_PATTERN =
  /\$\{\{\s*(.+?)\s*\}\}|\{\{\s*(.+?)\s*\}\}/g;
const QUOTED_TOKEN_PATTERN = /^['"].*['"]$/;

interface PathToken {
  value: string;
  bracket: boolean;
}

export interface TemplateContext extends Record<string, unknown> {
  data: DataSection;
  item?: unknown;
  index: number;
  i: number;
  repeatIndex: number;
  sceneIndex: number;
}

export interface ExpandedSceneSpec
  extends Omit<
    SceneSpec,
    "duration" | "durationFrames" | "repeat" | "props" | "propsTemplate" | "background" | "effects" | "data"
  > {
  key: string;
  durationFrames: number;
  props: Record<string, unknown>;
  backgrounds: BackgroundSpec[];
  effects: EffectSpec[];
  context: TemplateContext;
}

const extractTemplateExpression = (value: string): string | null => {
  const match = value.match(WHOLE_TEMPLATE_PATTERN);
  return match?.[1] ?? match?.[2] ?? null;
};

const tokenizePath = (path: string): PathToken[] => {
  const normalizedPath = path.trim();
  if (!normalizedPath) {
    return [];
  }

  const tokens: PathToken[] = [];
  const matcher = /([^[.\]]+)|\[(.+?)\]/g;

  let match = matcher.exec(normalizedPath);
  while (match) {
    if (match[1]) {
      tokens.push({ value: match[1], bracket: false });
    } else if (match[2]) {
      tokens.push({ value: match[2].trim(), bracket: true });
    }

    match = matcher.exec(normalizedPath);
  }

  return tokens;
};

const stripQuotes = (token: string): string => {
  return QUOTED_TOKEN_PATTERN.test(token) ? token.slice(1, -1) : token;
};

const resolveBracketValue = (source: unknown, token: string): string | number => {
  if (/^\d+$/.test(token)) {
    return Number(token);
  }

  const stripped = stripQuotes(token);
  if (stripped !== token) {
    return stripped;
  }

  const resolvedToken = resolvePath(source, token);
  if (typeof resolvedToken === "number" || typeof resolvedToken === "string") {
    return resolvedToken;
  }

  return token;
};

export const resolvePath = (source: unknown, pathExpression: string): unknown => {
  if (pathExpression === ".") {
    return source;
  }

  const tokens = tokenizePath(pathExpression);
  if (tokens.length === 0) {
    return undefined;
  }

  let current: unknown = source;

  for (const token of tokens) {
    if (current === undefined || current === null) {
      return undefined;
    }

    if (token.bracket) {
      const bracketValue = resolveBracketValue(source, token.value);

      if (Array.isArray(current) && typeof bracketValue === "number") {
        current = current[bracketValue];
        continue;
      }

      current = (current as Record<string | number, unknown>)[bracketValue];
      continue;
    }

    current = (current as Record<string, unknown>)[stripQuotes(token.value)];
  }

  return current;
};

const stringifyTemplateValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
};

export const resolveTemplateValue = <T>(value: T, context: TemplateContext): T => {
  if (typeof value === "string") {
    const wholeExpression = extractTemplateExpression(value);
    if (wholeExpression) {
      return resolvePath(context, wholeExpression) as T;
    }

    return value.replace(
      INLINE_TEMPLATE_PATTERN,
      (_match, firstExpression: string | undefined, secondExpression: string | undefined) => {
        const expression = firstExpression ?? secondExpression ?? "";
        return stringifyTemplateValue(resolvePath(context, expression));
      }
    ) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveTemplateValue(item, context)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, itemValue]) => [
        key,
        resolveTemplateValue(itemValue, context),
      ])
    ) as T;
  }

  return value;
};

const deriveRepeatItems = (
  repeat: SceneSpec["repeat"],
  context: TemplateContext
): unknown[] => {
  if (repeat === undefined) {
    return [undefined];
  }

  const resolvedRepeat = resolveTemplateValue(repeat, context);

  if (Array.isArray(resolvedRepeat)) {
    return resolvedRepeat;
  }

  if (typeof repeat === "string") {
    const expression = extractTemplateExpression(repeat);
    if (expression?.endsWith(".length")) {
      const arrayExpression = expression.slice(0, -".length".length);
      const arrayValue = resolvePath(context, arrayExpression);
      if (Array.isArray(arrayValue)) {
        return arrayValue;
      }
    }
  }

  const count =
    typeof resolvedRepeat === "number"
      ? Math.max(0, Math.floor(resolvedRepeat))
      : typeof resolvedRepeat === "string" && /^\d+$/.test(resolvedRepeat)
        ? Math.max(0, Number(resolvedRepeat))
        : 0;

  return Array.from({ length: count }, (_unused, index) => index);
};

const normalizeBackgrounds = (
  background: SceneSpec["background"],
  context: TemplateContext
): BackgroundSpec[] => {
  if (!background) {
    return [];
  }

  const resolvedBackground = resolveTemplateValue(background, context);
  return Array.isArray(resolvedBackground)
    ? (resolvedBackground as BackgroundSpec[])
    : [resolvedBackground as BackgroundSpec];
};

export const expandRepeats = (
  scenes: SceneSpec[],
  data: DataSection,
  fps: number
): ExpandedSceneSpec[] => {
  const expandedScenes: ExpandedSceneSpec[] = [];

  scenes.forEach((scene, sceneIndex) => {
    const baseContext: TemplateContext = {
      data,
      sceneIndex,
      index: expandedScenes.length,
      i: 0,
      repeatIndex: 0,
      ...data,
    };

    const repeatItems = deriveRepeatItems(scene.repeat, baseContext);

    repeatItems.forEach((item, repeatIndex) => {
      const sceneData = resolveTemplateValue(scene.data ?? {}, {
        ...baseContext,
        item,
        i: repeatIndex,
        repeatIndex,
      });

      const mergedData = {
        ...data,
        ...(sceneData as Record<string, unknown>),
      };

      const context: TemplateContext = {
        data: mergedData,
        item,
        index: expandedScenes.length,
        i: repeatIndex,
        repeatIndex,
        sceneIndex,
        ...mergedData,
      };

      const durationFrames = scene.durationFrames
        ? parseDurationToFrames(
            resolveTemplateValue(scene.durationFrames, context),
            fps,
            "frames"
          )
        : parseDurationToFrames(
            resolveTemplateValue(scene.duration, context),
            fps,
            "seconds"
          );

      expandedScenes.push({
        ...scene,
        key: scene.id ?? `${scene.block}-${sceneIndex}-${repeatIndex}`,
        durationFrames: Math.max(1, durationFrames),
        props: {
          ...(resolveTemplateValue(scene.propsTemplate ?? {}, context) as Record<string, unknown>),
          ...(resolveTemplateValue(scene.props ?? {}, context) as Record<string, unknown>),
        },
        transition: scene.transition
          ? resolveTemplateValue(scene.transition, context)
          : undefined,
        backgrounds: normalizeBackgrounds(scene.background, context),
        effects: resolveTemplateValue(
          scene.effects ?? [],
          context
        ) as EffectSpec[],
        context,
      });
    });
  });

  return expandedScenes;
};

export const calculateTotalFrames = (spec: VideoSpec): number => {
  const fps = spec.video.fps ?? 30;
  const expandedScenes = expandRepeats(spec.scenes, spec.data, fps);
  const totalFrames = expandedScenes.reduce(
    (frameCount, scene) => frameCount + scene.durationFrames,
    0
  );

  return Math.max(totalFrames, fps);
};
