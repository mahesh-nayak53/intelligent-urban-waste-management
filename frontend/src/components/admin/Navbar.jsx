import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  User,
  ChevronDown,
  SlidersHorizontal,
  LogOut,
  X,
} from "lucide-react";

import { getNotifications } from "../../services/notificationService";

function Navbar({ onMenuToggle }) {
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    window.location.href = "/login";
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/admin/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleNotifications = async () => {
    const nextOpen = !showNotifications;

    setShowNotifications(nextOpen);
    setShowProfile(false);
    setShowHelp(false);

    if (!nextOpen || notifications.length) return;

    setNotificationsLoading(true);

    try {
      setNotifications(await getNotifications());
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const toggleHelp = () => {
    setShowHelp((previous) => !previous);
    setShowProfile(false);
    setShowNotifications(false);
  };

  const toggleProfile = () => {
    setShowProfile((previous) => !previous);
    setShowHelp(false);
    setShowNotifications(false);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open navigation"
          title="Open navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <span className="text-sm font-bold">WM</span>
          </div>

          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-slate-900">
              Waste Management
            </h2>

            <p className="text-xs text-slate-500">Administration</p>
          </div>
        </button>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mx-auto hidden w-full max-w-xl md:block"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search complaints, staff, tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search tasks, complaints, or staff"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </form>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={handleNotifications}
              aria-label="Open notifications"
              title="Notifications"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                showNotifications
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Bell size={19} />

              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-[360px]">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Recent system updates
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {notifications.length} new
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationsLoading && (
                    <div className="space-y-3 p-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse rounded-xl bg-slate-50 p-3"
                        >
                          <div className="h-3 w-3/4 rounded bg-slate-200" />
                          <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!notificationsLoading && !notifications.length && (
                    <div className="px-4 py-10 text-center">
                      <Bell size={22} className="mx-auto text-slate-300" />

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        No notifications
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        You're all caught up.
                      </p>
                    </div>
                  )}

                  {!notificationsLoading &&
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                      >
                        <p className="text-sm leading-5 text-slate-700">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="relative">
            <button
              type="button"
              title="Help"
              aria-label="Open help"
              onClick={toggleHelp}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                showHelp
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <HelpCircle size={19} />
            </button>

            {showHelp && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <HelpCircle size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Help</h3>

                      <p className="text-xs text-slate-500">
                        Quick navigation guidance
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-4">
                  <p className="text-sm leading-6 text-slate-600">
                    Use the sidebar to open an operations module. Contact your
                    administrator for account or access issues.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={toggleProfile}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
              aria-label="Open profile menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                <User size={17} />
              </span>

              <span className="hidden text-left lg:block">
                <span className="block text-sm font-semibold text-slate-800">
                  Admin
                </span>

                <span className="block text-[11px] text-slate-500">
                  Administrator
                </span>
              </span>

              <ChevronDown
                size={16}
                className={`hidden text-slate-400 transition-transform lg:block ${
                  showProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <User size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">Admin</p>

                      <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/settings?section=profile")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <User size={17} className="text-slate-400" />
                    Profile Settings
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/admin/settings?section=preferences")
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <SlidersHorizontal size={17} className="text-slate-400" />
                    Preferences
                  </button>

                  <div className="my-2 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
