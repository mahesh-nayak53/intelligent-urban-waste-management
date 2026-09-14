import { Info, Plus } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";

function AdminModulePlaceholder({ eyebrow, title, description, detail }) {
  return (
    <AdminLayout>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Info size={23} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  {eyebrow}
                </span>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            </div>
          </section>

          {/* Placeholder Content */}
          <section
            className="rounded-2xl border border-slate-200 bg-white px-6 py-14 shadow-sm sm:px-8"
            aria-live="polite"
          >
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Plus size={30} strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {detail}
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  This module is ready for the next data integration. Your
                  dashboard and other operations remain available.
                </p>
              </div>

              {/* Status */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Module ready
              </div>
            </div>
          </section>
        </div>
      </main>
    </AdminLayout>
  );
}

export default AdminModulePlaceholder;
