export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profileImage?: {
    url: string;
    publicId?: string;
  };
  bio?: string;
  location?: string;
  website?: string;
  favoriteGenres?: string[];
  gamingPlatforms?: string[];
  favoriteGames?: Array<{
    gameId: number;
    gameName: string;
    gameImage?: string;
    addedAt: string;
  }>;
  playedGames?: Array<{
    gameId: number;
    gameName: string;
    gameImage?: string;
    status: "playing" | "completed" | "dropped" | "plan-to-play";
    rating?: number;
    hoursPlayed?: number;
    addedAt: string;
    completedAt?: string;
  }>;
  totalGamesPlayed?: number;
  totalHoursPlayed?: number;
  achievementsUnlocked?: number;
  followers?: string[];
  following?: string[];
  profilePrivacy?: "public" | "friends" | "private";
  showEmail?: boolean;
  showGameStats?: boolean;
  showFavoriteGames?: boolean;
  showPlayedGames?: boolean;
  showCustomLists?: boolean;
  showBio?: boolean;
  showLocation?: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  lastLoginAt?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt?: string;
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
