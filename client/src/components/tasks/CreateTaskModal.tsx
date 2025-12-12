// src/components/tasks/CreateTaskModal.tsx
import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useTaskModal } from "@/hooks/useTaskModal";
import { motion, AnimatePresence } from "framer-motion";

type Status = "todo" | "in_progress" | "completed";

export default function CreateTaskModal() {
  const { isOpen, close, mode, task, defaultStatus, dueDate, contextLabel } = useTaskModal();
  const { createTask, updateTask } = useTasks();

  const isEdit = mode === "edit";

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<Status>((task?.status as Status) ?? defaultStatus ?? "todo");
  const [date, setDate] = useState<string>(task?.dueDate ?? dueDate ?? "");
  const [reminderTime, setReminderTime] = useState<string>(task?.reminder ?? "");

  useEffect(() => {
    if (isEdit && task) {
      setTitle(task.title ?? "");
      setDescription(task.description ?? "");
      setStatus(task.status ?? "todo");
      setDate(task.dueDate ?? "");
      setReminderTime(task.reminder ?? task.reminderTime ?? "");
    } else {
      setStatus(defaultStatus ?? "todo");
      setDate(dueDate ?? "");
    }
  }, [task, isEdit, defaultStatus, dueDate]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title required");

    if (isEdit) {
      // UPDATE EXISTING TASK
      await updateTask(task.id, {
        title,
        description,
        status,
        dueDate: date || null,
        reminderTime: reminderTime || null,
      });
    } else {
      // CREATE NEW TASK
      await createTask({
        title,
        description,
        status,
        dueDate: date || null,
        reminder: reminderTime || null,
      });
    }

    close();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="bg-white rounded-xl p-6 w-[420px] shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-2">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>

          <p className="text-xs text-gray-600 mb-4">
            {contextLabel ??
              (date
                ? `${isEdit ? "Editing task for:" : "Creating task for:"} ${new Date(
                    date
                  ).toLocaleDateString()}`
                : "Pick a due date")}
          </p>

          <div className="space-y-3">
            <input
              className="w-full border p-2 rounded"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              {/* STATUS */}
              <select
                className="border p-2 rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              {/* DATE */}
              <input
                type="date"
                className="border p-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              {/* REMINDER */}
              <input
                type="time"
                className="border p-2 rounded col-span-2"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={close}>
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                onClick={handleSubmit}
              >
                {isEdit ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
