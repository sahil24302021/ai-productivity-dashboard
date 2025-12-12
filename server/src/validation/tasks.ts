import { z } from "zod";

export const KanbanStatusSchema = z.enum(["todo", "in_progress", "completed"]);

export const ReorderBodySchema = z.object({
  status: KanbanStatusSchema,
  orderedIds: z.array(z.string().min(1)),
});

export const MoveBodySchema = z.object({
  taskId: z.string().min(1),
  fromStatus: KanbanStatusSchema,
  toStatus: KanbanStatusSchema,
  toPosition: z.number().int().min(0),
});

export type ReorderBody = z.infer<typeof ReorderBodySchema>;
export type MoveBody = z.infer<typeof MoveBodySchema>;
