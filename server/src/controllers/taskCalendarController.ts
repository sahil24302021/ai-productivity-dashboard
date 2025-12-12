// src/controllers/taskCalendarController.ts
import { Request, Response } from "express";
import { prisma } from "../prisma";
import { z } from "zod";
const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(), // ISO
  reminderAt: z.string().optional(),
  status: z.enum(["todo","in-progress","done"]).optional(),
});

export async function createTask(req: Request, res: Response) {
  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });

  if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });
  const userId = req.user.id;

  const { title, description, dueDate, reminderAt, status } = parsed.data;
  const dbStatus = status ? (status === "in-progress" ? "in_progress" : status) : "todo";

  // Set position to end of column
  const count = await prisma.task.count({ where: { userId, status: dbStatus } });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: dbStatus,
      position: count,
      dueDate: dueDate ? new Date(dueDate) : null,
      reminderAt: reminderAt ? new Date(reminderAt) : null,
      userId,
    },
  });

  return res.status(201).json(task);
}

export async function filterByDate(req: Request, res: Response) {
  const dateQ = req.query.date as string | undefined;
  if (!dateQ) return res.status(400).json({ error: "date query required (YYYY-MM-DD)" });

  if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });
  const userId = req.user.id;

  const dayStart = new Date(dateQ);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      dueDate: { gte: dayStart, lt: dayEnd },
    },
    orderBy: { dueDate: "asc" },
  });

  return res.json({ tasks });
}

export async function upcoming(req: Request, res: Response) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });
  const userId = req.user.id;

  const days = Number(req.query.days || 7);
  const now = new Date();
  const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const tasks = await prisma.task.findMany({
    where: { userId, dueDate: { gte: now, lte: until }, status: { not: "done" } },
    orderBy: { dueDate: "asc" },
  });

  return res.json({ tasks });
}

export async function overdue(req: Request, res: Response) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });
  const userId = req.user.id;

  const now = new Date();
  const tasks = await prisma.task.findMany({
    where: { userId, dueDate: { lt: now }, status: { not: "done" } },
    orderBy: { dueDate: "asc" },
  });

  return res.json({ tasks });
}
