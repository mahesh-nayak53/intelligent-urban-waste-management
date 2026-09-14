function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  iconWrapper = "bg-slate-50 text-slate-600",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <div className="mt-3">
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
            ) : (
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {value}
              </h2>
            )}
          </div>
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconWrapper}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Bottom Accent */}
      <div className="mt-5 h-1 w-10 rounded-full bg-slate-200 transition-all duration-300 group-hover:w-16" />
    </div>
  );
}

export default StatCard;
