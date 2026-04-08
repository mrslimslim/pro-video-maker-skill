import { z } from "zod";

const planSchema = z.object({
  name: z.string(),
  price: z.number(),
  period: z.string().optional(),
  features: z.array(z.string()),
  highlighted: z.boolean().optional(),
});

export const pricingTableSlideSchema = z.object({
  plans: z.array(planSchema).min(1).max(4),
  backgroundColor: z.string().default("#0B1220"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

export type PricingTableSlideProps = z.infer<typeof pricingTableSlideSchema>;
