import {
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import StaffPerformanceWidget from "./StaffPerformanceWidget";

function StaffProfile({ profile }) {
  const staff = profile.staff;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-teal-700 to-teal-500" />

        <div className="-mt-10 flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-teal-50 text-2xl font-bold text-teal-700 shadow-sm">
            {staff.name?.slice(0, 1).toUpperCase()}
          </div>

          {/* Staff information */}
          <div className="min-w-0 flex-1 sm:pb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Staff profile
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {staff.name}
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  staff.available
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {staff.available ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {staff.department || "Operations"}
            </p>
          </div>
        </div>
      </header>

      {/* Contact & Assignment Details */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Email */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Mail size={17} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 truncate text-sm font-medium text-slate-800">
              {staff.email}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Phone size={17} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Phone
            </p>

            <p className="mt-1 truncate text-sm font-medium text-slate-800">
              {staff.phone || "Not provided"}
            </p>
          </div>
        </div>

        {/* Zone */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <MapPin size={17} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Zone
            </p>

            <p className="mt-1 truncate text-sm font-medium text-slate-800">
              {staff.zone || "All zones"}
            </p>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <UserRound size={17} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Availability
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
              {staff.available
                ? "Available for assignment"
                : "Currently inactive"}
            </p>
          </div>
        </div>
      </section>

      {/* Performance */}
      <StaffPerformanceWidget
        performance={profile.performance}
      />

      {/* Assigned Work */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Assigned Complaints */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              Work queue
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">
                Assigned complaints
              </h3>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {profile.assignedComplaints?.length ?? 0}
              </span>
            </div>
          </div>

          {profile.assignedComplaints?.length ? (
            <ul className="divide-y divide-slate-100">
              {profile.assignedComplaints.map((complaint) => (
                <li
                  key={complaint.id}
                  className="px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <strong className="text-sm font-semibold text-slate-800">
                      #{complaint.id} {complaint.title}
                    </strong>

                    <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {complaint.priority || "Normal"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Status: {complaint.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-12 text-center text-sm font-medium text-slate-500">
              No assigned complaints.
            </p>
          )}
        </div>

        {/* Assigned Tasks */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Task queue
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900">
                Assigned tasks
              </h3>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {profile.assignedTasks?.length ?? 0}
              </span>
            </div>
          </div>

          {profile.assignedTasks?.length ? (
            <ul className="divide-y divide-slate-100">
              {profile.assignedTasks.map((task) => (
                <li
                  key={task.id}
                  className="px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <strong className="text-sm font-semibold text-slate-800">
                      Task #{task.id}
                    </strong>

                    <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {task.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Complaint #{task.complaintId}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-12 text-center text-sm font-medium text-slate-500">
              No assigned tasks.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default StaffProfile;

