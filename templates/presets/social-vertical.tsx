/**
 * Social Vertical Preset (9:16)
 *
 * Configuration for TikTok, Instagram Reels, YouTube Shorts, Douyin.
 *
 * Key considerations:
 * - Safe zone: 10% margin on all edges (UI overlays)
 * - Text size: >= 36px for readability on mobile
 * - Bottom 20% reserved for platform UI (like/comment buttons)
 * - Top 10% reserved for status bar / time
 * - Fast pacing: 2-4 second scenes
 * - Bold typography and high contrast
 */

export const socialVerticalConfig = {
  width: 1080,
  height: 1920,
  fps: 30,

  safeZone: {
    top: "10%",
    bottom: "20%",
    left: "8%",
    right: "8%",
  },

  typography: {
    title: { size: 72, weight: 800 },
    subtitle: { size: 44, weight: 600 },
    body: { size: 32, weight: 400 },
    caption: { size: 24, weight: 500 },
  },

  timing: {
    hookDuration: 3,
    sceneMin: 2,
    sceneMax: 5,
    transitionDuration: 10,
    totalMax: 60,
  },

  subtitle: {
    position: "center-bottom",
    fontSize: 36,
    maxWidth: "85%",
    bottomOffset: "22%",
  },
} as const;
