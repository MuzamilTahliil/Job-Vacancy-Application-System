import axios from "axios";
import { message } from "antd";

// Get API URL from environment variable or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Log API URL in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🌐 API Base URL:", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle different error status codes
      const status = error.response.status;
      const errorMessage = error.response.data?.message || "An error occurred";

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          // Optionally redirect to login page
          // window.location.href = "/login";
        }
        message.error("Session expired. Please login again.");
      } else if (status === 403) {
        message.error("You don't have permission to perform this action.");
      } else if (status === 404) {
        message.error("Resource not found.");
      } else if (status >= 500) {
        message.error("Server error. Please try again later.");
      } else {
        message.error(errorMessage);
      }
    } else if (error.request) {
      // Network error - backend not reachable
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      console.error("Network error - Backend not reachable at:", apiUrl);
      console.error("Make sure your backend server is running on port 4000");
      message.error(`Cannot connect to backend server at ${apiUrl}. Please make sure the backend is running.`);
    } else {
      message.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default api;
