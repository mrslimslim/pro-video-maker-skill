import { z } from "zod";

export const ctaGlowPulseSchema = z.object({
  headline: z.string(),
  subtext: z.string().optional(),
  buttonText: z.string().optional(),
  backgroundColor: z.string().default("#030712"),
  textColor: z.string().default("#F9FAFB"),
  accentColor: z.string().default("#A78BFA"),
  glowColor: z.string().optional(),
  fontFamily: z.string().default("Inter"),
});

export type CtaGlowPulseProps = z.infer<typeof ctaGlowPulseSchema>;
