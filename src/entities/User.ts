export interface User {
  id: string;
  email: string;
  username: string;
  profileImage?: string;
  displayName: string;
  createdAt: string;
  favoriteGames?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username: string;
  displayName: string;
}
