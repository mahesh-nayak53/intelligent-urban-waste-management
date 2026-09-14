import {
  CheckCircle2,
  Eye,
  Pencil,
  CalendarDays,
  UserRound,
  Flag,
} from "lucide-react";

function TaskCard({ task, onView, onEdit, onComplete }) {
  const statusStyles = {
    ASSIGNED: "bg-blue-50 text-blue-700 border-blue-200",
    ACCEPTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
    ARRIVED: "bg-purple-50 text-purple-700 border-purple-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const priorityStyles = {
    HIGH: "bg-red-50 text-red-700 border-red-200",
    MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
    LOW: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const status = task.status || "ASSIGNED";
  const priority = task.priority || "None";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Task #{task.id}
            </p>

            <h3 className="mt-1 truncate text-base font-semibold text-slate-900">
              {task.complaintReference || "Complaint"}
            </h3>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
              statusStyles[status] ||
              "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {status.replaceAll("_", " ")}
          </span>
        </div>
      </div>

      {/* Details */}
      <dl className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UserRound size={16} />
          </div>

          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-400">
              Assigned staff
            </dt>

            <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
              {task.assignedStaff || "Unassigned"}
            </dd>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <CalendarDays size={16} />
          </div>

          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-400">Due date</dt>

            <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
              {task.dueDate || "No due date"}
            </dd>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Flag size={16} />
          </div>

          <div className="min-w-0">
            <dt className="text-xs font-medium text-slate-400">Priority</dt>

            <dd className="mt-0.5">
              <span
                className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${
                  priorityStyles[priority] ||
                  "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {priority}
              </span>
            </dd>
          </div>
        </div>
      </dl>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
        <button
          type="button"
          onClick={() => onView(task)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <Eye size={15} />
          View
        </button>

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Pencil size={15} />
          Edit
        </button>

        {task.status !== "COMPLETED" && (
          <button
            type="button"
            onClick={() => onComplete(task)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <CheckCircle2 size={15} />
            Complete
          </button>
        )}
      </div>
    </article>
  );
}

export default TaskCard;
