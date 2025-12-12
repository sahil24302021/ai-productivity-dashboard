import { useState } from "react";
import { motion } from "framer-motion";

type DayPlan = { title: string; description?: string };
type Plan = Record<string, DayPlan[]>;

export default function WeeklyPlanner({
  generate,
  isLoading,
  plan,
  error,
}: {
  generate: (context?: string) => Promise<any>;
  isLoading: boolean;
  plan: Plan | null;
  error: any;
}) {
  const [context, setContext] = useState("");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-4">
      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate(context);
        }}
        className="flex gap-2"
      >
        <input
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Provide context (goals, events, constraints)..."
          className="
            flex-1 rounded-xl border border-gray-300 bg-white 
            px-4 py-2.5 text-sm text-gray-800 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-300
          "
        />

        <button
          type="submit"
          disabled={isLoading}
          className="
            rounded-xl bg-indigo-600 px-4 py-2.5 
            text-sm font-medium text-white shadow-sm
            hover:bg-indigo-700 disabled:opacity-50
          "
        >
          {isLoading ? "Planning..." : "Generate"}
        </button>
      </form>

      {error && <div className="text-xs text-red-500">Failed to generate plan.</div>}

      {/* Days Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {days.map((d) => (
          <div
            key={d}
            className="
              rounded-xl border border-gray-200 bg-white
              p-4 shadow-sm hover:shadow-md transition
            "
          >
            <div className="text-sm font-semibold text-gray-900 mb-2">{d}</div>

            <div className="space-y-2">
              {(plan?.[d] ?? []).map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    rounded-lg border border-gray-200 bg-gray-50 
                    p-2
                  "
                >
                  <div className="text-sm font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                  )}
                </motion.div>
              ))}

              {(plan?.[d]?.length ?? 0) === 0 && (
                <div className="text-xs text-gray-500">No items yet.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
