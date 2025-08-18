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
  gameCount?: number;
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
        <Skeleton height="48px" width="300px" borderRadius="md" mb={2} />
        <Skeleton height="24px" width="200px" borderRadius="md" />
      </Box>
    );
  }

  const filters = [];
  if (platformName) filters.push(platformName);
  if (genreName) filters.push(genreName);

  return (
    <Box mb={{ base: 4, md: 6 }}>
      <HStack align="baseline" spacing={4} wrap="wrap" mb={2}>
        <Heading
          as="h1"
          fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight="bold"
          color={textColor}
          lineHeight="shorter"
        >
          {filters.length > 0 ? `${filters.join(" ")} Games` : "Discover Games"}
        </Heading>

        {filters.length > 0 && (
          <HStack spacing={2} flexWrap="wrap">
            {filters.map((filter, index) => (
              <Badge
                key={index}
                colorScheme={badgeColorScheme}
                variant="subtle"
                fontSize={{ base: "xs", md: "sm" }}
                px={{ base: 2, md: 3 }}
                py={1}
                borderRadius="full"
              >
                {filter}
              </Badge>
            ))}
          </HStack>
        )}
      </HStack>

      {filters.length > 0 ? (
        <Text
          fontSize={{ base: "sm", md: "md" }}
          color="gray.500"
          mt={1}
          fontWeight="medium"
        >
          Filtered by {filters.join(" • ")} 🎮
        </Text>
      ) : (
        <Text
          fontSize={{ base: "sm", md: "md" }}
          color="gray.500"
          mt={1}
          fontWeight="medium"
        >
          Explore the latest and greatest games 🎮
        </Text>
      )}
    </Box>
  );
};

export default GameHeading;
