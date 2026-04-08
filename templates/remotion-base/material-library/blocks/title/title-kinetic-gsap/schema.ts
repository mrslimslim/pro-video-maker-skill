import { z } from "zod";

export const titleKineticGsapSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

export type TitleKineticGsapProps = z.infer<typeof titleKineticGsapSchema>;
