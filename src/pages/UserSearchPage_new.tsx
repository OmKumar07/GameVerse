import { Container, VStack, Heading, Text, Box } from "@chakra-ui/react";
import UserSearchComponent from "../components/search/UserSearchComponent";

const UserSearchPage = () => {
  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            Discover Users
          </Heading>
          <Text color="gray.600">
            Find other gamers, explore their profiles, and discover new games
            through their lists
          </Text>
        </Box>

        {/* Search Component */}
        <UserSearchComponent />
      </VStack>
    </Container>
  );
};

export default UserSearchPage;
