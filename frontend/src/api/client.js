/**
 * Frontend API Client
 * Drop this file into your existing frontend: src/api/client.js
 * Update VITE_API_URL in your frontend .env if backend runs on a different host.
 */
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hh_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (email, password) => api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
  refresh: (refresh_token) => api.post("/auth/refresh", { refresh_token }),
};

// ── Courses ──────────────────────────────────────────────
export const coursesApi = {
  /** Get all active courses (optional ?category=Pyro filter) */
  list: (category) => api.get("/courses", category ? { params: { category } } : undefined),
};

// ── Pricing ──────────────────────────────────────────────
export const pricingApi = {
  /** Get all active pricing plans */
  list: () => api.get("/pricing"),
};

// ── Enrollments ──────────────────────────────────────────
export const enrollmentsApi = {
  /**
   * Submit enrollment form
   * @param {Object} data - { first_name, last_name, email, country_code, phone, gender, plan, billing }
   */
  submit: (data) => api.post("/enrollments", data),
};

// ── Contact Messages ──────────────────────────────────────
export const messagesApi = {
  /**
   * Submit contact message from Pricing page "Contact Us" modal
   * @param {Object} data - { email, message }
   */
  submit: (data) => api.post("/messages", data),
};

export default api;