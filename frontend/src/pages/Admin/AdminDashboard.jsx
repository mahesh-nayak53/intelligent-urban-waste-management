import AdminLayout from "../../layouts/AdminLayout";

import KPICards from "../../components/admin/KPICards/KPICards";

import ComplaintStatusChart from "../../components/admin/Charts/ComplaintStatusChart";
import PriorityDistributionChart from "../../components/admin/Charts/PriorityDistributionChart";

import StaffPerformanceTable from "../../components/admin/Tables/StaffPerformanceTable";
import StaffWorkloadTable from "../../components/admin/Tables/StaffWorkloadTable";

import ActivityFeed from "../../components/admin/Activity/ActivityFeed";
import NotificationsPanel from "../../components/admin/Activity/NotificationsPanel";

import { Activity, BarChart3, Bell, ClipboardList, Users } from "lucide-react";

function AdminDashboard() {
  return (
    <AdminLayout>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1600px] space-y-8">
          {/* Dashboard Header */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-6 py-7 sm:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <BarChart3 size={24} strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                      City Operations
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      Operations Dashboard
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Real-time waste management system overview
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-500 lg:self-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Last updated: Just now
                </div>
              </div>
            </div>
          </section>

          {/* KPI Section */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ClipboardList size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Key Metrics
                </h2>

                <p className="text-sm text-slate-500">
                  Current operational summary
                </p>
              </div>
            </div>

            <KPICards />
          </section>

          {/* Analytics Section */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <BarChart3 size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Analytics
                </h2>

                <p className="text-sm text-slate-500">
                  Complaint status and priority distribution
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {/* Complaint Status */}
              <div>
                <ComplaintStatusChart />
              </div>

              {/* Priority Distribution */}
              <div>
                <PriorityDistributionChart />
              </div>
            </div>
          </section>

          {/* Staff Management */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Users size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Staff Management
                </h2>

                <p className="text-sm text-slate-500">
                  Track staff performance, workload and availability
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <StaffPerformanceTable />
              <StaffWorkloadTable />
            </div>
          </section>

          {/* Activity & Notifications */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <Activity size={18} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Activity & Notifications
                </h2>

                <p className="text-sm text-slate-500">
                  Recent system activity and operational updates
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ActivityFeed />
              <NotificationsPanel />
            </div>
          </section>

          {/* Dashboard Footer */}
          <section className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Bell size={16} />
              <span>Operational monitoring is active</span>
            </div>

            <span className="hidden text-xs text-slate-400 sm:block">
              CleanCity Administration
            </span>
          </section>
        </div>
      </main>
    </AdminLayout>
  );
}

export default AdminDashboard;
