import { Input, Icon, Box, useColorModeValue } from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { useRef } from "react";

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const focusBgColor = useColorModeValue("white", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const focusBorderColor = useColorModeValue("purple.400", "purple.300");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (ref.current) {
      onSearch(ref.current.value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box position="relative">
        <Input
          ref={ref}
          borderRadius="xl"
          placeholder="Search for games..."
          variant="filled"
          bg={bgColor}
          _focus={{
            bg: focusBgColor,
            borderColor: focusBorderColor,
            boxShadow: `0 0 0 1px ${focusBorderColor}`,
          }}
          _hover={{
            bg: focusBgColor,
          }}
          paddingLeft={12}
          fontSize="md"
          height="44px"
          transition="all 0.2s"
        />
        <Icon
          as={BsSearch}
          color="gray.400"
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
        />
      </Box>
    </form>
  );
};

export default SearchInput;
