import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Avatar,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { useFollowLists } from "../../hooks/useFollow";
import FollowButton from "./FollowButton";

const FollowListsCard = () => {
  const {
    followers,
    following,
    isLoadingFollowers,
    isLoadingFollowing,
    fetchFollowers,
    fetchFollowing,
    followersCount,
    followingCount,
  } = useFollowLists();

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
  }, []);

  const navigateToProfile = (username: string) => {
    window.history.pushState({}, "", `/user/${username}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const renderUserItem = (user: any, showFollowButton = false) => (
    <Card key={user._id} variant="outline" size="sm">
      <CardBody>
        <HStack spacing={3} align="center">
          <Avatar
            size="sm"
            src={user.profileImage?.url}
            name={user.displayName}
          />
          <Box flex="1">
            <Text fontWeight="semibold" fontSize="sm">
              {user.displayName}
            </Text>
            <Text color="gray.500" fontSize="xs">
              @{user.username}
            </Text>
            {user.bio && (
              <Text fontSize="xs" color="gray.600" noOfLines={1}>
                {user.bio}
              </Text>
            )}
          </Box>
          <HStack spacing={1}>
            {showFollowButton && <FollowButton userId={user._id} size="xs" />}
            <IconButton
              aria-label="View profile"
              icon={<ViewIcon />}
              size="xs"
              variant="ghost"
              onClick={() => navigateToProfile(user.username)}
            />
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Social Connections</Heading>
      </CardHeader>
      <CardBody>
        <Tabs variant="enclosed">
          <TabList>
            <Tab fontSize="sm">
              Followers ({followersCount})
            </Tab>
            <Tab fontSize="sm">
              Following ({followingCount})
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0} py={4}>
              {isLoadingFollowers ? (
                <Box textAlign="center" py={4}>
                  <Spinner size="md" />
                </Box>
              ) : followers.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  You don't have any followers yet
                </Alert>
              ) : (
                <VStack spacing={3} align="stretch">
                  {followers.map((follower) => renderUserItem(follower, true))}
                </VStack>
              )}
            </TabPanel>

            <TabPanel px={0} py={4}>
              {isLoadingFollowing ? (
                <Box textAlign="center" py={4}>
                  <Spinner size="md" />
                </Box>
              ) : following.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  You're not following anyone yet
                </Alert>
              ) : (
                <VStack spacing={3} align="stretch">
                  {following.map((user) => renderUserItem(user, false))}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default FollowListsCard;
