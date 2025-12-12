import { Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export class TaskController {
  /** ---------------------------
   *  CREATE TASK
   * --------------------------- */
  static async createTask(req: AuthRequest, res: Response) {
    try {
      const { title, description, status, dueDate, reminderTime } = req.body as any;

      const normalize = (s?: string) => {
        if (!s) return undefined;
        if (s === "in-progress") return "in_progress";
        if (s === "done") return "completed";
        if (s === "completed") return "completed";
        if (s === "in_progress") return "in_progress";
        if (s === "todo") return "todo";
        return undefined;
      };

      const normalized = normalize(status);

      const task = await prisma.task.create({
        data: {
          title,
          description,
          // Convert string => Date
          dueDate: dueDate ? new Date(dueDate) : null,

          // Combine date + time into a real DateTime
          reminderAt:
            dueDate && reminderTime
              ? new Date(`${dueDate}T${reminderTime}:00`)
              : null,

          // Prisma enum: todo | in_progress | done
          status:
            normalized === "completed" ? ("done" as any) : (normalized as any),

          userId: req.user!.id,
        },
      });

      return res.status(201).json(task);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  /** ---------------------------
   *  GET ALL TASKS
   * --------------------------- */
  static async getTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
      });

      const mapped = tasks.map((t: any) => ({
        ...t,
        status:
          t.status === "done"
            ? "completed"
            : t.status === "in-progress"
            ? "in_progress"
            : t.status,
      }));

      return res.json(mapped);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  /** ---------------------------
   *  UPDATE TASK
   * --------------------------- */
  static async updateTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, status, dueDate, reminderTime } = req.body as any;

      const existing = await prisma.task.findUnique({ where: { id } });
      if (!existing || existing.userId !== req.user!.id) {
        return res.status(404).json({ error: "Task not found or unauthorized" });
      }

      const normalize = (s?: string) => {
        if (!s) return undefined;
        if (s === "in-progress") return "in_progress";
        if (s === "done") return "completed";
        if (s === "completed") return "completed";
        if (s === "in_progress") return "in_progress";
        if (s === "todo") return "todo";
        return undefined;
      };

      const normalized = normalize(status);

      const updated = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,

          // Convert date string → DateTime
          dueDate: dueDate ? new Date(dueDate) : null,

          // Convert reminder time → DateTime
          reminderAt:
            dueDate && reminderTime
              ? new Date(`${dueDate}T${reminderTime}:00`)
              : null,

          status:
            normalized === "completed"
              ? ("done" as any)
              : (normalized as any),
        },
      });

      return res.json(updated);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  /** ---------------------------
   *  DELETE TASK
   * --------------------------- */
  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const existing = await prisma.task.findUnique({ where: { id } });
      if (!existing || existing.userId !== req.user!.id) {
        return res.status(404).json({ error: "Task not found or unauthorized" });
      }

      await prisma.task.delete({ where: { id } });

      return res.json({ message: "Task deleted" });
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }
}
