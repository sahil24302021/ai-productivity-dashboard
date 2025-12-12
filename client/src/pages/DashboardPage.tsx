// src/pages/DashboardPage.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";
import { Plus, Clock, CheckCircle2, Circle, ListTodo } from "lucide-react";
import Button from "@/components/ui/Button";
import PremiumCard from "@/components/ui/PremiumCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tasks, isLoading } = useTasks();

  // compute counts
  const { todoCount, inProgressCount, doneCount, upcoming } = useMemo(() => {
    let todo = 0;
    let in_progress = 0;
    let done = 0;
    const upcomingList: any[] = [];

    const now = new Date();
    const soonCutoff = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days

    for (const t of tasks) {
      const status = t.status || "todo";
      if (status === "todo") todo++;
      else if (status === "in_progress") in_progress++;
      else if (status === "completed") done++;

      if (t.dueDate) {
        const due = new Date(t.dueDate);
        if (due >= now && due <= soonCutoff) {
          upcomingList.push(t);
        }
      } else if (t.reminderAt) {
        const rem = new Date(t.reminderAt);
        if (rem >= now && rem <= soonCutoff) upcomingList.push(t);
      }
    }

    // sort upcoming by date asc
    upcomingList.sort((a, b) => {
      const da = new Date(a.dueDate || a.reminderAt || 0).getTime();
      const db = new Date(b.dueDate || b.reminderAt || 0).getTime();
      return da - db;
    });

    return {
      todoCount: todo,
      inProgressCount: in_progress,
      doneCount: done,
      upcoming: upcomingList.slice(0, 6),
    };
  }, [tasks]);

  const total = todoCount + inProgressCount + doneCount;
  const progressPercent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-2">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Welcome, <span className="text-indigo-600">User</span></h2>
          <p className="text-sm text-gray-500 mt-2">Here's your Productivity overview.</p>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            onClick={() => {
              // you can open your modal state instead — default navigates to tasks page
              // or call setOpenCreate(true) if you lift state up or use global store
              navigate("/tasks");
              // optionally use hash to open modal: navigate("/tasks#create");
            }}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Task
          </Button>

          <button
            onClick={() => navigate("/tasks")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow-md text-sm"
          >
            <ListTodo size={16} />
            View Tasks
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2 items-stretch">
  {isLoading && (
          <div className="md:col-span-4 text-center text-gray-500">Loading tasks…</div>
        )}
        {/* big progress card */}
        <PremiumCard gradient="purple" className="md:col-span-2">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 flex items-center justify-center">
              {/* Circular progress - pure CSS */}
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#5b21b6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#g1)"
                    strokeWidth="2.5"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">{progressPercent}%</span>
                  <span className="text-xs text-gray-400">Completed</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
              <p className="text-sm text-gray-500 mt-1">Tasks completed vs total tasks.</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <PremiumCard gradient="green" className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Tasks Completed</p>
                      <p className="text-3xl font-bold text-gray-900">{doneCount}</p>
                    </div>
                    <div className="bg-green-50 text-green-600 p-2 rounded-full">
                      <CheckCircle2 size={18} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Great job — keep going.</p>
                </PremiumCard>

                <PremiumCard gradient="blue" className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">In Progress</p>
                      <p className="text-3xl font-bold text-gray-900">{inProgressCount}</p>
                    </div>
                    <div className="bg-yellow-50 text-yellow-600 p-2 rounded-full">
                      <Clock size={18} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Focus on priorities.</p>
                </PremiumCard>

                <PremiumCard gradient="red" className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Todo</p>
                      <p className="text-3xl font-bold text-gray-900">{todoCount}</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full">
                      <Circle size={18} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Backlog — add priorities.</p>
                </PremiumCard>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* small cards */}
        <PremiumCard gradient="blue">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-700">Quick Actions</h4>
            <div className="text-xs text-gray-400">Shortcuts</div>
          </div>

          <div className="mt-4 grid gap-3">
            <button
              onClick={() => navigate("/tasks")}
              className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-3"
            >
              <Plus size={16} className="text-indigo-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Create task</div>
                <div className="text-xs text-gray-500">Title, description, status & reminders</div>
              </div>
            </button>

            <button
              onClick={() => navigate("/kanban")}
              className="w-full text-left px-4 py-3 bg-white border rounded-lg flex items-center gap-3 hover:shadow"
            >
              <ListTodo size={16} />
              <div>
                <div className="text-sm font-medium text-gray-900">Open Kanban</div>
                <div className="text-xs text-gray-500">Drag & reorder tasks visually</div>
              </div>
            </button>
          </div>
        </PremiumCard>
      </div>

      {/* Upcoming / Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PremiumCard gradient="blue" className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming</h3>
            <span className="text-sm text-gray-500">{upcoming.length} next 7 days</span>
          </div>

          <div className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <div className="text-gray-500 py-6">No upcoming items. Check back later!</div>
            ) : (
              upcoming.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.description || "No description"}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(t.dueDate || t.reminderAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-600">{t.status?.replace("_", " ")}</span>
                    <button
                      onClick={() => navigate("/tasks")}
                      className="text-indigo-600 text-sm"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </PremiumCard>

        <PremiumCard gradient="green">
          <h3 className="text-lg font-semibold text-gray-900">Tips</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>• Click a task card to edit details & change status quickly.</li>
            <li>• Use reminders to never miss deadlines.</li>
            <li>• Drag tasks in Kanban to reorder and change status.</li>
          </ul>
        </PremiumCard>
      </div>
    </div>
  );
}
