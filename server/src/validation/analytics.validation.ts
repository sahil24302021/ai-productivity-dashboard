import { z } from "zod";

// days query param, optional, defaults to 7, must be positive int and reasonable cap
export const daysQuerySchema = z.object({
  days: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().int().positive().max(365).optional())
    .transform((v) => v ?? 7),
});

export type DaysQuery = z.infer<typeof daysQuerySchema>;