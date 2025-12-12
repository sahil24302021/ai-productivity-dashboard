import { Router, Request, Response } from "express";
import OpenAI from "openai";

const router = Router();

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in environment");
  }
  return new OpenAI({ apiKey });
}

function safeJson(res: Response, payload: any, status = 200) {
  return res.status(status).json(payload);
}

function handleError(res: Response, err: any) {
  const message = typeof err?.message === "string" ? err.message : "Unexpected server error";
  return safeJson(
    res,
    {
      error: { message },
      data: {},
    },
    500
  );
}

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body ?? {};
    if (!message || typeof message !== "string") {
      return safeJson(res, { error: { message: "'message' is required" }, data: {} }, 400);
    }

    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    return safeJson(res, { data: { reply } });
  } catch (err) {
    return handleError(res, err);
  }
});

router.post("/tasks", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body ?? {};
    if (!prompt || typeof prompt !== "string") {
      return safeJson(res, { error: { message: "'prompt' is required" }, data: {} }, 400);
    }

    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate actionable task lists as JSON. Return an array of tasks with title, optional description, and optional priority (low|medium|high).",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const text = completion.choices?.[0]?.message?.content ?? "[]";
    let tasks: Array<{ title: string; description?: string; priority?: string }> = [];
    try {
      // Try to parse JSON directly; if it's fenced or contains prose, attempt to extract JSON
      const jsonMatch = text.match(/\[([\s\S]*?)\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      tasks = JSON.parse(jsonStr);
    } catch {
      tasks = [];
    }

    return safeJson(res, { data: { tasks } });
  } catch (err) {
    return handleError(res, err);
  }
});

router.post("/weekly-plan", async (req: Request, res: Response) => {
  try {
    const { context } = req.body ?? {};
    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Create a weekly plan as JSON object with keys Monday..Sunday, each being an array of items with title and optional description.",
        },
        { role: "user", content: context || "Create a balanced productivity plan." },
      ],
      temperature: 0.5,
    });

    const text = completion.choices?.[0]?.message?.content ?? "{}";
    let plan: Record<string, any> = {};
    try {
      const objMatch = text.match(/\{([\s\S]*?)\}/);
      const objStr = objMatch ? objMatch[0] : text;
      plan = JSON.parse(objStr);
    } catch {
      plan = {};
    }

    return safeJson(res, { data: { plan } });
  } catch (err) {
    return handleError(res, err);
  }
});

router.post("/insights", async (_req: Request, res: Response) => {
  try {
    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Provide a brief productivity summary and 3-5 actionable tips. Respond as JSON with {summary: string, tips: string[]}.",
        },
        { role: "user", content: "Analyze the week and provide insights." },
      ],
      temperature: 0.6,
    });

    const text = completion.choices?.[0]?.message?.content ?? "{}";
    let summary = "";
    let tips: string[] = [];
    try {
      const objMatch = text.match(/\{([\s\S]*?)\}/);
      const objStr = objMatch ? objMatch[0] : text;
      const parsed = JSON.parse(objStr);
      summary = typeof parsed.summary === "string" ? parsed.summary : "";
      tips = Array.isArray(parsed.tips) ? parsed.tips : [];
    } catch {
      summary = "";
      tips = [];
    }

    return safeJson(res, { data: { summary, tips } });
  } catch (err) {
    return handleError(res, err);
  }
});

export default router;
