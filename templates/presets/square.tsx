/**
 * Square Preset (1:1)
 *
 * Configuration for Instagram Feed, LinkedIn, Twitter/X.
 *
 * Key considerations:
 * - Equal width and height requires centered composition
 * - Avoid landscape-style layouts
 * - Text must be large enough for feed viewing
 * - Works well with card-style, centered, and stacked layouts
 */

export const squareConfig = {
  width: 1080,
  height: 1080,
  fps: 30,

  safeZone: {
    top: "8%",
    bottom: "8%",
    left: "8%",
    right: "8%",
  },

  typography: {
    title: { size: 60, weight: 700 },
    subtitle: { size: 36, weight: 600 },
    body: { size: 28, weight: 400 },
    caption: { size: 20, weight: 400 },
  },

  timing: {
    hookDuration: 3,
    sceneMin: 3,
    sceneMax: 8,
    transitionDuration: 15,
    totalMax: 120,
  },

  subtitle: {
    position: "bottom-center",
    fontSize: 28,
    maxWidth: "80%",
    bottomOffset: "10%",
  },
} as const;
