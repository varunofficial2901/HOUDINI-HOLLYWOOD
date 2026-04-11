import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// ── Auth token injection ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cis_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto logout on 401 ───────────────────────────────────
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

// ── Auth ─────────────────────────────────────────────────
export const authApi = {
  login:        (email, password) => api.post("/auth/login", { email, password }),
  googleLogin:  (token)           => api.post("/auth/google", { token }),
  register:     (data)            => api.post("/auth/register", {
                                       first_name:   data.firstName,
                                       last_name:    data.lastName,
                                       email:        data.email,
                                       password:     data.password,
                                       phone:        data.phone   || null,
                                       gender:       data.gender  || null,
                                     }),
  me:           ()                => api.get("/auth/me"),
  refresh:      (refresh_token)   => api.post("/auth/refresh", { refresh_token }),
};

// ── Enrollments ──────────────────────────────────────────
export const enrollApi = {
  // Standard enrollment form submission
  submit: (data) => api.post("/enrollments", {
    first_name:   data.firstName,
    last_name:    data.lastName,
    email:        data.email,
    country_code: data.countryCode || "+91",
    phone:        data.phone,
    gender:       data.gender  || null,
    plan:         data.courseId,
    billing:      data.billing || "monthly",
  }),

  // Payment screenshot upload (multipart/form-data)
  submitPayment: (formData) => api.post("/enrollments/payment-submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),

  // Check payment/enrollment status by ID
  checkStatus: (enrollmentId) => api.get(`/enrollments/payment-status/${enrollmentId}`),
};

// ── Contact ──────────────────────────────────────────────
export const contactApi = {
  submit: (data) => api.post("/messages", {
    email:   data.email,
    message: data.message,
  }),
};

// ── Courses ──────────────────────────────────────────────
export const coursesApi = {
  list: () => api.get("/courses"),
};

// ── Pricing ──────────────────────────────────────────────
export const pricingApi = {
  list: () => api.get("/pricing"),
};

// ── Admin (used by admin panel only) ─────────────────────
export const enrollmentsApi = {
  list:   (params) => api.get("/enrollments", { params }),
  update: (id, data) => api.patch(`/enrollments/${id}`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
};

export const messagesApi = {
  list:   (params) => api.get("/messages", { params }),
  submit: (data)   => api.post("/messages", data),
};

export default api;




















// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
//     ? `${import.meta.env.VITE_API_URL}/api`
//     : "http://localhost:8000/api",
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("cis_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("cis_token");
//       localStorage.removeItem("cis_refresh_token");
//       localStorage.removeItem("cis_user");
//       if (window.location.pathname !== "/") {
//         window.location.href = "/";
//       }
//     }
//     return Promise.reject(err);
//   }
// );

// export const authApi = {
//   login: (email, password) => api.post("/auth/login", { email, password }),
//   register: (data) => api.post("/auth/register", data),
//   me: () => api.get("/auth/me"),
//   refresh: (refresh_token) => api.post("/auth/refresh", { refresh_token }),
// };
// export const googleAuthApi = {
//   login: (token) => api.post("/auth/google", { token }),
// };

// // Add this to your frontend client.js (student app, not admin)
// export const enrollApi = {
//   submit: (data) => api.post("/enrollments/enroll", data),

//   // NEW — for payment screenshot submission
//   submitPayment: (formData) => api.post("/enrollments/payment-submit", formData, {
//     headers: { "Content-Type": "multipart/form-data" }
//   }),
// };

// export const contactApi = {
//   submit: (data) => api.post("/messages", {
//     email:   data.email,
//     message: data.message,
//   }),
// };

// export const coursesApi = {
//   list: () => api.get("/courses"),
// };

// export const pricingApi = {
//   list: () => api.get("/pricing"),
// };

// export const enrollmentsApi = {
//   submit: (data) => api.post("/enrollments", data),
// };

// export const messagesApi = {
//   submit: (data) => api.post("/messages", data),
// };




// export default api;