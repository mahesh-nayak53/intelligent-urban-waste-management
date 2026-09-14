import api from "../api/api";

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getStaffProfile = async () => (await api.get("/staff-workflow/me/profile", authConfig())).data;
export const getStaffTasks = async () => (await api.get("/staff-workflow/me/tasks", authConfig())).data;
export const getStaffComplaints = async () => (await api.get("/staff-workflow/me/complaints", authConfig())).data;
export const getStaffComplaintDetail = async (taskId) => (await api.get(`/staff-workflow/tasks/${taskId}/complaint`, authConfig())).data;
export const updateStaffTaskStatus = async (taskId, status) => (await api.put(`/staff-workflow/tasks/${taskId}/status`, { status }, authConfig())).data;
export const updateStaffTaskNotes = async (taskId, notes) => (await api.post(`/staff-workflow/tasks/${taskId}/notes`, { notes }, authConfig())).data;
export const updateStaffAvailability = async (available) => (await api.put("/staff-workflow/me/availability", { available }, authConfig())).data;
export const getDispatchQueue = async () => (await api.get("/staff-workflow/dispatch/queue", authConfig())).data;
export const getDispatchTeam = async (zone) => (await api.get("/staff-workflow/dispatch/team", { ...authConfig(), params: { zone } })).data;
export const assignDispatchTask = async (payload) => (await api.post("/staff-workflow/dispatch/assign", payload, authConfig())).data;
