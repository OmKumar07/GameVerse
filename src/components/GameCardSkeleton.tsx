import {
  Box,
  Card as ChakraCard,
  CardBody,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

const GameCardSkeleton = () => {
  return (
    <Box borderRadius={10} overflow="hidden" bg="gray.700">
      <Skeleton height="200px" />
      <Box p={5}>
        <SkeletonText />
      </Box>
    </Box>
  );
};

export default GameCardSkeleton;
