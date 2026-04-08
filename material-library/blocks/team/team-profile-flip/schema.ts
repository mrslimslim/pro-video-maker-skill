import { z } from "zod";

const memberSchema = z.object({
  name: z.string(),
  role: z.string(),
  color: z.string(),
  bio: z.string().optional(),
});

export const teamProfileFlipSchema = z.object({
  members: z.array(memberSchema).min(1).max(6),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#818CF8"),
  fontFamily: z.string().default("Inter"),
});

export type TeamProfileFlipProps = z.infer<typeof teamProfileFlipSchema>;
