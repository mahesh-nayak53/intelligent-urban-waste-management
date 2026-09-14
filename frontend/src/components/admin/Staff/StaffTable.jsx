import { Eye, Pencil, Power } from "lucide-react";

function StaffTable({ staff, onView, onEdit, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Staff member
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Department
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Zone
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active tasks
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Resolved
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Availability
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {staff.map((member) => (
              <tr
                key={member.id}
                className="group transition-colors hover:bg-slate-50"
              >
                {/* Staff member */}
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onView(member)}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
                      {member.name?.slice(0, 1).toUpperCase()}
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900 transition group-hover:text-emerald-700">
                        {member.name}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        {member.email}
                      </span>
                    </span>
                  </button>
                </td>

                {/* Department */}
                <td className="px-5 py-4 text-sm text-slate-600">
                  {member.department || "Unassigned"}
                </td>

                {/* Zone */}
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {member.zone || "All zones"}
                  </span>
                </td>

                {/* Active tasks */}
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {member.assignedTasks ?? 0}
                  </span>
                </td>

                {/* Resolved */}
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {member.resolvedComplaints ?? 0}
                  </span>
                </td>

                {/* Availability */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      member.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        member.available ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />

                    {member.available ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(member)}
                      title="View profile"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(member)}
                      title="Edit staff"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggle(member)}
                      title={
                        member.available ? "Deactivate staff" : "Activate staff"
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                        member.available
                          ? "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      <Power size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {staff.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">
            No staff members found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Staff members will appear here once they are added.
          </p>
        </div>
      )}
    </div>
  );
}

export default StaffTable;
