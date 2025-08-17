import apiClient from "./auth-api-client";

export interface FollowStatus {
  isFollowing: boolean;
  isFollower: boolean;
  followersCount: number;
  followingCount: number;
}

export interface FollowUser {
  _id: string;
  username: string;
  displayName: string;
  profileImage: {
    url: string;
  };
  bio?: string;
}

export interface FollowListResponse {
  success: boolean;
  data: {
    followers?: FollowUser[];
    following?: FollowUser[];
    count: number;
  };
}

export interface FollowActionResponse {
  success: boolean;
  message: string;
  data: {
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
  };
}

class FollowApiClient {
  // Follow a user
  followUser = async (userId: string): Promise<FollowActionResponse> => {
    const response = await apiClient.post<FollowActionResponse>(
      `/users/${userId}/follow`
    );
    return response.data;
  };

  // Unfollow a user
  unfollowUser = async (userId: string): Promise<FollowActionResponse> => {
    const response = await apiClient.delete<FollowActionResponse>(
      `/users/${userId}/follow`
    );
    return response.data;
  };

  // Get follow status for a user
  getFollowStatus = async (userId: string): Promise<{ success: boolean; data: FollowStatus }> => {
    const response = await apiClient.get<{ success: boolean; data: FollowStatus }>(
      `/users/${userId}/follow-status`
    );
    return response.data;
  };

  // Get user's followers
  getFollowers = async (): Promise<FollowListResponse> => {
    const response = await apiClient.get<FollowListResponse>("/users/followers");
    return response.data;
  };

  // Get user's following
  getFollowing = async (): Promise<FollowListResponse> => {
    const response = await apiClient.get<FollowListResponse>("/users/following");
    return response.data;
  };
}

export default new FollowApiClient();
