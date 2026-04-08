import { z } from "zod";

export const iconGridDrawSchema = z.object({
  heading: z.string().optional(),
  icons: z.array(
    z.object({
      svgContent: z.string(),
      label: z.string(),
    })
  ),
  columns: z.number().default(3),
  backgroundColor: z.string().default("#0F172A"),
  strokeColor: z.string().default("#6366F1"),
  textColor: z.string().default("#F8FAFC"),
  fontFamily: z.string().default("Inter"),
  drawDurationFrames: z.number().default(30),
  staggerFrames: z.number().default(15),
});

export type IconGridDrawProps = z.infer<typeof iconGridDrawSchema>;
