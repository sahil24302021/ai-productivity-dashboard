import { z } from "zod";

// Required schema: { task: string }
export const AiSuggestSchema = z.object({
  task: z.string().min(1),
});

export type AiSuggestInput = z.infer<typeof AiSuggestSchema>;
