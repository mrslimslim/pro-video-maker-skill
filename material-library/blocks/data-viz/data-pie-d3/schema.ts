import { z } from "zod";

const pieDatumSchema = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string().optional(),
});

export const dataPieD3Schema = z.object({
  title: z.string().optional(),
  data: z.array(pieDatumSchema),
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  fontFamily: z.string().default("Inter"),
  innerRadius: z.number().default(60),
  outerRadius: z.number().default(120),
});

export type DataPieD3Props = z.infer<typeof dataPieD3Schema>;
