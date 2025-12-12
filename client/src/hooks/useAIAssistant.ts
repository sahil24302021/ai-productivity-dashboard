import { useMutation } from "@tanstack/react-query";
import api from "@/api/client";

type ChatRequest = { message: string };
type ChatResponse = { reply: string };

type GenerateTasksRequest = { prompt: string };
type GenerateTasksResponse = { tasks: Array<{ title: string; description?: string; priority?: string }> };

type WeeklyPlanRequest = { context?: string };
type WeeklyPlanResponse = {
  plan: Record<string, Array<{ title: string; description?: string }>>; // keys Mon..Sun
};

type InsightsResponse = {
  summary: string;
  tips: string[];
};

export function useAIAssistant() {
  const chatMutation = useMutation<{ data: ChatResponse }, any, ChatRequest>({
    mutationKey: ["ai", "chat"],
    mutationFn: async (payload) => {
  const res = await api.post("/api/ai/chat", payload);
  return { data: res.data.data } as any;
    },
  });

  const generateTasksMutation = useMutation<{ data: GenerateTasksResponse }, any, GenerateTasksRequest>({
    mutationKey: ["ai", "generate-tasks"],
    mutationFn: async (payload) => {
  const res = await api.post("/api/ai/tasks", payload);
  return { data: res.data.data } as any;
    },
  });

  const weeklyPlanMutation = useMutation<{ data: WeeklyPlanResponse }, any, WeeklyPlanRequest>({
    mutationKey: ["ai", "weekly-plan"],
    mutationFn: async (payload) => {
  const res = await api.post("/api/ai/weekly-plan", payload);
  return { data: res.data.data } as any;
    },
  });

  const insightsMutation = useMutation<{ data: InsightsResponse }, any, Record<string, never>>({
    mutationKey: ["ai", "insights"],
    mutationFn: async () => {
  const res = await api.post("/api/ai/insights", {});
  return { data: res.data.data } as any;
    },
  });

  return { chatMutation, generateTasksMutation, weeklyPlanMutation, insightsMutation };
}
