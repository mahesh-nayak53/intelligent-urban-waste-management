import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getComplaintTrend } from "../../../services/dashboardService";

function ComplaintTrendChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getComplaintTrend();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching complaint trend:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">
          Unable to load complaint trend
        </p>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-60 animate-pulse rounded bg-gray-200" />

        <div className="mt-6 h-[250px] w-full animate-pulse rounded-xl bg-gray-100" />

        <div className="mt-5 flex gap-4">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-400">
          -
        </div>

        <h3 className="mt-4 text-base font-semibold text-gray-800">
          No data available
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Complaint trend information is not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Complaint Trend
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Complaint activity over the last 30 days
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
              labelStyle={{
                color: "#111827",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "#2563eb",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              height={30}
              iconType="circle"
            />

            <Line
              type="monotone"
              dataKey="count"
              name="Complaints"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                fill: "#3b82f6",
                r: 4,
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ComplaintTrendChart;

