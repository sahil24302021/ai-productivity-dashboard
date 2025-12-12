import { prisma } from "../prisma";

export class TaskService {
  /** ---------------------------
   * CREATE
   * --------------------------- */
  static async create(userId: string, data: any) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
  reminderAt: data.reminderTime ?? null,
        status: data.status, // already normalized in controller
        userId,
      },
    });
  }

  /** ---------------------------
   * GET ALL (user scoped)
   * --------------------------- */
  static async getAll(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /** ---------------------------
   * UPDATE
   * --------------------------- */
  static async update(id: string, userId: string, data: any) {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== userId) {
      throw new Error("Task not found or unauthorized");
    }

    return prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
  reminderAt: data.reminderTime ?? null,
        status: data.status, // controller already maps completed → done
      },
    });
  }

  /** ---------------------------
   * DELETE
   * --------------------------- */
  static async delete(id: string, userId: string) {
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== userId) {
      throw new Error("Task not found or unauthorized");
    }

    await prisma.task.delete({ where: { id } });
  }
}
