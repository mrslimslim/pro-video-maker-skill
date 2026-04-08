import { z } from "zod";

export const listRevealGsapSchema = z.object({
  heading: z.string().optional(),
  items: z.array(z.string()),
  numbered: z.boolean().default(true),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

export type ListRevealGsapProps = z.infer<typeof listRevealGsapSchema>;
