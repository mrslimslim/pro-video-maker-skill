import { z } from "zod";

const cardEntrySchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const contentCardStackSchema = z.object({
  title: z.string(),
  cards: z.array(cardEntrySchema).min(1).max(6),
  backgroundColor: z.string().default("#0B1220"),
  textColor: z.string().default("#F1F5F9"),
  accentColor: z.string().default("#818CF8"),
  fontFamily: z.string().default("Inter"),
});

export type ContentCardStackProps = z.infer<typeof contentCardStackSchema>;
