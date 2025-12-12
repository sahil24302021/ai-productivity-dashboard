import prisma from "../prisma";

type Status = "todo" | "in_progress" | "done";

export type OverviewStats = {
  // by-day arrays for last 7 days
  createdByDay: number[];
  completedByDay: number[];
  // streak in days of consecutive completion activity ending today
  streak: number;
  // average completion time in ms (done tasks only)
  avgCompletionTime: number | null;
  // point-in-time counts
  tasksToday: number;
  completedToday: number;
  overdue: number;
  active: number;
  // aggregates for last 7 days
  totalCreated7Days: number;
  totalCompleted7Days: number;
  avgCreatedPerDay: number;
  avgCompletedPerDay: number;
  peakCreatedDay: { date: string; count: number } | null;
  peakCompletedDay: { date: string; count: number } | null;
};

function daysRange(count: number, end = new Date()): Date[] {
  const list: Date[] = [];
  const start = new Date(end);
  start.setHours(0, 0, 0, 0);
  start.setDate(end.getDate() - (count - 1));
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(0, 0, 0, 0);
    list.push(d);
  }
  return list;
}

export async function getOverview(userId: string): Promise<OverviewStats> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const last7 = daysRange(7, now);
  const sevenStart = new Date(last7[0]);
  const sevenEnd = new Date(last7[last7.length - 1]);
  sevenEnd.setHours(23, 59, 59, 999);

  // Single batched Prisma calls for minimal data
  const [tasksInWindow, tasksTodayCreated, tasksTodayCompleted, statusGroupCounts, overdueCount] = await Promise.all([
    prisma.task.findMany({
      where: { userId, OR: [{ createdAt: { gte: sevenStart, lte: sevenEnd } }, { status: "done", updatedAt: { gte: sevenStart, lte: sevenEnd } }] },
      select: { status: true, createdAt: true, updatedAt: true, dueDate: true },
    }),
    prisma.task.count({ where: { userId, createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.task.count({ where: { userId, status: "done", updatedAt: { gte: todayStart, lte: todayEnd } } }),
    // overdue (dueDate < now and not done), active (not done)
    prisma.task.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.task.count({ where: { userId, dueDate: { lt: now }, NOT: { status: "done" } } }),
  ]);

  // build day maps
  const createdMap: Record<string, number> = {};
  const completedMap: Record<string, number> = {};
  for (const d of last7) {
    const key = d.toISOString().split("T")[0];
    createdMap[key] = 0;
    completedMap[key] = 0;
  }

  const durations: number[] = [];
  let overdue = overdueCount;
  let active = 0;

  // compute overdue/active using fetched window + grouped counts fallback
  // Prefer live calc from all statuses via groupBy results for accuracy
  const statusCounts = statusGroupCounts.reduce<Record<Status, number>>((acc, row: any) => {
    const s = row.status as Status;
    acc[s] = (row._count?.status ?? row._count) as number;
    return acc;
  }, { todo: 0, in_progress: 0, done: 0 });
  active = (statusCounts.todo ?? 0) + (statusCounts.in_progress ?? 0);

  // We still need overdue specifically (dueDate < now and not done)
  // Derive from tasksInWindow might miss tasks with older dueDate outside window; so do a precise count via Prisma without breaking single batch by using tasksInWindow where possible.
  // Since we must use one Promise.all batch, approximate overdue from tasksInWindow plus active counts is insufficient. Instead, we compute overdue by filtering tasksInWindow that are not done and dueDate < now, and note this may be an undercount if dueDate is outside window.
  // To avoid undercount, include dueDate constraint in the initial findMany OR by createdAt/updatedAt won't fetch all. Given constraint, we compute best-effort using tasksInWindow. If needed, adjust in future.

  for (const t of tasksInWindow) {
    const createdKey = t.createdAt.toISOString().split("T")[0];
    if (createdMap[createdKey] !== undefined) createdMap[createdKey]++;

    if (t.status === "done" && t.updatedAt) {
      const completedKey = t.updatedAt.toISOString().split("T")[0];
      if (completedMap[completedKey] !== undefined) completedMap[completedKey]++;
      const ms = new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime();
      if (ms >= 0) durations.push(ms);
    }

  // overdue already computed precisely via Prisma count; skip incremental window-based calc
  }

  const createdByDay = last7.map((d) => createdMap[d.toISOString().split("T")[0]]);
  const completedByDay = last7.map((d) => completedMap[d.toISOString().split("T")[0]]);

  // streak: consecutive days ending today with >=1 completed
  let streak = 0;
  for (let i = completedByDay.length - 1; i >= 0; i--) {
    if ((completedByDay[i] ?? 0) > 0) streak++;
    else break;
  }

  const avgCompletionTime = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null;

  const totalCreated7Days = createdByDay.reduce((a, b) => a + b, 0);
  const totalCompleted7Days = completedByDay.reduce((a, b) => a + b, 0);
  const avgCreatedPerDay = Math.round((totalCreated7Days / 7) * 100) / 100;
  const avgCompletedPerDay = Math.round((totalCompleted7Days / 7) * 100) / 100;

  const peakCreatedIdx = createdByDay.reduce((mIdx, val, idx, arr) => (val > arr[mIdx] ? idx : mIdx), 0);
  const peakCompletedIdx = completedByDay.reduce((mIdx, val, idx, arr) => (val > arr[mIdx] ? idx : mIdx), 0);
  const peakCreatedDay = createdByDay[peakCreatedIdx] > 0
    ? { date: last7[peakCreatedIdx].toISOString().split("T")[0], count: createdByDay[peakCreatedIdx] }
    : null;
  const peakCompletedDay = completedByDay[peakCompletedIdx] > 0
    ? { date: last7[peakCompletedIdx].toISOString().split("T")[0], count: completedByDay[peakCompletedIdx] }
    : null;

  return {
    createdByDay,
    completedByDay,
    streak,
    avgCompletionTime,
    tasksToday: tasksTodayCreated,
    completedToday: tasksTodayCompleted,
    overdue,
    active,
    totalCreated7Days,
    totalCompleted7Days,
    avgCreatedPerDay,
    avgCompletedPerDay,
    peakCreatedDay,
    peakCompletedDay,
  };
}
