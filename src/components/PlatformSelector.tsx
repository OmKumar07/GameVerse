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
  const { data, error, isLoading } = usePlatforms();
  const bgColor = useColorModeValue("white", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (error) return null;
  if (isLoading)
    return <Skeleton height="44px" width="200px" borderRadius="lg" />;

  const platforms = Array.isArray(data?.results) ? data.results : [];

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<Icon as={BsController} />}
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        _hover={{ bg: hoverColor }}
        _active={{ bg: hoverColor }}
        borderRadius="lg"
        height="44px"
        minW="200px"
        justifyContent="space-between"
        textAlign="left"
        fontWeight="normal"
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
          <Icon as={BsController} mr={3} />
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
            <Icon as={BsController} mr={3} />
            {platform.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default PlatformSelector;
