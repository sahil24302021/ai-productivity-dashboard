import { useState } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import TaskCard from "@/components/tasks/TaskCard";
import EditTaskDrawer from "@/components/tasks/EditTaskDrawer";
import { useTaskModal } from "@/hooks/useTaskModal";

export default function TasksPage() {
  const { tasks, isLoading, updateTask } = useTasks();
  const openModal = useTaskModal((s) => s.open);
  const [selected, setSelected] = useState<any | null>(null);

  if (isLoading)
    return <div className="flex items-center justify-center h-[70vh]">Loading tasks...</div>;
  // Errors are handled inside hooks or UI components; keep UI premium-focused.

  const toggleStatus = (task: any) => {
    // cycle: todo -> in-progress -> done -> todo
    const map: any = {
      "todo": "in-progress",
      "in-progress": "done",
      "done": "todo",
    };
    const next = map[task.status ?? "todo"];
  if (!updateTask) return;
  updateTask(task.id, { status: next });
  };

  return (
    <div className="px-10 py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, track and organize tasks</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal({ mode: "create", defaultStatus: "todo" })}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition"
          >
            <Plus />
            New Task
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((t: any) => (
          <TaskCard key={t.id} task={t} onOpen={setSelected} onToggleStatus={toggleStatus} />
        ))}
      </div>
      {selected && (
        <EditTaskDrawer task={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
