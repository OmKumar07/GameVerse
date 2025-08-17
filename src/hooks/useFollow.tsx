import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import followApiClient, {
  FollowStatus,
  FollowUser,
  FollowActionResponse,
} from "../services/follow-api-client";

export const useFollowStatus = (userId: string) => {
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const toast = useToast();

  // Fetch follow status for a user
  const fetchFollowStatus = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await followApiClient.getFollowStatus(userId);
      if (response.success) {
        setFollowStatus(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Follow a user
  const followUser = async (): Promise<FollowActionResponse | null> => {
    setIsActionLoading(true);
    try {
      const response = await followApiClient.followUser(userId);
      if (response.success) {
        setFollowStatus(prev => prev ? {
          ...prev,
          isFollowing: true,
          followersCount: response.data.followersCount
        } : null);
        
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
    setIsActionLoading(true);
    try {
      const response = await followApiClient.unfollowUser(userId);
      if (response.success) {
        setFollowStatus(prev => prev ? {
          ...prev,
          isFollowing: false,
          followersCount: response.data.followersCount
        } : null);
        
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
      const message = error.response?.data?.message || "Failed to unfollow user";
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
    fetchFollowStatus();
  }, [userId]);

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
  const toast = useToast();

  // Fetch followers list
  const fetchFollowers = async () => {
    setIsLoadingFollowers(true);
    try {
      const response = await followApiClient.getFollowers();
      if (response.success) {
        setFollowers(response.data.followers || []);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch followers";
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  // Fetch following list
  const fetchFollowing = async () => {
    setIsLoadingFollowing(true);
    try {
      const response = await followApiClient.getFollowing();
      if (response.success) {
        setFollowing(response.data.following || []);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch following";
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingFollowing(false);
    }
  };

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
