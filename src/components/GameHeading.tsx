import {
  Heading,
  Skeleton,
  Box,
  Text,
  HStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  gameCount: number;
  genreName?: string;
  platformName?: string;
  isLoading?: boolean;
}

const GameHeading = ({
  gameCount,
  genreName,
  platformName,
  isLoading,
}: Props) => {
  const textColor = useColorModeValue("gray.800", "white");
  const badgeColorScheme = useColorModeValue("purple", "purple");

  if (isLoading) {
    return (
      <Box mb={6}>
        <Skeleton height="48px" width="400px" borderRadius="md" mb={2} />
        <Skeleton height="24px" width="200px" borderRadius="md" />
      </Box>
    );
  }

  const filters = [];
  if (platformName) filters.push(platformName);
  if (genreName) filters.push(genreName);

  return (
    <Box mb={6}>
      <HStack align="baseline" spacing={4} wrap="wrap">
        <Heading
          as="h1"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
          color={textColor}
          lineHeight="shorter"
        >
          {gameCount.toLocaleString()} Games
        </Heading>

        {filters.length > 0 && (
          <HStack spacing={2} flexWrap="wrap">
            {filters.map((filter, index) => (
              <Badge
                key={index}
                colorScheme={badgeColorScheme}
                variant="subtle"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {filter}
              </Badge>
            ))}
          </HStack>
        )}
      </HStack>

      {filters.length > 0 && (
        <Text fontSize="lg" color="gray.500" mt={2} fontWeight="medium">
          Filtered by {filters.join(" • ")} 🎮
        </Text>
      )}
    </Box>
  );
};

export default GameHeading;
