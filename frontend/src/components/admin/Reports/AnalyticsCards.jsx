import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  UsersRound,
} from "lucide-react";

function AnalyticsCards({ data, loading }) {
  const cards = [
    {
      label: "Total complaints",
      value: data?.stats?.totalComplaints,
      icon: ClipboardList,
      iconStyle: "bg-blue-50 text-blue-600",
      accent: "bg-blue-600",
    },
    {
      label: "Resolved complaints",
      value: data?.stats?.resolvedComplaints,
      icon: CheckCircle2,
      iconStyle: "bg-green-50 text-green-600",
      accent: "bg-green-600",
    },
    {
      label: "Staff available",
      value: data?.stats?.availableStaff,
      icon: UsersRound,
      iconStyle: "bg-amber-50 text-amber-600",
      accent: "bg-amber-500",
    },
    {
      label: "Total tasks",
      value: data?.taskStats?.assignedTasks,
      icon: BarChart3,
      iconStyle: "bg-teal-50 text-teal-600",
      accent: "bg-teal-600",
    },
  ];

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Analytics summary"
    >
      {cards.map(
        ({ label, value, icon: Icon, iconStyle, accent }) => (
          <article
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Top accent */}
            <div
              className={`absolute left-0 top-0 h-1 w-full ${accent}`}
            />

            <div className="flex items-start justify-between gap-4">
              {/* Content */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {label}
                </p>

                <div className="mt-3">
                  {loading ? (
                    <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
                  ) : (
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                      {value ?? 0}
                    </h2>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconStyle}`}
              >
                <Icon size={21} strokeWidth={2} />
              </div>
            </div>

            {/* Bottom indicator */}
            <div className="mt-5 h-1 w-10 rounded-full bg-slate-200 transition-all duration-300 group-hover:w-16" />
          </article>
        )
      )}
    </section>
  );
}

export default AnalyticsCards;

