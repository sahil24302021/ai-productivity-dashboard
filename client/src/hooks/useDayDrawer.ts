import { create } from "zustand";

type DayDrawerState = {
  isOpen: boolean;
  date: string | null;
  tasks: any[];
  open: (payload: { date: string; tasks: any[] }) => void;
  close: () => void;
};

export const useDayDrawer = create<DayDrawerState>((set) => ({
  isOpen: false,
  date: null,
  tasks: [],
  open: ({ date, tasks }) =>
    set({
      isOpen: true,
      date,
      tasks,
    }),
  close: () =>
    set({
      isOpen: false,
      date: null,
      tasks: [],
    }),
}));
