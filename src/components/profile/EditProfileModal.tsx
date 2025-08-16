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
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  Avatar,
  Box,
  Text,
  useColorModeValue,
  useToast,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FiCamera, FiPlus } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/auth-api-client";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    favoriteGenres: [] as string[],
    gamingPlatforms: [] as string[],
    profilePrivacy: "public",
    showEmail: false,
    showGameStats: true,
  });

  // New genre/platform inputs
  const [newGenre, setNewGenre] = useState("");
  const [newPlatform, setNewPlatform] = useState("");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Popular gaming platforms and genres for suggestions
  const popularGenres = [
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Simulation",
    "Sports",
    "Racing",
    "Puzzle",
    "Fighting",
    "Horror",
    "Shooter",
    "Platformer",
  ];

  const popularPlatforms = [
    "PC",
    "PlayStation",
    "Xbox",
    "Nintendo Switch",
    "Mobile",
    "Mac",
    "Linux",
    "VR",
  ];

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        favoriteGenres: user.favoriteGenres || [],
        gamingPlatforms: user.gamingPlatforms || [],
        profilePrivacy: user.profilePrivacy || "public",
        showEmail: user.showEmail || false,
        showGameStats: user.showGameStats !== false,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addGenre = (genre: string) => {
    if (genre.trim() && !formData.favoriteGenres.includes(genre.trim())) {
      setFormData((prev) => ({
        ...prev,
        favoriteGenres: [...prev.favoriteGenres, genre.trim()],
      }));
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.filter((g) => g !== genreToRemove),
    }));
  };

  const addPlatform = (platform: string) => {
    if (
      platform.trim() &&
      !formData.gamingPlatforms.includes(platform.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        gamingPlatforms: [...prev.gamingPlatforms, platform.trim()],
      }));
      setNewPlatform("");
    }
  };

  const removePlatform = (platformToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      gamingPlatforms: prev.gamingPlatforms.filter(
        (p) => p !== platformToRemove
      ),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await apiClient.put("/users/profile", formData);

      if (response.data.success) {
        updateProfile(response.data.user);
        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message || "Failed to update profile",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} border="1px" borderColor={borderColor}>
        <ModalHeader>
          <VStack spacing={2} align="start">
            <Text fontSize="xl" fontWeight="bold">
              Edit Profile
            </Text>
            <Text fontSize="sm" color="gray.500">
              Update your gaming profile information
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Profile Picture Section */}
            <Box textAlign="center">
              <Box position="relative" display="inline-block">
                <Avatar
                  size="xl"
                  name={user.displayName}
                  src={user.profileImage?.url}
                  border="4px"
                  borderColor="purple.400"
                />
                <IconButton
                  aria-label="Change profile picture"
                  icon={<FiCamera />}
                  size="sm"
                  colorScheme="purple"
                  borderRadius="full"
                  position="absolute"
                  bottom={0}
                  right={0}
                  isDisabled
                  title="Coming Soon"
                />
              </Box>
              <Text fontSize="xs" color="gray.500" mt={2}>
                Profile picture upload coming soon
              </Text>
            </Box>

            <Divider />

            {/* Basic Information */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold" color="purple.400">
                Basic Information
              </Text>

              <FormControl isRequired>
                <FormLabel>Display Name</FormLabel>
                <Input
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  placeholder="Your display name"
                  maxLength={50}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself and your gaming interests..."
                  rows={3}
                  maxLength={500}
                />
                <Text fontSize="xs" color="gray.500" textAlign="right">
                  {formData.bio.length}/500
                </Text>
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Your location"
                    maxLength={100}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://yourwebsite.com"
                    type="url"
                  />
                </FormControl>
              </HStack>
            </VStack>

            <Divider />

            {/* Gaming Preferences */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold" color="purple.400">
                Gaming Preferences
              </Text>

              <FormControl>
                <FormLabel>Favorite Genres</FormLabel>
                <HStack>
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Add a genre..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addGenre(newGenre);
                      }
                    }}
                  />
                  <IconButton
                    aria-label="Add genre"
                    icon={<FiPlus />}
                    onClick={() => addGenre(newGenre)}
                    colorScheme="purple"
                    variant="outline"
                  />
                </HStack>

                <Box mt={2}>
                  <Text fontSize="xs" color="gray.500" mb={2}>
                    Popular genres:
                  </Text>
                  <Wrap spacing={1}>
                    {popularGenres
                      .filter((g) => !formData.favoriteGenres.includes(g))
                      .map((genre) => (
                        <WrapItem key={genre}>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => addGenre(genre)}
                            colorScheme="gray"
                          >
                            {genre}
                          </Button>
                        </WrapItem>
                      ))}
                  </Wrap>
                </Box>

                <Wrap spacing={2} mt={3}>
                  {formData.favoriteGenres.map((genre) => (
                    <WrapItem key={genre}>
                      <Tag colorScheme="purple" variant="solid">
                        <TagLabel>{genre}</TagLabel>
                        <TagCloseButton onClick={() => removeGenre(genre)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>

              <FormControl>
                <FormLabel>Gaming Platforms</FormLabel>
                <HStack>
                  <Input
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    placeholder="Add a platform..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPlatform(newPlatform);
                      }
                    }}
                  />
                  <IconButton
                    aria-label="Add platform"
                    icon={<FiPlus />}
                    onClick={() => addPlatform(newPlatform)}
                    colorScheme="purple"
                    variant="outline"
                  />
                </HStack>

                <Box mt={2}>
                  <Text fontSize="xs" color="gray.500" mb={2}>
                    Popular platforms:
                  </Text>
                  <Wrap spacing={1}>
                    {popularPlatforms
                      .filter((p) => !formData.gamingPlatforms.includes(p))
                      .map((platform) => (
                        <WrapItem key={platform}>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => addPlatform(platform)}
                            colorScheme="gray"
                          >
                            {platform}
                          </Button>
                        </WrapItem>
                      ))}
                  </Wrap>
                </Box>

                <Wrap spacing={2} mt={3}>
                  {formData.gamingPlatforms.map((platform) => (
                    <WrapItem key={platform}>
                      <Tag colorScheme="blue" variant="solid">
                        <TagLabel>{platform}</TagLabel>
                        <TagCloseButton
                          onClick={() => removePlatform(platform)}
                        />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>
            </VStack>

            <Divider />

            {/* Privacy Settings */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold" color="purple.400">
                Privacy Settings
              </Text>

              <FormControl>
                <FormLabel htmlFor="profile-privacy">
                  Profile Visibility
                </FormLabel>
                <Select
                  id="profile-privacy"
                  value={formData.profilePrivacy}
                  onChange={(e) =>
                    handleInputChange("profilePrivacy", e.target.value)
                  }
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private - Only me</option>
                </Select>
              </FormControl>

              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">Show Email</Text>
                  <Text fontSize="sm" color="gray.500">
                    Display your email on your public profile
                  </Text>
                </VStack>
                <Switch
                  isChecked={formData.showEmail}
                  onChange={(e) =>
                    handleInputChange("showEmail", e.target.checked)
                  }
                  colorScheme="purple"
                />
              </HStack>

              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">Show Game Statistics</Text>
                  <Text fontSize="sm" color="gray.500">
                    Display your gaming stats and activity
                  </Text>
                </VStack>
                <Switch
                  isChecked={formData.showGameStats}
                  onChange={(e) =>
                    handleInputChange("showGameStats", e.target.checked)
                  }
                  colorScheme="purple"
                />
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
