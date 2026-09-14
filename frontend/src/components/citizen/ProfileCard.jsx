import { Mail, Pencil, Phone, UserRound } from "lucide-react";

function ProfileCard({
  profile,
  editing,
  form,
  onChange,
  onEdit,
  onCancel,
  onSave,
  saving,
}) {
  if (!profile) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm mt-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Your account
          </span>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Profile
          </h2>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Pencil size={15} />
            Edit
          </button>
        )}
      </div>

      {/* Editing Form */}
      {editing ? (
        <form onSubmit={onSave} className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Name */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Name
              </span>

              <input
                required
                value={form.name}
                onChange={(event) => onChange("name", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>

            {/* Email */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </span>

              <input
                required
                type="email"
                value={form.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
              />
            </label>

            {/* Phone */}
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </span>

              <input
                value={form.phone || ""}
                onChange={(event) => onChange("phone", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Enter your phone number"
              />
            </label>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        /* Profile Details */
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {/* Name */}
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRound size={18} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <small className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                Name
              </small>

              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {profile.name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Mail size={18} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <small className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </small>

              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Phone size={18} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <small className="block text-xs font-medium uppercase tracking-wide text-slate-400">
                Phone
              </small>

              <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                {profile.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProfileCard;
