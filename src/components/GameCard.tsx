import { Game } from "@/hooks/useGames";
import {
  Box,
  Image,
  Heading,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";
import { FaHeart, FaRegHeart, FaPlay, FaCheck } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { usePlayedGames } from "@/hooks/usePlayedGames";
import AuthModal from "./auth/AuthModal";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites, isLoading } =
    useFavorites();
  const { isPlayed, addToPlayed, removeFromPlayed, isLoading: playedLoading } =
    usePlayedGames();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!isAuthenticated) {
      onOpen(); // Open auth modal
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
        description: "Failed to update favorites. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePlayedClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!isAuthenticated) {
      onOpen(); // Open auth modal
      return;
    }

    try {
      if (isPlayed(game.id)) {
        await removeFromPlayed(game.id);
        toast({
          title: "Removed from played games",
          description: `${game.name} has been removed from your played games`,
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await addToPlayed(game, "completed");
        toast({
          title: "Marked as played",
          description: `${game.name} has been marked as played`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update played games. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        borderRadius={10}
        overflow="hidden"
        bg="gray.700"
        position="relative"
        _hover={{
          transform: "scale(1.03)",
          transition: "transform .15s ease-in",
        }}
      >
        {/* Action Icons */}
        <VStack position="absolute" top={3} right={3} zIndex={2} spacing={2}>
          {/* Favorite Heart Icon */}
          <Tooltip
            label={isFavorite(game.id) ? "Remove from favorites" : "Add to favorites"}
            placement="top"
            hasArrow
          >
            <IconButton
              aria-label={
                isFavorite(game.id) ? "Remove from favorites" : "Add to favorites"
              }
              icon={
                isFavorite(game.id) ? (
                  <FaHeart color="#E53E3E" />
                ) : (
                  <FaRegHeart color="white" />
                )
              }
              size="sm"
              bg="blackAlpha.600"
              _hover={{ bg: "blackAlpha.800" }}
              borderRadius="full"
              isLoading={isLoading}
              onClick={handleFavoriteClick}
            />
          </Tooltip>

          {/* Played Game Icon */}
          <Tooltip
            label={isPlayed(game.id) ? "Remove from played games" : "Mark as played"}
            placement="top"
            hasArrow
          >
            <IconButton
              aria-label={isPlayed(game.id) ? "Remove from played games" : "Mark as played"}
              icon={
                isPlayed(game.id) ? (
                  <FaCheck color="#38A169" />
                ) : (
                  <FaPlay color="white" />
                )
              }
              size="sm"
              bg="blackAlpha.600"
              _hover={{ bg: "blackAlpha.800" }}
              borderRadius="full"
              isLoading={playedLoading}
              onClick={handlePlayedClick}
            />
          </Tooltip>
        </VStack>

        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            height="200px"
            objectFit="cover"
            width="100%"
          />
        ) : (
          <Box height="200px" bg="gray.700" />
        )}
        <Box p={5}>
          <HStack justifyContent="space-between" marginBottom={3}>
            <PlatformIconList
              platforms={game.parent_platforms.map((p) => p.platform)}
            />
            <CriticScore score={game.metacritic} />
          </HStack>
          <Heading fontSize="2xl">{game.name}</Heading>
        </Box>
      </Box>

      {/* Auth Modal for non-authenticated users */}
      <AuthModal isOpen={isOpen} onClose={onClose} initialMode="login" />
    </>
  );
};

export default GameCard;
