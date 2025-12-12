// client/src/components/tasks/StatusChip.tsx
import React from "react";

type Status = "todo" | "in-progress" | "done";

const COLORS: Record<Status, string> = {
  todo: "bg-gray-200 text-gray-700",
  "in-progress": "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
};

export default function StatusChip({ status, className = "" }: { status: Status | string; className?: string }) {
  // normalize unexpected values
  const s = (status || "todo").toString().replace("_", "-") as Status;
  const color = COLORS[s] ?? COLORS.todo;

  // display label: turn "in-progress" -> "In Progress"
  const label = s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color} ${className}`}>
      {label}
    </span>
  );
}
