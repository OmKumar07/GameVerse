import axios, { AxiosInstance } from "axios";

interface ExtendedAxiosInstance extends AxiosInstance {
  updateProfile: (updates: any) => Promise<any>;
  getProfile: () => Promise<any>;
}

// Create API client for backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Debug logging
console.log("🔗 API Base URL:", API_BASE_URL);
console.log("🌍 Environment VITE_API_URL:", import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}) as ExtendedAxiosInstance;

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

// Add custom methods to the API client
apiClient.updateProfile = async (updates: any) => {
  return apiClient.put("/auth/profile", updates);
};

apiClient.getProfile = async () => {
  return apiClient.get("/auth/profile");
};

export default apiClient;
