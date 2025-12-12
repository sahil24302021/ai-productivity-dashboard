// src/layout/DashboardLayout.tsx
import Sidebar from "@/layout/Sidebar";
import Topbar from "@/layout/Topbar";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";

export default function DashboardLayout() {
  return (
  <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#fbfcff] to-[#f6f8ff]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
  <div className="flex flex-1 flex-col min-w-0">

        {/* TOPBAR */}
        <Topbar />

        {/* SCROLL AREA */}
  <div className="flex-1 overflow-y-auto">

          {/* GLOBAL PAGE CONTAINER */}
          <main
            className="
              w-full 
              max-w-[1500px] 
              mx-auto 
              px-10 
              py-8 
              space-y-8
            "
          >
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>

        </div>
      </div>

      {/* GLOBAL MODAL */}
      <CreateTaskModal />
    </div>
  );
}
