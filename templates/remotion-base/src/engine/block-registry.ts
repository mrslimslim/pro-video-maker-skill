import React, { lazy } from "react";

type BlockModule = Record<string, unknown>;
type LazyBlockComponent = React.LazyExoticComponent<React.ComponentType<any>>;

const coerceBlockModule = async (
  loader: () => Promise<BlockModule>,
  blockId: string
): Promise<{ default: React.ComponentType<any> }> => {
  const module = await loader();
  const namedExport = Object.values(module).find(
    (candidate) => typeof candidate === "function"
  );

  if (!namedExport) {
    throw new Error(`No component export found for block "${blockId}".`);
  }

  return {
    default: namedExport as React.ComponentType<any>,
  };
};

const lazyBlock = (
  blockId: string,
  loader: () => Promise<BlockModule>
): LazyBlockComponent => lazy(() => coerceBlockModule(loader, blockId));

export const blockRegistry: Record<string, LazyBlockComponent> = {
  "before-after-wipe": lazyBlock("before-after-wipe", () =>
    import("@blocks/before-after/before-after-wipe/Component")
  ),
  "code-block-typewriter": lazyBlock("code-block-typewriter", () =>
    import("@blocks/code-block/code-block-typewriter/Component")
  ),
  "comparison-split-gsap": lazyBlock("comparison-split-gsap", () =>
    import("@blocks/comparison/comparison-split-gsap/Component")
  ),
  "content-bullet-stagger": lazyBlock("content-bullet-stagger", () =>
    import("@blocks/content/content-bullet-stagger/Component")
  ),
  "content-card-stack": lazyBlock("content-card-stack", () =>
    import("@blocks/content/content-card-stack/Component")
  ),
  "content-glassmorphic": lazyBlock("content-glassmorphic", () =>
    import("@blocks/content/content-glassmorphic/Component")
  ),
  "content-timeline-vertical": lazyBlock("content-timeline-vertical", () =>
    import("@blocks/content/content-timeline-vertical/Component")
  ),
  "countdown-flip": lazyBlock("countdown-flip", () =>
    import("@blocks/countdown/countdown-flip/Component")
  ),
  "cta-bounce": lazyBlock("cta-bounce", () =>
    import("@blocks/cta/cta-bounce/Component")
  ),
  "cta-glow-pulse": lazyBlock("cta-glow-pulse", () =>
    import("@blocks/cta/cta-glow-pulse/Component")
  ),
  "data-chart-build": lazyBlock("data-chart-build", () =>
    import("@blocks/data-viz/data-chart-build/Component")
  ),
  "data-line-chart-d3": lazyBlock("data-line-chart-d3", () =>
    import("@blocks/data-viz/data-line-chart-d3/Component")
  ),
  "data-number-highlight": lazyBlock("data-number-highlight", () =>
    import("@blocks/data-viz/data-number-highlight/Component")
  ),
  "data-pie-d3": lazyBlock("data-pie-d3", () =>
    import("@blocks/data-viz/data-pie-d3/Component")
  ),
  "feature-grid-icon": lazyBlock("feature-grid-icon", () =>
    import("@blocks/feature/feature-grid-icon/Component")
  ),
  "flow-diagram-draw": lazyBlock("flow-diagram-draw", () =>
    import("@blocks/data-viz/flow-diagram-draw/Component")
  ),
  "icon-grid-draw": lazyBlock("icon-grid-draw", () =>
    import("@blocks/custom/icon-grid-draw/Component")
  ),
  "image-showcase-gsap": lazyBlock("image-showcase-gsap", () =>
    import("@blocks/image-showcase/image-showcase-gsap/Component")
  ),
  "list-reveal-gsap": lazyBlock("list-reveal-gsap", () =>
    import("@blocks/list-reveal/list-reveal-gsap/Component")
  ),
  "logo-reveal-draw": lazyBlock("logo-reveal-draw", () =>
    import("@blocks/logo-reveal/logo-reveal-draw/Component")
  ),
  "logo-reveal-particles": lazyBlock("logo-reveal-particles", () =>
    import("@blocks/logo-reveal/logo-reveal-particles/Component")
  ),
  "pricing-table-slide": lazyBlock("pricing-table-slide", () =>
    import("@blocks/pricing/pricing-table-slide/Component")
  ),
  "quote-fade": lazyBlock("quote-fade", () =>
    import("@blocks/quote/quote-fade/Component")
  ),
  "social-proof-scroll": lazyBlock("social-proof-scroll", () =>
    import("@blocks/social-proof/social-proof-scroll/Component")
  ),
  "stats-counter-row": lazyBlock("stats-counter-row", () =>
    import("@blocks/stats/stats-counter-row/Component")
  ),
  "svg-draw-reveal": lazyBlock("svg-draw-reveal", () =>
    import("@blocks/custom/svg-draw-reveal/Component")
  ),
  "team-profile-flip": lazyBlock("team-profile-flip", () =>
    import("@blocks/team/team-profile-flip/Component")
  ),
  "testimonial-quote-card": lazyBlock("testimonial-quote-card", () =>
    import("@blocks/testimonial/testimonial-quote-card/Component")
  ),
  "text-highlight-marker": lazyBlock("text-highlight-marker", () =>
    import("@blocks/text-effect/text-highlight-marker/Component")
  ),
  "title-glitch-reveal": lazyBlock("title-glitch-reveal", () =>
    import("@blocks/title/title-glitch-reveal/Component")
  ),
  "title-gradient-sweep": lazyBlock("title-gradient-sweep", () =>
    import("@blocks/title/title-gradient-sweep/Component")
  ),
  "title-kinetic-gsap": lazyBlock("title-kinetic-gsap", () =>
    import("@blocks/title/title-kinetic-gsap/Component")
  ),
  "title-neon-flicker": lazyBlock("title-neon-flicker", () =>
    import("@blocks/title/title-neon-flicker/Component")
  ),
  "title-spring-basic": lazyBlock("title-spring-basic", () =>
    import("@blocks/title/title-spring-basic/Component")
  ),
  "transition-minimal": lazyBlock("transition-minimal", () =>
    import("@blocks/transition/transition-minimal/Component")
  ),
};

export const resolveBlock = (blockId: string): LazyBlockComponent | null => {
  return blockRegistry[blockId] ?? null;
};
