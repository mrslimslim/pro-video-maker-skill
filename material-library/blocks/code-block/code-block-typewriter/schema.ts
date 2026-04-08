import { z } from "zod";

export const codeBlockTypewriterSchema = z.object({
  code: z.string(),
  language: z.string().default("javascript"),
  highlightLines: z.array(z.number()).optional(),
  title: z.string().optional(),
  backgroundColor: z.string().default("#0D1117"),
  textColor: z.string().default("#E6EDF3"),
  accentColor: z.string().default("#58A6FF"),
  fontFamily: z.string().default("JetBrains Mono, monospace"),
});

export type CodeBlockTypewriterProps = z.infer<typeof codeBlockTypewriterSchema>;
