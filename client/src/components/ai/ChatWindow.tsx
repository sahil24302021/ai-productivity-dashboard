import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ChatWindow({ messages }: { messages: ChatMessage[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div ref={containerRef} className="space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((m, idx) => {
          const isUser = m.role === "user";

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm 
                ${isUser
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {messages.length === 0 && (
        <div className="text-sm text-gray-500 py-2">
          Start the conversation by typing a prompt below.
        </div>
      )}
    </div>
  );
}
