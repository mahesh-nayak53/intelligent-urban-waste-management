import { Check, Circle, MapPin, UserRound, ArrowRight } from "lucide-react";

function ComplaintTracker({ complaint, onSelect }) {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "assigned":
      case "in progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "pending":
      case "submitted":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";

      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Complaint #{complaint.id}
            </span>

            <h3 className="mt-1.5 text-lg font-bold text-slate-900">
              {complaint.title}
            </h3>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
              complaint.status,
            )}`}
          >
            {complaint.status}
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {complaint.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-5 sm:grid-cols-3 sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
            <MapPin size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Zone
            </p>

            <p className="truncate text-sm font-medium text-slate-700">
              {complaint.zone || "Zone not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
            <UserRound size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Assigned to
            </p>

            <p className="truncate text-sm font-medium text-slate-700">
              {complaint.assignedStaffName || "Awaiting assignment"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Priority
            </p>

            <span
              className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPriorityStyle(
                complaint.priority,
              )}`}
            >
              {complaint.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {complaint.timeline?.length > 0 && (
        <div className="p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-800">
              Complaint progress
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Track the current status of your complaint
            </p>
          </div>

          <div className="flex overflow-x-auto pb-2">
            <div className="flex min-w-max items-start">
              {complaint.timeline.map((step, index) => {
                const isLast = index === complaint.timeline.length - 1;

                return (
                  <div className="flex items-start" key={step.label}>
                    <div className="flex w-28 flex-col items-center text-center sm:w-32">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          step.complete
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 bg-white text-slate-400"
                        }`}
                      >
                        {step.complete ? (
                          <Check size={14} strokeWidth={2.5} />
                        ) : (
                          <Circle size={10} />
                        )}
                      </div>

                      <span
                        className={`mt-2 text-xs font-medium leading-4 ${
                          step.complete ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {!isLast && (
                      <div
                        className={`mt-4 h-0.5 w-12 sm:w-16 ${
                          step.complete ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-slate-100 bg-white p-4 sm:px-6">
        <button
          type="button"
          onClick={() => onSelect(complaint)}
          className="group/button flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          View tracking details
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover/button:translate-x-1"
          />
        </button>
      </div>
    </article>
  );
}

export default ComplaintTracker;
