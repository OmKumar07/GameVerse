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
          borderRadius={{ base: "lg", md: "xl" }}
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
          paddingLeft={{ base: 7, sm: 8, md: 10, lg: 12 }}
          fontSize={{ base: "xs", sm: "sm", md: "md" }}
          height={{ base: "32px", sm: "36px", md: "40px", lg: "44px" }}
          transition="all 0.2s"
        />
        <Icon
          as={BsSearch as any}
          color="gray.400"
          position="absolute"
          left={{ base: 2, sm: 2.5, md: 3, lg: 4 }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          boxSize={{ base: "10px", sm: "12px", md: "14px", lg: "16px" }}
        />
      </Box>
    </form>
  );
};

export default SearchInput;
