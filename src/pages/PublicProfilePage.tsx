import {
  Box,
  Container,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  IconButton,
  Link,
  Divider,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  CalendarIcon,
  TimeIcon,
  StarIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { usePublicProfile } from "../hooks/useUserSearch";

interface PublicProfilePageProps {}

const PublicProfilePage: React.FC<PublicProfilePageProps> = () => {
  const [username, setUsername] = useState<string>("");
  const { profile, isLoading, error, fetchProfile } = usePublicProfile();

  useEffect(() => {
    // Get username from URL path
    const path = window.location.pathname;
    const usernameFromPath = path.split("/user/")[1];
    if (usernameFromPath) {
      setUsername(usernameFromPath);
      fetchProfile(usernameFromPath);
    }
  }, []);

  if (isLoading) {
    return (
      <Container maxW="6xl" py={8}>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert status="info">
          <AlertIcon />
          User not found
        </Alert>
      </Container>
    );
  }

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

  // Handle private profiles
  if (profile.isPrivate) {
    return (
      <Container maxW="6xl" py={8}>
        <Card>
          <CardBody textAlign="center" py={12}>
            <Avatar
              size="xl"
              src={profile.profileImage.url}
              name={profile.displayName}
              mb={4}
            />
            <Heading size="lg" mb={2}>
              {profile.displayName}
            </Heading>
            <Text color="gray.600" mb={4}>
              @{profile.username}
            </Text>
            <Badge colorScheme="red" mb={4}>
              Private Profile
            </Badge>
            <Text color="gray.500">This user's profile is private.</Text>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Handle friends-only profiles
  if (profile.isFriendsOnly) {
    return (
      <Container maxW="6xl" py={8}>
        <Card>
          <CardBody textAlign="center" py={12}>
            <Avatar
              size="xl"
              src={profile.profileImage.url}
              name={profile.displayName}
              mb={4}
            />
            <Heading size="lg" mb={2}>
              {profile.displayName}
            </Heading>
            <Text color="gray.600" mb={4}>
              @{profile.username}
            </Text>
            <Badge colorScheme="yellow" mb={4}>
              Friends Only
            </Badge>
            <Text color="gray.500">
              This user's profile is only visible to friends.
            </Text>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Profile Header */}
        <Card>
          <CardBody>
            <HStack spacing={6} align="start">
              <Avatar
                size="2xl"
                src={profile.profileImage.url}
                name={profile.displayName}
              />

              <Box flex="1">
                <HStack spacing={3} align="center" mb={2}>
                  <Heading size="lg">{profile.displayName}</Heading>
                  <Badge
                    colorScheme={getPrivacyBadgeColor(profile.profilePrivacy)}
                  >
                    {profile.profilePrivacy}
                  </Badge>
                </HStack>

                <Text color="gray.600" fontSize="lg" mb={3}>
                  @{profile.username}
                </Text>

                {profile.bio && <Text mb={3}>{profile.bio}</Text>}

                <HStack spacing={4} fontSize="sm" color="gray.600" mb={3}>
                  {profile.location && (
                    <HStack spacing={1}>
                      <Text>📍</Text>
                      <Text>{profile.location}</Text>
                    </HStack>
                  )}

                  <HStack spacing={1}>
                    <CalendarIcon />
                    <Text>
                      Joined{" "}
                      {new Date(profile.memberSince).toLocaleDateString()}
                    </Text>
                  </HStack>

                  {profile.lastActive && (
                    <HStack spacing={1}>
                      <TimeIcon />
                      <Text>
                        Last active{" "}
                        {new Date(profile.lastActive).toLocaleDateString()}
                      </Text>
                    </HStack>
                  )}
                </HStack>

                {profile.website && (
                  <Link
                    href={profile.website}
                    isExternal
                    color="blue.500"
                    fontSize="sm"
                  >
                    <HStack spacing={1}>
                      <ExternalLinkIcon />
                      <Text>Website</Text>
                    </HStack>
                  </Link>
                )}

                {profile.email && (
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    📧 {profile.email}
                  </Text>
                )}
              </Box>
            </HStack>
          </CardBody>
        </Card>

        {/* Gaming Platforms & Genres */}
        {(profile.gamingPlatforms?.length ||
          profile.favoriteGenres?.length) && (
          <Card>
            <CardHeader>
              <Heading size="md">Gaming Preferences</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="start">
                {profile.gamingPlatforms?.length && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>
                      Platforms:
                    </Text>
                    <Wrap>
                      {profile.gamingPlatforms.map((platform, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="blue">
                            <TagLabel>{platform}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                )}

                {profile.favoriteGenres?.length && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>
                      Favorite Genres:
                    </Text>
                    <Wrap>
                      {profile.favoriteGenres.map((genre, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="purple">
                            <TagLabel>{genre}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Stats */}
        <Card>
          <CardHeader>
            <Heading size="md">Gaming Statistics</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Stat>
                <StatLabel>Games Played</StatLabel>
                <StatNumber>{profile.stats.totalGamesPlayed || 0}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Hours Played</StatLabel>
                <StatNumber>{profile.stats.totalHoursPlayed || 0}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Favorite Games</StatLabel>
                <StatNumber>{profile.stats.favoriteGamesCount || 0}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Custom Lists</StatLabel>
                <StatNumber>{profile.stats.customListsCount || 0}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Followers</StatLabel>
                <StatNumber>{profile.stats.followersCount || 0}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Following</StatLabel>
                <StatNumber>{profile.stats.followingCount || 0}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Achievements</StatLabel>
                <StatNumber>
                  {profile.stats.achievementsUnlocked || 0}
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Favorite Games */}
        {profile.favoriteGames?.length && (
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Favorite Games</Heading>
                <Text fontSize="sm" color="gray.600">
                  {profile.favoriteGames.length} game
                  {profile.favoriteGames.length !== 1 ? "s" : ""}
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {profile.favoriteGames.slice(0, 8).map((game) => (
                  <Card key={game.gameId} variant="outline" size="sm">
                    <CardBody p={3}>
                      {game.gameImage && (
                        <AspectRatio ratio={16 / 9} mb={2}>
                          <Image
                            src={game.gameImage}
                            alt={game.gameName}
                            borderRadius="md"
                            objectFit="cover"
                          />
                        </AspectRatio>
                      )}
                      <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                        {game.gameName}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              {profile.favoriteGames.length > 8 && (
                <Text textAlign="center" mt={4} fontSize="sm" color="gray.600">
                  and {profile.favoriteGames.length - 8} more...
                </Text>
              )}
            </CardBody>
          </Card>
        )}

        {/* Public Custom Lists */}
        {profile.customLists?.length && (
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Public Lists</Heading>
                <Link as={RouterLink} to={`/user/${profile.username}/lists`}>
                  <Button size="sm" variant="ghost" rightIcon={<ViewIcon />}>
                    View All
                  </Button>
                </Link>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {profile.customLists.slice(0, 4).map((list) => (
                  <Card key={list.id} variant="outline">
                    <CardBody>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="semibold" noOfLines={1}>
                          {list.name}
                        </Text>
                        <Badge>
                          {list.games.length} game
                          {list.games.length !== 1 ? "s" : ""}
                        </Badge>
                      </HStack>

                      {list.description && (
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          mb={3}
                          noOfLines={2}
                        >
                          {list.description}
                        </Text>
                      )}

                      {list.games.length > 0 && (
                        <HStack spacing={2} overflowX="auto">
                          {list.games.slice(0, 4).map((game) => (
                            <Box key={game.gameId} flexShrink={0}>
                              {game.gameImage ? (
                                <Image
                                  src={game.gameImage}
                                  alt={game.gameName}
                                  boxSize="40px"
                                  borderRadius="md"
                                  objectFit="cover"
                                />
                              ) : (
                                <Box
                                  boxSize="40px"
                                  bg="gray.200"
                                  borderRadius="md"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Text fontSize="xs">🎮</Text>
                                </Box>
                              )}
                            </Box>
                          ))}
                          {list.games.length > 4 && (
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              whiteSpace="nowrap"
                            >
                              +{list.games.length - 4} more
                            </Text>
                          )}
                        </HStack>
                      )}

                      <HStack
                        justify="space-between"
                        mt={3}
                        fontSize="xs"
                        color="gray.500"
                      >
                        <Text>
                          Created{" "}
                          {new Date(list.createdAt).toLocaleDateString()}
                        </Text>
                        <Link
                          as={RouterLink}
                          to={`/user/${profile.username}/lists/${list.id}`}
                        >
                          <Button size="xs" variant="ghost">
                            View
                          </Button>
                        </Link>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
};

export default PublicProfilePage;
