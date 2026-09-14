import {
  CheckCircle2,
  Eye,
  Pencil,
  UserRound,
  CalendarDays,
  Flag,
} from "lucide-react";

const statusLabels = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityStyles = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-slate-50 text-slate-600 border-slate-200",
};

function TaskTable({ tasks, onView, onEdit, onComplete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop / Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Task
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assigned staff
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Due date
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Priority
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const status = task.status || "PENDING";
              const priority = task.priority || "None";

              return (
                <tr
                  key={task.id}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  {/* Task */}
                  <td className="px-5 py-4">
                    <div className="flex min-w-[190px] flex-col">
                      <button
                        type="button"
                        onClick={() => onView(task)}
                        className="w-fit text-sm font-semibold text-slate-900 transition hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        Task #{task.id}
                      </button>

                      <span className="mt-1 text-xs text-slate-500">
                        {task.complaintReference || "No complaint reference"}
                      </span>
                    </div>
                  </td>

                  {/* Staff */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <UserRound size={15} />
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {task.assignedStaff || "Unassigned"}
                      </span>
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="text-sm text-slate-600">
                        {task.dueDate || "No due date"}
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        priorityStyles[priority] ||
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      <Flag size={12} />
                      {priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[status] ||
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {statusLabels[status] || status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(task)}
                        title="View task"
                        aria-label={`View task ${task.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                        aria-label={`Edit task ${task.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <Pencil size={16} />
                      </button>

                      {task.status !== "COMPLETED" && (
                        <button
                          type="button"
                          onClick={() => onComplete(task)}
                          title="Mark complete"
                          aria-label={`Mark task ${task.id} complete`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Empty state */}
            {tasks.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <ClipboardEmptyIcon />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-slate-900">
                      No tasks found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your filters or search query.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClipboardEmptyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M9 4.5V3h6v1.5" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </svg>
  );
}

export default TaskTable;

