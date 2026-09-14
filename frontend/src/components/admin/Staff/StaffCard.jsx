import { Eye, Pencil, Power } from "lucide-react";

function StaffCard({ member, onView, onEdit, onToggle }) {
  const initial = member.name?.slice(0, 1).toUpperCase() || "?";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Header */}
      <header className="flex items-start gap-4 border-b border-slate-100 p-5">
        {/* Avatar */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-lg font-bold text-teal-700">
          {initial}
        </span>

        {/* Staff information */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-slate-900">
            {member.name}
          </h3>

          <p className="mt-0.5 text-sm text-slate-500">
            {member.department || "Operations"}
          </p>
        </div>

        {/* Availability */}
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            member.available
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {member.available ? "Active" : "Inactive"}
        </span>
      </header>

      {/* Statistics */}
      <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        <div className="p-4">
          <dt className="text-xs font-medium text-slate-400">
            Zone
          </dt>

          <dd className="mt-1 truncate text-sm font-semibold text-slate-800">
            {member.zone || "All zones"}
          </dd>
        </div>

        <div className="p-4">
          <dt className="text-xs font-medium text-slate-400">
            Active tasks
          </dt>

          <dd className="mt-1 text-sm font-semibold text-slate-800">
            {member.assignedTasks ?? 0}
          </dd>
        </div>

        <div className="p-4">
          <dt className="text-xs font-medium text-slate-400">
            Resolved
          </dt>

          <dd className="mt-1 text-sm font-semibold text-slate-800">
            {member.resolvedComplaints ?? 0}
          </dd>
        </div>
      </dl>

      {/* Actions */}
      <footer className="flex flex-wrap gap-2 p-4">
        <button
          type="button"
          onClick={() => onView(member)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
        >
          <Eye size={15} strokeWidth={2} />
          Profile
        </button>

        <button
          type="button"
          onClick={() => onEdit(member)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Pencil size={15} strokeWidth={2} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onToggle(member)}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${
            member.available
              ? "border-red-200 bg-white text-red-600 hover:bg-red-50 focus:ring-red-200"
              : "border-green-200 bg-white text-green-600 hover:bg-green-50 focus:ring-green-200"
          }`}
        >
          <Power size={15} strokeWidth={2} />

          {member.available ? "Deactivate" : "Activate"}
        </button>
      </footer>
    </article>
  );
}

export default StaffCard;

