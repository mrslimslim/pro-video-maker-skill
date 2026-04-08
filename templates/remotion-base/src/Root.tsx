import React from "react";
import { Composition } from "remotion";
import { VideoComposition, videoSchema } from "./Video";
import { DSLRoot } from "./engine/DSLRoot";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoComposition"
        component={VideoComposition}
        schema={videoSchema}
        defaultProps={{
          title: "My Video",
          scenes: [],
        }}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <DSLRoot />
    </>
  );
};
