// src/pages/AIAssistantPage.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ChatWindow from "@/components/ai/ChatWindow";
import ChatInput from "@/components/ai/ChatInput";
import TaskGenerator from "@/components/ai/TaskGenerator";
import WeeklyPlanner from "@/components/ai/WeeklyPlanner";
import InsightsCard from "@/components/ai/InsightsCard";
import { useAIAssistant } from "@/hooks/useAIAssistant";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const {
    chatMutation,
    generateTasksMutation,
    weeklyPlanMutation,
    insightsMutation,
  } = useAIAssistant();

  // Auto-scroll to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await chatMutation.mutateAsync({ message: text });
      const assistantMsg = {
        role: "assistant" as const,
        content: res?.data?.reply ?? "",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }
  };

  return (
    <div className="w-full px-10 py-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header: minimal spacing, flush under topbar */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">AI Assistant</h1>
          <p className="mt-1 text-sm text-gray-600">Chat with AI, generate tasks, plan your week, and get insights.</p>
        </motion.div>

        {/* Main grid; unified card styles, no internal scroll except page */}
  <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chat Panel */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="xl:col-span-2">
            <div className="rounded-[22px] border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-gradient-to-br from-[#f7faff] to-[#eef3ff]">
              <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">AI Chat</h2>
              </div>
              <div className="flex-1 p-4 bg-white rounded-b-[22px]">
                <ChatWindow messages={messages} />
                <div ref={chatBottomRef} />
              </div>
              <div className="sticky bottom-0 px-4 py-3 border-t border-gray-100 bg-white rounded-b-[22px]">
                <ChatInput onSend={sendMessage} isLoading={chatMutation.isPending} />
              </div>
            </div>
          </motion.section>

        {/* Tools */}
      <div className="flex flex-col gap-6">
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="rounded-[22px] border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff]">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">AI Task Generator</h2>
              </div>
              <div className="p-4">
                <TaskGenerator
                  generate={(input: string) => generateTasksMutation.mutateAsync({ prompt: input })}
                  isLoading={generateTasksMutation.isPending}
                  tasks={generateTasksMutation.data?.data?.tasks ?? []}
                  error={generateTasksMutation.error as any}
                />
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="rounded-[22px] border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-gradient-to-br from-[#f7faff] to-[#eef3ff]">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">AI Weekly Planner</h2>
              </div>
              <div className="p-4">
                <WeeklyPlanner
                  generate={(context?: string) => weeklyPlanMutation.mutateAsync({ context })}
                  isLoading={weeklyPlanMutation.isPending}
                  plan={weeklyPlanMutation.data?.data?.plan ?? null}
                  error={weeklyPlanMutation.error as any}
                />
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="rounded-[22px] border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-gradient-to-br from-[#fff7f7] to-[#ffecec]">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">AI Insights</h2>
              </div>
              <div className="p-4">
                <InsightsCard
                  fetchInsights={() => insightsMutation.mutateAsync({})}
                  isLoading={insightsMutation.isPending}
                  insights={insightsMutation.data?.data ?? null}
                  error={insightsMutation.error as any}
                />
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
