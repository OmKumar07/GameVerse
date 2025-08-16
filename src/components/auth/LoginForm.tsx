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

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      setError("Invalid email or password");
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
          Welcome Back
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
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              w="100%"
              isLoading={isLoading}
              loadingText="Signing in..."
              bgGradient="linear(to-r, purple.400, pink.400)"
              _hover={{
                bgGradient: "linear(to-r, purple.500, pink.500)",
                transform: "translateY(-1px)",
                shadow: "lg",
              }}
              transition="all 0.2s"
            >
              Sign In
            </Button>
          </VStack>
        </Box>

        <VStack spacing={2}>
          <Text color="gray.500">Don't have an account?</Text>
          <Button
            variant="ghost"
            colorScheme="purple"
            onClick={onSwitchToSignup}
            _hover={{ bg: useColorModeValue("purple.50", "purple.900") }}
          >
            Create Account
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default LoginForm;
