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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";
import { FaHeart, FaRegHeart, FaPlay, FaCheck, FaPlus } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { usePlayedGames } from "@/hooks/usePlayedGames";
import AuthModal from "./auth/AuthModal";
import GameDetailsModal from "./GameDetailsModal";
import AddToListModal from "./lists/AddToListModal";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites, isLoading } =
    useFavorites();
  const {
    isPlayed,
    addToPlayed,
    removeFromPlayed,
    isLoading: playedLoading,
  } = usePlayedGames();
  const { isOpen, onOpen, onClose } = useDisclosure(); // For auth modal
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure(); // For game details modal
  const {
    isOpen: isAddToListOpen,
    onOpen: onAddToListOpen,
    onClose: onAddToListClose,
  } = useDisclosure(); // For add to list modal
  const toast = useToast();

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const iconBg = useColorModeValue("blackAlpha.200", "blackAlpha.600");
  const iconHoverBg = useColorModeValue("blackAlpha.400", "blackAlpha.800");
  const overlayBg = useColorModeValue("blackAlpha.400", "blackAlpha.600");
  const imageFallbackBg = useColorModeValue("gray.200", "gray.600");

  const handleCardClick = () => {
    onDetailsOpen();
  };

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

  const handleAddToListClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!isAuthenticated) {
      onOpen(); // Open auth modal
      return;
    }

    onAddToListOpen();
  };

  return (
    <>
      <Box
        borderRadius={10}
        overflow="hidden"
        bg={cardBg}
        border="1px"
        borderColor={borderColor}
        position="relative"
        cursor="pointer"
        onClick={handleCardClick}
        _hover={{
          transform: "scale(1.03)",
          transition: "transform .15s ease-in",
          boxShadow: "xl",
        }}
        transition="all 0.2s"
        w="100%"
        h="100%"
      >
        {/* Action Icons */}
        <VStack
          position="absolute"
          top={{ base: 1, sm: 2, md: 3 }}
          right={{ base: 1, sm: 2, md: 3 }}
          zIndex={2}
          spacing={{ base: 1, md: 2 }}
        >
          {/* Favorite Heart Icon */}
          <Tooltip
            label={
              isFavorite(game.id) ? "Remove from favorites" : "Add to favorites"
            }
            placement="top"
            hasArrow
          >
            <IconButton
              aria-label={
                isFavorite(game.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              icon={
                isFavorite(game.id) ? (
                  <FaHeart color="#E53E3E" />
                ) : (
                  <FaRegHeart color={textColor} />
                )
              }
              size={{ base: "xs", sm: "xs", md: "sm" }}
              bg={iconBg}
              _hover={{ bg: iconHoverBg }}
              borderRadius="full"
              isLoading={isLoading}
              onClick={handleFavoriteClick}
            />
          </Tooltip>

          {/* Played Game Icon */}
          <Tooltip
            label={
              isPlayed(game.id) ? "Remove from played games" : "Mark as played"
            }
            placement="top"
            hasArrow
          >
            <IconButton
              aria-label={
                isPlayed(game.id)
                  ? "Remove from played games"
                  : "Mark as played"
              }
              icon={
                isPlayed(game.id) ? (
                  <FaCheck color="#38A169" />
                ) : (
                  <FaPlay color={textColor} />
                )
              }
              size={{ base: "xs", sm: "xs", md: "sm" }}
              bg={iconBg}
              _hover={{ bg: iconHoverBg }}
              borderRadius="full"
              isLoading={playedLoading}
              onClick={handlePlayedClick}
            />
          </Tooltip>

          {/* Add to List Icon */}
          <Tooltip label="Add to list" placement="top" hasArrow>
            <IconButton
              aria-label="Add to list"
              icon={<FaPlus color={textColor} />}
              size={{ base: "xs", sm: "xs", md: "sm" }}
              bg={iconBg}
              _hover={{ bg: iconHoverBg }}
              borderRadius="full"
              onClick={handleAddToListClick}
            />
          </Tooltip>
        </VStack>

        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            height={{ base: "140px", sm: "180px", md: "200px", lg: "220px" }}
            objectFit="cover"
            width="100%"
          />
        ) : (
          <Box
            height={{ base: "140px", sm: "180px", md: "200px", lg: "220px" }}
            bg={imageFallbackBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color={textColor} fontSize={{ base: "xs", sm: "sm", md: "md" }}>
              No Image Available
            </Text>
          </Box>
        )}
        <Box p={{ base: 2, sm: 3, md: 4, lg: 5 }}>
          <HStack
            justifyContent="space-between"
            marginBottom={{ base: 1, sm: 2, md: 3 }}
            flexWrap="wrap"
            spacing={{ base: 1, md: 3 }}
          >
            <PlatformIconList
              platforms={game.parent_platforms.map((p) => p.platform)}
            />
            <CriticScore score={game.metacritic} />
          </HStack>
          <Heading
            fontSize={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
            color={textColor}
            noOfLines={2}
            lineHeight="shorter"
          >
            {game.name}
          </Heading>
        </Box>

        {/* Click hint overlay on hover */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={overlayBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          opacity={0}
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
          borderRadius={10}
          pointerEvents="none"
        >
          <Text
            color="white"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
          >
            Click for details
          </Text>
        </Box>
      </Box>

      {/* Auth Modal for non-authenticated users */}
      <AuthModal isOpen={isOpen} onClose={onClose} initialMode="login" />

      {/* Game Details Modal */}
      <GameDetailsModal
        game={game}
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
      />

      {/* Add to List Modal */}
      <AddToListModal
        game={game}
        isOpen={isAddToListOpen}
        onClose={onAddToListClose}
      />
    </>
  );
};

export default GameCard;
