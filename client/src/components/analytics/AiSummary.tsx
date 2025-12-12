import Button from "../ui/Button";

type Props = {
  onGenerate: () => void;
  loading?: boolean;
  summary?: string;
  tips?: string[];
};

export default function AiSummary({
  onGenerate,
  loading,
  summary,
  tips = [],
}: Props) {
  return (
  <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">AI Summary</div>
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate AI Summary"}
        </Button>
      </div>

      {/* Output */}
      <div className="space-y-3 text-gray-700 leading-relaxed">
        {summary ? (
          <p className="text-gray-800">{summary}</p>
        ) : (
          <p className="text-gray-500">Click the button to generate insights.</p>
        )}

        {tips && tips.length > 0 && (
          <ul className="list-inside list-disc space-y-1 text-gray-700">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
      </div>
  </div>
  );
}
