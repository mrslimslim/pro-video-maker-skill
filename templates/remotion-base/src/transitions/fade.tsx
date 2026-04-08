import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface FadeTransitionProps {
  progress: number;
  children: React.ReactNode;
}

export const FadeIn: React.FC<FadeTransitionProps> = ({ progress, children }) => (
  <AbsoluteFill style={{ opacity: progress }}>{children}</AbsoluteFill>
);

export const FadeOut: React.FC<FadeTransitionProps> = ({ progress, children }) => (
  <AbsoluteFill style={{ opacity: 1 - progress }}>{children}</AbsoluteFill>
);
