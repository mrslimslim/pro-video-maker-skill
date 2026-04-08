import { z } from "zod";

export const dataChartBuildSchema = z.object({
  heading: z.string(),
  vizType: z.enum(["bar-chart", "counter", "progress-ring", "stat-grid"]),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
});

export const dataChartBuildExtraProps = z.object({
  data: z
    .array(z.object({ label: z.string(), value: z.number(), color: z.string().optional() }))
    .optional(),
  stats: z
    .array(z.object({ label: z.string(), value: z.number(), suffix: z.string().optional() }))
    .optional(),
  percentage: z.number().optional(),
});

export type DataChartBuildProps = z.infer<typeof dataChartBuildSchema> &
  z.infer<typeof dataChartBuildExtraProps>;
