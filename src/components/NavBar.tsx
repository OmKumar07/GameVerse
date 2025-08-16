import { Box, HStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ui/ColorModeSwitch";
import SearchInput from "./SearchInput";
import ProfileMenu from "./profile/ProfileMenu";

interface Props {
  onSearch: (searchText: string) => void;
}

const NavBar = ({ onSearch }: Props) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const shadowColor = useColorModeValue("md", "dark-lg");

  return (
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
        "rgba(255, 255, 255, 0.8)",
        "rgba(26, 32, 44, 0.8)"
      )}
    >
      <HStack
        padding="16px 24px"
        maxW="1400px"
        mx="auto"
        justify="space-between"
      >
        <HStack spacing={4}>
          <Image
            src={logo}
            boxSize="50px"
            alt="GameVerse Logo"
            borderRadius="lg"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, purple.400, pink.400)"
            bgClip="text"
            display={{ base: "none", md: "block" }}
          >
            GameVerse
          </Text>
        </HStack>

        <Box flex={1} maxW="500px" mx={8}>
          <SearchInput onSearch={onSearch} />
        </Box>

        <HStack spacing={4}>
          <ColorModeSwitch />
          <ProfileMenu />
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavBar;
