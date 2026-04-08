import { z } from "zod";

const timelineItemSchema = z.object({
  label: z.string(),
  description: z.string(),
});

export const contentTimelineVerticalSchema = z.object({
  title: z.string().optional(),
  items: z.array(timelineItemSchema).min(1).max(8),
  backgroundColor: z.string().default("#020617"),
  textColor: z.string().default("#E2E8F0"),
  accentColor: z.string().default("#38BDF8"),
  fontFamily: z.string().default("Inter"),
});

export type ContentTimelineVerticalProps = z.infer<typeof contentTimelineVerticalSchema>;
