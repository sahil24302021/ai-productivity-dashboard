// src/components/calendar/CalendarGrid.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import EditTaskDrawer from "@/components/tasks/EditTaskDrawer";

type Status = "todo" | "in_progress" | "completed";

export type TaskItem = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  dueDate?: string | null;
  reminderTime?: string | null;
  raw?: any;
};

export type DayCell = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: TaskItem[];
};

type CalendarGridProps = {
  days: DayCell[];
  onDayClick?: (date: Date) => void;
  onTaskClick?: (task: TaskItem) => void;
};

export function CalendarGrid({ days, onDayClick, onTaskClick }: CalendarGridProps) {
  const [drawerTask, setDrawerTask] = React.useState<any | null>(null);

  return (
  // compact grid: tighter gaps, modern soft styling
  <div className="mt-2 grid grid-cols-7 gap-2 md:gap-3 auto-rows-[84px] md:auto-rows-[96px]">
      {days.map((day) => {
        const isMuted = !day.isCurrentMonth;

        return (
      <motion.div
            key={day.date.toISOString()}
            layout
            className={`
        group relative rounded-[18px]
        bg-gradient-to-br from-[#f9fbff] to-[#f3f7ff]
        border border-gray-200
        shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        p-2 transition transform
        hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]
              ${isMuted ? "opacity-40" : ""}
              flex flex-col
            `}
            onClick={() => onDayClick?.(day.date)}
          >
            {/* Date badge */}
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[13px] md:text-sm font-semibold text-gray-800">
                {day.date.getDate()}
              </span>

              {day.isToday && (
                <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow">
                  Today
                </span>
              )}
            </div>

            {/* Task Pills (grow area) */}
            <div className="mt-0.5 space-y-1.5 flex-1 overflow-hidden">
              <AnimatePresence>
                {day.tasks.map((task) => (
                  <motion.button
                    key={task.id}
                    layout
                    onClick={(e) => {
                      e.stopPropagation();
                      setDrawerTask(task.raw ?? task);
                      onTaskClick?.(task);
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`
                      w-full text-left rounded-[14px] px-2 py-0.5 text-[11px] md:text-xs shadow-[0_2px_10px_rgba(0,0,0,0.03)] border truncate transition
                      ${
                        task.status === "completed"
                          ? "bg-green-50 border-green-200 text-green-800 hover:-translate-y-0.5"
                          : task.status === "in_progress"
                          ? "bg-amber-50 border-amber-200 text-amber-800 hover:-translate-y-0.5"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:-translate-y-0.5"
                      }
                    `}
                    title={task.title}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-600"
                            : task.status === "in_progress"
                            ? "bg-amber-500"
                            : "bg-gray-600"
                        }`}
                      />
                      <span className="font-medium leading-snug truncate">
                        {task.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {/* Drawer */}
            <AnimatePresence>
              {drawerTask && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EditTaskDrawer task={drawerTask} onClose={() => setDrawerTask(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
