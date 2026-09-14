import api from "../api/api";

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getTaskManagementStats = async () => {
  const response = await api.get("/task-management/stats", authConfig());
  return response.data;
};

export const listManagedTasks = async (params) => {
  const response = await api.get("/task-management/tasks", {
    ...authConfig(),
    params,
  });
  return response.data;
};

export const getManagedTask = async (taskId) => {
  const response = await api.get(`/task-management/tasks/${taskId}`, authConfig());
  return response.data;
};

export const createManagedTask = async (payload) => {
  const response = await api.post("/task-management/tasks", payload, authConfig());
  return response.data;
};

export const updateManagedTask = async (taskId, payload) => {
  const response = await api.put(`/task-management/tasks/${taskId}`, payload, authConfig());
  return response.data;
};

export const updateManagedTaskStatus = async (taskId, status) => {
  const response = await api.put(
    `/task-management/tasks/${taskId}/status`,
    { status },
    authConfig(),
  );
  return response.data;
};

export const completeManagedTask = async (taskId) => {
  const response = await api.put(`/task-management/tasks/${taskId}/complete`, {}, authConfig());
  return response.data;
};

export const updateManagedTaskNotes = async (taskId, notes) => {
  const response = await api.post(
    `/task-management/tasks/${taskId}/notes`,
    { notes },
    authConfig(),
  );
  return response.data;
};
