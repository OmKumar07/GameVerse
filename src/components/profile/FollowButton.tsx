import { Button, ButtonProps } from "@chakra-ui/react";
import { useFollowStatus } from "../../hooks/useFollow";
import { useAuth } from "../../hooks/useAuth";

interface FollowButtonProps extends Omit<ButtonProps, "onClick"> {
  userId: string;
  onFollowChange?: (isFollowing: boolean, followersCount: number) => void;
}

const FollowButton = ({ 
  userId, 
  onFollowChange, 
  size = "sm", 
  ...props 
}: FollowButtonProps) => {
  const { user } = useAuth();
  const { followStatus, isActionLoading, followUser, unfollowUser } = useFollowStatus(userId);

  // Don't show button for own profile
  if (user?.id === userId) {
    return null;
  }

  const handleClick = async () => {
    if (!followStatus) return;

    const result = followStatus.isFollowing 
      ? await unfollowUser() 
      : await followUser();

    if (result && onFollowChange) {
      onFollowChange(result.data.isFollowing, result.data.followersCount);
    }
  };

  if (!followStatus) {
    return (
      <Button size={size} isLoading {...props}>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      size={size}
      colorScheme={followStatus.isFollowing ? "gray" : "blue"}
      variant={followStatus.isFollowing ? "outline" : "solid"}
      isLoading={isActionLoading}
      onClick={handleClick}
      {...props}
    >
      {followStatus.isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
