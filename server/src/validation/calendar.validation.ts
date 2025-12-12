import { z } from "zod";

export const calendarTaskBodySchema = z.object({
  taskId: z.string().uuid(),
  dueDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid ISO date" }),
  reminderAt: z
    .string()
    .optional()
    .refine((v) => (v ? !Number.isNaN(Date.parse(v)) : true), { message: "Invalid ISO date" }),
});

export const dateRangeQuerySchema = z.object({
  from: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid from date" }),
  to: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid to date" }),
});

export type CalendarTaskBody = z.infer<typeof calendarTaskBodySchema>;
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;