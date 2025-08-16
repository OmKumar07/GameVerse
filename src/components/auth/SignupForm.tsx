import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !username || !displayName) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await signup(email, password, username, displayName);
      toast({
        title: "Account created!",
        description:
          "Welcome to GameVerse! Your account has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <Box
      bg={bgColor}
      p={8}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      shadow="xl"
      maxW="400px"
      w="100%"
    >
      <VStack spacing={6}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          bgGradient="linear(to-r, purple.400, pink.400)"
          bgClip="text"
        >
          Join GameVerse
        </Text>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box as="form" onSubmit={handleSubmit} w="100%">
          <VStack spacing={4}>
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

            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              w="100%"
              isLoading={isLoading}
              loadingText="Creating account..."
              bgGradient="linear(to-r, purple.400, pink.400)"
              _hover={{
                bgGradient: "linear(to-r, purple.500, pink.500)",
                transform: "translateY(-1px)",
                shadow: "lg",
              }}
              transition="all 0.2s"
            >
              Create Account
            </Button>
          </VStack>
        </Box>

        <VStack spacing={2}>
          <Text color="gray.500">Already have an account?</Text>
          <Button
            variant="ghost"
            colorScheme="purple"
            onClick={onSwitchToLogin}
            _hover={{ bg: useColorModeValue("purple.50", "purple.900") }}
          >
            Sign In
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SignupForm;
