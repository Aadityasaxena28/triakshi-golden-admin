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
    const token = localStorage.getItem("adminToken");
    if (authHeaderName && token) {
      config.headers[authHeaderName] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
