import { z } from "zod";

export const titleNeonFlickerSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundColor: z.string().default("#0A0A0A"),
  textColor: z.string().default("#FFFFFF"),
  glowColor: z.string().default("#22D3EE"),
  fontFamily: z.string().default("Inter"),
});

export type TitleNeonFlickerProps = z.infer<typeof titleNeonFlickerSchema>;
