import { BarChart3, CheckCircle2, Clock3, ListTodo } from "lucide-react";

function StaffPerformanceWidget({ performance }) {
  const metrics = [
    {
      label: "Resolved complaints",
      value: performance?.resolvedComplaints ?? 0,
      icon: CheckCircle2,
      iconStyle: "bg-green-50 text-green-600",
      suffix: "",
    },
    {
      label: "Average resolution",
      value: performance?.averageResolutionHours ?? 0,
      icon: Clock3,
      iconStyle: "bg-blue-50 text-blue-600",
      suffix: " hrs",
    },
    {
      label: "Task completion rate",
      value: performance?.taskCompletionRate ?? 0,
      icon: BarChart3,
      iconStyle: "bg-teal-50 text-teal-600",
      suffix: "%",
    },
    {
      label: "Active workload",
      value: performance?.activeTasks ?? 0,
      icon: ListTodo,
      iconStyle: "bg-amber-50 text-amber-600",
      suffix: ` / ${performance?.totalTasks ?? 0}`,
    },
  ];

  const workloadPercentage = performance?.totalTasks
    ? Math.min((performance.activeTasks / performance.totalTasks) * 100, 100)
    : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            Performance dashboard
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            Operational scorecard
          </h3>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          All time
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, iconStyle, suffix }) => (
          <div
            key={label}
            className="group flex items-center gap-4 p-5 transition-colors hover:bg-slate-50"
          >
            {/* Icon */}
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
            >
              <Icon size={17} strokeWidth={2} />
            </span>

            {/* Value */}
            <div className="min-w-0">
              <strong className="block text-xl font-bold tracking-tight text-slate-900">
                {value}
                {suffix}
              </strong>

              <span className="mt-0.5 block text-xs font-medium text-slate-500">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Workload Analysis */}
      <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-slate-700">
            Workload analysis
          </span>

          <strong className="text-sm font-semibold text-slate-900">
            {Math.round(workloadPercentage)}% active
          </strong>
        </div>

        {/* Progress bar */}
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all duration-500"
            style={{
              width: `${workloadPercentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StaffPerformanceWidget;
