import { z } from "zod";

export const contentBulletStaggerSchema = z.object({
  heading: z.string(),
  body: z.string().optional(),
  bulletPoints: z.array(z.string()).optional(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
  layout: z.enum(["centered", "left-aligned", "split"]).default("centered"),
});

export type ContentBulletStaggerProps = z.infer<typeof contentBulletStaggerSchema>;
