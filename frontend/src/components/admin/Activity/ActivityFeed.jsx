import { useState, useEffect } from "react";
import { getActivity } from "../../../services/dashboardService";

function ActivityFeed() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getActivity();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching activity:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getActivityConfig = (type) => {
    switch (type?.toLowerCase()) {
      case "complaint":
        return {
          label: "Complaint",
          icon: "C",
          iconBg: "bg-blue-50",
          iconText: "text-blue-600",
          accent: "bg-blue-500",
          badge: "bg-blue-50 text-blue-700 ring-blue-100",
        };

      case "resolved":
        return {
          label: "Resolved",
          icon: "R",
          iconBg: "bg-emerald-50",
          iconText: "text-emerald-600",
          accent: "bg-emerald-500",
          badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        };

      case "assigned":
        return {
          label: "Assigned",
          icon: "A",
          iconBg: "bg-purple-50",
          iconText: "text-purple-600",
          accent: "bg-purple-500",
          badge: "bg-purple-50 text-purple-700 ring-purple-100",
        };

      case "notification":
        return {
          label: "Notification",
          icon: "N",
          iconBg: "bg-amber-50",
          iconText: "text-amber-600",
          accent: "bg-amber-500",
          badge: "bg-amber-50 text-amber-700 ring-amber-100",
        };

      default:
        return {
          label: "Activity",
          icon: "A",
          iconBg: "bg-slate-50",
          iconText: "text-slate-600",
          accent: "bg-slate-400",
          badge: "bg-slate-50 text-slate-700 ring-slate-100",
        };
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  /* Error State */
  if (error) {
    return (
      <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-600 ring-1 ring-red-100">
            !
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            Unable to load activity
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">{error}</p>
        </div>
      </section>
    );
  }

  /* Loading State */
  if (loading) {
    return (
      <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header Skeleton */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>

        {/* Activity Skeleton */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="p-5 sm:p-6">
              <div className="flex gap-4">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-200" />

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex justify-between gap-4">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />

                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* Empty State */
  if (!data || data.length === 0) {
    return (
      <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest updates and actions
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-400">
            A
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No recent activity
          </h3>

          <p className="mt-1 max-w-xs text-sm text-slate-500">
            There is no recent activity to display.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                A
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Latest updates and actions
                </p>
              </div>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {data.length} {data.length === 1 ? "activity" : "activities"}
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-h-[560px] divide-y divide-slate-100 overflow-y-auto">
        {data.map((activity, index) => {
          const config = getActivityConfig(activity.type);

          return (
            <article
              key={index}
              className="relative transition-colors duration-200 hover:bg-slate-50"
            >
              {/* Left Accent */}
              <div
                className={`absolute inset-y-0 left-0 w-1 ${config.accent}`}
              />

              <div className="p-5 sm:p-6">
                <div className="flex gap-4">
                  {/* Activity Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ring-1 ring-inset ${config.iconBg} ${config.iconText}`}
                  >
                    {config.icon}
                  </div>

                  {/* Activity Content */}
                  <div className="min-w-0 flex-1">
                    {/* Top Row */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${config.badge}`}
                        >
                          {config.label}
                        </span>

                        <h3 className="text-sm font-semibold text-slate-900">
                          {activity.title}
                        </h3>
                      </div>

                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
        <p className="text-center text-xs font-medium text-slate-400">
          Showing the latest {data.length}{" "}
          {data.length === 1 ? "activity" : "activities"}
        </p>
      </div>
    </section>
  );
}

export default ActivityFeed;

