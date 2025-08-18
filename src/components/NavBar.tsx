import {
  Box,
  HStack,
  VStack,
  Image,
  Text,
  useColorModeValue,
  Button,
  ButtonGroup,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ui/ColorModeSwitch";
import SearchInput from "./SearchInput";
import ProfileMenu from "./profile/ProfileMenu";

interface Props {
  onSearch: (searchText: string) => void;
}

const NavBar = ({ onSearch }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const shadowColor = useColorModeValue("md", "dark-lg");
  const mobileMenuBg = useColorModeValue("white", "gray.800");

  const handleNavigateHome = () => {
    // Navigate to homepage
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleNavigateDashboard = () => {
    // Navigate to dashboard
    window.history.pushState({}, "", "/dashboard");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleNavigateUsers = () => {
    // Navigate to user search
    window.history.pushState({}, "", "/users");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <Box
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        shadow={shadowColor}
        position="sticky"
        top={0}
        zIndex={10}
        backdropFilter="blur(10px)"
        backgroundColor={useColorModeValue(
          "rgba(255, 255, 255, 0.95)",
          "rgba(26, 32, 44, 0.95)"
        )}
      >
        {/* Desktop and Mobile Layout */}
        <Flex
          padding={{
            base: "6px 8px",
            sm: "8px 12px",
            md: "12px 16px",
            lg: "16px 24px",
          }}
          maxW="1400px"
          mx="auto"
          align="center"
          minH={{ base: "48px", sm: "52px", md: "56px", lg: "64px" }}
        >
          {/* Logo Section */}
          <HStack
            spacing={{ base: 1.5, sm: 2, md: 3 }}
            cursor="pointer"
            onClick={handleNavigateHome}
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
            minW="fit-content"
          >
            <Image
              src={logo}
              boxSize={{ base: "28px", sm: "32px", md: "40px", lg: "50px" }}
              alt="GameVerse Logo"
              borderRadius="lg"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            />
            <Text
              fontSize={{ base: "md", sm: "lg", md: "xl", lg: "2xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, purple.400, pink.400)"
              bgClip="text"
              display={{ base: "none", sm: "block" }}
              whiteSpace="nowrap"
            >
              GameVerse
            </Text>
          </HStack>

          {/* Search Section - Responsive */}
          <Box
            flex={1}
            maxW={{ base: "none", md: "500px" }}
            mx={{ base: 1.5, sm: 2, md: 3, lg: 6 }}
            minW={{ base: "80px", sm: "120px", md: "180px" }}
          >
            <SearchInput onSearch={onSearch} />
          </Box>

          {/* Desktop Navigation */}
          <HStack
            spacing={3}
            display={{ base: "none", lg: "flex" }}
            minW="fit-content"
          >
            <ButtonGroup size="sm" variant="ghost" spacing={1}>
              <Button onClick={handleNavigateHome} px={3}>
                Games
              </Button>
              <Button onClick={handleNavigateUsers} px={3}>
                Users
              </Button>
              <Button onClick={handleNavigateDashboard} px={3}>
                Dashboard
              </Button>
            </ButtonGroup>
            <ColorModeSwitch />
            <ProfileMenu />
          </HStack>

          {/* Mobile Navigation */}
          <HStack
            spacing={{ base: 0.5, sm: 1, md: 2 }}
            display={{ base: "flex", lg: "none" }}
            minW="fit-content"
          >
            <ColorModeSwitch />
            <ProfileMenu />
            <IconButton
              aria-label="Open navigation menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              size="sm"
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer Menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={mobileMenuBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text fontWeight="bold">Navigation</Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  handleNavigateHome();
                  onClose();
                }}
                size="lg"
              >
                🎮 Games
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  handleNavigateUsers();
                  onClose();
                }}
                size="lg"
              >
                👥 Users
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  handleNavigateDashboard();
                  onClose();
                }}
                size="lg"
              >
                📊 Dashboard
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavBar;
