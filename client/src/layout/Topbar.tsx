// src/layout/Topbar.tsx
import { useAuthStore } from "@/hooks/authStore";
import { Bell } from "lucide-react";

export default function Topbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="w-full h-16 bg-gradient-to-br from-[#fcfdff] to-[#f8faff] border-b border-gray-100 flex items-center justify-between px-6 shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
      <h1 className="text-xl font-semibold text-gray-900">Welcome, {user?.name || user?.email}</h1>

      <div className="flex items-center gap-4">
  <button className="p-2 rounded-[22px] hover:bg-gray-100 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        {/* user avatar placeholder */}
  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          { (user?.name || user?.email || "U").charAt(0).toUpperCase() }
        </div>
      </div>
    </div>
  );
}
