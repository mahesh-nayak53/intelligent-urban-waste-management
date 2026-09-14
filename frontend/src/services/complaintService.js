import api from "../api/api";

const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const listComplaints = async () => (await api.get("/complaints", authConfig())).data;
export const updateComplaintStatus = async (id, status) => (await api.put(`/complaints/${id}/status`, null, { ...authConfig(), params: { status } })).data;
export const deleteComplaint = async (id) => (await api.delete(`/complaints/${id}`, authConfig())).data;
