import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ViewIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useUserSearch, useTrendingUsers } from "../../hooks/useUserSearch";

const UserSearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { users, isLoading, error, pagination, searchUsers, clearSearch } =
    useUserSearch();
  const {
    trendingUsers,
    isLoading: isLoadingTrending,
    fetchTrendingUsers,
  } = useTrendingUsers();

  // Fetch trending users on component mount
  useEffect(() => {
    fetchTrendingUsers();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      searchUsers(debouncedQuery, 1);
    } else if (debouncedQuery.trim().length === 0) {
      clearSearch();
    }
  }, [debouncedQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (debouncedQuery.trim().length >= 2) {
      searchUsers(debouncedQuery, page);
    }
  };

  const navigateToProfile = (username: string) => {
    window.history.pushState({}, "", `/user/${username}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const renderUserCard = (user: any) => (
    <Card key={user._id} mb={4}>
      <CardBody>
        <HStack spacing={4} align="start">
          <Avatar
            size="md"
            src={user.profileImage?.url}
            name={user.displayName}
          />
          <Box flex="1">
            <HStack spacing={2} mb={1}>
              <Text fontWeight="bold" fontSize="lg">
                {user.displayName}
              </Text>
              <Text color="gray.500" fontSize="sm">
                @{user.username}
              </Text>
              {user.profilePrivacy !== "public" && (
                <Badge
                  colorScheme={
                    user.profilePrivacy === "private" ? "red" : "orange"
                  }
                >
                  {user.profilePrivacy}
                </Badge>
              )}
            </HStack>
            {user.bio && (
              <Text fontSize="sm" color="gray.600" mb={2}>
                {user.bio}
              </Text>
            )}
            {user.location && (
              <Text fontSize="xs" color="gray.500" mb={1}>
                📍 {user.location}
              </Text>
            )}
            <Text fontSize="xs" color="gray.500">
              Member since {new Date(user.memberSince).toLocaleDateString()}
            </Text>
          </Box>
          <IconButton
            aria-label="View profile"
            icon={<ViewIcon />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={() => navigateToProfile(user.username)}
          />
        </HStack>
      </CardBody>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Search Users</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Search Input */}
          <InputGroup>
            <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search users by username or display name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>

          {/* Search Results or Trending Users */}
          {debouncedQuery.trim().length >= 2 ? (
            <Box>
              <Heading size="sm" mb={4}>
                Search Results for "{debouncedQuery}"
              </Heading>

              {isLoading ? (
                <Flex justify="center" py={8}>
                  <Spinner size="lg" />
                </Flex>
              ) : error ? (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              ) : users.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  No users found matching your search.
                </Alert>
              ) : (
                <>
                  <VStack spacing={4}>{users.map(renderUserCard)}</VStack>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <Flex justify="center" align="center" mt={6} gap={2}>
                      <IconButton
                        aria-label="Previous page"
                        icon={<ChevronLeftIcon />}
                        isDisabled={!pagination.hasPrevPage}
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        size="sm"
                      />

                      <Text fontSize="sm">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </Text>

                      <IconButton
                        aria-label="Next page"
                        icon={<ChevronRightIcon />}
                        isDisabled={!pagination.hasNextPage}
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        size="sm"
                      />
                    </Flex>
                  )}
                </>
              )}
            </Box>
          ) : (
            <Box>
              <Heading size="sm" mb={4}>
                Popular Users
              </Heading>

              {isLoadingTrending ? (
                <Flex justify="center" py={8}>
                  <Spinner size="lg" />
                </Flex>
              ) : trendingUsers.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  No users available.
                </Alert>
              ) : (
                <VStack spacing={4}>
                  {trendingUsers.slice(0, 3).map(renderUserCard)}
                </VStack>
              )}
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default UserSearchComponent;
