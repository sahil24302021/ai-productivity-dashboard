type Props = {
  streak?: number;
  avgMs?: number | null;
};

function formatDuration(ms?: number | null) {
  if (!ms && ms !== 0) return "N/A";
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  if (hours < 24) return `${hours}h ${remMin}m`;
  const days = Math.floor(hours / 24);
  const remH = hours % 24;
  return `${days}d ${remH}h`;
}

export default function StreakCard({ streak = 0, avgMs }: Props) {
  return (
  <div className="flex flex-col gap-6">

      {/* Row */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-500 font-medium">Productivity Streak</div>
          <div className="mt-1 text-3xl font-bold text-emerald-600">{streak} days</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 font-medium">Avg Completion Time</div>
          <div className="mt-1 text-3xl font-bold text-indigo-600">
            {formatDuration(avgMs)}
          </div>
        </div>
      </div>
  </div>
  );
}
