import api from "../api/api";

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getWorkers = async () => (await api.get("/workers", authConfig())).data;
export const createWorker = async (payload) => (await api.post("/workers", payload, authConfig())).data;
export const getWorkerById = async (id) => (await api.get(`/workers/${id}`, authConfig())).data;
export const updateWorker = async (id, payload) => (await api.put(`/workers/${id}`, payload, authConfig())).data;
export const deleteWorker = async (id) => (await api.delete(`/workers/${id}`, authConfig())).data;

export const getWorkerAssignments = async () => (await api.get("/worker-assignments", authConfig())).data;
export const getWorkerAssignmentsByStaff = async (staffId) => (await api.get(`/worker-assignments/staff/${staffId}`, authConfig())).data;
export const getWorkerAssignmentsByWorker = async (workerId) => (await api.get(`/worker-assignments/worker/${workerId}`, authConfig())).data;
export const createWorkerAssignment = async (payload) => (await api.post("/worker-assignments", payload, authConfig())).data;
export const updateWorkerAssignmentStatus = async (id, payload) => (await api.put(`/worker-assignments/${id}/status`, payload, authConfig())).data;

export const getNavigationRoute = async (startLatitude, startLongitude, destinationLatitude, destinationLongitude) => (await api.get("/navigation/route", { ...authConfig(), params: { startLatitude, startLongitude, destinationLatitude, destinationLongitude } })).data;
export const getNavigationEta = async (startLatitude, startLongitude, destinationLatitude, destinationLongitude) => (await api.get("/navigation/eta", { ...authConfig(), params: { startLatitude, startLongitude, destinationLatitude, destinationLongitude } })).data;
