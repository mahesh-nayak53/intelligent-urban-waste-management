import { useEffect, useEffectEvent, useState } from "react";
import {
  ClipboardList,
  Clock3,
  Plus,
  RefreshCw,
  CircleCheck,
  Timer,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../../../layouts/AdminLayout";
import TaskTable from "../../../components/admin/Tasks/TaskTable";
import TaskCard from "../../../components/admin/Tasks/TaskCard";
import TaskModal from "../../../components/admin/Tasks/TaskModal";

import {
  completeManagedTask,
  createManagedTask,
  getTaskManagementStats,
  listManagedTasks,
  updateManagedTask,
} from "../../../services/taskManagementService";

const initialFilters = {
  page: 0,
  size: 10,
  sortBy: "assignedAt",
  sortDirection: "desc",
};

function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(initialFilters);

  const [modal, setModal] = useState({
    open: false,
    mode: "view",
    task: null,
  });

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [taskPage, taskStats] = await Promise.all([
        listManagedTasks(filters),
        getTaskManagementStats(),
      ]);

      setTasks(taskPage.content || []);

      setPagination({
        page: taskPage.page || 0,
        totalPages: taskPage.totalPages || 0,
        totalElements: taskPage.totalElements || 0,
      });

      setStats(taskStats);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDataEvent = useEffectEvent(loadData);

  useEffect(() => {
    const request = setTimeout(() => {
      loadDataEvent();
    }, 0);

    return () => clearTimeout(request);
  }, [filters]);

  const updatePage = (page) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  const saveTask = async (payload) => {
    setSaving(true);
    setError("");

    try {
      if (modal.mode === "create") {
        await createManagedTask(payload);
      } else if (
        payload.status === "COMPLETED" &&
        modal.task.status !== "COMPLETED"
      ) {
        await completeManagedTask(modal.task.id);
      } else {
        await updateManagedTask(modal.task.id, payload);
      }

      setModal({
        open: false,
        mode: "view",
        task: null,
      });

      await loadData();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to save task."
      );
    } finally {
      setSaving(false);
    }
  };

  const completeTask = async (task) => {
    if (saving || task.status === "COMPLETED") return;

    setSaving(true);
    setError("");

    try {
      await completeManagedTask(task.id);
      await loadData();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to complete task."
      );
    } finally {
      setSaving(false);
    }
  };

  const openModal = (mode, task = null) => {
    setModal({
      open: true,
      mode,
      task,
    });
  };

  const summaryCards = [
    {
      label: "Total tasks",
      value: stats.totalTasks,
      icon: ClipboardList,
      iconStyle: "bg-blue-50 text-blue-600",
      accent: "bg-blue-600",
    },
    {
      label: "Pending",
      value: stats.pendingTasks,
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-600",
      accent: "bg-amber-500",
    },
    {
      label: "In progress",
      value: stats.inProgressTasks,
      icon: Timer,
      iconStyle: "bg-teal-50 text-teal-600",
      accent: "bg-teal-600",
    },
    {
      label: "Completed",
      value: stats.completedTasks,
      icon: CircleCheck,
      iconStyle: "bg-green-50 text-green-600",
      accent: "bg-green-600",
    },
  ];

  return (
    <AdminLayout>
      <main className="mx-auto w-full max-w-[1600px]">

        {/* Page Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Operations
                </span>

                <span className="text-sm text-slate-400">/</span>

                <span className="text-sm font-medium text-slate-500">
                  Tasks
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Task management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Coordinate assignments, priorities, and completion across city
                operations.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => openModal("create")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
              >
                <Plus size={18} />
                Assign task
              </button>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <section
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Task summary"
        >
          {summaryCards.map(
            ({ label, value, icon: Icon, iconStyle, accent }) => (
              <article
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`absolute left-0 top-0 h-1 w-full ${accent}`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {label}
                    </p>

                    <div className="mt-3">
                      {loading ? (
                        <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
                      ) : (
                        <p className="text-3xl font-bold tracking-tight text-slate-900">
                          {value ?? 0}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-200 group-hover:scale-105 ${iconStyle}`}
                  >
                    <Icon size={21} strokeWidth={2} />
                  </div>
                </div>

                <div className="mt-5 h-1 w-10 rounded-full bg-slate-100 transition-all duration-300 group-hover:w-16" />
              </article>
            )
          )}
        </section>

        {/* Task List */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Section Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <ClipboardList size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All tasks
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  {pagination.totalElements}{" "}
                  {pagination.totalElements === 1
                    ? "record"
                    : "records"}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
              Showing task assignments
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mx-5 mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:mx-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-semibold">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-red-600">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={loadData}
                className="inline-flex w-fit items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="p-6">
              <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                <div className="h-12 animate-pulse bg-slate-100" />

                <div className="divide-y divide-slate-100">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-5 p-5"
                    >
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 md:hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-40 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                <RefreshCw size={16} className="animate-spin" />
                Loading task records...
              </div>
            </div>
          ) : tasks.length === 0 ? (
            /* Empty */
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ClipboardList size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No tasks found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no task assignments to display.
              </p>

              <button
                type="button"
                onClick={() => openModal("create")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={17} />
                Assign task
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <TaskTable
                  tasks={tasks}
                  onView={(task) =>
                    openModal("view", task)
                  }
                  onEdit={(task) =>
                    openModal("edit", task)
                  }
                  onComplete={completeTask}
                />
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4 p-4 md:hidden">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onView={(item) =>
                      openModal("view", item)
                    }
                    onEdit={(item) =>
                      openModal("edit", item)
                    }
                    onComplete={completeTask}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.page + 1}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updatePage(pagination.page - 1)
                  }
                  disabled={pagination.page === 0}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updatePage(pagination.page + 1)
                  }
                  disabled={
                    pagination.page + 1 >=
                    pagination.totalPages
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Task Modal */}
      {modal.open && (
        <TaskModal
          task={modal.task}
          mode={modal.mode}
          onClose={() =>
            setModal({
              open: false,
              mode: "view",
              task: null,
            })
          }
          onSave={saveTask}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}

export default TaskManagementPage;

