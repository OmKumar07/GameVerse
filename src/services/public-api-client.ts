import apiClient from "./api-client";

export interface PublicUser {
  stats: any;
  _id: string;
  username: string;
  displayName: string;
  profileImage: {
    url: string;
    publicId?: string;
  };
  bio?: string;
  location?: string;
  profilePrivacy: "public" | "friends" | "private";
  memberSince: string;
  isPrivate?: boolean;
  isFriendsOnly?: boolean;
}

export interface PublicUserProfile extends PublicUser {
  email?: string;
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
  customLists?: Array<{
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    games: Array<{
      gameId: number;
      gameName: string;
      gameImage?: string;
      addedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }>;
  stats: {
    totalGamesPlayed: number;
    totalHoursPlayed: number;
    achievementsUnlocked: number;
    favoriteGamesCount: number;
    customListsCount: number;
    followersCount: number;
    followingCount: number;
  };
  lastActive?: string;
}

export interface SearchUsersResponse {
  success: boolean;
  data: {
    users: PublicUser[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface PublicUserProfileResponse {
  success: boolean;
  data: PublicUserProfile;
}

export interface PublicUserList {
  id: string;
  name: string;
  description?: string;
  gamesCount: number;
  createdAt: string;
  updatedAt: string;
  games: Array<{
    gameId: number;
    gameName: string;
    gameImage?: string;
    addedAt: string;
  }>;
}

export interface PublicUserListsResponse {
  success: boolean;
  data: {
    username: string;
    displayName: string;
    lists: PublicUserList[];
    totalPublicLists: number;
  };
}

export interface PublicListDetailsResponse {
  success: boolean;
  data: {
    list: PublicUserList;
    owner: {
      username: string;
      displayName: string;
      profileImage: {
        url: string;
      };
    };
  };
}

class PublicApiClient {
  // Search for users
  searchUsers = async (
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SearchUsersResponse> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get<SearchUsersResponse>(
      `/public/users/search?${params}`
    );
    return response.data;
  };

  // Get public user profile
  getUserProfile = async (
    identifier: string
  ): Promise<PublicUserProfileResponse> => {
    const response = await apiClient.get<PublicUserProfileResponse>(
      `/public/users/${identifier}`
    );
    return response.data;
  };

  // Get user's public lists
  getUserLists = async (
    identifier: string
  ): Promise<PublicUserListsResponse> => {
    const response = await apiClient.get<PublicUserListsResponse>(
      `/public/users/${identifier}/lists`
    );
    return response.data;
  };

  // Get specific public list details
  getListDetails = async (
    identifier: string,
    listId: string
  ): Promise<PublicListDetailsResponse> => {
    const response = await apiClient.get<PublicListDetailsResponse>(
      `/public/users/${identifier}/lists/${listId}`
    );
    return response.data;
  };

  // Get trending users
  getTrendingUsers = async (
    limit: number = 10
  ): Promise<{ success: boolean; data: PublicUser[] }> => {
    const response = await apiClient.get<{
      success: boolean;
      data: PublicUser[];
    }>(`/public/users/trending?limit=${limit}`);
    return response.data;
  };
}

export default new PublicApiClient();
