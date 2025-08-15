import { Input, InputGroup, Icon, Box } from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { useRef } from "react";

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

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
          borderRadius={20}
          placeholder="Search games..."
          variant="outline"
          paddingLeft={10}
        />
        <Icon
          as={BsSearch}
          color="gray.500"
          position="absolute"
          left={3}
          top="50%"
          transform="translateY(-50%)"
        />
      </Box>
    </form>
  );
};

export default SearchInput;
