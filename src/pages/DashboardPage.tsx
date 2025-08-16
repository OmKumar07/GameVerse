import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import UserDashboard from "../components/profile/UserDashboard";

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  if (!isAuthenticated || !user) {
    return (
      <Box
        bg={bgColor}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="md" textAlign="center">
          <VStack spacing={6}>
            <Heading size="lg" color="gray.500">
              Access Denied
            </Heading>
            <Text color="gray.400">Please sign in to view your dashboard.</Text>
            <Button colorScheme="purple" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return <UserDashboard />;
};

export default DashboardPage;
