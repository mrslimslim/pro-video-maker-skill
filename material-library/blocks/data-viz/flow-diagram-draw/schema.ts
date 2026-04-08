import { z } from "zod";

export const flowDiagramDrawSchema = z.object({
  heading: z.string().optional(),
  steps: z.array(
    z.object({
      label: z.string(),
      description: z.string().optional(),
    })
  ),
  direction: z.enum(["horizontal", "vertical"]).default("horizontal"),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  lineColor: z.string().default("#475569"),
  fontFamily: z.string().default("Inter"),
});

export type FlowDiagramDrawProps = z.infer<typeof flowDiagramDrawSchema>;
