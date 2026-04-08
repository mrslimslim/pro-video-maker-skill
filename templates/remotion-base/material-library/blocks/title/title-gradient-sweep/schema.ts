import { z } from "zod";

export const titleGradientSweepSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  gradientFrom: z.string().default("#6366F1"),
  gradientTo: z.string().default("#22D3EE"),
  fontFamily: z.string().default("Inter"),
});

export type TitleGradientSweepProps = z.infer<typeof titleGradientSweepSchema>;
