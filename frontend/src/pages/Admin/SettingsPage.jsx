import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bell, Check, Settings, UserRound, RefreshCw } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";

const defaultPreferences = {
  notifications: true,
  autoRefresh: true,
};

function SettingsPage() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "preferences";

  const [preferences, setPreferences] = useState(() => {
    try {
      return {
        ...defaultPreferences,
        ...JSON.parse(localStorage.getItem("cleancity.preferences") || "{}"),
      };
    } catch {
      return defaultPreferences;
    }
  });

  const [saved, setSaved] = useState(false);

  const [profileName, setProfileName] = useState(
    () => localStorage.getItem("name") || "Admin",
  );

  const updatePreference = (field) => {
    setPreferences((current) => ({
      ...current,
      [field]: !current[field],
    }));

    setSaved(false);
  };

  const savePreferences = (event) => {
    event.preventDefault();

    localStorage.setItem("cleancity.preferences", JSON.stringify(preferences));

    setSaved(true);
  };

  const saveProfile = (event) => {
    event.preventDefault();

    localStorage.setItem("name", profileName.trim() || "Admin");

    setSaved(true);
  };

  return (
    <AdminLayout>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Settings size={23} strokeWidth={2} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  System / Settings
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Settings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage workspace preferences and operational defaults for
                  CleanCity.
                </p>
              </div>
            </div>
          </section>

          {/* Settings Card */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Settings Navigation */}
            <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6">
              <div className="flex gap-2 overflow-x-auto py-3">
                <div
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                    section === "profile"
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500"
                  }`}
                >
                  <UserRound size={16} />
                  Profile
                </div>

                <div
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                    section !== "profile"
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500"
                  }`}
                >
                  <Settings size={16} />
                  Preferences
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            {section === "profile" ? (
              <form
                className="max-w-2xl space-y-6 p-6 sm:p-8"
                onSubmit={saveProfile}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <UserRound size={19} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Profile settings
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Update the name displayed across the workspace.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label
                    htmlFor="display-name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Display name
                  </label>

                  <input
                    id="display-name"
                    value={profileName}
                    onChange={(event) => {
                      setProfileName(event.target.value);
                      setSaved(false);
                    }}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Enter your display name"
                  />
                </div>

                {/* Account Information */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm leading-6 text-slate-500">
                    Your login email and role are managed by your account
                    administrator.
                  </p>
                </div>

                {/* Save */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                  >
                    <Check size={17} />
                    Save profile
                  </button>

                  {saved && (
                    <p
                      role="status"
                      className="flex items-center gap-2 text-sm font-medium text-emerald-600"
                    >
                      <Check size={16} />
                      Profile saved.
                    </p>
                  )}
                </div>
              </form>
            ) : (
              /* Preferences */
              <form
                className="max-w-2xl space-y-6 p-6 sm:p-8"
                onSubmit={savePreferences}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Settings size={19} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Preferences
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Control how the CleanCity workspace behaves.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Bell size={18} />
                    </div>

                    <div>
                      <span className="block text-sm font-semibold text-slate-800">
                        Operational notifications
                      </span>

                      <span className="mt-1 block text-sm leading-5 text-slate-500">
                        Receive notifications about operational updates and
                        activities.
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={() => updatePreference("notifications")}
                    className="h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                {/* Auto Refresh */}
                <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      <RefreshCw size={18} />
                    </div>

                    <div>
                      <span className="block text-sm font-semibold text-slate-800">
                        Automatic dashboard refresh
                      </span>

                      <span className="mt-1 block text-sm leading-5 text-slate-500">
                        Refresh dashboard data automatically when new
                        information is available.
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={preferences.autoRefresh}
                    onChange={() => updatePreference("autoRefresh")}
                    className="h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                {/* Save */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                  >
                    <Check size={17} />
                    Save preferences
                  </button>

                  {saved && (
                    <p
                      role="status"
                      className="flex items-center gap-2 text-sm font-medium text-emerald-600"
                    >
                      <Check size={16} />
                      Preferences saved.
                    </p>
                  )}
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </AdminLayout>
  );
}

export default SettingsPage;
