// client/src/components/tasks/StatusChip.tsx
import type { CSSProperties } from "react";

type Status = "todo" | "in-progress" | "done";

const COLORS: Record<Status, string> = {
  todo: "bg-gray-200 text-gray-700",
  "in-progress": "bg-yellow-100 text-yellow-800",
  done: "bg-green-100 text-green-800",
};

export default function StatusChip({ status, className = "", small }: { status: Status | string; className?: string; small?: boolean }) {
  // normalize unexpected values
  const s = (status || "todo").toString().replace("_", "-") as Status;
  const color = COLORS[s] ?? COLORS.todo;

  // display label: turn "in-progress" -> "In Progress"
  const label = s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const style: CSSProperties | undefined = small ? { paddingInline: "0.5rem", paddingBlock: "0.25rem", fontSize: "0.75rem" } : undefined;

  return (
    <span style={style} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color} ${className}`}>
      {label}
    </span>
  );
}
