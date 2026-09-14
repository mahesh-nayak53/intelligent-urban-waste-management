import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0f766e", "#2563eb", "#d97706", "#dc2626", "#7c3aed"];

const number = (item) =>
  Number(item?.count ?? item?.complaints ?? item?.value ?? 0);

function ChartsSection({ data }) {
  const trend = data.complaintTrend.map((item) => ({
    label: item.date || item.day,
    complaints: Number(item.complaints ?? item.count ?? 0),
    resolved: Number(item.resolved ?? 0),
  }));

  const status = data.complaintStatus.map((item) => ({
    name: item.status || item.name,
    value: number(item),
  }));

  const zones = data.zones.map((item) => ({
    name: item.zone || "Unknown",
    complaints: number(item),
    resolved: Number(item.resolved ?? 0),
  }));

  const staff = data.staffPerformance.map((item) => ({
    name: item.staffName || item.name,
    resolved: Number(item.resolved ?? item.completed ?? item.count ?? 0),
  }));

  const tooltip = {
    contentStyle: {
      backgroundColor: "#102a2a",
      border: "1px solid #285654",
      borderRadius: "8px",
      color: "#f0fdfa",
    },
  };

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Complaint and Resolution Trends */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Volume and throughput
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Complaint and resolution trends
            </h2>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Historical view
          </span>
        </div>

        <div className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={310}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="complaintFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2ecea" />

              <XAxis dataKey="label" stroke="#78908e" tick={{ fontSize: 12 }} />

              <YAxis stroke="#78908e" tick={{ fontSize: 12 }} />

              <Tooltip {...tooltip} />

              <Legend />

              <Area
                type="monotone"
                dataKey="complaints"
                stroke="#0f766e"
                fill="url(#complaintFill)"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#d97706"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complaint Status */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            Portfolio health
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Complaint status
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={285}>
            <PieChart>
              <Pie
                data={status}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={94}
                paddingAngle={3}
              >
                {status.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip {...tooltip} />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Performance */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Team output
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Staff performance
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={285}>
            <BarChart
              data={staff}
              layout="vertical"
              margin={{
                left: 12,
                right: 15,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ecea" />

              <XAxis type="number" stroke="#78908e" tick={{ fontSize: 12 }} />

              <YAxis
                type="category"
                dataKey="name"
                width={90}
                stroke="#78908e"
                tick={{ fontSize: 12 }}
              />

              <Tooltip {...tooltip} />

              <Bar dataKey="resolved" fill="#2563eb" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone Analysis */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Geographic view
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Zone analysis
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={285}>
            <BarChart data={zones}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2ecea" />

              <XAxis dataKey="name" stroke="#78908e" tick={{ fontSize: 12 }} />

              <YAxis stroke="#78908e" tick={{ fontSize: 12 }} />

              <Tooltip {...tooltip} />

              <Legend />

              <Bar dataKey="complaints" fill="#0f766e" radius={[5, 5, 0, 0]} />

              <Bar dataKey="resolved" fill="#d97706" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default ChartsSection;
