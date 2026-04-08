import { z } from "zod";

export const beforeAfterWipeSchema = z.object({
  beforeLabel: z.string().default("Before"),
  afterLabel: z.string().default("After"),
  beforeColor: z.string().default("#64748B"),
  afterColor: z.string().default("#22C55E"),
  dividerColor: z.string().default("#F8FAFC"),
  backgroundColor: z.string().default("#020617"),
  textColor: z.string().default("#F1F5F9"),
  fontFamily: z.string().default("Inter"),
});

export type BeforeAfterWipeProps = z.infer<typeof beforeAfterWipeSchema>;
