import api from "../api/api";

const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const get = async (path) => (await api.get(path, authConfig())).data;

export const getReportsAnalyticsData = async () => {
  const [stats, complaintTrend, complaintStatus, priorities, zones, staffPerformance, staffWorkload, taskStats, complaintHistory] = await Promise.all([
    get("/dashboard/stats"),
    get("/dashboard/complaint-trend"),
    get("/dashboard/status"),
    get("/dashboard/priorities"),
    get("/dashboard/zones"),
    get("/dashboard/staff-performance"),
    get("/dashboard/staff-workload"),
    get("/dashboard/task-stats"),
    get("/dashboard/complaint-history"),
  ]);

  return { stats, complaintTrend: complaintTrend || [], complaintStatus: complaintStatus || [], priorities: priorities || [], zones: zones || [], staffPerformance: staffPerformance || [], staffWorkload: staffWorkload || [], taskStats: taskStats || {}, complaintHistory: complaintHistory || {} };
};
