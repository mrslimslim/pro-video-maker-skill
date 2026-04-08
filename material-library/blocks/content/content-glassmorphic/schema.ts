import { z } from "zod";

export const contentGlassmorphicSchema = z.object({
  title: z.string(),
  body: z.string(),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#A78BFA"),
  fontFamily: z.string().default("Inter"),
  blurAmount: z.number().min(4).max(64).default(20),
});

export type ContentGlassmorphicProps = z.infer<typeof contentGlassmorphicSchema>;
