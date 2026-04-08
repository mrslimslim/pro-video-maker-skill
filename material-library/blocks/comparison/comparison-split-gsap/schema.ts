import { z } from "zod";

export const comparisonSplitGsapSchema = z.object({
  leftLabel: z.string(),
  rightLabel: z.string(),
  leftContent: z.string(),
  rightContent: z.string(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  leftColor: z.string().default("#EF4444"),
  rightColor: z.string().default("#22C55E"),
  fontFamily: z.string().default("Inter"),
});

export type ComparisonSplitGsapProps = z.infer<typeof comparisonSplitGsapSchema>;
