import React from "react";
import { AbsoluteFill } from "remotion";

interface ZoomTransitionProps {
  progress: number;
  children: React.ReactNode;
}

export const ZoomIn: React.FC<ZoomTransitionProps> = ({ progress, children }) => {
  const scale = 0.5 + progress * 0.5;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity: progress }}>
      {children}
    </AbsoluteFill>
  );
};

export const ZoomOut: React.FC<ZoomTransitionProps> = ({ progress, children }) => {
  const scale = 1 + progress * 0.5;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity: 1 - progress }}>
      {children}
    </AbsoluteFill>
  );
};
