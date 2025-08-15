import {
  HStack,
  Switch,
  Text,
  useColorMode,
  Icon,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSun, BsMoon } from "react-icons/bs";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <HStack spacing={3}>
      <Icon
        as={BsSun}
        color={colorMode === "light" ? "orange.400" : "gray.400"}
      />
      <Switch
        colorScheme="purple"
        size="lg"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      <Icon
        as={BsMoon}
        color={colorMode === "dark" ? "blue.400" : "gray.400"}
      />
      <Text
        whiteSpace="nowrap"
        fontSize="sm"
        fontWeight="medium"
        color={textColor}
        display={{ base: "none", md: "block" }}
      >
        {colorMode === "dark" ? "Dark" : "Light"}
      </Text>
    </HStack>
  );
};

export default ColorModeSwitch;
