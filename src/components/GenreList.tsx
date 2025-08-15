import {
  Box,
  HStack,
  Image,
  Text,
  Spinner,
  VStack,
  Button,
} from "@chakra-ui/react";
import useGenres, { Genre } from "@/hooks/useGenres";

interface Props {
  selectedGenre?: Genre;
  onSelectGenre: (genre: Genre) => void;
}

const GenreList = ({ selectedGenre, onSelectGenre }: Props) => {
  const { data, error, isLoading } = useGenres();

  if (error) return null;
  if (isLoading) return <Spinner />;

  const genres = data?.results || [];

  return (
    <VStack align="stretch" gap={3}>
      {genres.map((genre) => (
        <Box key={genre.id} py={1}>
          <HStack>
            <Image
              boxSize="32px"
              borderRadius={8}
              objectFit="cover"
              src={genre.image_background}
            />
            <Button
              variant="ghost"
              justifyContent="flex-start"
              whiteSpace="normal"
              fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
              onClick={() => onSelectGenre(genre)}
              fontSize="lg"
              width="full"
            >
              {genre.name}
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default GenreList;
