import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/hooks/authStore";

export default function ProtectedRoute({ children }: { children?: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children ?? <Outlet />;
}
