// src/api/client.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("productivity_jwt");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// optional response interceptor for global errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // you can add centralized handling here
    return Promise.reject(err);
  }
);

export default api;
