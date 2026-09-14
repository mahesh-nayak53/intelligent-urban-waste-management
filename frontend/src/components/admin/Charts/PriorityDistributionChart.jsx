import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getPriorityDistribution } from "../../../services/dashboardService";

function PriorityDistributionChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getPriorityDistribution();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching priority distribution:", err);
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
          Unable to load priority distribution
        </p>

        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-52 animate-pulse rounded bg-gray-200" />

        <div className="mt-6 flex h-[250px] items-end justify-around gap-4">
          <div className="h-32 w-12 animate-pulse rounded-t-lg bg-gray-200" />
          <div className="h-48 w-12 animate-pulse rounded-t-lg bg-gray-200" />
          <div className="h-24 w-12 animate-pulse rounded-t-lg bg-gray-200" />
          <div className="h-40 w-12 animate-pulse rounded-t-lg bg-gray-200" />
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
          Priority information is not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Priority Distribution
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Overview of complaints by priority level
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              dataKey="priority"
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
                color: "#7c3aed",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              height={30}
              iconType="circle"
            />

            <Bar
              dataKey="count"
              name="Complaints"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PriorityDistributionChart;
