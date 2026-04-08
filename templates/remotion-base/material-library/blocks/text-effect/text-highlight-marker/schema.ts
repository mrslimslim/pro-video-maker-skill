import { z } from "zod";

const highlightSchema = z.object({
  word: z.string(),
  color: z.string(),
});

const lineSchema = z.object({
  text: z.string(),
  highlights: z.array(highlightSchema).optional(),
});

export const textHighlightMarkerSchema = z.object({
  lines: z.array(lineSchema).min(1).max(8),
  backgroundColor: z.string().default("#FAFAF9"),
  textColor: z.string().default("#1C1917"),
  fontFamily: z.string().default("Inter"),
});

export type TextHighlightMarkerProps = z.infer<typeof textHighlightMarkerSchema>;
