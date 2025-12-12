// src/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/hooks/authStore"; // Updated to hooks alias

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Tasks", path: "/tasks" },
  { name: "Kanban", path: "/kanban" },
  { name: "Calendar", path: "/calendar" },
  { name: "Analytics", path: "/analytics" },
  { name: "AI Assistant", path: "/ai-assistant" },
];

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);

  return (
  <div className="h-screen w-64 bg-gradient-to-br from-[#fcfdff] to-[#f7faff] border-r border-gray-100 flex flex-col justify-between shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
      <div>
    <div className="px-6 py-6 text-xl font-semibold tracking-wide text-gray-900">Productivity AI</div>

    <nav className="mt-2 space-y-1 px-3">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
        `block px-4 py-2 rounded-[14px] text-sm transition-colors ${
                  isActive
          ? "bg-indigo-50 text-indigo-700 font-medium border border-indigo-100"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={logout}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-[14px] text-sm shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
