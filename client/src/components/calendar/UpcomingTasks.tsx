// client/src/components/calendar/UpcomingTasks.tsx
import React from "react";
import { useTasks } from "@/hooks/useTasks";
import EditTaskDrawer from "@/components/tasks/EditTaskDrawer";

// Status shape inferred from tasks hook

// (Task type omitted here; upcoming list uses inferred 'any' from tasks hook)

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function UpcomingTasks() {
  const { tasks } = useTasks();
  const [selected, setSelected] = React.useState<any | null>(null);

  const today = React.useMemo(() => startOfDay(new Date()), []);

  const upcoming = React.useMemo(() => {
    return (Array.isArray(tasks) ? tasks : [])
      .map((t: any) => {
        const due = t?.dueDate ? startOfDay(new Date(t.dueDate)) : null;
        return { ...t, due, raw: t };
      })
      .filter((t: any) => t.due && t.due >= today && t.status !== "completed")
      .sort((a: any, b: any) => a.due.getTime() - b.due.getTime())
      .slice(0, 10);
  }, [tasks, today]);

  const relative = (d: Date) => {
    const now = startOfDay(new Date());
    const dd = startOfDay(new Date(d));
    const diff = Math.round((dd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Due today";
    if (diff === 1) return "Due tomorrow";
    if (diff < 0) return `Overdue by ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"}`;
    return `Due in ${diff} days`;
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold tracking-tight text-gray-800">Upcoming Tasks</h3>
        <span className="text-xs text-gray-500">Next 10</span>
      </div>

      <div className="space-y-2">
        {upcoming.length === 0 ? (
          <div className="text-sm text-gray-500 py-2">No upcoming tasks.</div>
        ) : (
          upcoming.map((t: any) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.raw)}
              className="w-full text-left rounded-lg border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 transition flex items-center justify-between"
              title={t.title}
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    "inline-block h-2 w-2 rounded-full " +
                    (t.status === "completed" ? "bg-green-500" : t.status === "in_progress" ? "bg-amber-500" : "bg-gray-500")
                  }
                />
                <div>
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">{t.title}</div>
                  <div className="text-xs text-gray-600">{relative(t.due)}</div>
                </div>
              </div>

              <div className="text-xs text-gray-500">{t.due ? t.due.toLocaleDateString() : ""}</div>
            </button>
          ))
        )}
      </div>

      {selected && <EditTaskDrawer task={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
