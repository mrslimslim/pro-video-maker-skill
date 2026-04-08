import React from "react";
import {
  AbsoluteFill,
  Img,
  Video,
  Audio,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";

interface ImageLayerProps {
  src: string;
  fit?: "cover" | "contain" | "fill";
  opacity?: number;
  kenBurns?: boolean;
  zoomRange?: [number, number];
}

export const ImageLayer: React.FC<ImageLayerProps> = ({
  src,
  fit = "cover",
  opacity = 1,
  kenBurns = false,
  zoomRange = [1, 1.2],
}) => {
  const frame = useCurrentFrame();
  const scale = kenBurns
    ? interpolate(frame, [0, 300], zoomRange, { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

interface VideoLayerProps {
  src: string;
  volume?: number;
  muted?: boolean;
  opacity?: number;
  playbackRate?: number;
}

export const VideoLayer: React.FC<VideoLayerProps> = ({
  src,
  volume = 0,
  muted = true,
  opacity = 1,
  playbackRate = 1,
}) => {
  return (
    <AbsoluteFill style={{ opacity }}>
      <Video
        src={staticFile(src)}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

interface AudioLayerProps {
  src: string;
  volume?: number;
  loop?: boolean;
}

export const AudioLayer: React.FC<AudioLayerProps> = ({
  src,
  volume = 0.3,
  loop = false,
}) => {
  return <Audio src={staticFile(src)} volume={volume} loop={loop} />;
};
