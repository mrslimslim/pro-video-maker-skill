import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

interface SceneProps {
  backgroundColor?: string;
  padding?: number;
  children: React.ReactNode;
}

export const Scene: React.FC<SceneProps> = ({
  backgroundColor = "transparent",
  padding = 60,
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        padding,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

interface SafeZoneProps {
  margin?: string;
  children: React.ReactNode;
}

export const SafeZone: React.FC<SafeZoneProps> = ({
  margin = "10%",
  children,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: margin,
        left: margin,
        right: margin,
        bottom: margin,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};
