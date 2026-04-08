import { z } from "zod";

export const titleGlitchRevealSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundColor: z.string().default("#0A0A0A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#FF006E"),
  fontFamily: z.string().default("Inter"),
});

export type TitleGlitchRevealProps = z.infer<typeof titleGlitchRevealSchema>;
