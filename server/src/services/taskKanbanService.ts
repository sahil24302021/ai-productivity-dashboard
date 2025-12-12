import { prisma } from "../prisma";


export type KanbanStatusApi = "todo" | "in_progress" | "completed";
const apiToDbStatus = (s: KanbanStatusApi): "todo" | "in_progress" | "done" =>
  s === "in_progress" ? "in_progress" : s === "completed" ? "done" : "todo";

export async function reorderTasks({
  userId,
  status,
  orderedIds,
}: {
  userId: string;
  status: KanbanStatusApi;
  orderedIds: string[];
}): Promise<{ ok: true }> {
  const dbStatus = apiToDbStatus(status);
  const tasks = await prisma.task.findMany({ where: { id: { in: orderedIds }, userId, status: dbStatus as any }, select: { id: true } });
  if (tasks.length !== orderedIds.length) throw new Error("Some tasks not found or not owned by user");

  await prisma.$transaction(
    orderedIds.map((id: string, idx: number) => prisma.task.update({ where: { id }, data: { position: idx } }))
  );
  return { ok: true };
}

export async function moveTask({
  userId,
  taskId,
  toStatus,
  toPosition,
}: {
  userId: string;
  taskId: string;
  toStatus: KanbanStatusApi;
  toPosition: number;
}): Promise<{ ok: true }> {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error("Task not found");
  const dbToStatus = apiToDbStatus(toStatus);

  if (task.status === (dbToStatus as any)) {
    const list = await prisma.task.findMany({ where: { userId, status: dbToStatus as any }, orderBy: { position: "asc" }, select: { id: true } });
    const ids: string[] = list.map((t: { id: string }): string => t.id);
    const fromIndex = ids.indexOf(taskId);
    if (fromIndex === -1) throw new Error("Task not in column");
    ids.splice(fromIndex, 1);
    ids.splice(Math.min(Math.max(toPosition, 0), ids.length), 0, taskId);

  await prisma.$transaction(ids.map((id: string, idx: number) => prisma.task.update({ where: { id }, data: { position: idx } })));
    return { ok: true };
  }

  await prisma.$transaction([
    prisma.task.updateMany({ where: { userId, status: task.status as any, position: { gt: task.position } }, data: { position: { decrement: 1 } } }),
    prisma.task.updateMany({ where: { userId, status: dbToStatus as any, position: { gte: toPosition } }, data: { position: { increment: 1 } } }),
    prisma.task.update({ where: { id: taskId }, data: { status: dbToStatus as any, position: toPosition } }),
  ]);
  return { ok: true };
}
