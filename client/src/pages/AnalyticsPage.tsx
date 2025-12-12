import { useAnalytics } from "@/hooks/useAnalytics";
import TasksChart from "@/components/analytics/TasksChart";
import CompletionChart from "@/components/analytics/CompletionChart";
import StreakCard from "@/components/analytics/StreakCard";
import AiSummary from "@/components/analytics/AiSummary";
import PremiumCard from "@/components/ui/PremiumCard";

export default function AnalyticsPage() {
  const {
    overview,
    isLoading,
    generateAiSummary,
    aiLoading,
    aiSummary,
    createdPerDay,
    completedPerDay,
    meta,
  } = useAnalytics();

  return (
    <div className="px-10 py-8 space-y-8 w-full">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Your productivity insights at a glance</p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-[22px] bg-gray-100 animate-pulse" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-72 rounded-[22px] bg-gray-100 animate-pulse" />
            <div className="h-72 rounded-[22px] bg-gray-100 animate-pulse" />
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="h-32 rounded-[22px] bg-gray-100 animate-pulse" />
            <div className="h-32 rounded-[22px] bg-gray-100 animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* PREMIUM STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: "Tasks Created Today", value: overview?.tasksToday ?? 0, gradient: "blue" },
              { label: "Tasks Completed Today", value: overview?.completedToday ?? 0, gradient: "green" },
              { label: "Overdue Tasks", value: overview?.overdue ?? 0, gradient: "red" },
              { label: "Active Tasks", value: overview?.active ?? 0, gradient: "purple" },
            ].map((card, i) => (
              <PremiumCard key={i} label={card.label} value={card.value} gradient={card.gradient as any} />
            ))}
          </div>

          {/* CHARTS SECTION */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* CREATED CHART */}
            <PremiumCard gradient="blue">
              <div className="bg-white rounded-[16px] border border-gray-200 p-4">
                <TasksChart data={createdPerDay} title="Tasks Created (7 days)" />
                {meta && (
                  <div className="flex flex-wrap gap-6 text-xs text-gray-600 mt-4">
                    <span>Total: {meta.totalCreated7Days}</span>
                    <span>Avg/day: {meta.avgCreatedPerDay}</span>
                    <span>
                      Peak: {meta.peakCreatedDay ? `${meta.peakCreatedDay.count} on ${meta.peakCreatedDay.date}` : "—"}
                    </span>
                  </div>
                )}
              </div>
            </PremiumCard>

            {/* COMPLETED CHART */}
            <PremiumCard gradient="green">
              <div className="bg-white rounded-[16px] border border-gray-200 p-4">
                <CompletionChart data={completedPerDay} title="Tasks Completed (7 days)" />
                {meta && (
                  <div className="flex flex-wrap gap-6 text-xs text-gray-600 mt-4">
                    <span>Total: {meta.totalCompleted7Days}</span>
                    <span>Avg/day: {meta.avgCompletedPerDay}</span>
                    <span>
                      Peak: {meta.peakCreatedDay ? `${meta.peakCreatedDay.count} on ${meta.peakCreatedDay.date}` : "—"}
                    </span>
                  </div>
                )}
              </div>
            </PremiumCard>
          </div>

          {/* STREAK SECTION */}
          <div className="grid sm:grid-cols-2 gap-8">
            <PremiumCard gradient="purple">
              <StreakCard streak={overview?.streak} avgMs={overview?.avgCompletionTime ?? null} />
            </PremiumCard>
          </div>
        </>
      )}

      {/* AI SUMMARY */}
      <PremiumCard gradient="blue">
        <AiSummary
          onGenerate={() => generateAiSummary(overview)}
          loading={aiLoading}
          summary={aiSummary?.summary}
          tips={aiSummary?.tips}
        />
      </PremiumCard>
    </div>
  );
}
