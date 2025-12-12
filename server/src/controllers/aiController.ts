import { Request, Response } from "express";
import { AiSuggestSchema } from "../validation/ai";
import { suggestTaskImprovement } from "../services/aiService";
import logger from "../utils/logger";

export async function suggest(req: Request, res: Response) {
  const parsed = AiSuggestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await suggestTaskImprovement(parsed.data.task, userId);
    return res.json({ ok: true, data: result });
  } catch (err: any) {
    logger.error("AI suggest error", { error: err });
    return res.status(500).json({ error: err.message ?? "AI service error" });
  }
}
