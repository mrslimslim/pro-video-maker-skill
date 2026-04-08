import { z } from "zod";

export const dataLineChartD3Schema = z.object({
  title: z.string().optional(),
  data: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
    })
  ),
  lineColor: z.string().default("#6366F1"),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  fontFamily: z.string().default("Inter"),
  showDots: z.boolean().default(true),
});

export type DataLineChartD3Props = z.infer<typeof dataLineChartD3Schema>;
