import {
  Box,
  HStack,
  Image,
  Text,
  Spinner,
  VStack,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import useGenres, { Genre } from "@/hooks/useGenres";

interface Props {
  selectedGenre?: Genre;
  onSelectGenre: (genre: Genre) => void;
}

const GenreList = ({ selectedGenre, onSelectGenre }: Props) => {
  const { data, error, isLoading, refetch } = useGenres();
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const selectedBg = useColorModeValue("purple.50", "purple.900");
  const selectedColor = useColorModeValue("purple.600", "purple.200");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.700", "gray.200");

  if (error) {
    return (
      <Box p={6} textAlign="center">
        <Text color="red.500" mb={4} fontSize="sm">
          Failed to load genres
        </Text>
        <Button
          onClick={() => refetch()}
          colorScheme="purple"
          variant="outline"
          size="sm"
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="lg" color="purple.500" />
      </Box>
    );

  const genres = data?.results || [];

  return (
    <Box>
      <Heading
        size={{ base: "sm", md: "md" }}
        mb={{ base: 4, md: 6 }}
        color={headingColor}
        fontWeight="semibold"
      >
        🎮 Genres
      </Heading>

      <VStack align="stretch" spacing={1}>
        {/* All Games option */}
        <Button
          variant="ghost"
          justifyContent="flex-start"
          p={{ base: 2, md: 3 }}
          h="auto"
          borderRadius="lg"
          bg={!selectedGenre ? selectedBg : "transparent"}
          color={!selectedGenre ? selectedColor : textColor}
          _hover={{ bg: !selectedGenre ? selectedBg : hoverBg }}
          onClick={() => onSelectGenre({} as Genre)}
          fontWeight={!selectedGenre ? "semibold" : "medium"}
          transition="all 0.2s"
        >
          <HStack spacing={{ base: 2, md: 3 }} w="full">
            <Box
              w={{ base: "28px", md: "32px" }}
              h={{ base: "28px", md: "32px" }}
              borderRadius="md"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: "14px", md: "16px" }}
            >
              🎯
            </Box>
            <Text fontSize={{ base: "sm", md: "sm" }} flex={1} textAlign="left">
              All Games
            </Text>
          </HStack>
        </Button>

        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant="ghost"
            justifyContent="flex-start"
            p={{ base: 2, md: 3 }}
            h="auto"
            borderRadius="lg"
            bg={selectedGenre?.id === genre.id ? selectedBg : "transparent"}
            color={selectedGenre?.id === genre.id ? selectedColor : textColor}
            _hover={{
              bg: selectedGenre?.id === genre.id ? selectedBg : hoverBg,
            }}
            onClick={() => onSelectGenre(genre)}
            fontWeight={selectedGenre?.id === genre.id ? "semibold" : "medium"}
            transition="all 0.2s"
          >
            <HStack spacing={{ base: 2, md: 3 }} w="full">
              <Image
                boxSize={{ base: "28px", md: "32px" }}
                borderRadius="md"
                objectFit="cover"
                src={genre.image_background}
                fallback={
                  <Box
                    w={{ base: "28px", md: "32px" }}
                    h={{ base: "28px", md: "32px" }}
                    borderRadius="md"
                    bg="gray.300"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={{ base: "12px", md: "14px" }}
                  >
                    🎮
                  </Box>
                }
              />
              <Text
                fontSize={{ base: "sm", md: "sm" }}
                flex={1}
                textAlign="left"
                isTruncated
              >
                {genre.name}
              </Text>
            </HStack>
          </Button>
        ))}
      </VStack>
    </Box>
  );
};

export default GenreList;
