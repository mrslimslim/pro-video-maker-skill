declare module "vivus" {
  export interface VivusOptions {
    start?: string;
    type?: string;
    duration?: number;
    animTimingFunction?: (value: number) => number;
  }

  export default class Vivus {
    public static EASE: (value: number) => number;

    public constructor(
      element: HTMLElement,
      options?: VivusOptions
    );

    public destroy(): void;
    public reset(): void;
    public setFrameProgress(progress: number): void;
  }
}
