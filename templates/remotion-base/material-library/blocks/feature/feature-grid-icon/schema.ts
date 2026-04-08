import { z } from "zod";

const featureItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const featureGridIconSchema = z.object({
  title: z.string().optional(),
  features: z.array(featureItemSchema).min(1).max(12),
  columns: z.union([z.literal(2), z.literal(3)]).default(2),
  backgroundColor: z.string().default("#020617"),
  textColor: z.string().default("#E2E8F0"),
  accentColor: z.string().default("#818CF8"),
  fontFamily: z.string().default("Inter"),
});

export type FeatureGridIconProps = z.infer<typeof featureGridIconSchema>;
