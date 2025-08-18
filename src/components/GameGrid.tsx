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
      <Box
        padding={{ base: "8px", sm: "12px", md: "16px", lg: "20px", xl: "24px" }}
        maxW="1400px"
        mx="auto"
      >
        <ErrorFallback
          error={error.message || "Something went wrong"}
          onRetry={() => refetch()}
          title="Unable to Load Games"
        />
      </Box>
    );
  }

  return (
    <Box
      padding={{ base: "8px", sm: "12px", md: "16px", lg: "20px", xl: "24px" }}
      maxW="1400px"
      mx="auto"
    >
      <GameHeading
        genreName={selectedGenre?.name}
        platformName={selectedPlatform?.name}
        isLoading={isLoading}
      />

      <HStack
        gap={{ base: 2, sm: 3, md: 4 }}
        marginBottom={{ base: 4, md: 6 }}
        flexWrap="wrap"
        align="center"
        justify={{ base: "center", sm: "flex-start" }}
      >
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelectPlatform={onSelectPlatform}
        />
        <SortSelector sortOrder={sortOrder} onSelectSortOrder={onSortSelect} />
      </HStack>

      <SimpleGrid
        columns={{
          base: 1, // 1 column on mobile (320px+)
          sm: 2,   // 2 columns on small screens (480px+)
          md: 2,   // 2 columns on medium screens (768px+)  
          lg: 3,   // 3 columns on large screens (992px+)
          xl: 4,   // 4 columns on extra large screens (1280px+)
          "2xl": 5 // 5 columns on 2xl screens (1536px+)
        }}
        spacing={{ base: 3, sm: 4, md: 5, lg: 6 }}
        w="100%"
      >
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
