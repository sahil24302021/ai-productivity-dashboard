export default function InsightsCard({
  fetchInsights,
  isLoading,
  insights,
  error,
}: {
  fetchInsights: () => Promise<any>;
  isLoading: boolean;
  insights: { summary: string; tips: string[] } | null;
  error: any;
}) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => fetchInsights()}
        disabled={isLoading}
        className="
          rounded-xl bg-indigo-600 px-4 py-2.5 
          text-sm font-medium text-white shadow-sm
          hover:bg-indigo-700 disabled:opacity-50
        "
      >
        {isLoading ? "Loading..." : "Refresh Insights"}
      </button>

      {error && <div className="text-xs text-red-500">Failed to fetch insights.</div>}

      {insights ? (
        <div
          className="
            rounded-xl border border-gray-200 bg-white 
            p-4 shadow-sm space-y-2
          "
        >
          <div className="text-sm font-semibold text-gray-900">Summary</div>
          <div className="text-sm text-gray-600">{insights.summary}</div>

          <div className="text-sm font-semibold text-gray-900 mt-2">Tips</div>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {insights.tips?.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-xs text-gray-500">
          No insights yet. Click refresh to fetch.
        </div>
      )}
    </div>
  );
}
