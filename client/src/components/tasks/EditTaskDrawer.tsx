import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Calendar, Clock } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

type Status = "todo" | "in_progress" | "completed";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  dueDate?: string | null;
  reminderTime?: string | null;
};

export default function EditTaskDrawer({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  const { updateTask, deleteTask } = useTasks();

  // Normalize ISO date → yyyy-mm-dd for date input
  const normalizeInputDate = (iso?: string | null) => {
    if (!iso) return "";
    try {
      return iso.substring(0, 10); // first 10 chars = yyyy-mm-dd
    } catch {
      return "";
    }
  };

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<Status>(task?.status ?? "todo");
  const [dueDate, setDueDate] = useState<string>(normalizeInputDate(task?.dueDate));
  const [reminderTime, setReminderTime] = useState(task?.reminderTime ?? "");

  // Update when drawer opens with new task
  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "todo");
    setDueDate(normalizeInputDate(task?.dueDate));
    setReminderTime(task?.reminderTime ?? "");
  }, [task]);

  // Status options
  const statusOptions = [
    { label: "Todo", value: "todo", bg: "bg-gray-200", active: "bg-gray-900 text-white" },
    { label: "In Progress", value: "in_progress", bg: "bg-yellow-200", active: "bg-yellow-500 text-white" },
    { label: "Completed", value: "completed", bg: "bg-green-200", active: "bg-green-600 text-white" },
  ];

  // FIX: Convert yyyy-mm-dd → ISO string for API
  const formatDueDateForAPI = (dateStr: string) => {
    if (!dateStr || dateStr.trim() === "") return null;
    return new Date(dateStr + "T00:00:00.000Z").toISOString();
  };

  // Save task
  const saveTask = async () => {
    const payload = {
      title: title.trim() || "Untitled Task",
      description,
      status,
      dueDate: formatDueDateForAPI(dueDate),
      reminder: reminderTime || null,
    };

    await updateTask(task.id, payload);
    onClose();
  };

  // Delete task
  const removeTask = async () => {
    await deleteTask(task.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0.6 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 32 }}
        className="
        fixed top-0 right-0 h-full w-full max-w-[450px]
        backdrop-blur-2xl bg-white/40
        shadow-[0_0_50px_rgba(0,0,0,0.15)]
        border-l border-white/20
        z-50 flex flex-col rounded-l-3xl overflow-hidden
      "
      >
        {/* Top Shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 relative z-10">
          <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/40 backdrop-blur-md shadow-sm rounded-full hover:bg-white/70 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 relative z-10">

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-white/70 backdrop-blur-md border border-white/30 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Enter task title..."
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-28 rounded-xl px-4 py-3 bg-white/70 border border-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Add details about the task..."
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Status</label>
            <div className="flex gap-3">
              {statusOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium shadow-sm transition
                    ${status === s.value ? s.active : s.bg + " text-gray-700"}
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-5">

            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Due Date</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-3 py-3 bg-white/70 border border-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Reminder */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Reminder</label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="time"
                  value={reminderTime ?? ""}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-3 py-3 bg-white/70 border border-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex items-center justify-between relative z-10">

          {/* Delete */}
          <button
            onClick={removeTask}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium shadow-lg hover:bg-red-700 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={saveTask}
            className="px-8 py-2.5 rounded-xl font-semibold shadow-xl bg-indigo-600 text-white hover:bg-indigo-700 transition relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-indigo-300/30 animate-pulse opacity-60" />
            <span className="relative z-10">Save</span>
          </motion.button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
