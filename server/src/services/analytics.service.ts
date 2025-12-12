import prisma from "../prisma";

export async function getTaskCounts(userId: string) {
  const groups = await prisma.task.groupBy({
    by: ["status"],
    _count: { status: true },
    where: { userId },
  });

  const byStatus: Record<string, number> = { todo: 0, in_progress: 0, done: 0 };
  let total = 0;
  groups.forEach((g: any) => {
    byStatus[g.status] = g._count.status;
    total += g._count.status;
  });
  return { total, byStatus };
}

export async function getStatusBreakdown(userId: string) {
  const { total, byStatus } = await getTaskCounts(userId);
  if (total === 0) return { todo: 0, in_progress: 0, done: 0 };
  return {
    todo: Math.round((byStatus.todo / total) * 100),
    in_progress: Math.round((byStatus.in_progress / total) * 100),
    done: Math.round((byStatus.done / total) * 100),
  };
}

export async function getProductivityScore(userId: string) {
  const completedTasks = await prisma.task.count({ where: { userId, status: "done" as any } });
  const pendingTasks = await prisma.task.count({ where: { userId, NOT: { status: "done" as any } } });
  const score = completedTasks * 2 - pendingTasks;
  return { score };
}

export async function getDailyActivity(userId: string, days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // Fetch created and updated counts per day using groupBy on date truncated to day.
  // Since Prisma doesn't support date_trunc directly, we'll post-process in JS.
  const tasks = await prisma.task.findMany({
    where: { userId, OR: [{ createdAt: { gte: start, lte: end } }, { updatedAt: { gte: start, lte: end } }] },
    select: { createdAt: true, updatedAt: true },
  });

  const daysMap: Record<string, { created: number; updated: number }> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().split("T")[0];
    daysMap[key] = { created: 0, updated: 0 };
  }

  tasks.forEach((t: { createdAt: Date; updatedAt: Date }) => {
    const createdKey = t.createdAt.toISOString().split("T")[0];
    const updatedKey = t.updatedAt.toISOString().split("T")[0];
    if (daysMap[createdKey]) daysMap[createdKey].created += 1;
    if (daysMap[updatedKey]) daysMap[updatedKey].updated += 1;
  });

  return Object.entries(daysMap).map(([date, v]) => ({ date, ...v }));
}