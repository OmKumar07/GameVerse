import { Game } from "@/hooks/useGames";
import { Box, Image, Heading, HStack } from "@chakra-ui/react";
import React from "react";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  return (
    <Box
      borderRadius={10}
      overflow="hidden"
      bg="gray.700"
      _hover={{
        transform: "scale(1.03)",
        transition: "transform .15s ease-in",
      }}
    >
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
  );
};

export default GameCard;
