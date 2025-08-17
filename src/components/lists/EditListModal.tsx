import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  useCustomLists,
  CustomList,
  UpdateListData,
} from "@/hooks/useCustomLists";

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: CustomList | null;
}

const EditListModal: React.FC<EditListModalProps> = ({
  isOpen,
  onClose,
  list,
}) => {
  const [formData, setFormData] = useState<UpdateListData>({
    name: "",
    description: "",
    isPublic: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { updateList, isLoading } = useCustomLists();

  // Populate form data when list changes
  useEffect(() => {
    if (list) {
      setFormData({
        name: list.name,
        description: list.description,
        isPublic: list.isPublic,
      });
    }
  }, [list]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!list) return;

    // Reset errors
    setErrors({});

    // Validate form
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = "List name is required";
    } else if (formData.name.length > 50) {
      newErrors.name = "List name cannot exceed 50 characters";
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await updateList(list.id, formData);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange = (
    field: keyof UpdateListData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (!list) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit List</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>List Name</FormLabel>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter list name"
                  maxLength={50}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your list..."
                  maxLength={200}
                  rows={3}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="isPublic" mb="0">
                  Make list public
                </FormLabel>
                <Switch
                  id="isPublic"
                  isChecked={formData.isPublic || false}
                  onChange={(e) =>
                    handleInputChange("isPublic", e.target.checked)
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Updating..."
            >
              Update List
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditListModal;
