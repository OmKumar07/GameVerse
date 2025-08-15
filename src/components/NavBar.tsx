import { Box, HStack, Image } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ui/ColorModeSwitch";
import SearchInput from "./SearchInput";

interface Props {
  onSearch: (searchText: string) => void;
}

const NavBar = ({ onSearch }: Props) => {
  return (
    <HStack padding="10px">
      <Image src={logo} boxSize="60px" alt="Logo" />
      <Box flex={1}>
        <SearchInput onSearch={onSearch} />
      </Box>
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
