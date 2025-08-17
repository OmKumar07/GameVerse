import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  SimpleGrid,
  Image,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiPlus,
} from "react-icons/fi";
import { CustomList, useCustomLists } from "@/hooks/useCustomLists";
import EditListModal from "./EditListModal";

interface ListCardProps {
  list: CustomList;
  onEditClick?: (list: CustomList) => void;
}

const ListCard: React.FC<ListCardProps> = ({ list, onEditClick }) => {
  const [selectedList, setSelectedList] = useState<CustomList | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const { deleteList, isLoading } = useCustomLists();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleEditClick = () => {
    setSelectedList(list);
    onEditOpen();
  };

  const handleDeleteClick = () => {
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    await deleteList(list.id);
    onDeleteClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGameImages = () => {
    return list.games
      .slice(0, 4)
      .map((game) => game.gameImage)
      .filter(Boolean);
  };

  return (
    <>
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={5}
        shadow="sm"
        _hover={{ shadow: "md" }}
        transition="shadow 0.2s"
      >
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <HStack justify="space-between" align="flex-start">
            <VStack align="flex-start" spacing={1} flex={1}>
              <HStack>
                <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
                  {list.name}
                </Text>
                <Badge
                  colorScheme={list.isPublic ? "green" : "gray"}
                  variant="subtle"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {list.isPublic ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                  {list.isPublic ? "Public" : "Private"}
                </Badge>
              </HStack>

              {list.description && (
                <Text fontSize="sm" color={textColor} noOfLines={2}>
                  {list.description}
                </Text>
              )}

              <Text fontSize="xs" color={textColor}>
                {list.games.length} game{list.games.length !== 1 ? "s" : ""} •
                Created {formatDate(list.createdAt)}
              </Text>
            </VStack>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
                aria-label="List options"
              />
              <MenuList>
                <MenuItem icon={<FiEdit2 />} onClick={handleEditClick}>
                  Edit List
                </MenuItem>
                <MenuItem
                  icon={<FiTrash2 />}
                  onClick={handleDeleteClick}
                  color="red.500"
                >
                  Delete List
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* Game Preview */}
          {list.games.length > 0 ? (
            <Box>
              <SimpleGrid columns={4} spacing={2}>
                {getGameImages().map((imageUrl, index) => (
                  <Box key={index} position="relative">
                    <Image
                      src={imageUrl}
                      alt={`Game ${index + 1}`}
                      borderRadius="md"
                      objectFit="cover"
                      w="100%"
                      h="60px"
                      fallback={
                        <Box
                          w="100%"
                          h="60px"
                          bg="gray.300"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="xs" color="gray.500">
                            No Image
                          </Text>
                        </Box>
                      }
                    />
                  </Box>
                ))}

                {/* Show remaining count if more than 4 games */}
                {list.games.length > 4 && (
                  <Box
                    w="100%"
                    h="60px"
                    bg="gray.100"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="2px dashed"
                    borderColor="gray.300"
                  >
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">
                      +{list.games.length - 4}
                    </Text>
                  </Box>
                )}
              </SimpleGrid>
            </Box>
          ) : (
            <Box
              p={6}
              textAlign="center"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              bg="gray.50"
            >
              <VStack spacing={2}>
                <FiPlus size={24} color="gray.400" />
                <Text fontSize="sm" color="gray.500">
                  No games in this list yet
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Edit Modal */}
      <EditListModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        list={selectedList}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete List
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{list.name}"? This action cannot
              be undone.
              {list.games.length > 0 && (
                <Text mt={2} fontSize="sm" color="gray.600">
                  This list contains {list.games.length} game
                  {list.games.length !== 1 ? "s" : ""}.
                </Text>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ListCard;
