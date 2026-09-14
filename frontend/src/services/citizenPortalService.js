import api from "../api/api";

const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getCitizenDashboard = async () => (await api.get("/citizen-portal/dashboard", authConfig())).data;
export const getCitizenComplaint = async (complaintId) => (await api.get(`/citizen-portal/complaints/${complaintId}`, authConfig())).data;
export const createComplaint = async (payload) => (await api.post("/complaints", payload, authConfig())).data;
export const uploadComplaintImage = async (file) => { const formData = new FormData(); formData.append("file", file); return (await api.post("/files/upload", formData, { ...authConfig(), headers: { ...authConfig().headers, "Content-Type": "multipart/form-data" } })).data; };
export const getCitizenProfile = async () => (await api.get("/citizen-portal/profile", authConfig())).data;
export const updateCitizenProfile = async (payload) => (await api.put("/citizen-portal/profile", payload, authConfig())).data;
