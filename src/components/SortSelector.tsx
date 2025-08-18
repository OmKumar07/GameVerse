import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BsSortDown } from "react-icons/bs";

interface Props {
  onSelectSortOrder: (sortOrder: string) => void;
  sortOrder: string;
}

interface SortOption {
  value: string;
  label: string;
  icon: string;
}

const SortSelector = ({ onSelectSortOrder, sortOrder }: Props) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const sortOrders: SortOption[] = [
    { value: "", label: "Relevance", icon: "🎯" },
    { value: "-added", label: "Date Added", icon: "📅" },
    { value: "name", label: "Name", icon: "🔤" },
    { value: "-released", label: "Release Date", icon: "🗓️" },
    { value: "-metacritic", label: "Popularity", icon: "🔥" },
    { value: "-rating", label: "Rating", icon: "⭐" },
  ];

  const currentSortOrder =
    sortOrders.find((order) => order.value === sortOrder) || sortOrders[0];

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<Icon as={BsSortDown as any} />}
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        _hover={{ bg: hoverColor }}
        _active={{ bg: hoverColor }}
        borderRadius="lg"
        height={{ base: "36px", sm: "40px", md: "44px" }}
        minW={{ base: "90px", sm: "110px", md: "140px" }}
        maxW={{ base: "130px", sm: "160px", md: "none" }}
        justifyContent="space-between"
        textAlign="left"
        fontWeight="normal"
        fontSize={{ base: "xs", sm: "sm", md: "md" }}
      >
        <Text isTruncated>
          {currentSortOrder.icon} {currentSortOrder.label}
        </Text>
      </MenuButton>
      <MenuList
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        shadow="xl"
      >
        {sortOrders.map((order) => (
          <MenuItem
            key={order.value}
            onClick={() => onSelectSortOrder(order.value)}
            _hover={{ bg: hoverColor }}
            fontWeight={sortOrder === order.value ? "bold" : "normal"}
          >
            <Text mr={3}>{order.icon}</Text>
            {order.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SortSelector;
