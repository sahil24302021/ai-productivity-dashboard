import prisma from "../prisma";

export async function updateTaskDates(userId: string, taskId: string, dueDate: Date, reminderAt?: Date | null) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) {
    throw new Error("Task not found or unauthorized");
  }
  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { dueDate, reminderAt: reminderAt ?? null },
  });
  return updated;
}

export async function getTasksByDateRange(userId: string, from: Date, to: Date) {
  return prisma.task.findMany({
    where: { userId, dueDate: { gte: from, lte: to } },
    orderBy: { dueDate: "asc" },
  });
}

export async function getUpcoming(userId: string) {
  const now = new Date();
  const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  return prisma.task.findMany({
    where: { userId, dueDate: { gte: now, lte: threeDays } },
    orderBy: { dueDate: "asc" },
  });
}

export async function getOverdue(userId: string) {
  const now = new Date();
  return prisma.task.findMany({
    where: { userId, dueDate: { lt: now }, status: { not: "done" as any } },
    orderBy: { dueDate: "asc" },
  });
}