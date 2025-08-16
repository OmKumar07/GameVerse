import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  useToast,
  Progress,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  Select,
  Switch,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { FiPlus, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onClose,
}) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Basic account fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Profile fields
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [gamingPlatforms, setGamingPlatforms] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [newPlatform, setNewPlatform] = useState("");

  // Privacy settings
  const [profilePrivacy, setProfilePrivacy] = useState("public");
  const [showEmail, setShowEmail] = useState(false);
  const [showGameStats, setShowGameStats] = useState(true);

  const [error, setError] = useState("");
  const { signup, isLoading } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Popular options for quick selection
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

  const addGenre = (genre: string) => {
    if (genre.trim() && !favoriteGenres.includes(genre.trim())) {
      setFavoriteGenres([...favoriteGenres, genre.trim()]);
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setFavoriteGenres(favoriteGenres.filter((g) => g !== genreToRemove));
  };

  const addPlatform = (platform: string) => {
    if (platform.trim() && !gamingPlatforms.includes(platform.trim())) {
      setGamingPlatforms([...gamingPlatforms, platform.trim()]);
      setNewPlatform("");
    }
  };

  const removePlatform = (platformToRemove: string) => {
    setGamingPlatforms(gamingPlatforms.filter((p) => p !== platformToRemove));
  };

  const validateStep1 = () => {
    if (!email || !password || !username || !displayName) {
      setError("Please fill in all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setError("");

    if (currentStep === 1) {
      if (!validateStep1()) return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    try {
      // First create the account
      await signup(email, password, username, displayName);

      // Then update the profile with additional information
      const profileData = {
        bio,
        location,
        website,
        favoriteGenres,
        gamingPlatforms,
        profilePrivacy,
        showEmail,
        showGameStats,
      };

      // Make API call to update profile (only if there's data to update)
      if (
        bio ||
        location ||
        website ||
        favoriteGenres.length > 0 ||
        gamingPlatforms.length > 0
      ) {
        try {
          await fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:5001/api"
            }/users/profile`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify(profileData),
            }
          );
        } catch (profileError) {
          console.warn("Profile update failed during signup:", profileError);
          // Don't fail the signup if profile update fails
        }
      }

      toast({
        title: "Welcome to GameVerse! 🎮",
        description:
          "Your account has been created and profile set up successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      setError("Failed to create account. Please try again.");
    }
  };

  const renderStep1 = () => (
    <VStack spacing={4}>
      <Text
        fontSize="lg"
        fontWeight="semibold"
        color="purple.400"
        textAlign="center"
      >
        Create Your Account
      </Text>

      <FormControl isRequired>
        <FormLabel>Display Name</FormLabel>
        <Input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          bg={inputBg}
          border="1px"
          borderColor={borderColor}
          _hover={{ borderColor: "purple.300" }}
          _focus={{
            borderColor: "purple.400",
            boxShadow: "0 0 0 1px purple.400",
          }}
          placeholder="Your display name"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
          }
          bg={inputBg}
          border="1px"
          borderColor={borderColor}
          _hover={{ borderColor: "purple.300" }}
          _focus={{
            borderColor: "purple.400",
            boxShadow: "0 0 0 1px purple.400",
          }}
          placeholder="username"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg={inputBg}
          border="1px"
          borderColor={borderColor}
          _hover={{ borderColor: "purple.300" }}
          _focus={{
            borderColor: "purple.400",
            boxShadow: "0 0 0 1px purple.400",
          }}
          placeholder="your.email@example.com"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bg={inputBg}
          border="1px"
          borderColor={borderColor}
          _hover={{ borderColor: "purple.300" }}
          _focus={{
            borderColor: "purple.400",
            boxShadow: "0 0 0 1px purple.400",
          }}
          placeholder="At least 6 characters"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          bg={inputBg}
          border="1px"
          borderColor={borderColor}
          _hover={{ borderColor: "purple.300" }}
          _focus={{
            borderColor: "purple.400",
            boxShadow: "0 0 0 1px purple.400",
          }}
          placeholder="Confirm your password"
        />
      </FormControl>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={4}>
      <Text
        fontSize="lg"
        fontWeight="semibold"
        color="purple.400"
        textAlign="center"
      >
        Tell Us About Yourself
      </Text>

      <FormControl>
        <FormLabel>Bio</FormLabel>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          bg={inputBg}
          border="1px"
          borderColor={borderColor}
          _hover={{ borderColor: "purple.300" }}
          _focus={{
            borderColor: "purple.400",
            boxShadow: "0 0 0 1px purple.400",
          }}
          placeholder="Tell us about yourself and your gaming interests..."
          rows={3}
          maxLength={500}
        />
        <Text fontSize="xs" color="gray.500" textAlign="right">
          {bio.length}/500
        </Text>
      </FormControl>

      <HStack spacing={4} w="100%">
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            bg={inputBg}
            border="1px"
            borderColor={borderColor}
            _hover={{ borderColor: "purple.300" }}
            _focus={{
              borderColor: "purple.400",
              boxShadow: "0 0 0 1px purple.400",
            }}
            placeholder="Your location"
            maxLength={100}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Website</FormLabel>
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            bg={inputBg}
            border="1px"
            borderColor={borderColor}
            _hover={{ borderColor: "purple.300" }}
            _focus={{
              borderColor: "purple.400",
              boxShadow: "0 0 0 1px purple.400",
            }}
            placeholder="https://yoursite.com"
            type="url"
          />
        </FormControl>
      </HStack>
    </VStack>
  );

  const renderStep3 = () => (
    <VStack spacing={4}>
      <Text
        fontSize="lg"
        fontWeight="semibold"
        color="purple.400"
        textAlign="center"
      >
        Gaming Preferences & Privacy
      </Text>

      {/* Gaming Preferences */}
      <FormControl>
        <FormLabel>Favorite Genres</FormLabel>
        <HStack>
          <Input
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Add a genre..."
            bg={inputBg}
            border="1px"
            borderColor={borderColor}
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
            size="sm"
          />
        </HStack>

        {popularGenres.length > 0 && (
          <Box mt={2}>
            <Text fontSize="xs" color="gray.500" mb={1}>
              Quick add:
            </Text>
            <Wrap spacing={1}>
              {popularGenres
                .filter((g) => !favoriteGenres.includes(g))
                .slice(0, 6)
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
        )}

        {favoriteGenres.length > 0 && (
          <Wrap spacing={2} mt={2}>
            {favoriteGenres.map((genre) => (
              <WrapItem key={genre}>
                <Tag colorScheme="purple" variant="solid" size="sm">
                  <TagLabel>{genre}</TagLabel>
                  <TagCloseButton onClick={() => removeGenre(genre)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </FormControl>

      <FormControl>
        <FormLabel>Gaming Platforms</FormLabel>
        <HStack>
          <Input
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            placeholder="Add a platform..."
            bg={inputBg}
            border="1px"
            borderColor={borderColor}
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
            size="sm"
          />
        </HStack>

        {popularPlatforms.length > 0 && (
          <Box mt={2}>
            <Text fontSize="xs" color="gray.500" mb={1}>
              Quick add:
            </Text>
            <Wrap spacing={1}>
              {popularPlatforms
                .filter((p) => !gamingPlatforms.includes(p))
                .slice(0, 4)
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
        )}

        {gamingPlatforms.length > 0 && (
          <Wrap spacing={2} mt={2}>
            {gamingPlatforms.map((platform) => (
              <WrapItem key={platform}>
                <Tag colorScheme="blue" variant="solid" size="sm">
                  <TagLabel>{platform}</TagLabel>
                  <TagCloseButton onClick={() => removePlatform(platform)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </FormControl>

      <Divider />

      {/* Privacy Settings */}
      <Text fontSize="md" fontWeight="semibold" color="gray.600">
        Privacy Settings
      </Text>

      <FormControl>
        <FormLabel htmlFor="signup-privacy">Profile Visibility</FormLabel>
        <Select
          id="signup-privacy"
          value={profilePrivacy}
          onChange={(e) => setProfilePrivacy(e.target.value)}
          bg={inputBg}
          border="1px"
          borderColor={borderColor}
        >
          <option value="public">Public - Anyone can view</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private - Only me</option>
        </Select>
      </FormControl>

      <HStack justify="space-between" w="100%">
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" fontWeight="medium">
            Show Email
          </Text>
          <Text fontSize="xs" color="gray.500">
            Display email on profile
          </Text>
        </VStack>
        <Switch
          isChecked={showEmail}
          onChange={(e) => setShowEmail(e.target.checked)}
          colorScheme="purple"
        />
      </HStack>

      <HStack justify="space-between" w="100%">
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" fontWeight="medium">
            Show Game Stats
          </Text>
          <Text fontSize="xs" color="gray.500">
            Display gaming statistics
          </Text>
        </VStack>
        <Switch
          isChecked={showGameStats}
          onChange={(e) => setShowGameStats(e.target.checked)}
          colorScheme="purple"
        />
      </HStack>
    </VStack>
  );

  return (
    <Box
      bg={bgColor}
      p={8}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      shadow="xl"
      maxW="500px"
      w="100%"
      maxH="90vh"
      overflowY="auto"
    >
      <VStack spacing={6}>
        {/* Header */}
        <VStack spacing={2}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, purple.400, pink.400)"
            bgClip="text"
          >
            Join GameVerse
          </Text>
          <HStack spacing={2}>
            <Badge colorScheme="purple" variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </HStack>
        </VStack>

        {/* Progress Bar */}
        <Box w="100%">
          <Progress
            value={(currentStep / totalSteps) * 100}
            colorScheme="purple"
            borderRadius="full"
            size="sm"
          />
        </Box>

        {/* Error Display */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Step Content */}
        <Box w="100%">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </Box>

        {/* Navigation Buttons */}
        <HStack spacing={3} w="100%" justify="space-between">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={handlePrevious}
            isDisabled={currentStep === 1}
            size="sm"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              rightIcon={<FiArrowRight />}
              colorScheme="purple"
              onClick={handleNext}
              size="sm"
            >
              Next
            </Button>
          ) : (
            <Button
              colorScheme="purple"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Creating account..."
              size="sm"
              bgGradient="linear(to-r, purple.400, pink.400)"
              _hover={{
                bgGradient: "linear(to-r, purple.500, pink.500)",
              }}
            >
              Create Account
            </Button>
          )}
        </HStack>

        {/* Footer */}
        <VStack spacing={2}>
          <Text color="gray.500" fontSize="sm">
            Already have an account?
          </Text>
          <Button
            variant="ghost"
            colorScheme="purple"
            onClick={onSwitchToLogin}
            _hover={{ bg: useColorModeValue("purple.50", "purple.900") }}
            size="sm"
          >
            Sign In
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SignupForm;
