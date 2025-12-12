// src/controllers/kanban.controller.ts
import { Request, Response } from "express";
import logger from "../utils/logger";
import { reorderSchema, moveSchema } from "../validation/kanban.validation";
import * as kanbanService from "../services/kanban.service";

/**
 * PUT /api/tasks/reorder
 * body: { status, taskIds }
 */
export async function reorderController(req: Request, res: Response) {
  try {
    const parsed = reorderSchema.parse(req.body);
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const updated = await kanbanService.reorderTasks(userId, parsed.status, parsed.taskIds);
    return res.json({ success: true, tasks: updated });
  } catch (err: any) {
    logger.error("reorderController error", { error: err });
    return res.status(400).json({ success: false, error: err.message || err });
  }
}

/**
 * PUT /api/tasks/move
 * body: { taskId, fromStatus?, toStatus, toPosition? }
 */
export async function moveController(req: Request, res: Response) {
  try {
    const parsed = moveSchema.parse(req.body);
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const updatedTask = await kanbanService.moveTask(userId, parsed.taskId, parsed.toStatus, parsed.toPosition);
    return res.json({ success: true, task: updatedTask });
  } catch (err: any) {
    logger.error("moveController error", { error: err });
    return res.status(400).json({ success: false, error: err.message || err });
  }
}
