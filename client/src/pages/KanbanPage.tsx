// src/pages/KanbanPage.tsx
 
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { useTasks } from "@/hooks/useTasks";

export default function KanbanPage() {
  const { isLoading } = useTasks();
  if (isLoading) return <div className="px-10 py-8">Loading tasks...</div>;

  return (
    <div className="w-full px-10 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Kanban</h1>
        <p className="text-sm text-gray-500 mt-1">Organize and track tasks visually</p>
      </div>

      <KanbanBoard />
    </div>
  );
}
