import { useState } from "react";
import {
  X,
  ClipboardList,
  UserRound,
  CalendarDays,
  Flag,
  CircleDot,
  FileText,
} from "lucide-react";

const emptyForm = {
  complaintId: "",
  staffId: "",
  dueDate: "",
  priority: "MEDIUM",
  status: "PENDING",
  notes: "",
};

function TaskModal({ task, mode, onClose, onSave, saving }) {
  const [form, setForm] = useState(() =>
    task
      ? {
          complaintId: task.complaintId || "",
          staffId: task.staffId || "",
          dueDate: task.dueDate || "",
          priority: task.priority || "MEDIUM",
          status: task.status || "PENDING",
          notes: task.notes || "",
        }
      : emptyForm,
  );

  const isReadOnly = mode === "view";

  const update = (field, value) =>
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  const handleSave = () => {
    if (!form.complaintId || !form.staffId) return;

    onSave({
      ...form,
      complaintId: Number(form.complaintId),
      staffId: Number(form.staffId),
    });
  };

  const modalTitle =
    mode === "create"
      ? "Assign task"
      : mode === "view"
        ? `Task #${task.id}`
        : `Edit task #${task.id}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ClipboardList size={21} />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Task workspace
              </span>

              <h2
                id="task-modal-title"
                className="mt-1 text-xl font-bold tracking-tight text-slate-900"
              >
                {modalTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <X size={20} />
          </button>
        </header>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Complaint */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ClipboardList size={15} className="text-slate-400" />
                Complaint reference
              </span>

              <input
                type="number"
                min="1"
                required={!isReadOnly}
                value={form.complaintId}
                onChange={(event) => update("complaintId", event.target.value)}
                disabled={isReadOnly || mode !== "create"}
                placeholder="Complaint ID"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              />
            </label>

            {/* Staff */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UserRound size={15} className="text-slate-400" />
                Assigned staff
              </span>

              <input
                type="number"
                min="1"
                required={!isReadOnly}
                value={form.staffId}
                onChange={(event) => update("staffId", event.target.value)}
                disabled={isReadOnly}
                placeholder="Staff ID"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              />
            </label>

            {/* Due date */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays size={15} className="text-slate-400" />
                Due date
              </span>

              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => update("dueDate", event.target.value)}
                disabled={isReadOnly}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              />
            </label>

            {/* Priority */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Flag size={15} className="text-slate-400" />
                Priority
              </span>

              <select
                value={form.priority}
                onChange={(event) => update("priority", event.target.value)}
                disabled={isReadOnly}
                className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </label>

            {/* Status */}
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CircleDot size={15} className="text-slate-400" />
                Status
              </span>

              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                disabled={isReadOnly}
                className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option>PENDING</option>
                <option>IN_PROGRESS</option>
                <option>COMPLETED</option>
              </select>
            </label>

            {/* Notes */}
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText size={15} className="text-slate-400" />
                Notes
              </span>

              <textarea
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                disabled={isReadOnly}
                rows="4"
                placeholder="Add operational notes"
                className="resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        {!isReadOnly && (
          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.complaintId || !form.staffId}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save task"}
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}

export default TaskModal;
