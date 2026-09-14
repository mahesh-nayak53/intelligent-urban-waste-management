import { useState, useEffect } from "react";
import {
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";

import { getDashboardStats } from "../../../services/dashboardService";
import StatCard from "../StatCard";

function KPICards() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    staffMembers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const data = await getDashboardStats();

        setStats({
          totalComplaints: data.totalComplaints || 0,
          pendingComplaints: data.pendingComplaints || 0,
          resolvedComplaints: data.resolvedComplaints || 0,
          staffMembers: data.staffMembers || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-600">
            !
          </div>

          <div>
            <p className="text-sm font-semibold text-red-800">
              Unable to load dashboard statistics
            </p>

            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Complaints"
        value={stats.totalComplaints}
        loading={loading}
        icon={FiClipboard}
        iconWrapper="bg-blue-50 text-blue-600"
      />

      <StatCard
        title="Pending Complaints"
        value={stats.pendingComplaints}
        loading={loading}
        icon={FiClock}
        iconWrapper="bg-amber-50 text-amber-600"
      />

      <StatCard
        title="Resolved Complaints"
        value={stats.resolvedComplaints}
        loading={loading}
        icon={FiCheckCircle}
        iconWrapper="bg-emerald-50 text-emerald-600"
      />

      <StatCard
        title="Staff Members"
        value={stats.staffMembers}
        loading={loading}
        icon={FiUsers}
        iconWrapper="bg-purple-50 text-purple-600"
      />
    </div>
  );
}

export default KPICards;

