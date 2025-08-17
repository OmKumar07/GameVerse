import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import publicApiClient, {
  PublicUser,
  PublicUserProfile,
} from "../services/public-api-client";

export const useUserSearch = () => {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const toast = useToast();

  const searchUsers = async (query: string, page: number = 1) => {
    if (!query || query.trim().length < 2) {
      setUsers([]);
      setError("Search query must be at least 2 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await publicApiClient.searchUsers(query.trim(), page);

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else {
        throw new Error("Search failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to search users";
      setError(errorMessage);
      toast({
        title: "Search Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setUsers([]);
    setError(null);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });
  };

  return {
    users,
    isLoading,
    error,
    pagination,
    searchUsers,
    clearSearch,
  };
};

export const usePublicProfile = () => {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchProfile = async (identifier: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await publicApiClient.getUserProfile(identifier);

      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error("Profile fetch failed");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch user profile";
      setError(errorMessage);

      // Don't show toast for 404 errors as they're handled in the UI
      if (err.response?.status !== 404) {
        toast({
          title: "Profile Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    clearProfile,
  };
};

export const useTrendingUsers = () => {
  const [trendingUsers, setTrendingUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchTrendingUsers = async (limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await publicApiClient.getTrendingUsers(limit);

      if (response.success) {
        setTrendingUsers(response.data);
      } else {
        throw new Error("Failed to fetch trending users");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch trending users";
      setError(errorMessage);
      toast({
        title: "Trending Users Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trendingUsers,
    isLoading,
    error,
    fetchTrendingUsers,
  };
};
