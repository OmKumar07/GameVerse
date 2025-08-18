import React from "react";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { FiUser, FiSettings, FiLogOut, FiHeart, FiLogIn } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "../auth/AuthModal";

const ProfileMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const menuBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  if (!isAuthenticated || !user) {
    return (
      <>
        <IconButton
          aria-label="Sign In"
          icon={<Icon as={FiLogIn} />}
          colorScheme="purple"
          variant="ghost"
          size="sm"
          onClick={onOpen}
          _hover={{
            bg: useColorModeValue("purple.50", "purple.900"),
            transform: "translateY(-1px)",
          }}
          transition="all 0.2s"
        />
        <AuthModal isOpen={isOpen} onClose={onClose} initialMode="login" />
      </>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" p={0} borderRadius="full">
        <HStack spacing={3}>
          <Avatar
            size="sm"
            name={user.displayName}
            src={user.profileImage?.url}
            border="2px"
            borderColor="purple.400"
            _hover={{
              borderColor: "purple.300",
              transform: "scale(1.05)",
            }}
            transition="all 0.2s"
          />
          <Text
            display={{ base: "none", md: "block" }}
            fontSize="sm"
            fontWeight="medium"
            color={useColorModeValue("gray.700", "gray.200")}
          >
            {user.displayName}
          </Text>
        </HStack>
      </MenuButton>

      <MenuList
        bg={menuBg}
        borderColor={borderColor}
        shadow="xl"
        borderRadius="xl"
        py={2}
        minW="200px"
      >
        <Box px={4} py={2} borderBottom="1px" borderColor={borderColor}>
          <VStack spacing={1} align="start">
            <Text fontWeight="semibold" fontSize="sm">
              {user.displayName}
            </Text>
            <Text fontSize="xs" color="gray.500">
              @{user.username}
            </Text>
          </VStack>
        </Box>

        <MenuItem
          icon={<FiUser />}
          _hover={{ bg: hoverBg }}
          fontWeight="medium"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Profile
        </MenuItem>

        <MenuItem
          icon={<FiHeart />}
          _hover={{ bg: hoverBg }}
          fontWeight="medium"
        >
          Favorite Games
        </MenuItem>

        <MenuItem
          icon={<FiSettings />}
          _hover={{ bg: hoverBg }}
          fontWeight="medium"
        >
          Settings
        </MenuItem>

        <MenuDivider />

        <MenuItem
          icon={<FiLogOut />}
          _hover={{ bg: "red.50", color: "red.600" }}
          fontWeight="medium"
          onClick={handleLogout}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
