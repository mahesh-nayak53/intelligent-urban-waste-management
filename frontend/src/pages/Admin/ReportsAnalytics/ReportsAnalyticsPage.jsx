import { useEffect, useEffectEvent, useState } from "react";
import { BarChart3, RefreshCw, AlertCircle } from "lucide-react";

import AdminLayout from "../../../layouts/AdminLayout";
import AnalyticsCards from "../../../components/admin/Reports/AnalyticsCards";
import ChartsSection from "../../../components/admin/Reports/ChartsSection";
import ReportsTable from "../../../components/admin/Reports/ReportsTable";
import ExportTools from "../../../components/admin/Reports/ExportTools";

import { getReportsAnalyticsData } from "../../../services/reportsAnalyticsService";

const reportTabs = [
  { key: "complaints", label: "Complaints" },
  { key: "staff", label: "Staff" },
  { key: "tasks", label: "Tasks" },
  { key: "zones", label: "Zones" },
];

function ReportsAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReport, setActiveReport] = useState("complaints");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      setData(await getReportsAnalyticsData());
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load analytics.",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDataEvent = useEffectEvent(loadData);

  useEffect(() => {
    const request = setTimeout(() => {
      loadDataEvent();
    }, 0);

    return () => clearTimeout(request);
  }, []);

  return (
    <AdminLayout>
      <main className="mx-auto w-full max-w-[1600px]">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Executive intelligence
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Reports & analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                See the operational picture clearly, from citywide trends to
                team output.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />

              {loading ? "Refreshing" : "Refresh data"}
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">Unable to load analytics</p>

                <p className="mt-1 text-red-600">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="w-fit rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Analytics Summary */}
        <section className="mb-8">
          <AnalyticsCards data={data} loading={loading} />
        </section>

        {/* Loading */}
        {loading ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BarChart3 size={30} />
            </div>

            <strong className="mt-5 text-lg font-bold text-slate-900">
              Preparing your analytics workspace...
            </strong>

            <span className="mt-2 text-sm text-slate-500">
              Gathering operational datasets
            </span>

            <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
            </div>
          </section>
        ) : data ? (
          <>
            {/* Charts */}
            <section className="mb-8">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Visual intelligence
                  </span>
                </div>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Operational analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor complaint trends, priorities, status, and zone
                  performance.
                </p>
              </div>

              <ChartsSection data={data} />
            </section>

            {/* Reports */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Reports Header */}
              <div className="border-b border-slate-200 p-5 sm:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Decision support
                    </span>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Operational reports
                    </h2>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                      Review detailed operational datasets and export the
                      currently selected report.
                    </p>
                  </div>

                  <div className="shrink-0">
                    <ExportTools activeReport={activeReport} data={data} />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200 px-5 sm:px-6">
                <div
                  className="flex gap-1 overflow-x-auto"
                  role="tablist"
                  aria-label="Report categories"
                >
                  {reportTabs.map((tab) => {
                    const isActive = activeReport === tab.key;

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveReport(tab.key)}
                        className={`relative whitespace-nowrap px-4 py-4 text-sm font-semibold transition ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {tab.label}

                        {isActive && (
                          <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Report Table */}
              <div className="p-0">
                <ReportsTable activeReport={activeReport} data={data} />
              </div>
            </section>
          </>
        ) : (
          /* Empty State */
          <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <BarChart3 size={30} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No analytics data available
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              There is currently no operational data available to display. Try
              refreshing the analytics workspace.
            </p>

            <button
              type="button"
              onClick={loadData}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw size={17} />
              Load analytics
            </button>
          </section>
        )}
      </main>
    </AdminLayout>
  );
}

export default ReportsAnalyticsPage;
