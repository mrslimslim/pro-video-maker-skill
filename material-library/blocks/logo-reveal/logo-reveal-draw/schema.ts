import { z } from "zod";

export const logoRevealDrawSchema = z.object({
  svgPath: z.string(),
  label: z.string().optional(),
  backgroundColor: z.string().default("#0B1120"),
  strokeColor: z.string().default("#E2E8F0"),
  fillColor: z.string().default("#38BDF8"),
  fontFamily: z.string().default("Inter"),
});

export type LogoRevealDrawProps = z.infer<typeof logoRevealDrawSchema>;
