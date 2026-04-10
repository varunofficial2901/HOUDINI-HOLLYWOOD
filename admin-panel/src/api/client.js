import axios from "axios";

const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api`, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
};
export const dashboardApi = { stats: () => api.get("/admin/dashboard") };
export const enrollmentsApi = {
  list: (params) => api.get("/enrollments", { params }),
  update: (id, data) => api.patch(`/enrollments/${id}`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
  stats: () => api.get("/enrollments/stats/summary"),
};
export const coursesApi = {
  listAll: () => api.get("/courses/admin/all"),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.patch(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};
export const pricingApi = {
  listAll: () => api.get("/pricing/admin/all"),
  update: (id, data) => api.patch(`/pricing/${id}`, data),
};
export const messagesApi = {
  list: (params) => api.get("/messages", { params }),
  markRead: (id) => api.patch(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`),
};
export const studentsApi = {
  list: (params) => api.get("/admin/students", { params }),
  toggle: (id) => api.patch(`/admin/students/${id}/toggle`),
};

export default api;
