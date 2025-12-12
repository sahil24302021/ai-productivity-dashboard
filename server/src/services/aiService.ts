import OpenAI from "openai";

// Function: suggestTaskImprovement(task: string, userId: string)
// If OPENAI_API_KEY exists -> call OpenAI; else return mock suggestion.
export async function suggestTaskImprovement(task: string, userId: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      suggestion: `Consider breaking "${task}" into smaller actionable steps, estimate time, and set a due date. Focus on the highest-impact subtask first.`,
      source: "mock",
      userId,
    };
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const prompt = `Given the user's task: "${task}", propose a concise improvement plan. Return JSON with keys: suggestion (string), subtasks (string[]).`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });
    const text = response.choices?.[0]?.message?.content ?? "";
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { suggestion: text };
    }
    return { ...parsed, source: "openai", userId };
  } catch (err) {
    // Fallback to mock on errors
    return {
      suggestion: `Consider clarifying outcomes for "${task}" and define 2-3 subtasks you can do today.`,
      source: "mock-error",
      userId,
    };
  }
}
