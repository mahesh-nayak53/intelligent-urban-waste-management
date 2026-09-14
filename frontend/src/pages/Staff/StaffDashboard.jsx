import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  LogOut,
  MapPin,
  RefreshCw,
  Recycle,
  Users,
  X,
  Clock3,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  assignDispatchTask,
  getDispatchQueue,
  getDispatchTeam,
  getStaffComplaintDetail,
  getStaffComplaints,
  getStaffProfile,
  getStaffTasks,
  updateStaffAvailability,
  updateStaffTaskNotes,
  updateStaffTaskStatus,
} from "../../services/staffWorkflowService";

const nextStatuses = {
  PENDING: "ASSIGNED",
  ASSIGNED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

function StaffDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [dispatchQueue, setDispatchQueue] = useState([]);
  const [dispatchTeam, setDispatchTeam] = useState([]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [selectedAssignment, setSelectedAssignment] = useState({
    complaintId: "",
    staffId: "",
    type: "WORKER",
    priority: "MEDIUM",
    zone: "",
  });

  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [profileData, taskData, complaintData, queueData] =
        await Promise.all([
          getStaffProfile(),
          getStaffTasks(),
          getStaffComplaints(),
          getDispatchQueue(),
        ]);

      setProfile(profileData);
      setTasks(taskData || []);
      setComplaints(complaintData || []);
      setDispatchQueue(queueData || []);

      const zone = profileData?.staff?.zone || "";

      const teamData = zone
        ? await getDispatchTeam(zone)
        : await getDispatchTeam();

      setDispatchTeam(teamData || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load your workspace.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const request = setTimeout(() => {
      loadDashboard();
    }, 0);

    return () => clearTimeout(request);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    navigate("/login");
  };

  const updateStatus = async (task) => {
    const status = nextStatuses[task.status];

    if (!status || saving) return;

    setSaving(true);
    setError("");

    try {
      await updateStaffTaskStatus(task.id, status);
      await loadDashboard();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update task status.",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async (taskId) => {
    if (saving) return;

    setSaving(true);

    try {
      await updateStaffTaskNotes(taskId, note[taskId] || "");

      setNote((current) => ({
        ...current,
        [taskId]: "",
      }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to save the note.",
      );
    } finally {
      setSaving(false);
    }
  };

  const showComplaint = async (taskId) => {
    setError("");

    try {
      const complaint = await getStaffComplaintDetail(taskId);
      setSelectedComplaint(complaint);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load complaint details.",
      );
    }
  };

  const setAvailability = async (available) => {
    setSaving(true);

    try {
      const staff = await updateStaffAvailability(available);

      setProfile((current) => ({
        ...current,
        staff,
      }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update availability.",
      );
    } finally {
      setSaving(false);
    }
  };

  const assignTask = async (event) => {
    event.preventDefault();

    if (!selectedAssignment.complaintId || !selectedAssignment.staffId) {
      setError("Select a complaint and a field resource before assigning.");
      return;
    }

    const complaintToAssign = (dispatchQueue || []).find(
      (complaint) =>
        String(complaint.id) === String(selectedAssignment.complaintId),
    );

    setSaving(true);
    setError("");

    try {
      const assignedTask = await assignDispatchTask({
        complaintId: Number(selectedAssignment.complaintId),
        staffId: Number(selectedAssignment.staffId),
        type: selectedAssignment.type,
        priority: selectedAssignment.priority,
        zone: selectedAssignment.zone || profile?.staff?.zone || "",
      });

      if (complaintToAssign) {
        const nextComplaint = {
          ...complaintToAssign,
          priority: selectedAssignment.priority || complaintToAssign.priority,
          status: assignedTask?.status || "ASSIGNED",
          zone:
            selectedAssignment.zone ||
            complaintToAssign.zone ||
            profile?.staff?.zone ||
            "",
        };

        setComplaints((current) => [
          nextComplaint,
          ...current.filter(
            (complaint) => complaint.id !== complaintToAssign.id,
          ),
        ]);
      }

      setTasks((current) => [
        {
          id: assignedTask?.id || Date.now(),
          complaintId: Number(selectedAssignment.complaintId),
          status: assignedTask?.status || "ASSIGNED",
          assignedAt: assignedTask?.assignedAt || new Date().toISOString(),
          completedAt: assignedTask?.completedAt || null,
        },
        ...current,
      ]);

      setSelectedAssignment({
        complaintId: "",
        staffId: "",
        type: "WORKER",
        priority: "MEDIUM",
        zone: profile?.staff?.zone || "",
      });

      await loadDashboard();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to assign the task.",
      );
    } finally {
      setSaving(false);
    }
  };

  const activeTasks = tasks.filter((task) => task.status !== "COMPLETED");

  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  const highPriority = complaints.filter(
    (complaint) => complaint.priority?.toUpperCase() === "HIGH",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "PENDING").length;

  const inProgressTasks = tasks.filter((task) =>
    ["ASSIGNED", "IN_PROGRESS"].includes(task.status),
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "RESOLVED",
  ).length;

  const completionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const staff = profile?.staff || {};

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "ASSIGNED":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";

      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "LOW":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Recycle size={22} />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                CleanCity
              </p>

              <p className="text-sm text-slate-500">Staff operations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </header>

        {/* Page Heading */}
        <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              Staff supervisor workspace
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Good work starts with a clear queue.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Coordinate assigned complaints, keep field work moving, and close
              the loop with residents.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
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

        {/* KPI Cards */}
        <section
          aria-label="Work summary"
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Assigned complaints
                </p>

                <strong className="mt-3 block text-3xl font-bold text-slate-900">
                  {loading ? "--" : complaints.length}
                </strong>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ClipboardList size={21} />
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute left-0 top-0 h-1 w-full bg-amber-500" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active tasks
                </p>

                <strong className="mt-3 block text-3xl font-bold text-slate-900">
                  {loading ? "--" : activeTasks.length}
                </strong>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={21} />
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute left-0 top-0 h-1 w-full bg-emerald-600" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Completed tasks
                </p>

                <strong className="mt-3 block text-3xl font-bold text-slate-900">
                  {loading ? "--" : completedTasks.length}
                </strong>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute left-0 top-0 h-1 w-full bg-red-500" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  High priority
                </p>

                <strong className="mt-3 block text-3xl font-bold text-slate-900">
                  {loading ? "--" : highPriority}
                </strong>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={21} />
              </div>
            </div>
          </article>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Operational Queue */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  My operational queue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Move work through the verified field workflow.
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardList size={20} />
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-xl border border-slate-200 p-5"
                    >
                      <div className="h-4 w-40 rounded bg-slate-200" />
                      <div className="mt-3 h-3 w-64 rounded bg-slate-100" />
                      <div className="mt-5 h-10 rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                  <ClipboardList size={30} className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No tasks are assigned to you yet.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    New assignments will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              <ClipboardList size={17} />
                            </span>

                            <div>
                              <h3 className="font-bold text-slate-900">
                                Task #{task.id}
                              </h3>

                              <p className="mt-0.5 text-xs text-slate-500">
                                Complaint #{task.complaintId}
                                {" · "}
                                Assigned{" "}
                                {task.assignedAt
                                  ? new Date(
                                      task.assignedAt,
                                    ).toLocaleDateString()
                                  : "recently"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                            task.status,
                          )}`}
                        >
                          {task.status?.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => showComplaint(task.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          View complaint
                          <ArrowRight size={15} />
                        </button>

                        {nextStatuses[task.status] && (
                          <button
                            type="button"
                            onClick={() => updateStatus(task)}
                            disabled={saving}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              nextStatuses[task.status] === "COMPLETED"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-slate-900 hover:bg-slate-800"
                            }`}
                          >
                            {nextStatuses[task.status] === "COMPLETED" ? (
                              <>
                                <CheckCircle2 size={15} />
                                Mark completed
                              </>
                            ) : (
                              <>
                                Move to{" "}
                                {nextStatuses[task.status].replace("_", " ")}
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={note[task.id] || ""}
                          onChange={(event) =>
                            setNote((current) => ({
                              ...current,
                              [task.id]: event.target.value,
                            }))
                          }
                          placeholder="Add an operational note"
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                        />

                        <button
                          type="button"
                          onClick={() => saveNote(task.id)}
                          disabled={saving}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                        >
                          <Save size={15} />
                          Save note
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Profile */}
          <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Supervisor profile
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep your availability accurate.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Users size={20} />
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">Name</span>

                  <strong className="text-right text-sm text-slate-900">
                    {staff.name || "Staff supervisor"}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">Zone</span>

                  <strong className="text-right text-sm text-slate-900">
                    {staff.zone || "All assigned zones"}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span className="text-sm text-slate-500">Department</span>

                  <strong className="text-right text-sm text-slate-900">
                    {staff.department || "Operations"}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Availability</span>

                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={staff.available !== false}
                      disabled={saving}
                      onChange={(event) =>
                        setAvailability(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span
                      className={`text-sm font-semibold ${
                        staff.available === false
                          ? "text-slate-500"
                          : "text-emerald-600"
                      }`}
                    >
                      {staff.available === false ? "Unavailable" : "Available"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Team workload
                  </p>

                  <strong className="mt-2 block text-2xl font-bold text-slate-900">
                    {activeTasks.length}
                  </strong>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Completion rate
                  </p>

                  <strong className="mt-2 block text-2xl font-bold text-slate-900">
                    {completionRate}%
                  </strong>
                </div>
              </div>
            </div>
          </aside>

          {/* Assigned Complaints */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Assigned complaints
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Location and priority context for your queue.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={20} />
                </div>
              </div>
            </div>

            <div className="p-5">
              {complaints.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                  <MapPin size={30} className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No assigned complaints.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Assigned complaint details will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map((complaint) => (
                    <article
                      key={complaint.id}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            #{complaint.id} {complaint.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {complaint.status}
                            {" · "}
                            Reported{" "}
                            {complaint.createdAt
                              ? new Date(
                                  complaint.createdAt,
                                ).toLocaleDateString()
                              : "recently"}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${getPriorityStyle(
                            complaint.priority,
                          )}`}
                        >
                          {complaint.priority || "Normal"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Operational Reports */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Operational reports
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Live metrics for your assigned work.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Pending work</p>

                <strong className="mt-2 block text-2xl font-bold text-slate-900">
                  {pendingTasks}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">In progress</p>

                <strong className="mt-2 block text-2xl font-bold text-slate-900">
                  {inProgressTasks}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Resolved complaints</p>

                <strong className="mt-2 block text-2xl font-bold text-slate-900">
                  {resolvedComplaints}
                </strong>
              </div>

              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs text-red-600">Priority alerts</p>

                <strong className="mt-2 block text-2xl font-bold text-red-700">
                  {highPriority}
                </strong>
              </div>
            </div>
          </section>
        </div>

        {/* Dispatch Board */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                  Field operations
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Company dispatch board
                </h2>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Assign workers and drivers based on complaint type, priority,
                  and location.
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck size={21} />
              </div>
            </div>
          </div>

          <form
            onSubmit={assignTask}
            className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {/* Complaint */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Complaint
              </span>

              <select
                value={selectedAssignment.complaintId}
                onChange={(event) =>
                  setSelectedAssignment((current) => ({
                    ...current,
                    complaintId: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select complaint</option>

                {(dispatchQueue || []).map((complaint) => (
                  <option key={complaint.id} value={complaint.id}>
                    #{complaint.id} · {complaint.title} ·{" "}
                    {complaint.zone || "Unassigned zone"}
                  </option>
                ))}
              </select>
            </label>

            {/* Assignment Type */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Assignment type
              </span>

              <select
                value={selectedAssignment.type}
                onChange={(event) =>
                  setSelectedAssignment((current) => ({
                    ...current,
                    type: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="WORKER">Worker</option>

                <option value="DRIVER">Driver</option>

                <option value="FIELD">Field Crew</option>
              </select>
            </label>

            {/* Priority */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Priority
              </span>

              <select
                value={selectedAssignment.priority}
                onChange={(event) =>
                  setSelectedAssignment((current) => ({
                    ...current,
                    priority: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="LOW">Low</option>

                <option value="MEDIUM">Medium</option>

                <option value="HIGH">High</option>
              </select>
            </label>

            {/* Zone */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Zone
              </span>

              <input
                value={selectedAssignment.zone || profile?.staff?.zone || ""}
                onChange={(event) =>
                  setSelectedAssignment((current) => ({
                    ...current,
                    zone: event.target.value,
                  }))
                }
                placeholder="Zone A"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {/* Team Member */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Available team member
              </span>

              <select
                value={selectedAssignment.staffId}
                onChange={(event) =>
                  setSelectedAssignment((current) => ({
                    ...current,
                    staffId: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Choose team member</option>

                {(dispatchTeam || []).map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} · {member.department || "Operations"} ·{" "}
                    {member.zone || "All zones"} · {member.assignedTasks} active
                    tasks
                  </option>
                ))}
              </select>

              {dispatchTeam.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No available team members are currently listed for this zone.
                </p>
              )}
            </label>

            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserCheck size={17} />

                {saving ? "Assigning..." : "Assign to team"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Complaint Modal */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedComplaint(null);
            }
          }}
        >
          <section
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="staff-complaint-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                  Complaint #{selectedComplaint.id}
                </p>

                <h2
                  id="staff-complaint-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selectedComplaint.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                aria-label="Close complaint details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Description
                </p>

                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {selectedComplaint.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Location
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedComplaint.zone || "Zone not specified"}

                    {selectedComplaint.latitude != null &&
                      ` · ${selectedComplaint.latitude}, ${selectedComplaint.longitude}`}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Priority / Status
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {selectedComplaint.priority || "Normal"} ·{" "}
                    {selectedComplaint.status}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default StaffDashboard;
