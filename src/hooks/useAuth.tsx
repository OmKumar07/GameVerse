import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthState } from "../entities/User";
import apiClient from "../services/auth-api-client";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Store token and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        username,
        displayName,
      });

      const { token, user } = response.data;

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Store token and user data
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      const message = error.response?.data?.message || "Signup failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Check for existing user on mount
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("authToken");

      if (storedUser && storedToken) {
        try {
          // Verify token with backend
          const response = await apiClient.post("/auth/verify-token", {
            token: storedToken,
          });

          if (response.data.valid) {
            const user = JSON.parse(storedUser);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
          }
        } catch (error) {
          // Token verification failed, clear storage
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
    };

    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
