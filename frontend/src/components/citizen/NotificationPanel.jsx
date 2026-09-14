import {
  Bell,
  Info,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";

function NotificationPanel({ notifications = [], onRead, onDismiss }) {
  const iconFor = (type) => {
    if (type?.includes("RESOLVED")) {
      return CheckCircle2;
    }

    if (type?.includes("ALERT")) {
      return AlertTriangle;
    }

    return Info;
  };

  const styleFor = (type) => {
    if (type?.includes("RESOLVED")) {
      return {
        wrapper: "bg-emerald-50 text-emerald-600",
        border: "border-emerald-100",
      };
    }

    if (type?.includes("ALERT")) {
      return {
        wrapper: "bg-amber-50 text-amber-600",
        border: "border-amber-100",
      };
    }

    return {
      wrapper: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    };
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            Stay informed
          </span>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Recent updates
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <Bell size={19} />
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {notifications.map((notification) => {
            const Icon = iconFor(notification.type);
            const styles = styleFor(notification.type);

            return (
              <article
                key={notification.id}
                className={`group flex gap-4 px-5 py-5 transition-colors hover:bg-slate-50 sm:px-6 ${
                  notification.read ? "opacity-70" : ""
                }`}
              >
                {/* Notification Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.wrapper}`}
                >
                  <Icon size={17} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1">
                    <p
                      className={`text-sm leading-5 ${
                        notification.read
                          ? "font-medium text-slate-600"
                          : "font-semibold text-slate-800"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <time className="text-xs text-slate-400">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString()
                        : "Recently"}
                    </time>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onRead(notification.id)}
                      disabled={notification.read}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        notification.read
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      <Check size={13} />

                      {notification.read ? "Read" : "Mark read"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDismiss(notification.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={13} />
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Unread Indicator */}
                {!notification.read && (
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${styles.wrapper
                      .replace("text-", "bg-")
                      .replace("-50", "-500")}`}
                    aria-label="Unread notification"
                  />
                )}
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Bell size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            You are all caught up
          </p>

          <p className="mt-1 text-sm text-slate-500">
            There are no new notifications at the moment.
          </p>
        </div>
      )}
    </section>
  );
}

export default NotificationPanel;
