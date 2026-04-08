import { z } from "zod";

const itemSchema = z.object({
  text: z.string(),
  author: z.string(),
  platform: z.string().optional(),
});

export const socialProofScrollSchema = z.object({
  items: z.array(itemSchema).min(2).max(12),
  backgroundColor: z.string().default("#0B1220"),
  textColor: z.string().default("#E2E8F0"),
  accentColor: z.string().default("#38BDF8"),
  fontFamily: z.string().default("Inter"),
  speed: z.number().default(1),
});

export type SocialProofScrollProps = z.infer<typeof socialProofScrollSchema>;
