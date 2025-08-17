import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Grid,
  GridItem,
  Heading,
  Divider,
  SimpleGrid,
  Link,
  Button,
  IconButton,
  useToast,
  Tooltip,
  useColorModeValue,
  Flex,
  Icon,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Game } from "@/hooks/useGames";
import { FaHeart, FaPlay, FaCheck, FaExternalLinkAlt, FaCalendarAlt, FaStar, FaGamepad } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { usePlayedGames } from "@/hooks/usePlayedGames";
import { useGameDetails } from "@/hooks/useGameDetails";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";

interface Props {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

const GameDetailsModal: React.FC<Props> = ({ game, isOpen, onClose }) => {
  const {
    gameDetails,
    screenshots,
    isLoading,
    screenshotsLoading,
    error,
    fetchGameDetails,
    fetchScreenshots,
    clearGameDetails,
  } = useGameDetails();
  
  const { isAuthenticated } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites, isLoading: favLoading } = useFavorites();
  const { isPlayed, addToPlayed, isLoading: playedLoading } = usePlayedGames();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    if (isOpen && game.id) {
      fetchGameDetails(game.id);
      fetchScreenshots(game.id);
    } else if (!isOpen) {
      clearGameDetails();
    }
  }, [isOpen, game.id]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add favorites",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isFavorite(game.id)) {
        await removeFromFavorites(game.id);
        toast({
          title: "Removed from favorites",
          description: `${game.name} has been removed from your favorites`,
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await addToFavorites(game);
        toast({
          title: "Added to favorites",
          description: `${game.name} has been added to your favorites`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePlayedClick = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to track played games",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addToPlayed(game);
      toast({
        title: "Added to played games",
        description: `${game.name} has been marked as played`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as played",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getESRBColor = (rating?: string) => {
    switch (rating?.toLowerCase()) {
      case "everyone": return "green";
      case "everyone 10+": return "blue";
      case "teen": return "yellow";
      case "mature 17+": return "orange";
      case "adults only 18+": return "red";
      default: return "gray";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} maxW="90vw" maxH="90vh">
        <ModalHeader>
          <HStack justify="space-between" align="center">
            <Heading size="lg" noOfLines={1}>
              {game.name}
            </Heading>
            <HStack spacing={2}>
              <Tooltip label={isFavorite(game.id) ? "Remove from favorites" : "Add to favorites"}>
                <IconButton
                  aria-label="Toggle favorite"
                  icon={isFavorite(game.id) ? <FaHeart color="#E53E3E" /> : <FaHeart color="gray" />}
                  variant="ghost"
                  size="lg"
                  isLoading={favLoading}
                  onClick={handleFavoriteClick}
                />
              </Tooltip>
              <Tooltip label="Mark as played">
                <IconButton
                  aria-label="Mark as played"
                  icon={isPlayed(game.id) ? <FaCheck color="#38A169" /> : <FaPlay color="gray" />}
                  variant="ghost"
                  size="lg"
                  isLoading={playedLoading}
                  onClick={handlePlayedClick}
                />
              </Tooltip>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          {isLoading ? (
            <Flex justify="center" align="center" minH="400px">
              <VStack spacing={4}>
                <Spinner size="xl" />
                <Text>Loading game details...</Text>
              </VStack>
            </Flex>
          ) : gameDetails ? (
            <VStack spacing={6} align="stretch">
              {/* Hero Section */}
              <Box position="relative" borderRadius="lg" overflow="hidden">
                <Image
                  src={gameDetails.background_image || game.background_image}
                  alt={gameDetails.name}
                  w="100%"
                  h="300px"
                  objectFit="cover"
                  fallback={
                    <Flex align="center" justify="center" h="300px" bg="gray.100">
                      <IoGameControllerOutline size={64} color="gray" />
                    </Flex>
                  }
                />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  bg="linear-gradient(transparent, rgba(0,0,0,0.8))"
                  p={4}
                >
                  <HStack justify="space-between" align="end">
                    <VStack align="start" spacing={1}>
                      <HStack spacing={2}>
                        <CriticScore score={gameDetails.metacritic} />
                        {gameDetails.esrb_rating && (
                          <Badge colorScheme={getESRBColor(gameDetails.esrb_rating.name)}>
                            {gameDetails.esrb_rating.name}
                          </Badge>
                        )}
                      </HStack>
                      <PlatformIconList platforms={game.parent_platforms?.map(p => p.platform) || []} />
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <HStack>
                        <Icon as={FaStar} color="yellow.400" />
                        <Text color="white" fontWeight="bold">
                          {gameDetails.rating.toFixed(1)}/5
                        </Text>
                        <Text color="gray.300" fontSize="sm">
                          ({gameDetails.ratings_count.toLocaleString()} ratings)
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              </Box>

              {/* Main Content Grid */}
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                {/* Left Column - Description and Screenshots */}
                <GridItem>
                  <VStack spacing={6} align="stretch">
                    {/* Description */}
                    <Box>
                      <Heading size="md" mb={3}>About</Heading>
                      <Text color={textColor} lineHeight="tall">
                        {gameDetails.description_raw || "No description available."}
                      </Text>
                    </Box>

                    {/* Screenshots */}
                    {screenshots.length > 0 && (
                      <Box>
                        <Heading size="md" mb={3}>Screenshots</Heading>
                        {screenshotsLoading ? (
                          <Spinner />
                        ) : (
                          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                            {screenshots.map((screenshot) => (
                              <Image
                                key={screenshot.id}
                                src={screenshot.image}
                                alt="Game screenshot"
                                borderRadius="md"
                                cursor="pointer"
                                transition="transform 0.2s"
                                _hover={{ transform: "scale(1.05)" }}
                                h="120px"
                                w="100%"
                                objectFit="cover"
                              />
                            ))}
                          </SimpleGrid>
                        )}
                      </Box>
                    )}

                    {/* Tags */}
                    {gameDetails.tags && gameDetails.tags.length > 0 && (
                      <Box>
                        <Heading size="md" mb={3}>Tags</Heading>
                        <Wrap>
                          {gameDetails.tags.slice(0, 15).map((tag) => (
                            <WrapItem key={tag.id}>
                              <Badge variant="subtle" colorScheme="blue">
                                {tag.name}
                              </Badge>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    )}
                  </VStack>
                </GridItem>

                {/* Right Column - Game Info */}
                <GridItem>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} border="1px" borderColor={borderColor} borderRadius="lg">
                      <VStack spacing={3} align="stretch">
                        {/* Release Date */}
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={FaCalendarAlt} color="gray.500" />
                            <Text fontWeight="semibold">Release Date:</Text>
                          </HStack>
                          <Text color={textColor}>{formatDate(gameDetails.released)}</Text>
                        </HStack>

                        <Divider />

                        {/* Playtime */}
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={FaGamepad} color="gray.500" />
                            <Text fontWeight="semibold">Playtime:</Text>
                          </HStack>
                          <Text color={textColor}>
                            {gameDetails.playtime ? `${gameDetails.playtime} hours` : "N/A"}
                          </Text>
                        </HStack>

                        <Divider />

                        {/* Genres */}
                        {gameDetails.genres && gameDetails.genres.length > 0 && (
                          <>
                            <VStack align="stretch" spacing={2}>
                              <Text fontWeight="semibold">Genres:</Text>
                              <Wrap>
                                {gameDetails.genres.map((genre) => (
                                  <WrapItem key={genre.id}>
                                    <Badge colorScheme="purple">{genre.name}</Badge>
                                  </WrapItem>
                                ))}
                              </Wrap>
                            </VStack>
                            <Divider />
                          </>
                        )}

                        {/* Platforms */}
                        {gameDetails.platforms && gameDetails.platforms.length > 0 && (
                          <>
                            <VStack align="stretch" spacing={2}>
                              <Text fontWeight="semibold">Platforms:</Text>
                              <Wrap>
                                {gameDetails.platforms.map((platform) => (
                                  <WrapItem key={platform.platform.id}>
                                    <Badge variant="outline">{platform.platform.name}</Badge>
                                  </WrapItem>
                                ))}
                              </Wrap>
                            </VStack>
                            <Divider />
                          </>
                        )}

                        {/* Developers */}
                        {gameDetails.developers && gameDetails.developers.length > 0 && (
                          <>
                            <VStack align="stretch" spacing={2}>
                              <Text fontWeight="semibold">Developers:</Text>
                              <Text color={textColor} fontSize="sm">
                                {gameDetails.developers.map(dev => dev.name).join(", ")}
                              </Text>
                            </VStack>
                            <Divider />
                          </>
                        )}

                        {/* Publishers */}
                        {gameDetails.publishers && gameDetails.publishers.length > 0 && (
                          <VStack align="stretch" spacing={2}>
                            <Text fontWeight="semibold">Publishers:</Text>
                            <Text color={textColor} fontSize="sm">
                              {gameDetails.publishers.map(pub => pub.name).join(", ")}
                            </Text>
                          </VStack>
                        )}
                      </VStack>
                    </Box>

                    {/* External Links */}
                    <VStack spacing={2}>
                      {gameDetails.website && (
                        <Button
                          as={Link}
                          href={gameDetails.website}
                          isExternal
                          leftIcon={<FaExternalLinkAlt />}
                          colorScheme="blue"
                          variant="outline"
                          w="100%"
                        >
                          Official Website
                        </Button>
                      )}
                      {gameDetails.metacritic_url && (
                        <Button
                          as={Link}
                          href={gameDetails.metacritic_url}
                          isExternal
                          leftIcon={<FaExternalLinkAlt />}
                          colorScheme="yellow"
                          variant="outline"
                          w="100%"
                        >
                          Metacritic Reviews
                        </Button>
                      )}
                      {gameDetails.reddit_url && (
                        <Button
                          as={Link}
                          href={gameDetails.reddit_url}
                          isExternal
                          leftIcon={<FaExternalLinkAlt />}
                          colorScheme="orange"
                          variant="outline"
                          w="100%"
                        >
                          Reddit Community
                        </Button>
                      )}
                    </VStack>
                  </VStack>
                </GridItem>
              </Grid>
            </VStack>
          ) : (
            <Flex justify="center" align="center" minH="400px">
              <VStack spacing={4}>
                <IoGameControllerOutline size={64} color="gray" />
                <Text color={textColor}>Failed to load game details</Text>
                <Button onClick={() => fetchGameDetails(game.id)}>Try Again</Button>
              </VStack>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GameDetailsModal;
