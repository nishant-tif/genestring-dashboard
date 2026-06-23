import axios, { AxiosInstance, AxiosError } from "axios";
import { API_CONFIG } from "@/config/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
const getTokenFromCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));

  return match ? decodeURIComponent(match[2]) : null;
};

// request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token =
    getTokenFromCookie("access_token") || getTokenFromCookie("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
/* ===============================
   RESPONSE INTERCEPTOR
=============================== */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      // prevent infinite redirect loop
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
