import { z } from "zod";

export const testimonialQuoteCardSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  avatarColor: z.string().default("#6366F1"),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F1F5F9"),
  accentColor: z.string().default("#38BDF8"),
  fontFamily: z.string().default("Inter"),
});

export type TestimonialQuoteCardProps = z.infer<typeof testimonialQuoteCardSchema>;
