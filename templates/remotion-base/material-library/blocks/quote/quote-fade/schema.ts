import { z } from "zod";

export const quoteFadeSchema = z.object({
  quote: z.string(),
  author: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

export type QuoteFadeProps = z.infer<typeof quoteFadeSchema>;
