import { z } from "zod";

export const countdownFlipSchema = z.object({
  from: z.number().int().min(1).max(10).default(3),
  backgroundColor: z.string().default("#020617"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#F472B6"),
  fontFamily: z.string().default("Inter"),
});

export type CountdownFlipProps = z.infer<typeof countdownFlipSchema>;
