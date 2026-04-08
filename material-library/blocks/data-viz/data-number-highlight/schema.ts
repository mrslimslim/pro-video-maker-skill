import { z } from "zod";

export const dataNumberHighlightSchema = z.object({
  value: z.number(),
  label: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

export type DataNumberHighlightProps = z.infer<typeof dataNumberHighlightSchema>;
