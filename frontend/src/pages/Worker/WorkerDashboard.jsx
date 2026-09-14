import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  Navigation,
  RefreshCw,
  Route,
  Truck,
} from "lucide-react";

import FreeRouteMap from "../../components/Map/FreeRouteMap";

import {
  getWorkerAssignmentsByWorker,
  getNavigationRoute,
  updateWorkerAssignmentStatus,
} from "../../services/workerService";

const STATUS_FLOW = [
  "ASSIGNED",
  "ACCEPTED",
  "IN_PROGRESS",
  "ARRIVED",
  "COMPLETED",
];

function WorkerDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const workerId = Number(localStorage.getItem("workerId") || 1);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWorkerAssignmentsByWorker(workerId);

      setAssignments(data || []);

      if (data?.[0]) {
        setSelectedAssignment(data[0]);
      } else {
        setSelectedAssignment(null);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load worker assignments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleStatusUpdate = async (assignmentId, status) => {
    if (!status || status === "COMPLETED") {
      if (status !== "COMPLETED") return;
    }

    try {
      setError("");

      await updateWorkerAssignmentStatus(assignmentId, { status });

      await loadAssignments();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update assignment status.",
      );
    }
  };

  const selectedRoute = useMemo(() => {
    if (!selectedAssignment) return null;

    return {
      start: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
      destination: {
        latitude: 12.9838,
        longitude: 77.5878,
      },
    };
  }, [selectedAssignment]);

  const handleNavigate = async () => {
    if (!selectedRoute) return;

    try {
      setError("");

      const route = await getNavigationRoute(
        selectedRoute.start.latitude,
        selectedRoute.start.longitude,
        selectedRoute.destination.latitude,
        selectedRoute.destination.longitude,
      );

      setSelectedAssignment((current) => ({
        ...current,
        route,
      }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to calculate route.",
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ASSIGNED":
        return "border-violet-200 bg-violet-50 text-violet-700";

      case "ACCEPTED":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "IN_PROGRESS":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "ARRIVED":
        return "border-orange-200 bg-orange-50 text-orange-700";

      case "COMPLETED":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
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
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  const activeAssignments = assignments.filter(
    (item) => item.status !== "COMPLETED",
  );

  const completedAssignments = assignments.filter(
    (item) => item.status === "COMPLETED",
  );

  const currentStatus = selectedAssignment?.status || "ASSIGNED";

  const currentStatusIndex = STATUS_FLOW.indexOf(currentStatus);

  const nextStatus =
    currentStatusIndex >= 0 && currentStatusIndex < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentStatusIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Truck size={22} />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                CleanCity
              </p>

              <p className="text-sm text-slate-500">Worker operations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadAssignments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {/* Page Heading */}
        <section className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
            Worker dashboard
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Field operations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your assignments, follow the route, and keep complaint
            progress updated from the field.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total assignments
                </p>

                <strong className="mt-3 block text-3xl font-bold text-slate-900">
                  {loading ? "--" : assignments.length}
                </strong>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Route size={21} />
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute left-0 top-0 h-1 w-full bg-amber-500" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active assignments
                </p>

                <strong className="mt-3 block text-3xl font-bold text-slate-900">
                  {loading ? "--" : activeAssignments.length}
                </strong>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={21} />
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute left-0 top-0 h-1 w-full bg-emerald-600" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>

                <strong className="mt-3 block text-3xl font-bold text-slate-900">
                  {loading ? "--" : completedAssignments.length}
                </strong>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </article>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          {/* Left */}
          <section className="space-y-6">
            {/* Assignments */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Assignments
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select an assignment to view its route and operational
                    details.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {assignments.length} total
                </span>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="animate-pulse rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex justify-between gap-4">
                          <div>
                            <div className="h-4 w-40 rounded bg-slate-200" />
                            <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
                          </div>

                          <div className="h-6 w-20 rounded-full bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                    <Route size={32} className="mx-auto text-slate-400" />

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      No assignments yet.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      New field assignments will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setSelectedAssignment(item)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selectedAssignment?.id === item.id
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                selectedAssignment?.id === item.id
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Route size={18} />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                Complaint #{item.complaintId}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Priority: {item.priority || "MEDIUM"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                              item.status,
                            )}`}
                          >
                            {item.status?.replace("_", " ")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Route */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                      Navigation
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      Live route
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Follow the route to the selected complaint location.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNavigate}
                    disabled={!selectedRoute}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Navigation size={16} />
                    Navigate
                  </button>
                </div>
              </div>

              <div className="p-5">
                {selectedRoute ? (
                  <>
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <FreeRouteMap
                        start={selectedRoute.start}
                        destination={selectedRoute.destination}
                        route={selectedAssignment?.route}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Distance
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {selectedAssignment?.route?.distanceKm ?? "--"}
                          <span className="ml-1 text-sm font-medium text-slate-500">
                            km
                          </span>
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          ETA
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {selectedAssignment?.route?.etaMinutes ?? "--"}
                          <span className="ml-1 text-sm font-medium text-slate-500">
                            min
                          </span>
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Status
                        </p>

                        <p className="mt-2 truncate text-lg font-bold text-slate-900">
                          {selectedAssignment?.status?.replace("_", " ") ||
                            "--"}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                    <MapPin size={32} className="mx-auto text-slate-400" />

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Select an assignment
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      The route will appear after selecting an assignment.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </section>

          {/* Right */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-24">
            {selectedAssignment ? (
              <>
                {/* Details Header */}
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                        Selected assignment
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        Assignment details
                      </h2>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                        selectedAssignment.status,
                      )}`}
                    >
                      {selectedAssignment.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  {/* Assignment Info */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="text-emerald-600" />

                      <p className="text-sm font-bold text-slate-900">
                        Route information
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500">
                          Complaint
                        </span>

                        <strong className="text-sm text-slate-900">
                          #{selectedAssignment.complaintId}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500">Priority</span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getPriorityStyle(
                            selectedAssignment.priority,
                          )}`}
                        >
                          {selectedAssignment.priority || "MEDIUM"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500">
                          Current status
                        </span>

                        <strong className="text-right text-sm text-slate-900">
                          {selectedAssignment.status?.replace("_", " ")}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div>
                    <p className="mb-3 text-sm font-bold text-slate-900">
                      Update assignment
                    </p>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(selectedAssignment.id, "ACCEPTED")
                        }
                        disabled={selectedAssignment.status !== "ASSIGNED"}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(
                            selectedAssignment.id,
                            "IN_PROGRESS",
                          )
                        }
                        disabled={
                          !["ACCEPTED"].includes(selectedAssignment.status)
                        }
                        className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Start
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(selectedAssignment.id, "ARRIVED")
                        }
                        disabled={selectedAssignment.status !== "IN_PROGRESS"}
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Arrive
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(selectedAssignment.id, "COMPLETED")
                        }
                        disabled={selectedAssignment.status !== "ARRIVED"}
                        className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Complete
                      </button>
                    </div>
                  </div>

                  {/* Advance */}
                  <div className="border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        if (nextStatus) {
                          handleStatusUpdate(selectedAssignment.id, nextStatus);
                        }
                      }}
                      disabled={
                        !nextStatus || selectedAssignment.status === "COMPLETED"
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <CheckCircle2 size={17} />

                      {nextStatus
                        ? `Advance to ${nextStatus.replace("_", " ")}`
                        : "Assignment completed"}
                    </button>
                  </div>

                  {/* Status Progress */}
                  <div className="border-t border-slate-100 pt-5">
                    <p className="mb-4 text-sm font-bold text-slate-900">
                      Assignment progress
                    </p>

                    <div className="space-y-3">
                      {STATUS_FLOW.map((status, index) => {
                        const isComplete = currentStatusIndex >= index;

                        const isCurrent = currentStatus === status;

                        return (
                          <div key={status} className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                isComplete
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-200 bg-slate-50 text-slate-400"
                              }`}
                            >
                              {isComplete ? (
                                <CheckCircle2 size={15} />
                              ) : (
                                <span className="text-xs font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`text-sm font-semibold ${
                                  isCurrent
                                    ? "text-emerald-700"
                                    : isComplete
                                      ? "text-slate-800"
                                      : "text-slate-400"
                                }`}
                              >
                                {status.replace("_", " ")}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-5 py-12 text-center">
                <Route size={32} className="mx-auto text-slate-400" />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No assignment selected
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Select an assignment to view its details.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default WorkerDashboard;
