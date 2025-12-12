 
import StatusChip from "./StatusChip";
import { Clock } from "lucide-react";

// Define the allowed statuses (fixes your error)
export type Status = "todo" | "in_progress" | "completed";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  dueDate?: string | null;
};

export default function TaskCard({
  task,
  onOpen,
  onToggleStatus,
}: {
  task: Task;
  onOpen: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}) {
  return (
    <div
      onClick={() => onOpen(task)}
  className="bg-gradient-to-br from-[#f7faff] to-[#eef3ff] rounded-[22px] p-5 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition cursor-pointer"
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <p className="text-gray-500 mt-1 text-sm">
            {task.description || "No description"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">

          {/* Status bubble (prevents parent click) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(task);
            }}
          >
            <StatusChip status={task.status} small />
          </div>

          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
              <Clock size={14} />
              <span>{new Date(task.dueDate).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
