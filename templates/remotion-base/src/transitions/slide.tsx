import React from "react";
import { AbsoluteFill } from "remotion";

type Direction = "up" | "down" | "left" | "right";

interface SlideTransitionProps {
  progress: number;
  direction: Direction;
  children: React.ReactNode;
}

export const SlideIn: React.FC<SlideTransitionProps> = ({
  progress,
  direction,
  children,
}) => {
  const transforms: Record<Direction, string> = {
    up: `translateY(${(1 - progress) * 100}%)`,
    down: `translateY(${(progress - 1) * 100}%)`,
    left: `translateX(${(1 - progress) * 100}%)`,
    right: `translateX(${(progress - 1) * 100}%)`,
  };

  return (
    <AbsoluteFill style={{ transform: transforms[direction] }}>
      {children}
    </AbsoluteFill>
  );
};

export const SlideOut: React.FC<SlideTransitionProps> = ({
  progress,
  direction,
  children,
}) => {
  const transforms: Record<Direction, string> = {
    up: `translateY(${-progress * 100}%)`,
    down: `translateY(${progress * 100}%)`,
    left: `translateX(${-progress * 100}%)`,
    right: `translateX(${progress * 100}%)`,
  };

  return (
    <AbsoluteFill style={{ transform: transforms[direction] }}>
      {children}
    </AbsoluteFill>
  );
};
