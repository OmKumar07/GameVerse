import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  useColorModeValue,
  Icon,
  Flex,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import {
  FaGamepad,
  FaUsers,
  FaHeart,
  FaSearch,
  FaStar,
  FaPlay,
  FaList,
} from "react-icons/fa";
import { MdGames, MdExplore, MdLibraryBooks } from "react-icons/md";
import logo from "../assets/logo.webp";

interface HeroPageProps {
  onEnterApp: () => void;
}

const HeroPage = ({ onEnterApp }: HeroPageProps) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const shadowColor = useColorModeValue("md", "dark-lg");

  const features = [
    {
      icon: FaSearch,
      title: "Discover Games",
      description: "Find your next favorite game from thousands of titles",
    },
    {
      icon: FaList,
      title: "Manage Lists",
      description: "Create custom lists to organize your gaming collection",
    },
    {
      icon: FaHeart,
      title: "Track Favorites",
      description: "Keep track of games you love and want to play",
    },
    {
      icon: FaUsers,
      title: "Connect with Gamers",
      description: "Discover other gamers and see what they're playing",
    },
    {
      icon: MdExplore,
      title: "Explore Genres",
      description: "Browse games by genre, platform, and rating",
    },
    {
      icon: FaStar,
      title: "Get Recommendations",
      description: "Discover new games based on your preferences",
    },
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Hero Section */}
      <Container maxW="6xl" pt={{ base: 8, md: 16 }} pb={{ base: 12, md: 20 }}>
        <VStack spacing={{ base: 8, md: 12 }} align="center" textAlign="center">
          {/* Logo and Title */}
          <VStack spacing={{ base: 4, md: 6 }}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: 2, sm: 3 }}
              align="center"
              justify="center"
            >
              <Image
                src={logo}
                boxSize={{ base: "60px", sm: "70px", md: "80px", lg: "100px" }}
                alt="GameVerse Logo"
                borderRadius="lg"
              />
              <Heading
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, purple.400, pink.400)"
                bgClip="text"
                lineHeight="shorter"
              >
                GameVerse
              </Heading>
            </Stack>

            <Text
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color={textColor}
              maxW={{ base: "90%", md: "2xl" }}
              lineHeight="tall"
              px={{ base: 2, md: 0 }}
            >
              Your ultimate gaming companion. Discover, organize, and track your
              favorite games all in one place.
            </Text>
          </VStack>

          {/* CTA Buttons */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: 3, sm: 4 }}
            align="center"
            w={{ base: "full", sm: "auto" }}
          >
            <Button
              size={{ base: "md", md: "lg" }}
              colorScheme="purple"
              rightIcon={<FaPlay />}
              onClick={onEnterApp}
              boxShadow={shadowColor}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
              px={{ base: 6, md: 8 }}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: "md", md: "lg" }}
              w={{ base: "full", sm: "auto" }}
              minW={{ sm: "160px" }}
            >
              Explore Games
            </Button>

            <Button
              size={{ base: "md", md: "lg" }}
              variant="outline"
              colorScheme="purple"
              rightIcon={<MdExplore />}
              onClick={onEnterApp}
              _hover={{
                transform: "translateY(-2px)",
                bg: useColorModeValue("purple.50", "purple.900"),
              }}
              transition="all 0.2s"
              px={{ base: 6, md: 8 }}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: "md", md: "lg" }}
              w={{ base: "full", sm: "auto" }}
              minW={{ sm: "160px" }}
            >
              Browse Library
            </Button>
          </Stack>

          {/* Hero Showcase */}
          <Box
            w="full"
            maxW={{ base: "100%", md: "4xl" }}
            h={{ base: "200px", sm: "250px", md: "300px", lg: "350px" }}
            bg={cardBg}
            borderRadius={{ base: "lg", md: "2xl" }}
            boxShadow={shadowColor}
            border="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
            mx={{ base: 2, md: 0 }}
          >
            <Flex
              align="center"
              justify="center"
              h="full"
              direction="column"
              p={{ base: 4, md: 8 }}
            >
              <Icon
                as={MdGames}
                boxSize={{ base: "60px", md: "80px", lg: "100px" }}
                color="purple.400"
                mb={4}
              />
              <Text
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                fontWeight="semibold"
                color={headingColor}
                textAlign="center"
              >
                Discover Amazing Games
              </Text>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color={textColor}
                textAlign="center"
                mt={2}
                display={{ base: "none", sm: "block" }}
              >
                Browse thousands of games across all platforms
              </Text>
            </Flex>
          </Box>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="6xl" py={{ base: 12, md: 16 }}>
        <VStack spacing={{ base: 10, md: 12 }}>
          <VStack spacing={{ base: 3, md: 4 }} textAlign="center">
            <Heading
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              color={headingColor}
              px={{ base: 4, md: 0 }}
            >
              Everything You Need for Gaming
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textColor}
              maxW={{ base: "90%", md: "2xl" }}
              px={{ base: 2, md: 0 }}
            >
              GameVerse provides all the tools you need to enhance your gaming
              experience
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 4, md: 6, lg: 8 }}
            w="full"
            px={{ base: 2, md: 0 }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                bg={cardBg}
                p={{ base: 6, md: 8 }}
                borderRadius={{ base: "lg", md: "xl" }}
                boxShadow={shadowColor}
                border="1px"
                borderColor={borderColor}
                textAlign="center"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.3s"
                h="full"
              >
                <Icon
                  as={feature.icon}
                  boxSize={{ base: 8, md: 10, lg: 12 }}
                  color="purple.400"
                  mb={{ base: 3, md: 4 }}
                />
                <Heading
                  size={{ base: "sm", md: "md" }}
                  mb={{ base: 2, md: 3 }}
                  color={headingColor}
                >
                  {feature.title}
                </Heading>
                <Text
                  color={textColor}
                  lineHeight="tall"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Container maxW="5xl" py={{ base: 12, md: 16 }} pb={{ base: 16, md: 20 }}>
        <Box
          bg={cardBg}
          p={{ base: 6, md: 8, lg: 12 }}
          borderRadius={{ base: "lg", md: "2xl" }}
          boxShadow={shadowColor}
          border="1px"
          borderColor={borderColor}
          textAlign="center"
          mx={{ base: 2, md: 0 }}
        >
          <VStack spacing={{ base: 4, md: 6 }}>
            <Heading
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              color={headingColor}
              px={{ base: 2, md: 0 }}
            >
              Ready to Start Your Gaming Journey?
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textColor}
              maxW={{ base: "100%", md: "xl" }}
              px={{ base: 2, md: 0 }}
            >
              Join thousands of gamers who use GameVerse to discover and
              organize their favorite games.
            </Text>
            <Button
              size={{ base: "md", md: "lg" }}
              colorScheme="purple"
              rightIcon={<FaGamepad />}
              onClick={onEnterApp}
              boxShadow={shadowColor}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
              px={{ base: 6, md: 8, lg: 10 }}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: "md", md: "lg" }}
              w={{ base: "full", sm: "auto" }}
              maxW={{ base: "280px", sm: "none" }}
            >
              Start Exploring
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroPage;
