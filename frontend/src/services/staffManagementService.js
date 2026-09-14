import api from "../api/api";

const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const listManagedStaff = async (params) => (await api.get("/staff-management/staff", { ...authConfig(), params })).data;
export const getManagedStaffProfile = async (staffId) => (await api.get(`/staff-management/staff/${staffId}`, authConfig())).data;
export const createManagedStaff = async (payload) => (await api.post("/staff-management/staff", payload, authConfig())).data;
export const updateManagedStaff = async (staffId, payload) => (await api.put(`/staff-management/staff/${staffId}`, payload, authConfig())).data;
export const updateManagedStaffAvailability = async (staffId, available) => (await api.put(`/staff-management/staff/${staffId}/availability`, { available }, authConfig())).data;
