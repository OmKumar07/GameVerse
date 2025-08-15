import { Heading, Skeleton } from "@chakra-ui/react";

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
  const heading = `${platformName || ""} ${genreName || ""} Games`;

  if (isLoading) {
    return <Skeleton height="60px" marginBottom={5} borderRadius="md" />;
  }

  return (
    <Heading as="h1" marginBottom={5} fontSize="5xl">
      {gameCount.toLocaleString()} {heading.trim()} 🎮
    </Heading>
  );
};

export default GameHeading;
