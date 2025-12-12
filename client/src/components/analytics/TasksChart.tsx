import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  data?: Array<{ date: string; count: number }>;
  title?: string;
};

export default function TasksChart({ data = [], title = "Tasks Created" }: Props) {
  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">{title}</div>
      </div>

      {/* Chart */}
      <div className="h-64 bg-white rounded-[16px] border border-gray-200 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                background: "white",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
