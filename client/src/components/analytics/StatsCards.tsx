import React from "react";
import PremiumCard from "@/components/ui/PremiumCard";

type Props = {
  counts?: {
    total: number;
    todo: number;
    in_progress: number;
    done: number;
    overdue: number;
    upcoming: number;
  };
  loading?: boolean;
};

const Card: React.FC<{ title: string; value: number; accent?: string }>=({ title, value })=> (
  <PremiumCard label={title} value={value} gradient="blue" />
);

export default function StatsCards({ counts, loading }: Props) {
  const skeleton = (
    <div className="h-20 animate-pulse rounded-[22px] bg-gray-100"/>
  );
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => <div key={i}>{skeleton}</div>)
      ) : (
        <>
          <Card title="Total" value={counts?.total ?? 0} accent="slate" />
          <Card title="Todo" value={counts?.todo ?? 0} accent="amber" />
          <Card title="In-progress" value={counts?.in_progress ?? 0} accent="sky" />
          <Card title="Done" value={counts?.done ?? 0} accent="emerald" />
          <Card title="Overdue" value={counts?.overdue ?? 0} accent="rose" />
          <Card title="Upcoming" value={counts?.upcoming ?? 0} accent="indigo" />
        </>
      )}
    </div>
  );
}
