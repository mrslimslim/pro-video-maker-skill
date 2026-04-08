import { z } from "zod";

export const ctaBounceSchema = z.object({
  headline: z.string(),
  subtext: z.string().optional(),
  buttonText: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

export type CtaBounceProps = z.infer<typeof ctaBounceSchema>;
