// src/components/tasks/KanbanCard.tsx
 
import { motion } from "framer-motion";

type Task = {
  id: string | number;
  title?: string;
  description?: string;
  order?: number;
  status?: string;
  dueAt?: string | null;
};

export default function KanbanCard({ task, isDragging = false }: { task: Task; isDragging?: boolean; }) {
  const due = task?.dueAt ? new Date(task.dueAt) : null;
  const dueLabel = due ? due.toLocaleDateString() : null;

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging ? "0 12px 30px rgba(0,0,0,0.10)" : "0 4px 20px rgba(0,0,0,0.04)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-white rounded-[20px] p-4 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition"
      style={{ cursor: "grab" }}
      onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
      onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900 truncate">{task.title || "Untitled"}</h4>
          {task.description && <p className="mt-1 text-xs text-slate-500 line-clamp-2">{task.description}</p>}
        </div>

        <div className="flex flex-col items-end gap-1">
          {dueLabel && <div className="text-xs text-slate-400">{dueLabel}</div>}
          <div className="text-xs px-2 py-1 rounded-xl border border-gray-200 bg-gray-50 text-slate-700">
            {task.status === "in_progress" ? "In progress" : task.status === "completed" ? "Done" : "Todo"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
