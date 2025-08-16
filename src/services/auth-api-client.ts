import axios from "axios";

// Create API client for backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              token,
            }
          );

          const newToken = response.data.token;
          localStorage.setItem("authToken", newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
