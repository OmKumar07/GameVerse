import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Icon,
  Divider,
  Badge,
  Wrap,
  WrapItem,
  Image,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FiHeart, FiCalendar, FiEdit3, FiStar } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import { useRecommendations } from "../../hooks/useRecommendations";
import EditProfileModal from "./EditProfileModal";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    favorites,
    removeFromFavorites,
    addToFavorites,
    isLoading,
    isFavorite,
  } = useFavorites();
  const { recommendations, isLoading: recommendationsLoading } =
    useRecommendations();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!user) {
    return null;
  }

  const handleRemoveFavorite = async (gameId: number, gameName: string) => {
    try {
      await removeFromFavorites(gameId);
      toast({
        title: "Removed from favorites",
        description: `${gameName} has been removed from your favorites`,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddToFavorites = async (game: any) => {
    try {
      await addToFavorites(game);
      toast({
        title: "Added to favorites",
        description: `${game.name} has been added to your favorites`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to favorites. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="1200px">
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="lg">
            <CardBody>
              <HStack spacing={6} align="start">
                <Avatar
                  size="xl"
                  name={user.displayName}
                  src={user.profileImage?.url}
                  border="4px"
                  borderColor="purple.400"
                />
                <VStack align="start" spacing={3} flex={1}>
                  <HStack justify="space-between" w="100%">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold">
                        {user.displayName}
                      </Text>
                      <Text fontSize="md" color="gray.500">
                        @{user.username}
                      </Text>
                      <HStack spacing={4}>
                        <HStack spacing={1}>
                          <FiCalendar color="gray.400" />
                          <Text fontSize="sm" color="gray.500">
                            Member since {memberSince}
                          </Text>
                        </HStack>
                        <Badge colorScheme="purple" variant="subtle">
                          Gamer
                        </Badge>
                      </HStack>
                      {user.bio && (
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          mt={2}
                          maxW="500px"
                        >
                          {user.bio}
                        </Text>
                      )}
                      {user.location && (
                        <Text fontSize="sm" color="gray.500">
                          📍 {user.location}
                        </Text>
                      )}
                      {user.website && (
                        <Text fontSize="sm" color="gray.500">
                          🌐{" "}
                          <Text
                            as="a"
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="purple.400"
                            textDecoration="underline"
                            _hover={{ color: "purple.600" }}
                          >
                            {user.website.replace(/^https?:\/\//, "")}
                          </Text>
                        </Text>
                      )}

                      {/* Gaming Preferences */}
                      {user.favoriteGenres &&
                        user.favoriteGenres.length > 0 && (
                          <VStack align="start" spacing={1} mt={2}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Favorite Genres:
                            </Text>
                            <Wrap spacing={1}>
                              {user.favoriteGenres.slice(0, 5).map((genre) => (
                                <WrapItem key={genre}>
                                  <Badge
                                    colorScheme="purple"
                                    variant="subtle"
                                    fontSize="xs"
                                  >
                                    {genre}
                                  </Badge>
                                </WrapItem>
                              ))}
                              {user.favoriteGenres.length > 5 && (
                                <WrapItem>
                                  <Badge
                                    colorScheme="gray"
                                    variant="subtle"
                                    fontSize="xs"
                                  >
                                    +{user.favoriteGenres.length - 5} more
                                  </Badge>
                                </WrapItem>
                              )}
                            </Wrap>
                          </VStack>
                        )}

                      {user.gamingPlatforms &&
                        user.gamingPlatforms.length > 0 && (
                          <VStack align="start" spacing={1} mt={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Gaming Platforms:
                            </Text>
                            <Wrap spacing={1}>
                              {user.gamingPlatforms
                                .slice(0, 4)
                                .map((platform) => (
                                  <WrapItem key={platform}>
                                    <Badge
                                      colorScheme="blue"
                                      variant="subtle"
                                      fontSize="xs"
                                    >
                                      {platform}
                                    </Badge>
                                  </WrapItem>
                                ))}
                              {user.gamingPlatforms.length > 4 && (
                                <WrapItem>
                                  <Badge
                                    colorScheme="gray"
                                    variant="subtle"
                                    fontSize="xs"
                                  >
                                    +{user.gamingPlatforms.length - 4} more
                                  </Badge>
                                </WrapItem>
                              )}
                            </Wrap>
                          </VStack>
                        )}
                    </VStack>
                    <Button
                      leftIcon={<FiEdit3 />}
                      colorScheme="purple"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack>
                    <FiHeart color="red.400" size={20} />
                    <StatLabel>Favorite Games</StatLabel>
                  </HStack>
                  <StatNumber color="red.400">{favorites.length}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack>
                    <IoGameControllerOutline color="blue.400" size={20} />
                    <StatLabel>Games Played</StatLabel>
                  </HStack>
                  <StatNumber color="blue.400">
                    {user.totalGamesPlayed || 0}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack>
                    <FiCalendar color="green.400" size={20} />
                    <StatLabel>Days Active</StatLabel>
                  </HStack>
                  <StatNumber color="green.400">
                    {Math.ceil(
                      (Date.now() - new Date(user.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Recommended Games Section */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={4}>
                <HStack justify="space-between" w="100%">
                  <Text fontSize="lg" fontWeight="semibold">
                    Recommended for You
                  </Text>
                  {recommendations.length > 0 && (
                    <Text fontSize="sm" color="gray.500">
                      Based on your favorites
                    </Text>
                  )}
                </HStack>
                <Divider />

                {recommendationsLoading ? (
                  <Box textAlign="center" py={8} w="100%">
                    <Text color="gray.500" fontSize="lg">
                      Finding games you might like...
                    </Text>
                  </Box>
                ) : favorites.length === 0 ? (
                  <Box textAlign="center" py={8} w="100%">
                    <IoGameControllerOutline size={48} color="gray.300" />
                    <Text color="gray.500" fontSize="lg" mt={4}>
                      No recommendations yet
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      Add some games to your favorites to get personalized
                      recommendations!
                    </Text>
                  </Box>
                ) : recommendations.length === 0 ? (
                  <Box textAlign="center" py={8} w="100%">
                    <IoGameControllerOutline size={48} color="gray.300" />
                    <Text color="gray.500" fontSize="lg" mt={4}>
                      No new recommendations
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      You've discovered most games in your favorite genres!
                    </Text>
                  </Box>
                ) : (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 6 }}
                    spacing={4}
                    w="100%"
                  >
                    {recommendations.map((game) => (
                      <Card
                        key={game.id}
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        position="relative"
                        _hover={{
                          transform: "scale(1.02)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <CardBody p={0}>
                          {/* Add to favorites button */}
                          <IconButton
                            aria-label="Add to favorites"
                            icon={
                              isFavorite(game.id) ? (
                                <FaHeart color="#E53E3E" />
                              ) : (
                                <FiHeart color="white" />
                              )
                            }
                            position="absolute"
                            top={2}
                            right={2}
                            zIndex={2}
                            size="sm"
                            bg="blackAlpha.600"
                            _hover={{ bg: "blackAlpha.800" }}
                            borderRadius="full"
                            isLoading={isLoading}
                            onClick={() =>
                              isFavorite(game.id)
                                ? handleRemoveFavorite(game.id, game.name)
                                : handleAddToFavorites(game)
                            }
                          />

                          {/* Game Image */}
                          {game.background_image ? (
                            <Image
                              src={game.background_image}
                              alt={game.name}
                              height="120px"
                              objectFit="cover"
                              width="100%"
                              borderTopRadius="md"
                            />
                          ) : (
                            <Box
                              height="120px"
                              bg="gray.700"
                              borderTopRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <IoGameControllerOutline
                                size={32}
                                color="gray.400"
                              />
                            </Box>
                          )}

                          {/* Game Info */}
                          <Box p={3}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              noOfLines={2}
                              title={game.name}
                            >
                              {game.name}
                            </Text>
                            {game.metacritic && (
                              <Text fontSize="xs" color="green.500" mt={1}>
                                Score: {game.metacritic}
                              </Text>
                            )}
                          </Box>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Favorite Games Section */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={4}>
                <HStack justify="space-between" w="100%">
                  <Text fontSize="lg" fontWeight="semibold">
                    Favorite Games
                  </Text>
                  {favorites.length > 6 && (
                    <Button size="sm" variant="ghost" colorScheme="purple">
                      View All ({favorites.length})
                    </Button>
                  )}
                </HStack>
                <Divider />

                {favorites.length === 0 ? (
                  <Box textAlign="center" py={8} w="100%">
                    <FiHeart size={48} color="gray.300" />
                    <Text color="gray.500" fontSize="lg" mt={4}>
                      No favorite games yet
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      Heart games you love to add them to your favorites!
                    </Text>
                  </Box>
                ) : (
                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 6 }}
                    spacing={4}
                    w="100%"
                  >
                    {favorites.slice(0, 6).map((game) => (
                      <Card
                        key={game.id}
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        position="relative"
                        _hover={{
                          transform: "scale(1.02)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <CardBody p={0}>
                          {/* Remove from favorites button */}
                          <IconButton
                            aria-label="Remove from favorites"
                            icon={<FaHeart color="#E53E3E" />}
                            position="absolute"
                            top={2}
                            right={2}
                            zIndex={2}
                            size="sm"
                            bg="blackAlpha.600"
                            _hover={{ bg: "blackAlpha.800" }}
                            borderRadius="full"
                            isLoading={isLoading}
                            onClick={() =>
                              handleRemoveFavorite(game.id, game.name)
                            }
                          />

                          {/* Game Image */}
                          {game.background_image ? (
                            <Image
                              src={game.background_image}
                              alt={game.name}
                              height="120px"
                              objectFit="cover"
                              width="100%"
                              borderTopRadius="md"
                            />
                          ) : (
                            <Box
                              height="120px"
                              bg="gray.700"
                              borderTopRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <IoGameControllerOutline
                                size={32}
                                color="gray.400"
                              />
                            </Box>
                          )}

                          {/* Game Info */}
                          <Box p={3}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              noOfLines={2}
                              title={game.name}
                            >
                              {game.name}
                            </Text>
                          </Box>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Container>
    </Box>
  );
};

export default UserDashboard;
