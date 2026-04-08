/**
 * Landscape Preset (16:9)
 *
 * Configuration for YouTube, Bilibili, general web video.
 *
 * Key considerations:
 * - Standard HD resolution
 * - Wider composition allows for more complex layouts
 * - Can use split-screen, side-by-side, data dashboards
 * - Normal pacing: 4-8 second scenes
 * - Subtitle at bottom-center
 */

export const landscapeConfig = {
  width: 1920,
  height: 1080,
  fps: 30,

  safeZone: {
    top: "5%",
    bottom: "5%",
    left: "5%",
    right: "5%",
  },

  typography: {
    title: { size: 64, weight: 700 },
    subtitle: { size: 40, weight: 600 },
    body: { size: 28, weight: 400 },
    caption: { size: 20, weight: 400 },
  },

  timing: {
    hookDuration: 4,
    sceneMin: 4,
    sceneMax: 10,
    transitionDuration: 20,
    totalMax: 600,
  },

  subtitle: {
    position: "bottom-center",
    fontSize: 32,
    maxWidth: "70%",
    bottomOffset: "8%",
  },
} as const;
