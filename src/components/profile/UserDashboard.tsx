import React from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Icon,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { FiHeart, FiCalendar, FiEdit3 } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { useAuth } from "../../hooks/useAuth";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!user) {
    return null;
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="1200px">
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="lg">
            <CardBody>
              <HStack spacing={6} align="start">
                <Avatar
                  size="xl"
                  name={user.displayName}
                  src={user.profileImage}
                  border="4px"
                  borderColor="purple.400"
                />
                <VStack align="start" spacing={3} flex={1}>
                  <HStack justify="space-between" w="100%">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold">
                        {user.displayName}
                      </Text>
                      <Text fontSize="md" color="gray.500">
                        @{user.username}
                      </Text>
                      <HStack spacing={4}>
                        <HStack spacing={1}>
                          <Icon as={FiCalendar} color="gray.400" />
                          <Text fontSize="sm" color="gray.500">
                            Member since {memberSince}
                          </Text>
                        </HStack>
                        <Badge colorScheme="purple" variant="subtle">
                          Gamer
                        </Badge>
                      </HStack>
                    </VStack>
                    <Button
                      leftIcon={<Icon as={FiEdit3} />}
                      colorScheme="purple"
                      variant="outline"
                      size="sm"
                    >
                      Edit Profile
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack>
                    <Icon as={FiHeart} color="red.400" boxSize={5} />
                    <StatLabel>Favorite Games</StatLabel>
                  </HStack>
                  <StatNumber color="red.400">
                    {user.favoriteGames?.length || 0}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack>
                    <Icon
                      as={IoGameControllerOutline}
                      color="blue.400"
                      boxSize={5}
                    />
                    <StatLabel>Games Played</StatLabel>
                  </HStack>
                  <StatNumber color="blue.400">0</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack>
                    <Icon as={FiCalendar} color="green.400" boxSize={5} />
                    <StatLabel>Days Active</StatLabel>
                  </HStack>
                  <StatNumber color="green.400">
                    {Math.ceil(
                      (Date.now() - new Date(user.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Recent Activity Section */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={4}>
                <Text fontSize="lg" fontWeight="semibold">
                  Recent Activity
                </Text>
                <Divider />
                <Box textAlign="center" py={8}>
                  <Icon
                    as={IoGameControllerOutline}
                    boxSize={12}
                    color="gray.300"
                    mb={4}
                  />
                  <Text color="gray.500" fontSize="lg">
                    No recent activity
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    Start exploring games to see your activity here!
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Favorite Games Section */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={4}>
                <HStack justify="space-between" w="100%">
                  <Text fontSize="lg" fontWeight="semibold">
                    Favorite Games
                  </Text>
                  <Button size="sm" variant="ghost" colorScheme="purple">
                    View All
                  </Button>
                </HStack>
                <Divider />
                <Box textAlign="center" py={8}>
                  <Icon as={FiHeart} boxSize={12} color="gray.300" mb={4} />
                  <Text color="gray.500" fontSize="lg">
                    No favorite games yet
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    Heart games you love to add them to your favorites!
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default UserDashboard;
