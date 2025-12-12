// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

import DashboardLayout from "@/layout/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import DashboardPage from "@/pages/DashboardPage";
import TasksPage from "@/pages/TasksPage";
import KanbanPage from "@/pages/KanbanPage";
import CalendarPage from "@/pages/CalendarPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AIAssistantPage from "@/pages/AIAssistantPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected + Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
        </Route>

        {/* Default */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
