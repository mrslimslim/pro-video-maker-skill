import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

/* ---------- GradientMesh ---------- */

interface GradientMeshProps {
  colors: string[];
  speed?: number;
}

export const GradientMesh: React.FC<GradientMeshProps> = ({
  colors,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const t = frame * speed;

  const positions = colors.map((_, i) => {
    const angle = (i / colors.length) * Math.PI * 2 + t * 0.01;
    const x = 50 + Math.sin(angle) * 30;
    const y = 50 + Math.cos(angle * 0.7) * 30;
    return { x, y };
  });

  const gradients = colors.map(
    (color, i) =>
      `radial-gradient(circle at ${positions[i].x}% ${positions[i].y}%, ${color} 0%, transparent 60%)`
  );

  return (
    <AbsoluteFill
      style={{
        background: gradients.join(", "),
        filter: "blur(40px)",
      }}
    />
  );
};

/* ---------- NoiseGrain ---------- */

interface NoiseGrainProps {
  opacity?: number;
  blend?: string;
}

export const NoiseGrain: React.FC<NoiseGrainProps> = ({
  opacity = 0.06,
  blend = "overlay",
}) => {
  const frame = useCurrentFrame();
  const seed = frame % 100;

  return (
    <AbsoluteFill style={{ mixBlendMode: blend as any, opacity }}>
      <svg width="100%" height="100%">
        <filter id={`noise-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            seed={seed}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noise-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- Solid ---------- */

interface SolidProps {
  color: string;
  children?: React.ReactNode;
}

export const Solid: React.FC<SolidProps> = ({ color, children }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: color }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- Gradient ---------- */

interface GradientProps {
  from: string;
  to: string;
  direction?: string;
  children?: React.ReactNode;
}

export const Gradient: React.FC<GradientProps> = ({
  from,
  to,
  direction = "to bottom right",
  children,
}) => {
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(${direction}, ${from}, ${to})` }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ---------- ParticleField ---------- */

interface ParticleFieldProps {
  count?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 30,
  color = "rgba(255, 255, 255, 0.15)",
  maxSize = 6,
  speed = 0.3,
}) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i * 37 + 13) % 100,
        y: (i * 53 + 7) % 100,
        size: (i % 4) + 2,
        speedX: ((i % 7) - 3) * 0.1,
        speedY: ((i % 5) - 2) * 0.08,
        phase: i * 0.5,
      })),
    [count]
  );

  return (
    <AbsoluteFill>
      {particles.map((p, i) => {
        const x = ((p.x + frame * p.speedX * speed + 100) % 100);
        const y = ((p.y + frame * p.speedY * speed + 100) % 100);
        const float = Math.sin((frame + p.phase) * 0.05) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y + float * 0.3}%`,
              width: Math.min(p.size, maxSize),
              height: Math.min(p.size, maxSize),
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- StarField ---------- */

interface StarFieldProps {
  count?: number;
  color?: string;
  speed?: number;
  depthLayers?: number;
}

export const StarField: React.FC<StarFieldProps> = ({
  count = 80,
  color = "#FFFFFF",
  speed = 0.4,
  depthLayers = 3,
}) => {
  const frame = useCurrentFrame();

  const stars = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const layer = i % depthLayers;
        const depthScale = (layer + 1) / depthLayers;
        return {
          x: ((i * 73 + 17) % 1000) / 10,
          y: ((i * 41 + 59) % 1000) / 10,
          size: 1 + depthScale * 3,
          opacity: 0.3 + depthScale * 0.7,
          twinkleSpeed: 0.02 + (i % 11) * 0.005,
          twinklePhase: (i * 2.7) % (Math.PI * 2),
          driftX: (((i * 13) % 7) - 3) * 0.02 * depthScale,
          driftY: -0.03 * depthScale,
        };
      }),
    [count, depthLayers]
  );

  return (
    <AbsoluteFill>
      {stars.map((s, i) => {
        const twinkle =
          0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinklePhase);
        const x = ((s.x + frame * s.driftX * speed + 200) % 100);
        const y = ((s.y + frame * s.driftY * speed + 200) % 100);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: s.opacity * twinkle,
              boxShadow: `0 0 ${s.size * 2}px ${s.size * 0.5}px ${color}44`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- AuroraWave ---------- */

interface AuroraWaveProps {
  colors?: string[];
  speed?: number;
  layers?: number;
}

export const AuroraWave: React.FC<AuroraWaveProps> = ({
  colors = ["#00F5D4", "#7B61FF", "#FF006E"],
  speed = 0.3,
  layers = 4,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const waveLayers = React.useMemo(
    () =>
      Array.from({ length: layers }, (_, i) => ({
        color: colors[i % colors.length],
        amplitude: 60 + i * 30,
        frequency: 0.003 + i * 0.001,
        phaseOffset: i * 1.2,
        yBase: 30 + i * 15,
        blur: 40 + i * 15,
        opacity: 0.25 - i * 0.04,
      })),
    [layers, colors]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {waveLayers.map((layer, li) => {
        const t = frame * speed * 0.01 + layer.phaseOffset;
        const points: string[] = [];
        const steps = 40;
        for (let s = 0; s <= steps; s++) {
          const xPct = (s / steps) * 100;
          const xNorm = s / steps;
          const yOffset =
            Math.sin(xNorm * Math.PI * 2 * 3 + t * 2) * layer.amplitude * 0.5 +
            Math.sin(xNorm * Math.PI * 4 + t * 1.3) * layer.amplitude * 0.3 +
            Math.cos(xNorm * Math.PI * 1.5 + t * 0.7) * layer.amplitude * 0.2;
          const yPct = layer.yBase + (yOffset / height) * 100;
          points.push(`${xPct}% ${yPct}%`);
        }
        points.push("100% 100%", "0% 100%");

        const hueShift = Math.sin(frame * 0.008 + li) * 30;

        return (
          <div
            key={li}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `polygon(${points.join(", ")})`,
              background: layer.color,
              opacity: layer.opacity,
              filter: `blur(${layer.blur}px) hue-rotate(${hueShift}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- GeometricGrid ---------- */

interface GeometricGridProps {
  color?: string;
  cellSize?: number;
  strokeWidth?: number;
  pattern?: "grid" | "honeycomb" | "triangles";
  revealDurationFrames?: number;
}

export const GeometricGrid: React.FC<GeometricGridProps> = ({
  color = "rgba(255,255,255,0.08)",
  cellSize = 60,
  strokeWidth = 1,
  pattern = "grid",
  revealDurationFrames = 90,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const progress = interpolate(frame, [0, revealDurationFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lines = React.useMemo(() => {
    const result: Array<{ d: string; length: number }> = [];
    if (pattern === "grid") {
      for (let x = cellSize; x < width; x += cellSize) {
        result.push({ d: `M${x} 0 L${x} ${height}`, length: height });
      }
      for (let y = cellSize; y < height; y += cellSize) {
        result.push({ d: `M0 ${y} L${width} ${y}`, length: width });
      }
    } else if (pattern === "honeycomb") {
      const h = cellSize * Math.sqrt(3);
      for (let row = 0; row < height / h + 1; row++) {
        for (let col = 0; col < width / cellSize + 1; col++) {
          const cx = col * cellSize * 1.5;
          const cy = row * h + (col % 2 === 1 ? h / 2 : 0);
          const r = cellSize * 0.5;
          const pts = Array.from({ length: 6 }, (_, k) => {
            const a = (Math.PI / 3) * k - Math.PI / 6;
            return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
          });
          const d = `M${pts.join(" L")} Z`;
          result.push({ d, length: r * 6 });
        }
      }
    } else {
      for (let row = 0; row < height / cellSize + 1; row++) {
        for (let col = 0; col < width / cellSize + 1; col++) {
          const x = col * cellSize;
          const y = row * cellSize;
          const d =
            (row + col) % 2 === 0
              ? `M${x} ${y} L${x + cellSize} ${y} L${x} ${y + cellSize} Z`
              : `M${x + cellSize} ${y} L${x + cellSize} ${y + cellSize} L${x} ${y + cellSize} Z`;
          result.push({ d, length: cellSize * 3 });
        }
      }
    }
    return result;
  }, [width, height, cellSize, pattern]);

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {lines.map((line, i) => {
          const staggerDelay = (i / lines.length) * 0.7;
          const lineProgress = interpolate(
            progress,
            [staggerDelay, staggerDelay + 0.3],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <path
              key={i}
              d={line.d}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={line.length}
              strokeDashoffset={line.length * (1 - lineProgress)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- GlowOrbs ---------- */

interface GlowOrbsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  maxRadius?: number;
}

export const GlowOrbs: React.FC<GlowOrbsProps> = ({
  colors = ["#6366F1", "#22D3EE", "#A78BFA", "#F472B6"],
  count = 4,
  speed = 0.3,
  maxRadius = 400,
}) => {
  const frame = useCurrentFrame();

  const orbs = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        startX: 20 + ((i * 27 + 11) % 60),
        startY: 20 + ((i * 43 + 23) % 60),
        radius: maxRadius * (0.5 + (i % 3) * 0.25),
        phaseX: (i * 1.7) % (Math.PI * 2),
        phaseY: (i * 2.3) % (Math.PI * 2),
        orbitX: 15 + (i % 4) * 5,
        orbitY: 10 + (i % 3) * 7,
        color: colors[i % colors.length],
      })),
    [count, colors, maxRadius]
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {orbs.map((orb, i) => {
        const t = frame * speed * 0.008;
        const x = orb.startX + Math.sin(t + orb.phaseX) * orb.orbitX;
        const y = orb.startY + Math.cos(t * 0.7 + orb.phaseY) * orb.orbitY;
        const pulseScale = 0.9 + 0.1 * Math.sin(t * 2 + i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: orb.radius * pulseScale,
              height: orb.radius * pulseScale,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color}88 0%, ${orb.color}22 40%, transparent 70%)`,
              filter: `blur(${orb.radius * 0.15}px)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- WaveLines ---------- */

interface WaveLinesProps {
  color?: string;
  layers?: number;
  amplitude?: number;
  speed?: number;
  position?: "bottom" | "top" | "both";
}

export const WaveLines: React.FC<WaveLinesProps> = ({
  color = "rgba(255,255,255,0.06)",
  layers = 4,
  amplitude = 40,
  speed = 0.5,
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const buildPath = (layerIndex: number, flip: boolean) => {
    const t = frame * speed * 0.015 + layerIndex * 0.8;
    const freq = 2 + layerIndex * 0.5;
    const amp = amplitude * (1 - layerIndex * 0.15);
    const baseY = flip ? 0 : height;
    const dir = flip ? 1 : -1;
    const yOffset = layerIndex * 20 * dir;

    const points: string[] = [`M0 ${baseY}`];
    const steps = 50;
    for (let s = 0; s <= steps; s++) {
      const x = (s / steps) * width;
      const xNorm = s / steps;
      const y =
        baseY +
        dir *
          (-amp *
            (Math.sin(xNorm * Math.PI * freq + t) * 0.6 +
              Math.sin(xNorm * Math.PI * freq * 1.5 + t * 1.3) * 0.4)) +
        yOffset;
      points.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    points.push(`L${width} ${baseY} Z`);
    return points.join(" ");
  };

  const renderWaves = (flip: boolean) =>
    Array.from({ length: layers }, (_, i) => (
      <path
        key={`${flip ? "t" : "b"}-${i}`}
        d={buildPath(i, flip)}
        fill={color}
        opacity={1 - i * 0.15}
      />
    ));

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {(position === "bottom" || position === "both") && renderWaves(false)}
        {(position === "top" || position === "both") && renderWaves(true)}
      </svg>
    </AbsoluteFill>
  );
};
