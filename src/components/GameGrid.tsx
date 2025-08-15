import useGames from "@/hooks/useGames";
import { Box, SimpleGrid, Spinner, Text, HStack } from "@chakra-ui/react";
import React from "react";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import GameHeading from "./GameHeading";
import PlatformSelector from "./PlatformSelector";
import SortSelector from "./SortSelector";
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

  const { games, error, isLoading } = useGames(gameQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];

  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box padding="10px">
      <GameHeading
        gameCount={games.length}
        genreName={selectedGenre?.name}
        platformName={selectedPlatform?.name}
        isLoading={isLoading}
      />

      <HStack gap={5} marginBottom={5}>
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelectPlatform={onSelectPlatform}
        />
        <SortSelector sortOrder={sortOrder} onSelectSortOrder={onSortSelect} />
      </HStack>

      {isLoading && (
        <Box padding="10">
          <Spinner size="xl" />
        </Box>
      )}

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {isLoading &&
          skeletons.map((skeleton: number) => (
            <GameCardSkeleton key={skeleton} />
          ))}
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default GameGrid;
