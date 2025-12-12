// src/controllers/taskKanbanController.ts
import { Request, Response } from "express";
import { ReorderBodySchema, MoveBodySchema } from "../validation/tasks";
import * as taskService from "../services/taskKanbanService";
import type { KanbanStatusApi } from "../services/taskKanbanService";

export async function reorder(req: Request, res: Response) {
  const parse = ReorderBodySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues });

  const { status, orderedIds } = parse.data as { status: KanbanStatusApi; orderedIds: string[] };
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    await taskService.reorderTasks({ userId: req.user.id, status, orderedIds });
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message ?? "Reorder failed" });
  }
}

export async function move(req: Request, res: Response) {
  const parse = MoveBodySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues });

  const { taskId, toStatus, toPosition } = parse.data as { taskId: string; toStatus: KanbanStatusApi; toPosition: number };
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    await taskService.moveTask({ userId: req.user.id, taskId, toStatus, toPosition });
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message ?? "Move failed" });
  }
}
