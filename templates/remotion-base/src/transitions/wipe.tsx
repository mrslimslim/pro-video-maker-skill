import React from "react";
import { AbsoluteFill } from "remotion";

type WipeDirection = "right" | "left" | "down" | "up";

interface WipeTransitionProps {
  progress: number;
  direction: WipeDirection;
  children: React.ReactNode;
}

export const WipeIn: React.FC<WipeTransitionProps> = ({
  progress,
  direction,
  children,
}) => {
  const clipPaths: Record<WipeDirection, string> = {
    right: `inset(0 ${(1 - progress) * 100}% 0 0)`,
    left: `inset(0 0 0 ${(1 - progress) * 100}%)`,
    down: `inset(0 0 ${(1 - progress) * 100}% 0)`,
    up: `inset(${(1 - progress) * 100}% 0 0 0)`,
  };

  return (
    <AbsoluteFill style={{ clipPath: clipPaths[direction] }}>
      {children}
    </AbsoluteFill>
  );
};

export const CircleWipeIn: React.FC<{ progress: number; children: React.ReactNode }> = ({
  progress,
  children,
}) => {
  const radius = progress * 75;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${radius}% at 50% 50%)` }}>
      {children}
    </AbsoluteFill>
  );
};
