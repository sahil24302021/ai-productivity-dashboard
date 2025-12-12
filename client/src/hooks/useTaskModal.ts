import { create } from "zustand";

interface TaskModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  defaultStatus?: string;
  dueDate?: string | null;
  task?: any;
  contextLabel?: string | null;
  open: (opts?: any) => void;
  close: () => void;
}

export const useTaskModal = create<TaskModalState>((set) => ({
  isOpen: false,
  mode: "create",
  defaultStatus: "todo",
  dueDate: null,
  task: null,
  contextLabel: null,

  open: (opts) =>
    set({
      isOpen: true,
      mode: opts?.mode ?? "create",
      task: opts?.task ?? null,
      defaultStatus: opts?.defaultStatus ?? "todo",
      dueDate: opts?.dueDate ?? null,
    contextLabel: opts?.contextLabel ?? null,
    }),

  close: () => set({ isOpen: false, task: null, dueDate: null, contextLabel: null }),
}));
