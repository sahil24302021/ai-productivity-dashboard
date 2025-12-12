import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api/client";

export type OverviewStats = {
  createdByDay: number[];
  completedByDay: number[];
  streak: number;
  avgCompletionTime: number | null;
  tasksToday: number;
  completedToday: number;
  overdue: number;
  active: number;
  totalCreated7Days: number;
  totalCompleted7Days: number;
  avgCreatedPerDay: number;
  avgCompletedPerDay: number;
  peakCreatedDay: { date: string; count: number } | null;
  peakCompletedDay: { date: string; count: number } | null;
};

export type AiSummaryResponse = {
  stats: OverviewStats;
  summary: string;
  tips: string[];
};

function daysRange(count: number, end = new Date()): Date[] {
  const list: Date[] = [];
  const start = new Date(end);
  start.setDate(end.getDate() - (count - 1));
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    list.push(d);
  }
  return list;
}

async function fetchOverview() {
  const res = await api.get<{ data: OverviewStats; error: string | null }>("/api/analytics/overview");
  if (res.data.error) throw new Error(res.data.error);
  return res.data.data;
}

async function postAiSummary(stats?: OverviewStats) {
  const res = await api.post<AiSummaryResponse>("/api/analytics/ai-summary", stats ? { stats } : {});
  return res.data;
}

export function useAnalytics() {
  const {
  data: overview,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["analytics-overview"], queryFn: fetchOverview });

  const {
    mutateAsync: generateAiSummary,
    isPending: aiLoading,
    data: aiSummary,
  } = useMutation({ mutationKey: ["ai-summary"], mutationFn: postAiSummary });

  // Chart-friendly datasets with dates
  const last7 = daysRange(7);
  const createdPerDay = last7.map((d, i) => ({
    date: d.toISOString().split("T")[0],
    count: overview?.createdByDay?.[i] ?? 0,
  }));
  const completedPerDay = last7.map((d, i) => ({
    date: d.toISOString().split("T")[0],
    count: overview?.completedByDay?.[i] ?? 0,
  }));

  const meta = overview
    ? {
        totalCreated7Days: overview.totalCreated7Days,
        totalCompleted7Days: overview.totalCompleted7Days,
        avgCreatedPerDay: overview.avgCreatedPerDay,
        avgCompletedPerDay: overview.avgCompletedPerDay,
        peakCreatedDay: overview.peakCreatedDay,
        peakCompletedDay: overview.peakCompletedDay,
      }
    : undefined;

  return {
    overview,
    isLoading,
    refetch,
    generateAiSummary,
    aiLoading,
    aiSummary,
    createdPerDay,
    completedPerDay,
    meta,
  };
}
