// src/validation/kanban.validation.ts
import { z } from "zod";

/**
 * Reorder within a column:
 * body: {
 *   status: string, // column name (e.g. "todo")
 *   taskIds: string[] // full list of task ids in desired order for that column
 * }
 */
export const reorderSchema = z.object({
  status: z.enum(["todo", "in_progress", "completed"]),
  taskIds: z.array(z.string().uuid()).min(1),
});

/**
 * Move a single task from one column to another and place at a target position.
 * body: {
 *   taskId: string,
 *   fromStatus?: string, // optional, used to validate if you want
 *   toStatus: string,
 *   toPosition?: number // 1-based; if omitted, append to end
 * }
 */
export const moveSchema = z.object({
  taskId: z.string().uuid(),
  fromStatus: z.enum(["todo", "in_progress", "completed"]).optional(),
  toStatus: z.enum(["todo", "in_progress", "completed"]),
  toPosition: z.number().int().positive().optional(),
});

export type ReorderInput = z.infer<typeof reorderSchema>;
export type MoveInput = z.infer<typeof moveSchema>;
