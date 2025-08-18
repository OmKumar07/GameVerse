import {
  IconButton,
  useColorMode,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSun, BsMoon } from "react-icons/bs";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
      icon={<Icon as={colorMode === "light" ? BsMoon : BsSun} boxSize={4} />}
      variant="ghost"
      size="sm"
      onClick={toggleColorMode}
      color={useColorModeValue("gray.600", "gray.300")}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.700"),
        transform: "scale(1.1)",
      }}
      transition="all 0.2s"
    />
  );
};

export default ColorModeSwitch;
