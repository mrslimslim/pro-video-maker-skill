import { z } from "zod";

export const logoRevealParticlesSchema = z.object({
  logoText: z.string(),
  backgroundColor: z.string().default("#030712"),
  textColor: z.string().default("#F9FAFB"),
  accentColor: z.string().default("#22D3EE"),
  fontFamily: z.string().default("Inter"),
  particleCount: z.number().int().min(12).max(200).default(60),
});

export type LogoRevealParticlesProps = z.infer<typeof logoRevealParticlesSchema>;
