import { useEffect, useEffectEvent, useState } from "react";
import { AlertCircle, ClipboardList, Trash2, MapPin, Flag } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import {
  deleteComplaint,
  listComplaints,
  updateComplaintStatus,
} from "../../services/complaintService";

function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    setLoading(true);
    setError("");

    try {
      setComplaints(await listComplaints());
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load complaints.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadComplaintsEvent = useEffectEvent(loadComplaints);

  useEffect(() => {
    const request = setTimeout(() => loadComplaintsEvent(), 0);

    return () => clearTimeout(request);
  }, []);

  const changeStatus = async (complaint, status) => {
    try {
      const updated = await updateComplaintStatus(complaint.id, status);

      setComplaints((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update complaint.",
      );
    }
  };

  const removeComplaint = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    try {
      await deleteComplaint(id);

      setComplaints((current) =>
        current.filter((complaint) => complaint.id !== id),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to delete complaint.",
      );
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "border-red-200 bg-red-50 text-red-700";

      case "MEDIUM":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "LOW":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      default:
        return "border-slate-200 bg-slate-100 text-slate-600";
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "RESOLVED":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "ASSIGNED":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "PENDING":
        return "border-amber-200 bg-amber-50 text-amber-700";

      default:
        return "border-slate-200 bg-slate-100 text-slate-600";
    }
  };

  return (
    <AdminLayout>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardList size={23} strokeWidth={2} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  Operations / Complaints
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Complaints
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Review incoming reports and keep neighborhood issues moving
                  toward resolution.
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
                <p className="font-semibold">Something went wrong</p>

                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Summary */}
          {!loading && complaints.length > 0 && (
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total complaints
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {complaints.length}
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
                      Pending
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {
                        complaints.filter(
                          (complaint) =>
                            complaint.status?.toUpperCase() === "PENDING",
                        ).length
                      }
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <AlertCircle size={20} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Resolved
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {
                        complaints.filter(
                          (complaint) =>
                            complaint.status?.toUpperCase() === "RESOLVED",
                        ).length
                      }
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ClipboardList size={20} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Loading */}
          {loading ? (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="animate-pulse p-6">
                <div className="h-5 w-40 rounded bg-slate-200" />

                <div className="mt-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="h-16 rounded-xl bg-slate-100" />
                  ))}
                </div>
              </div>
            </section>
          ) : !complaints.length ? (
            /* Empty State */
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <ClipboardList size={26} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                No complaints found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no complaints available to review.
              </p>
            </section>
          ) : (
            /* Complaints Table */
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Table Header */}
              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Complaint records
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage complaint status and remove invalid records.
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {complaints.length} records
                  </span>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="min-w-[850px] w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Complaint
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Zone
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Priority
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="transition hover:bg-slate-50"
                      >
                        {/* Complaint */}
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <ClipboardList size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-400">
                                Complaint #{complaint.id}
                              </p>

                              <p className="mt-1 max-w-xs truncate text-sm font-semibold text-slate-900">
                                {complaint.title}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Zone */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            <span>{complaint.zone || "-"}</span>
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                              complaint.priority,
                            )}`}
                          >
                            <Flag size={13} />

                            {complaint.priority || "-"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <select
                            value={complaint.status || "PENDING"}
                            onChange={(event) =>
                              changeStatus(complaint, event.target.value)
                            }
                            className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold outline-none transition focus:ring-4 focus:ring-emerald-500/10 ${getStatusStyle(
                              complaint.status,
                            )}`}
                          >
                            <option value="PENDING">PENDING</option>

                            <option value="ASSIGNED">ASSIGNED</option>

                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => removeComplaint(complaint.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-500/10"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile hint */}
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-400 sm:hidden">
                Swipe horizontally to view all complaint details.
              </div>
            </section>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}

export default ComplaintsPage;
