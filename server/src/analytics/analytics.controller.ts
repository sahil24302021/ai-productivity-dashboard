import { Request, Response } from "express";
import { getOverview } from "./analytics.service";
import logger from "../utils/logger";

export async function getOverviewHandler(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
  const stats = await getOverview(userId);
    return res.json({ data: stats, error: null });
  } catch (err: any) {
    logger.error("analytics.getOverview error", { error: err });
    return res.status(500).json({ data: null, error: err.message ?? "Failed to compute analytics overview" });
  }
}

export async function aiSummaryHandler(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  try {
    // Accept analytics stats from body; if not provided, compute fresh overview
  const provided = req.body?.stats;
    const stats = provided ?? (await getOverview(userId));

    // Call internal AI service endpoint to get a summary
    // We avoid external network calls and reuse existing route handler via service layer or direct fetch.
    // Here we construct a prompt-like payload.
  const { suggestTaskImprovement } = await import("../services/aiService");
  const prompt = `User analytics overview: ${JSON.stringify(stats)}. Summarize productivity, highlight strengths, and list 3 improvement tips.`;
  const aiResult = await suggestTaskImprovement(prompt, userId);

  // Normalize output fields
  const summary = aiResult.suggestion ?? "No summary available";
  const tips = Array.isArray((aiResult as any).subtasks) ? (aiResult as any).subtasks : [];

  return res.json({ stats, summary, tips });
  } catch (err: any) {
    logger.error("analytics.aiSummary error", { error: err });
    return res.status(500).json({ error: err.message ?? "Failed to generate AI summary" });
  }
}
