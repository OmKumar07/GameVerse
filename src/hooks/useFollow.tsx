import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "./useAuth";
import followApiClient, {
  FollowStatus,
  FollowUser,
  FollowActionResponse,
} from "../services/follow-api-client";

export const useFollowStatus = (userId: string) => {
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  // Fetch follow status for a user
  const fetchFollowStatus = async () => {
    if (!userId || !isAuthenticated || !user) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await followApiClient.getFollowStatus(userId);
      if (response.success) {
        setFollowStatus(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch follow status:", error);
      // Don't show toast for auth errors
      if (error.response?.status !== 401) {
        console.error("Follow status error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Follow a user
  const followUser = async (): Promise<FollowActionResponse | null> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to follow users",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    setIsActionLoading(true);
    try {
      const response = await followApiClient.followUser(userId);
      if (response.success) {
        setFollowStatus((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: true,
                followersCount: response.data.followersCount,
              }
            : null
        );

        toast({
          title: "Success",
          description: response.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return response;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to follow user";
      toast({
        title: "Follow Failed",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsActionLoading(false);
    }
    return null;
  };

  // Unfollow a user
  const unfollowUser = async (): Promise<FollowActionResponse | null> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to unfollow users",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }

    setIsActionLoading(true);
    try {
      const response = await followApiClient.unfollowUser(userId);
      if (response.success) {
        setFollowStatus((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: false,
                followersCount: response.data.followersCount,
              }
            : null
        );

        toast({
          title: "Success",
          description: response.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return response;
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to unfollow user";
      toast({
        title: "Unfollow Failed",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsActionLoading(false);
    }
    return null;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFollowStatus();
    } else {
      setFollowStatus(null);
    }
  }, [userId, isAuthenticated, user]);

  return {
    followStatus,
    isLoading,
    isActionLoading,
    followUser,
    unfollowUser,
    refetchStatus: fetchFollowStatus,
  };
};

export const useFollowLists = () => {
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  // Fetch followers list
  const fetchFollowers = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    setIsLoadingFollowers(true);
    try {
      const response = await followApiClient.getFollowers();
      if (response.success) {
        setFollowers(response.data.followers || []);
      }
    } catch (error: any) {
      console.error("Fetch followers error:", error);

      // For 404 errors, just set empty array (user has no followers yet)
      if (error.response?.status === 404) {
        setFollowers([]);
        return;
      }

      // For other errors, just log them without causing logout
      if (error.response?.status !== 401) {
        console.log("Could not fetch followers, setting empty array");
        setFollowers([]);
      }
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  // Fetch following list
  const fetchFollowing = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    setIsLoadingFollowing(true);
    try {
      const response = await followApiClient.getFollowing();
      if (response.success) {
        setFollowing(response.data.following || []);
      }
    } catch (error: any) {
      console.error("Fetch following error:", error);

      // For 404 errors, just set empty array (user is not following anyone yet)
      if (error.response?.status === 404) {
        setFollowing([]);
        return;
      }

      // For other errors, just log them without causing logout
      if (error.response?.status !== 401) {
        console.log("Could not fetch following, setting empty array");
        setFollowing([]);
      }
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  // Auto-fetch when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !hasAttempted) {
      setHasAttempted(true);
      fetchFollowers();
      fetchFollowing();
    } else if (!isAuthenticated) {
      // Clear data when not authenticated
      setFollowers([]);
      setFollowing([]);
      setHasAttempted(false);
    }
  }, [isAuthenticated, user]);

  return {
    followers,
    following,
    isLoadingFollowers,
    isLoadingFollowing,
    fetchFollowers,
    fetchFollowing,
    followersCount: followers.length,
    followingCount: following.length,
  };
};
