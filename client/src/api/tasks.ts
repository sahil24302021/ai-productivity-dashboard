// src/api/tasks.ts
import api from "./client";

const mapStatusIn = (s?: string) => {
  if (!s) return undefined;
  if (s === "in-progress") return "in_progress";
  if (s === "done") return "completed";
  return s;
};

const mapStatusOut = (s?: string) => {
  if (!s) return undefined;
  if (s === "in-progress") return "in_progress";
  if (s === "done") return "completed";
  return s;
};

export const taskApi = {

  /** ---------------------------
   *  GET TASKS
   * --------------------------- */
  async getTasks() {
    const res = await api.get(`/api/tasks`);
    return (res.data || []).map((t: any) => ({
      ...t,
      status: mapStatusOut(t.status),
      dueDate: t.dueDate ? t.dueDate : null,
      reminderTime: t.reminderAt ? t.reminderAt : null,
    }));
  },

  /** ---------------------------
   *  CREATE TASK
   * --------------------------- */
  async createTask(data: {
    title: string;
    description?: string;
    status?: string;
    dueDate?: string | null;
    reminderTime?: string | null;
  }) {
    const payload = {
      title: data.title,
      description: data.description,
      status: mapStatusIn(data.status),
      dueDate: data.dueDate ?? null,
      reminderTime: data.reminderTime ?? null,
    };

    const res = await api.post(`/api/tasks`, payload);
    return res.data;
  },

  /** ---------------------------
   *  UPDATE TASK
   * --------------------------- */
  async updateTask(
    id: string,
    data: Partial<{
      title: string;
      description?: string;
      status?: string;
      dueDate?: string | null;
      reminderTime?: string | null;
    }>
  ) {
    const payload = {
      ...data,
      status: mapStatusIn(data.status),
      dueDate: data.dueDate ?? null,
      reminderTime: data.reminderTime ?? null,
    };

    const res = await api.put(`/api/tasks/${id}`, payload);
    return res.data;
  },

  /** ---------------------------
   *  DELETE TASK
   * --------------------------- */
  async deleteTask(id: string) {
    const res = await api.delete(`/api/tasks/${id}`);
    return res.data;
  },
};
