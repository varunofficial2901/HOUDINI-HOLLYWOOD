import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cis_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("cis_token");
      localStorage.removeItem("cis_refresh_token");
      localStorage.removeItem("cis_user");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  
  // Google — sends credential (ID token) matching your backend
  googleLogin: (credential) => api.post("/auth/google", { token: credential }),
  
  // Register — matches your UserRegister schema exactly
  register: (data) => api.post("/auth/register", {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
    phone: data.phone || null,
    gender: data.gender || null,
  }),

  me: () => api.get("/auth/me"),
  refresh: (refresh_token) => api.post("/auth/refresh", { refresh_token }),
};

export const enrollApi = {
  submit: (data) =>
    api.post("/enrollments", {
      first_name:   data.firstName,
      last_name:    data.lastName,
      email:        data.email,
      country_code: "+91",
      phone:        data.phone,
      gender:       data.gender || null,
      plan:         data.courseId,
      billing:      "monthly",
    }),
};

export const contactApi = {
  submit: (data) => api.post("/messages", {
    email:   data.email,
    message: data.message,
  }),
};

export const coursesApi = {
  list: () => api.get("/courses"),
};

export const pricingApi = {
  list: () => api.get("/pricing"),
};

export const enrollmentsApi = {
  submit: (data) => api.post("/enrollments", data),
};

export const messagesApi = {
  submit: (data) => api.post("/messages", data),
};




export default api;