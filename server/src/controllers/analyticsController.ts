import { Request, Response } from "express";
import { daysQuerySchema } from "../validation/analytics.validation";
import { getTaskCounts, getStatusBreakdown, getProductivityScore, getDailyActivity } from "../services/analytics.service";
import logger from "../utils/logger";

export async function taskCounts(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const data = await getTaskCounts(userId);
    return res.json(data);
  } catch (err: any) {
    logger.error("analytics.taskCounts error", { error: err });
    return res.status(500).json({ error: err.message ?? "Failed to fetch task counts" });
  }
}

export async function statusBreakdown(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const data = await getStatusBreakdown(userId);
    return res.json(data);
  } catch (err: any) {
    logger.error("analytics.statusBreakdown error", { error: err });
    return res.status(500).json({ error: err.message ?? "Failed to fetch status breakdown" });
  }
}

export async function productivityScore(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    const data = await getProductivityScore(userId);
    return res.json(data);
  } catch (err: any) {
    logger.error("analytics.productivityScore error", { error: err });
    return res.status(500).json({ error: err.message ?? "Failed to fetch productivity score" });
  }
}

export async function dailyActivity(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const parsed = daysQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const { days } = parsed.data;
  try {
    const data = await getDailyActivity(userId, days);
    return res.json(data);
  } catch (err: any) {
    logger.error("analytics.dailyActivity error", { error: err });
    return res.status(500).json({ error: err.message ?? "Failed to fetch daily activity" });
  }
}

