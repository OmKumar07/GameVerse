import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Skeleton,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { Platform } from "../hooks/useGames";
import usePlatforms from "../hooks/usePlatforms";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BsController } from "react-icons/bs";

interface Props {
  onSelectPlatform: (platform: Platform) => void;
  selectedPlatform?: Platform | null;
}

const PlatformSelector = ({ onSelectPlatform, selectedPlatform }: Props) => {
  const { data, error, isLoading, refetch } = usePlatforms();
  const bgColor = useColorModeValue("white", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (error) {
    return (
      <Button
        onClick={() => refetch()}
        variant="outline"
        colorScheme="red"
        size="md"
        leftIcon={<Icon as={BsController as any} />}
        height="44px"
      >
        Retry Platforms
      </Button>
    );
  }

  if (isLoading)
    return (
      <Skeleton
        height={{ base: "36px", md: "44px" }}
        width={{ base: "120px", sm: "140px", md: "180px" }}
        borderRadius="lg"
      />
    );

  const platforms =
    data?.results && Array.isArray(data.results) ? data.results : [];

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<Icon as={BsController as any} />}
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        _hover={{ bg: hoverColor }}
        _active={{ bg: hoverColor }}
        borderRadius="lg"
        height={{ base: "36px", sm: "40px", md: "44px" }}
        minW={{ base: "100px", sm: "120px", md: "160px" }}
        maxW={{ base: "140px", sm: "180px", md: "none" }}
        justifyContent="space-between"
        textAlign="left"
        fontWeight="normal"
        fontSize={{ base: "xs", sm: "sm", md: "md" }}
      >
        <Text isTruncated>{selectedPlatform?.name || "All Platforms"}</Text>
      </MenuButton>
      <MenuList
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        shadow="xl"
        maxH="300px"
        overflowY="auto"
      >
        <MenuItem
          onClick={() => onSelectPlatform({} as Platform)}
          _hover={{ bg: hoverColor }}
          fontWeight={!selectedPlatform ? "bold" : "normal"}
        >
          <Icon as={BsController as any} mr={3} />
          All Platforms
        </MenuItem>
        {platforms.map((platform: Platform) => (
          <MenuItem
            key={platform.id}
            onClick={() => onSelectPlatform(platform)}
            _hover={{ bg: hoverColor }}
            fontWeight={
              selectedPlatform?.id === platform.id ? "bold" : "normal"
            }
          >
            <Icon as={BsController as any} mr={3} />
            {platform.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default PlatformSelector;
