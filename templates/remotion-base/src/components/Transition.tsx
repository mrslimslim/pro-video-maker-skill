import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface FadeProps {
  durationFrames: number;
  direction: "in" | "out";
  children: React.ReactNode;
}

export const Fade: React.FC<FadeProps> = ({ durationFrames, direction, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    direction === "in" ? [0, durationFrames] : [0, durationFrames],
    direction === "in" ? [0, 1] : [1, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

interface SlideProps {
  durationFrames: number;
  direction: "up" | "down" | "left" | "right";
  type: "in" | "out";
  children: React.ReactNode;
}

export const Slide: React.FC<SlideProps> = ({
  durationFrames,
  direction,
  type,
  children,
}) => {
  const frame = useCurrentFrame();

  const axisMap = {
    up: { prop: "translateY", from: 100, to: 0 },
    down: { prop: "translateY", from: -100, to: 0 },
    left: { prop: "translateX", from: 100, to: 0 },
    right: { prop: "translateX", from: -100, to: 0 },
  };
  const axis = axisMap[direction];

  const value = interpolate(
    frame,
    [0, durationFrames],
    type === "in" ? [axis.from, axis.to] : [axis.to, axis.from],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{ transform: `${axis.prop}(${value}%)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

interface ScaleProps {
  durationFrames: number;
  type: "in" | "out";
  fromScale?: number;
  toScale?: number;
  children: React.ReactNode;
}

export const Scale: React.FC<ScaleProps> = ({
  durationFrames,
  type,
  fromScale = 0.5,
  toScale = 1,
  children,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, durationFrames],
    type === "in" ? [fromScale, toScale] : [toScale, fromScale],
    { extrapolateRight: "clamp" }
  );

  const opacity = interpolate(
    frame,
    [0, durationFrames * 0.5],
    type === "in" ? [0, 1] : [1, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>
      {children}
    </AbsoluteFill>
  );
};
