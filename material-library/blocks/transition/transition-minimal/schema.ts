import { z } from "zod";

export const transitionMinimalSchema = z.object({
  text: z.string().optional(),
  icon: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  accentColor: z.string().default("#6366F1"),
  textColor: z.string().default("#F8FAFC"),
  fontFamily: z.string().default("Inter"),
});

export type TransitionMinimalProps = z.infer<typeof transitionMinimalSchema>;
