import useGames from "@/hooks/useGames";
import {
  Box,
  SimpleGrid,
  Spinner,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameHeading from "./GameHeading";
import PlatformSelector from "./PlatformSelector";
import SortSelector from "./SortSelector";
import ErrorFallback from "./ErrorFallback";
import { Platform } from "@/hooks/useGames";
import { Genre } from "@/hooks/useGenres";

interface Props {
  selectedGenre?: Genre;
  selectedPlatform?: Platform;
  searchText?: string;
  sortOrder?: string;
  onSelectPlatform: (platform: Platform) => void;
  onSortSelect: (sortOrder: string) => void;
}

const GameGrid = ({
  selectedGenre,
  selectedPlatform,
  searchText,
  sortOrder = "",
  onSelectPlatform,
  onSortSelect,
}: Props) => {
  const gameQuery = {
    genreId: selectedGenre?.id,
    platformId: selectedPlatform?.id,
    sortOrder,
    searchText,
  };

  const {
    games,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGames(gameQuery);

  const skeletons = [1, 2, 3, 4, 5, 6];

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // Load more when 1000px from bottom
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Show error fallback if there's an error
  if (error) {
    return (
      <Box padding={{ base: "20px", md: "32px" }} maxW="1400px" mx="auto">
        <ErrorFallback
          error={error.message || "Something went wrong"}
          onRetry={() => refetch()}
          title="Unable to Load Games"
        />
      </Box>
    );
  }

  return (
    <Box padding={{ base: "20px", md: "32px" }} maxW="1400px" mx="auto">
      <GameHeading
        genreName={selectedGenre?.name}
        platformName={selectedPlatform?.name}
        isLoading={isLoading}
      />

      <HStack gap={4} marginBottom={8} flexWrap="wrap" align="center">
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelectPlatform={onSelectPlatform}
        />
        <SortSelector sortOrder={sortOrder} onSelectSortOrder={onSortSelect} />
      </HStack>

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {isLoading &&
          skeletons.map((skeleton: number) => (
            <GameCardSkeleton key={skeleton} />
          ))}
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </SimpleGrid>

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <Box display="flex" justifyContent="center" mt={8} mb={4}>
          <Spinner size="lg" color="purple.500" />
        </Box>
      )}

      {/* Load more button as fallback */}
      {hasNextPage && !isFetchingNextPage && (
        <Box display="flex" justifyContent="center" mt={8} mb={4}>
          <Button
            onClick={() => fetchNextPage()}
            colorScheme="purple"
            variant="outline"
            size="lg"
          >
            Load More Games
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GameGrid;
