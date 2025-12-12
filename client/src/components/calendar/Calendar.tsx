// client/src/components/calendar/Calendar.tsx
import React from "react";
import { motion } from "framer-motion";
import { useTasks } from "@/hooks/useTasks";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import type { DayCell, TaskItem } from "@/components/calendar/CalendarGrid";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import { useTaskModal } from "@/hooks/useTaskModal";
import { useDayDrawer } from "@/hooks/useDayDrawer";
import DayTasksDrawer from "@/components/calendar/DayTasksDrawer";

/* UTIL HELPERS */
function startOfMonth(date: Date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfMonth(date: Date) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* MAIN COMPONENT */
export default function Calendar() {
  const { tasks } = useTasks();
  const [cursor, setCursor] = React.useState<Date>(new Date());
  const today = React.useMemo(() => startOfDay(new Date()), []);

  const { open: openTaskModal } = useTaskModal();
  const { open: openDayDrawer } = useDayDrawer();

  /* NAVIGATION */
  const prevMonth = () =>
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const nextMonth = () =>
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const gotoToday = () => {
    const now = startOfDay(new Date());
    setCursor(now);
  };

  // HOTKEYS ← → T
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prevMonth();
      if (e.key === "ArrowRight") nextMonth();
      if (e.key.toLowerCase() === "t") gotoToday();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* GRID BUILDING */
  const monthStart = React.useMemo(() => startOfMonth(cursor), [cursor]);
  const monthEnd = React.useMemo(() => endOfMonth(cursor), [cursor]);

  const days: DayCell[] = React.useMemo(() => {
    const firstDayOfGrid = new Date(monthStart);
    firstDayOfGrid.setDate(1 - monthStart.getDay());

    const arr: DayCell[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDayOfGrid);
      date.setDate(firstDayOfGrid.getDate() + i);

      const cellDay = startOfDay(date);
      const isCurrentMonth = date >= monthStart && date <= monthEnd;

      const dayTasks = (Array.isArray(tasks) ? tasks : [])
        .filter((t: any) => t?.dueDate)
        .map((t: any) => ({
          id: String(t.id),
          title: t.title ?? "Untitled",
          description: t.description ?? "",
          status: t.status,
          dueDate: t.dueDate,
          reminderTime: t.reminderTime ?? t.reminder ?? null,
          raw: t,
        }))
        .filter((t) => isSameDay(startOfDay(new Date(t.dueDate)), cellDay));

      arr.push({
        date,
        isToday: isSameDay(cellDay, today),
        isCurrentMonth,
        tasks: dayTasks,
      });
    }

    return arr;
  }, [tasks, monthStart, monthEnd, today]);

  /* ACTIONS */
  const onDayClick = (date: Date) => {
    const iso = date.toISOString().slice(0, 10);
    const dayTasks =
      days.find(
        (d) =>
          d.date.getDate() === date.getDate() &&
          d.date.getMonth() === date.getMonth() &&
          d.date.getFullYear() === date.getFullYear()
      )?.tasks || [];

    openDayDrawer({ date: iso, tasks: dayTasks });
  };

  const onTaskClick = (task: TaskItem) => {
    openTaskModal({
      mode: "edit",
      task: task.raw ?? task,
      contextLabel: `Editing: ${task.title}`,
    });
  };

  /* MONTH DROPDOWN */
  const monthOptions = React.useMemo(() => {
    const arr: { label: string; date: Date }[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(cursor.getFullYear(), cursor.getMonth() + i, 1);
      arr.push({
        label: d.toLocaleDateString(undefined, {
          month: "short",
          year: "numeric",
        }),
        date: d,
      });
    }
    return arr;
  }, [cursor]);

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="w-full min-h-0">
      {/* Centered, soft card without heavy borders */}
      <div className="mx-auto w-full max-w-[1100px] rounded-2xl border border-gray-100 bg-white shadow-sm p-4 md:p-5">

        {/* HEADER ROW */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <CalendarHeader
              monthLabel={getMonthLabel(cursor)}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
            <p className="text-sm text-gray-500 mt-1">
              ← / → to navigate · Press T for Today
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="hidden md:block rounded-md border px-3 py-2 text-sm shadow-sm"
              value={cursor.toISOString().slice(0, 7)}
              onChange={(e) => {
                const [y, m] = e.target.value.split("-");
                setCursor(new Date(Number(y), Number(m) - 1, 1));
              }}
            >
              {monthOptions.map((o) => {
                const key = `${o.date.getFullYear()}-${String(
                  o.date.getMonth() + 1
                ).padStart(2, "0")}`;
                return (
                  <option key={key} value={key}>
                    {o.label}
                  </option>
                );
              })}
            </select>

            <button
              onClick={gotoToday}
              className="px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
            >
              Today
            </button>
          </div>
        </div>

        {/* WEEKDAYS (tight spacing) */}
        <div className="mt-3 grid grid-cols-7 gap-2 text-xs md:text-sm text-gray-600">
          {"SUN MON TUE WED THU FRI SAT".split(" ").map((d) => (
            <div key={d} className="text-center font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* GRID (no internal scroll; page handles scrolling) */}
        <motion.div
          key={cursor.getMonth()}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3"
        >
          <CalendarGrid
            days={days}
            onDayClick={onDayClick}
            onTaskClick={onTaskClick}
          />
        </motion.div>
      </div>

  <DayTasksDrawer />
  <CreateTaskModal />
    </div>
  );
}
