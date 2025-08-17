import {
  Container,
  VStack,
  HStack,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Text,
  Badge,
  IconButton,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import UserSearchComponent from "../components/search/UserSearchComponent";
import { useTrendingUsers } from "../hooks/useUserSearch";

const UserSearchPage = () => {
  const { trendingUsers, isLoading, fetchTrendingUsers } = useTrendingUsers();

  useEffect(() => {
    fetchTrendingUsers(8);
  }, []);

  const getPrivacyBadgeColor = (privacy: string) => {
    switch (privacy) {
      case "public":
        return "green";
      case "friends":
        return "yellow";
      case "private":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Page Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Discover Users
          </Heading>
          <Text color="gray.600">
            Find other gamers, explore their profiles, and discover new games
            through their lists
          </Text>
        </Box>

        {/* Search Component */}
        <UserSearchComponent />

        {/* Trending Users */}
        <Card>
          <CardHeader>
            <Heading size="md">Trending Users</Heading>
            <Text fontSize="sm" color="gray.600">
              Popular users with the most gaming activity
            </Text>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Box textAlign="center" py={8}>
                <Spinner size="md" />
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
                {trendingUsers.map((user) => (
                  <Card key={user._id} variant="outline">
                    <CardBody>
                      <HStack spacing={4} align="center">
                        <Avatar
                          size="md"
                          src={user.profileImage.url}
                          name={user.displayName}
                        />

                        <Box flex="1">
                          <HStack spacing={2} align="center" mb={1}>
                            <Text fontWeight="bold">{user.displayName}</Text>
                            <Text fontSize="sm" color="gray.600">
                              @{user.username}
                            </Text>
                            <Badge
                              colorScheme={getPrivacyBadgeColor(
                                user.profilePrivacy
                              )}
                              size="sm"
                            >
                              {user.profilePrivacy}
                            </Badge>
                          </HStack>

                          {user.bio && (
                            <Text
                              fontSize="sm"
                              color="gray.700"
                              mb={2}
                              noOfLines={2}
                            >
                              {user.bio}
                            </Text>
                          )}

                          <HStack spacing={3} fontSize="xs" color="gray.500">
                            {user.stats?.totalGamesPlayed !== undefined && (
                              <Text>
                                🎮 {user.stats.totalGamesPlayed} games
                              </Text>
                            )}
                            {user.stats?.followersCount !== undefined && (
                              <Text>
                                👥 {user.stats.followersCount} followers
                              </Text>
                            )}
                          </HStack>
                        </Box>

                        <IconButton
                          aria-label="View profile"
                          icon={<ViewIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => {
                            window.history.pushState(
                              {},
                              "",
                              `/user/${user.username}`
                            );
                            window.dispatchEvent(new PopStateEvent("popstate"));
                          }}
                        />
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}

            {!isLoading && trendingUsers.length === 0 && (
              <Text textAlign="center" color="gray.500" py={4}>
                No trending users found
              </Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default UserSearchPage;
