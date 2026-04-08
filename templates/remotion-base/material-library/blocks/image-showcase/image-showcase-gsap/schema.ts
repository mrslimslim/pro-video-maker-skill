import { z } from "zod";

export const imageShowcaseGsapSchema = z.object({
  imageSrc: z.string(),
  overlayText: z.string().optional(),
  overlaySubtext: z.string().optional(),
  textColor: z.string().default("#FFFFFF"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
  zoomIntensity: z.number().default(0.15),
});

export type ImageShowcaseGsapProps = z.infer<typeof imageShowcaseGsapSchema>;
