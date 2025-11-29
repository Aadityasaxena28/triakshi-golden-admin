import axios from "axios";

const authHeaderName = import.meta.env.VITE_Api_key;
const authHeaderValue = import.meta.env.VITE_Api_value;

const api = axios.create({
  baseURL: import.meta.env.VITE_Backend,
  timeout: 15000,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    // 1. Attach Bearer token
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Attach custom API auth header from env
    if (authHeaderName && authHeaderValue) {
      config.headers[authHeaderName] = authHeaderValue;
    } else {
      console.warn("API auth headers are missing in env vars");
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
