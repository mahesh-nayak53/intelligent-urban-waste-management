import api from "../api/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats", getAuthHeader());
  return response.data;
};

export const getComplaintTrend = async () => {
  const response = await api.get("/dashboard/complaint-trend", getAuthHeader());
  return response.data;
};

export const getComplaintStatus = async () => {
  const response = await api.get("/dashboard/status", getAuthHeader());
  return response.data;
};

export const getPriorityDistribution = async () => {
  const response = await api.get("/dashboard/priorities", getAuthHeader());
  return response.data;
};

export const getZoneStatistics = async () => {
  const response = await api.get("/dashboard/zones", getAuthHeader());
  return response.data;
};

export const getStaffPerformance = async () => {
  const response = await api.get("/dashboard/staff-performance", getAuthHeader());
  return response.data;
};

export const getStaffWorkload = async () => {
  const response = await api.get("/dashboard/staff-workload", getAuthHeader());
  return response.data;
};

export const getTaskStats = async () => {
  const response = await api.get("/dashboard/task-stats", getAuthHeader());
  return response.data;
};

export const getActivity = async () => {
  const response = await api.get("/dashboard/activity", getAuthHeader());
  return response.data;
};

export const getComplaintHistory = async () => {
  const response = await api.get("/dashboard/complaint-history", getAuthHeader());
  return response.data;
};