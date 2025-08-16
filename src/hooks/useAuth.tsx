import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../entities/User';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
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
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        displayName: email.split('@')[0],
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString(),
        favoriteGames: [],
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Login failed');
    }
  };

  const signup = async (email: string, password: string, username: string, displayName: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        username,
        displayName,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt: new Date().toISOString(),
        favoriteGames: [],
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Check for existing user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
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
