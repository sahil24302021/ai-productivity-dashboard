import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useDayDrawer } from "@/hooks/useDayDrawer";
import { useTaskModal } from "@/hooks/useTaskModal";

export default function DayTasksDrawer() {
  const { isOpen, date, tasks, close } = useDayDrawer();
  const { open: openTaskModal } = useTaskModal();

  if (!isOpen || !date) return null;

  const readable = new Date(date).toLocaleDateString();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 34 }}
        className="
          fixed top-0 right-0 h-full w-full max-w-[420px]
          bg-white shadow-2xl border-l z-[999] px-6 py-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tasks on {readable}</h2>
          <button onClick={close} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Create Button */}
        <button
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-indigo-600 text-white mb-4 shadow hover:bg-indigo-700
          "
          onClick={() =>
            openTaskModal({
              mode: "create",
              defaultStatus: "todo",
              task: null,
              dueDate: date,
              contextLabel: `Creating task for ${readable}`,
            })
          }
        >
          <Plus size={16} />
          Create Task
        </button>

        {/* Task List */}
        <div className="space-y-3 overflow-y-auto h-[75vh] pr-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks for this day.</p>
          ) : (
            tasks.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  openTaskModal({
                    mode: "edit",
                    task: t.raw ?? t,
                    contextLabel: `Editing: ${t.title}`,
                  })
                }
                className="
                  w-full rounded-lg border bg-gray-50 p-3 text-left shadow-sm hover:bg-gray-100
                "
              >
                <div className="font-medium text-gray-900">{t.title}</div>
                {t.description && (
                  <div className="text-xs text-gray-600 mt-1">{t.description}</div>
                )}
              </button>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
