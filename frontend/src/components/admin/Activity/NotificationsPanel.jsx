import { useEffect, useState } from "react";
import {
  deleteNotification,
  getNotifications,
  markNotificationRead,
} from "../../../services/notificationService";

function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setNotifications(await getNotifications());
      } catch (requestError) {
        setError(requestError.message || "Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  const getNotificationConfig = (type) => {
    switch (type?.toLowerCase()) {
      case "alert":
        return {
          label: "Alert",
          accent: "bg-red-500",
          iconBg: "bg-red-50",
          iconText: "text-red-600",
          badge: "bg-red-50 text-red-700 ring-red-100",
          icon: "!",
        };

      case "success":
        return {
          label: "Success",
          accent: "bg-emerald-500",
          iconBg: "bg-emerald-50",
          iconText: "text-emerald-600",
          badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
          icon: "✓",
        };

      case "warning":
        return {
          label: "Warning",
          accent: "bg-amber-500",
          iconBg: "bg-amber-50",
          iconText: "text-amber-600",
          badge: "bg-amber-50 text-amber-700 ring-amber-100",
          icon: "!",
        };

      case "info":
      default:
        return {
          label: "Information",
          accent: "bg-blue-500",
          iconBg: "bg-blue-50",
          iconText: "text-blue-600",
          badge: "bg-blue-50 text-blue-700 ring-blue-100",
          icon: "i",
        };
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const markRead = async (id) => {
    try {
      const updated = await markNotificationRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === updated.id ? updated : notification,
        ),
      );
    } catch (requestError) {
      console.error("Unable to mark notification as read:", requestError);
    }
  };

  const dismiss = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
    } catch (requestError) {
      console.error("Unable to dismiss notification:", requestError);
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                N
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Notifications
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Stay updated with recent activity
                </p>
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 ring-1 ring-inset ring-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-emerald-700">
                {unreadCount} unread
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[560px] overflow-y-auto">
        {/* Loading */}
        {loading && (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex justify-between gap-4">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-lg font-bold text-red-600 ring-1 ring-red-100">
              !
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              Unable to load notifications
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-400">
              N
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No notifications
            </h3>

            <p className="mt-1 max-w-xs text-sm text-slate-500">
              You're all caught up. New activity will appear here.
            </p>
          </div>
        )}

        {/* Notifications */}
        {!loading &&
          !error &&
          notifications.map((notification) => {
            const config = getNotificationConfig(notification.type);

            return (
              <article
                key={notification.id}
                className={`relative border-b border-slate-100 transition-colors last:border-b-0 ${
                  notification.read
                    ? "bg-white hover:bg-slate-50"
                    : "bg-slate-50/70 hover:bg-slate-50"
                }`}
              >
                {/* Unread accent */}
                {!notification.read && (
                  <div
                    className={`absolute inset-y-0 left-0 w-1 ${config.accent}`}
                  />
                )}

                <div className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    {/* Notification Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ring-1 ring-inset ${config.iconBg} ${config.iconText}`}
                    >
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Top row */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${config.badge}`}
                          >
                            {config.label}
                          </span>

                          {!notification.read && (
                            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                              New
                            </span>
                          )}
                        </div>

                        <span className="shrink-0 text-xs font-medium text-slate-400">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>

                      {/* Message */}
                      <p
                        className={`mt-3 text-sm leading-6 ${
                          notification.read
                            ? "font-medium text-slate-600"
                            : "font-semibold text-slate-900"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() => markRead(notification.id)}
                            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          >
                            Mark as read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => dismiss(notification.id)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
      </div>

      {/* Footer */}
      {!loading && !error && notifications.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
          <p className="text-center text-xs font-medium text-slate-400">
            Showing {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </section>
  );
}

export default NotificationsPanel;

