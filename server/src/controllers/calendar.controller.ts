import { Request, Response } from "express";
import { calendarTaskBodySchema, dateRangeQuerySchema } from "../validation/calendar.validation";
import { updateTaskDates, getTasksByDateRange, getUpcoming, getOverdue } from "../services/calendar.service";

export async function createCalendarTask(req: Request, res: Response) {
  const parsed = calendarTaskBodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { taskId, dueDate, reminderAt } = parsed.data;
  try {
    const updated = await updateTaskDates(
      userId,
      taskId,
      new Date(dueDate),
      reminderAt ? new Date(reminderAt) : null
    );
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message ?? "Failed to update task dates" });
  }
}

export async function listTasksByDateRange(req: Request, res: Response) {
  const parsed = dateRangeQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { from, to } = parsed.data;
  try {
    const tasks = await getTasksByDateRange(userId, new Date(from), new Date(to));
    return res.json(tasks);
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? "Failed to fetch tasks" });
  }
}

export async function listUpcoming(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const tasks = await getUpcoming(userId);
    return res.json(tasks);
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? "Failed to fetch upcoming tasks" });
  }
}

export async function listOverdue(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const tasks = await getOverdue(userId);
    return res.json(tasks);
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? "Failed to fetch overdue tasks" });
  }
}