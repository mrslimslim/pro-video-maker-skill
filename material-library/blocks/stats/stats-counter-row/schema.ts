import { z } from "zod";

const statEntrySchema = z.object({
  value: z.number(),
  label: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export const statsCounterRowSchema = z.object({
  stats: z.array(statEntrySchema).min(1).max(6),
  backgroundColor: z.string().default("#020617"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#34D399"),
  fontFamily: z.string().default("Inter"),
  showTrendArrow: z.boolean().default(false),
});

export type StatsCounterRowProps = z.infer<typeof statsCounterRowSchema>;
