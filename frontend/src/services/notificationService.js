import api from "../api/api";

const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

export const getNotifications = async () => (await api.get("/notifications", authConfig())).data;
export const markNotificationRead = async (id) => (await api.put(`/notifications/${id}/read`, {}, authConfig())).data;
export const deleteNotification = async (id) => (await api.delete(`/notifications/${id}`, authConfig())).data;
