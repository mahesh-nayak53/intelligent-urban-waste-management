import { useEffect, useEffectEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ClipboardList,
  Search,
  UserRound,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import { listComplaints } from "../../services/complaintService";
import { listManagedStaff } from "../../services/staffManagementService";
import { listManagedTasks } from "../../services/taskManagementService";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const [results, setResults] = useState({
    complaints: [],
    tasks: [],
    staff: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = async () => {
    setLoading(true);
    setError("");

    try {
      const [complaints, tasks, staff] = await Promise.all([
        listComplaints(),
        listManagedTasks({
          search: query,
          page: 0,
          size: 10,
        }),
        listManagedStaff({
          search: query,
          page: 0,
          size: 10,
        }),
      ]);

      const normalizedQuery = query.toLowerCase();

      setResults({
        complaints: complaints.filter(
          (complaint) =>
            !normalizedQuery ||
            `${complaint.id} ${complaint.title} ${complaint.description} ${complaint.zone}`
              .toLowerCase()
              .includes(normalizedQuery),
        ),
        tasks: tasks.content || [],
        staff: staff.content || [],
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to search operations.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadResultsEvent = useEffectEvent(loadResults);

  useEffect(() => {
    const request = setTimeout(() => loadResultsEvent(), 0);

    return () => clearTimeout(request);
  }, [query]);

  const totalResults =
    results.complaints.length + results.tasks.length + results.staff.length;

  const getStatusStyle = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized?.includes("resolved") || normalized?.includes("completed")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (normalized?.includes("progress") || normalized?.includes("assigned")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (normalized?.includes("pending") || normalized?.includes("open")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <AdminLayout>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Search size={23} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Operations / Search
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Search results
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {query
                    ? `Results for "${query}"`
                    : "Enter a search term to find complaints, tasks, or staff."}
                </p>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">Search failed</p>

                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="animate-pulse p-6">
                    <div className="h-5 w-32 rounded bg-slate-200" />
                    <div className="mt-5 space-y-3">
                      <div className="h-16 rounded-xl bg-slate-100" />
                      <div className="h-16 rounded-xl bg-slate-100" />
                      <div className="h-16 rounded-xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <>
              {/* Result Summary */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Complaints
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {results.complaints.length}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <ClipboardList size={20} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Tasks
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {results.tasks.length}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Staff
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {results.staff.length}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <UserRound size={20} />
                    </div>
                  </div>
                </div>
              </section>

              {/* No Results */}
              {!totalResults && (
                <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <Search size={25} />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900">
                    No results found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {query
                      ? `No complaints, tasks, or staff matched "${query}".`
                      : "Use the search field in the navigation bar to search operations."}
                  </p>
                </section>
              )}

              {/* Results */}
              {totalResults > 0 && (
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  {/* Complaints */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <ClipboardList size={19} />
                          </div>

                          <div>
                            <h2 className="font-semibold text-slate-900">
                              Complaints
                            </h2>

                            <p className="text-xs text-slate-500">
                              {results.complaints.length} results
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {results.complaints.length}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {results.complaints.length ? (
                        results.complaints.map((complaint) => (
                          <article
                            key={complaint.id}
                            className="p-5 transition hover:bg-slate-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-400">
                                  Complaint #{complaint.id}
                                </p>

                                <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">
                                  {complaint.title}
                                </h3>
                              </div>

                              <span
                                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                                  complaint.status,
                                )}`}
                              >
                                {complaint.status || "Unknown"}
                              </span>
                            </div>

                            {complaint.zone && (
                              <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                                <MapPin size={14} />
                                {complaint.zone}
                              </div>
                            )}

                            {complaint.description && (
                              <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
                                {complaint.description}
                              </p>
                            )}
                          </article>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-slate-400">
                            No complaints found.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Clock3 size={19} />
                          </div>

                          <div>
                            <h2 className="font-semibold text-slate-900">
                              Tasks
                            </h2>

                            <p className="text-xs text-slate-500">
                              {results.tasks.length} results
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          {results.tasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {results.tasks.length ? (
                        results.tasks.map((task) => (
                          <article
                            key={task.id}
                            className="p-5 transition hover:bg-slate-50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-400">
                                  Task #{task.id}
                                </p>

                                <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">
                                  {task.complaintReference ||
                                    "Complaint assignment"}
                                </h3>
                              </div>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <UserRound size={14} />
                                <span className="truncate">
                                  {task.assignedStaff || "Unassigned"}
                                </span>
                              </div>

                              {task.status && (
                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                                    task.status,
                                  )}`}
                                >
                                  {task.status}
                                </span>
                              )}
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-slate-400">
                            No tasks found.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Staff */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            <UserRound size={19} />
                          </div>

                          <div>
                            <h2 className="font-semibold text-slate-900">
                              Staff
                            </h2>

                            <p className="text-xs text-slate-500">
                              {results.staff.length} results
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                          {results.staff.length}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {results.staff.length ? (
                        results.staff.map((member) => (
                          <article
                            key={member.id}
                            className="p-5 transition hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                {member.name?.slice(0, 1).toUpperCase() || "S"}
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-slate-900">
                                  {member.name}
                                </h3>

                                <p className="mt-1 truncate text-xs text-slate-500">
                                  {member.department || "No department"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-xs text-slate-400">
                                Staff ID #{member.id}
                              </span>

                              {member.available !== undefined && (
                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                    member.available
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border-slate-200 bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {member.available
                                    ? "Available"
                                    : "Unavailable"}
                                </span>
                              )}
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-slate-400">
                            No staff found.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}

export default SearchPage;
