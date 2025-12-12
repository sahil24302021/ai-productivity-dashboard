import { useState } from "react";
import { motion } from "framer-motion";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", color: "bg-blue-500" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
];

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <div className="flex gap-3">
      {STATUS_OPTIONS.map((s) => {
        const active = s.value === value;
        return (
          <motion.button
            key={s.value}
            whileTap={{ scale: 0.94 }}
            onClick={() => onChange(s.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition
              border ${active ? "border-white/40 bg-white/20" : "border-white/10 bg-white/5"}
              backdrop-blur-md`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${s.color}`} />
              {s.label}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
