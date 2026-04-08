import { z } from "zod";

export const svgDrawRevealSchema = z.object({
  svgContent: z.string(),
  heading: z.string().optional(),
  showFill: z.boolean().default(true),
  strokeColor: z.string().default("#F8FAFC"),
  fillColor: z.string().default("#6366F1"),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  fontFamily: z.string().default("Inter"),
  drawDurationFrames: z.number().default(60),
});

export type SvgDrawRevealProps = z.infer<typeof svgDrawRevealSchema>;
