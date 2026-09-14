import axios from "axios";

const PROD_BACKEND_URL = "https://intelligent-urban-waste-management-lpks.onrender.com/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || PROD_BACKEND_URL,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;