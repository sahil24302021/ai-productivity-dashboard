// src/services/kanban.service.ts
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

/**
 * Helper: renumber tasks for a status into sequential positions starting at 1.
 * Accepts an array of Task objects (must include id) and updates position sequentially.
 */
async function renumberTasksForStatus(userId: string, status: string, orderedTaskIds: string[]) {
  const normalize = (s: string) => (s === "in-progress" ? "in_progress" : s === "done" ? "completed" : s);
  const normalizedStatus = normalize(status);
  const dbStatus = normalizedStatus === "completed" ? "done" : normalizedStatus;
  // Build the bulk operations using a transaction
  const updates = orderedTaskIds.map((taskId, index) =>
    prisma.task.update({
      where: { id: taskId },
  data: { position: index + 1, status: dbStatus as any },
    })
  );

  return prisma.$transaction(updates);
}

/**
 * Reorder tasks within the same column/status using an ordered list of task IDs.
 * Ensures ownership and that each task belongs to the provided user and status.
 */
export async function reorderTasks(userId: string, status: string, taskIds: string[]) {
  const normalize = (s: string) => (s === "in-progress" ? "in_progress" : s === "done" ? "completed" : s);
  const normalizedStatus = normalize(status);
  // fetch tasks to validate ownership and status
  const tasks = await prisma.task.findMany({
    where: { id: { in: taskIds } },
    select: { id: true, userId: true, status: true },
  });

  if (tasks.length !== taskIds.length) {
    throw new Error("One or more tasks not found.");
  }

  // ownership check
  const notOwned = tasks.filter((t: { id: string; userId: string; status: string }) => t.userId !== userId);
  if (notOwned.length > 0) {
    throw new Error("Unauthorized: you don't own all tasks.");
  }

  // recommended to check that all tasks belong to the same status (or allow moving status via move endpoint)
  const wrongStatus = tasks.filter((t: { id: string; userId: string; status: string }) => t.status !== normalizedStatus);
  if (wrongStatus.length > 0) {
    throw new Error("All tasks must belong to the provided status/column when reordering.");
  }

  // Renumber sequentially
  await renumberTasksForStatus(userId, normalizedStatus, taskIds);

  // return the updated list
  const updated = await prisma.task.findMany({
    where: { id: { in: taskIds } },
    orderBy: { position: "asc" },
  });
  return updated;
}

/**
 * Move a task from its current status to another status, inserting at toPosition (1-based).
 * If toPosition omitted or > length+1, append to end.
 * Ensures ownership.
 */
export async function moveTask(userId: string, taskId: string, toStatus: string, toPosition?: number) {
  const normalize = (s: string) => (s === "in-progress" ? "in_progress" : s === "done" ? "completed" : s);
  // fetch the task
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found.");
  if (task.userId !== userId) throw new Error("Unauthorized: you don't own this task.");

  const fromStatus = task.status;
  const toStatusNormalized = normalize(toStatus);
  const toDb = toStatusNormalized === "completed" ? "done" : toStatusNormalized;

  // If moving within same status, we can reuse reorder logic but here we handle general case.
  if (fromStatus === toStatusNormalized && toPosition === undefined) {
    // nothing to do
    return task;
  }

  // Get tasks currently in target status ordered by position
  const destTasks = await prisma.task.findMany({
    where: { status: toDb as any, userId },
    orderBy: { position: "asc" },
    select: { id: true },
  });

  // Build new ordered list of IDs for destination
  const destIds = destTasks.map((t: { id: string }) => t.id);

  // Remove the taskId if it already exists in dest (it might when moving within same column)
  const filtered: string[] = destIds.filter((id: string) => id !== taskId);

  // compute insertion index (0-based)
  let insertIndex = filtered.length; // default append
  if (typeof toPosition === "number") {
    // clamp to [0, filtered.length]
    insertIndex = Math.max(0, Math.min(toPosition - 1, filtered.length));
  }

  filtered.splice(insertIndex, 0, taskId); // insert

  // For source column: if moving across columns, remove from source and renumber source too
  if (fromStatus !== toDb) {
  const sourceTasks = await prisma.task.findMany({
      where: { status: fromStatus, userId },
      orderBy: { position: "asc" },
      select: { id: true },
    });

  const sourceFiltered: string[] = sourceTasks.map((t: { id: string }) => t.id).filter((id: string) => id !== taskId);

    // prepare transactions: update dest positions + update source positions
  const tx: Prisma.PrismaPromise<any>[] = [];

    // update dest
    filtered.forEach((id: string, idx: number) =>
      tx.push(prisma.task.update({ where: { id }, data: { position: idx + 1, status: toDb as any } }))
    );

    // update source
  sourceFiltered.forEach((id: string, idx: number) =>
      tx.push(prisma.task.update({ where: { id }, data: { position: idx + 1 } }))
    );

    const results = await prisma.$transaction(tx);
    // return changed task (we can fetch fresh)
    const updatedTask = await prisma.task.findUnique({ where: { id: taskId } });
    return updatedTask;
  } else {
    // moving within same status: just renumber that status with the new ordering
    await renumberTasksForStatus(userId, toStatus, filtered);
    const updatedTask = await prisma.task.findUnique({ where: { id: taskId } });
    return updatedTask;
  }
}
