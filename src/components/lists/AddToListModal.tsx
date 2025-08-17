import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Checkbox,
  Box,
  Badge,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useCustomLists } from "@/hooks/useCustomLists";
import { Game } from "@/hooks/useGames";

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

const AddToListModal: React.FC<AddToListModalProps> = ({
  isOpen,
  onClose,
  game,
}) => {
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lists, addGameToList, removeGameFromList, isLoading } =
    useCustomLists();
  const toast = useToast();

  if (!game) return null;

  // Get lists that already contain this game
  const listsWithGame = lists.filter((list) =>
    list.games.some((g) => g.gameId === game.id)
  );

  // Get lists that don't contain this game
  const availableLists = lists.filter(
    (list) => !list.games.some((g) => g.gameId === game.id)
  );

  const handleListToggle = (listId: string) => {
    const newSelectedLists = new Set(selectedLists);
    if (newSelectedLists.has(listId)) {
      newSelectedLists.delete(listId);
    } else {
      newSelectedLists.add(listId);
    }
    setSelectedLists(newSelectedLists);
  };

  const handleSubmit = async () => {
    if (selectedLists.size === 0) {
      toast({
        title: "No lists selected",
        description: "Please select at least one list to add the game to.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const gameData = {
        gameId: game.id,
        gameName: game.name,
        gameImage: game.background_image,
      };

      // Add game to selected lists
      const promises = Array.from(selectedLists).map((listId) =>
        addGameToList(listId, gameData)
      );

      await Promise.all(promises);

      toast({
        title: "Game added to lists",
        description: `"${game.name}" has been added to ${
          selectedLists.size
        } list${selectedLists.size !== 1 ? "s" : ""}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add game to lists. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromList = async (listId: string) => {
    try {
      await removeGameFromList(listId, game.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove game from list. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    setSelectedLists(new Set());
    onClose();
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody py={8}>
            <Center>
              <VStack spacing={4}>
                <Spinner size="lg" />
                <Text>Loading your lists...</Text>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add "{game.name}" to Lists</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Already in lists */}
            {listsWithGame.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2} color="green.500">
                  Already in these lists:
                </Text>
                <VStack spacing={2} align="stretch">
                  {listsWithGame.map((list) => (
                    <HStack
                      key={list.id}
                      justify="space-between"
                      p={2}
                      bg="green.50"
                      borderRadius="md"
                    >
                      <VStack align="flex-start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {list.name}
                        </Text>
                        {list.description && (
                          <Text fontSize="xs" color="gray.600" noOfLines={1}>
                            {list.description}
                          </Text>
                        )}
                      </VStack>
                      <HStack>
                        <Badge colorScheme="green" size="sm">
                          Added
                        </Badge>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleRemoveFromList(list.id)}
                        >
                          Remove
                        </Button>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Available lists */}
            {availableLists.length > 0 ? (
              <Box>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Add to these lists:
                </Text>
                <VStack spacing={2} align="stretch">
                  {availableLists.map((list) => (
                    <HStack
                      key={list.id}
                      justify="space-between"
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: "gray.50" }}
                    >
                      <VStack align="flex-start" spacing={0} flex={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {list.name}
                        </Text>
                        {list.description && (
                          <Text fontSize="xs" color="gray.600" noOfLines={1}>
                            {list.description}
                          </Text>
                        )}
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.500">
                            {list.games.length} games
                          </Text>
                          <Badge
                            size="sm"
                            colorScheme={list.isPublic ? "green" : "gray"}
                          >
                            {list.isPublic ? "Public" : "Private"}
                          </Badge>
                        </HStack>
                      </VStack>
                      <Checkbox
                        isChecked={selectedLists.has(list.id)}
                        onChange={() => handleListToggle(list.id)}
                      />
                    </HStack>
                  ))}
                </VStack>
              </Box>
            ) : (
              !listsWithGame.length && (
                <Box textAlign="center" py={4}>
                  <Text color="gray.500">
                    You don't have any lists yet. Create a list first to add
                    games to it.
                  </Text>
                </Box>
              )
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          {availableLists.length > 0 && (
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Adding..."
              isDisabled={selectedLists.size === 0}
            >
              Add to {selectedLists.size} List
              {selectedLists.size !== 1 ? "s" : ""}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddToListModal;
