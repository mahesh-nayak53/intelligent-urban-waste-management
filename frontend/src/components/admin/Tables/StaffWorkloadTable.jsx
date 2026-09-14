import { useState, useEffect } from "react";
import { Users, AlertCircle } from "lucide-react";
import { getStaffWorkload } from "../../../services/dashboardService";

function StaffWorkloadTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await getStaffWorkload();

        setData(result || []);
      } catch (err) {
        console.error("Error fetching staff workload:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="font-semibold">Unable to load staff workload</p>

          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="space-y-4 p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid animate-pulse grid-cols-4 gap-4">
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
              <div className="h-4 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Users size={22} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No workload data available
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Staff workload information will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Staff Workload</h3>

          <p className="mt-1 text-sm text-slate-500">
            Monitor active tasks and team capacity.
          </p>
        </div>

        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
          <Users size={20} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Staff Name
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Tasks
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Workload
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Capacity
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((staff, index) => {
              const activeTasks = Number(staff.activeTasks) || 0;
              const capacity = Number(staff.capacity) || 0;

              const workloadPercentage =
                capacity > 0 ? (activeTasks / capacity) * 100 : 0;

              const displayPercentage = Math.min(workloadPercentage, 100);

              const workloadLevel =
                workloadPercentage >= 80
                  ? "high"
                  : workloadPercentage >= 50
                    ? "medium"
                    : "low";

              const workloadStyles = {
                high: {
                  bar: "bg-red-500",
                  text: "text-red-700",
                  badge: "bg-red-50",
                },
                medium: {
                  bar: "bg-amber-500",
                  text: "text-amber-700",
                  badge: "bg-amber-50",
                },
                low: {
                  bar: "bg-emerald-500",
                  text: "text-emerald-700",
                  badge: "bg-emerald-50",
                },
              };

              const styles = workloadStyles[workloadLevel];

              return (
                <tr key={index} className="transition-colors hover:bg-slate-50">
                  {/* Staff Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                        {staff.name?.slice(0, 1).toUpperCase()}
                      </div>

                      <span className="text-sm font-semibold text-slate-900">
                        {staff.name}
                      </span>
                    </div>
                  </td>

                  {/* Active Tasks */}
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-semibold text-slate-900">
                      {activeTasks}
                    </span>
                  </td>

                  {/* Workload */}
                  <td className="px-5 py-4">
                    <div className="mx-auto flex max-w-[220px] items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                          style={{
                            width: `${displayPercentage}%`,
                          }}
                        />
                      </div>

                      <span
                        className={`w-12 text-right text-sm font-semibold ${styles.text}`}
                      >
                        {workloadPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>

                  {/* Capacity */}
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold ${styles.badge} ${styles.text}`}
                    >
                      {capacity} tasks
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StaffWorkloadTable;
