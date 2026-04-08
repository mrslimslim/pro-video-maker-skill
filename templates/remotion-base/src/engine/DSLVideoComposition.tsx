import React, { Suspense } from "react";
import { TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { Subtitle } from "@/components/Subtitle";
import { resolveBlock } from "./block-registry";
import {
  getOutputPreset,
  parseDurationToSeconds,
  type SceneSpec,
  type VideoSpec,
  videoSpecSchema,
} from "./dsl-schema";
import { resolveBackground, resolveEffects } from "./effect-resolver";
import { applyStyle, resolveStyle } from "./style-resolver";
import { expandRepeats } from "./template-engine";
import { resolveTransition } from "./transition-resolver";

const subtitlePositionMap = {
  top: "top",
  center: "center",
  bottom: "bottom",
  "top-center": "top",
  "center-center": "center",
  "bottom-center": "bottom",
} as const;

const MissingBlock: React.FC<{ blockId: string }> = ({ blockId }) => {
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 48,
        backgroundColor: "#111827",
        color: "#F9FAFB",
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 18, opacity: 0.7, marginBottom: 12 }}>
          Missing block
        </div>
        <div style={{ fontSize: 36, fontWeight: 800 }}>{blockId}</div>
      </div>
    </AbsoluteFill>
  );
};

const BlockRenderer: React.FC<{
  blockId: string;
  props: Record<string, unknown>;
}> = ({ blockId, props }) => {
  const BlockComponent = resolveBlock(blockId);

  if (!BlockComponent) {
    return <MissingBlock blockId={blockId} />;
  }

  return (
    <Suspense fallback={<MissingBlock blockId={blockId} />}>
      <BlockComponent {...props} />
    </Suspense>
  );
};

export const DSLVideoComposition: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const parsedSpec = videoSpecSchema.parse(spec);
  const preset = getOutputPreset(parsedSpec.video);
  const style = resolveStyle(parsedSpec.video.style, parsedSpec.styleOverrides);
  const scenes = expandRepeats(parsedSpec.scenes, parsedSpec.data, preset.fps);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: style.palette.background,
        color: style.palette.text,
        fontFamily: style.typography.body,
      }}
    >
      <TransitionSeries>
        {scenes.map((scene, index) => {
          const transition =
            index < scenes.length - 1
              ? resolveTransition(
                  scene.transition as SceneSpec["transition"],
                  preset.fps
                )
              : null;
          const styledProps = applyStyle(scene.props, style);
          const effectLayers = resolveEffects(scene.effects, {
            fps: preset.fps,
            durationFrames: scene.durationFrames,
            style,
          });

          return (
            <React.Fragment key={scene.key}>
              <TransitionSeries.Sequence durationInFrames={scene.durationFrames}>
                <AbsoluteFill
                  style={{
                    backgroundColor:
                      (styledProps.backgroundColor as string | undefined) ??
                      style.palette.background,
                  }}
                >
                  {scene.backgrounds.map((background, backgroundIndex) => {
                    const layer = resolveBackground(background, style);

                    return layer
                      ? React.cloneElement(layer, {
                          key: `${scene.key}-background-${backgroundIndex}`,
                        })
                      : null;
                  })}
                  <BlockRenderer
                    blockId={scene.block as string}
                    props={styledProps}
                  />
                  {effectLayers}
                </AbsoluteFill>
              </TransitionSeries.Sequence>

              {transition ? (
                <TransitionSeries.Transition
                  presentation={transition.presentation}
                  timing={transition.timing}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {parsedSpec.subtitles?.enabled ? (
        <Subtitle
          entries={parsedSpec.subtitles.entries.map((entry) => ({
            ...entry,
            start: parseDurationToSeconds(entry.start, preset.fps, "seconds"),
            end: parseDurationToSeconds(entry.end, preset.fps, "seconds"),
          }))}
          position={subtitlePositionMap[parsedSpec.subtitles.position]}
          style={parsedSpec.subtitles.style}
          fontSize={parsedSpec.subtitles.fontSize}
          color={parsedSpec.subtitles.color}
          backgroundColor={parsedSpec.subtitles.backgroundColor}
          fontFamily={parsedSpec.subtitles.fontFamily ?? style.typography.body}
        />
      ) : null}
    </AbsoluteFill>
  );
};
