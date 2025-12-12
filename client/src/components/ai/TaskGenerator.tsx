import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Task = { title: string; description?: string; priority?: string };

export default function TaskGenerator({
  generate,
  isLoading,
  tasks,
  error,
}: {
  generate: (input: string) => Promise<any>;
  isLoading: boolean;
  tasks: Task[];
  error: any;
}) {
  const [prompt, setPrompt] = useState("");

  const presets = [
    "Plan my day",
    "Generate tasks from this description",
    "Create a study plan",
  ];

  const run = async (p: string) => {
    setPrompt(p);
    await generate(p);
  };

  return (
    <div className="space-y-4">
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => run(p)}
            className="
              rounded-full border border-gray-300 bg-white 
              px-3 py-1.5 text-xs text-gray-700 
              hover:bg-gray-100 transition shadow-sm
            "
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); run(prompt); }} className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you need..."
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
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <div className="text-xs text-red-500">Failed to generate tasks.</div>}

      {/* Generated Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {tasks?.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="
                rounded-xl border border-gray-200 bg-white 
                p-4 shadow-sm hover:shadow-md transition
              "
            >
              <div className="text-sm font-semibold text-gray-900">{t.title}</div>
              {t.description && (
                <div className="text-xs text-gray-600 mt-1">{t.description}</div>
              )}
              {t.priority && (
                <div className="mt-2 inline-block rounded-full border bg-gray-50 px-2 py-1 text-[10px] text-gray-700">
                  {t.priority}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
