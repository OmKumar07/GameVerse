import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
} from "@chakra-ui/react";
import { BsWifi, BsArrowClockwise, BsShield } from "react-icons/bs";

interface Props {
  error: string;
  onRetry: () => void;
  title?: string;
}

const ErrorFallback = ({
  error,
  onRetry,
  title = "Unable to Load Content",
}: Props) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const isNetworkError =
    error.toLowerCase().includes("network") ||
    error.toLowerCase().includes("failed to fetch") ||
    error.toLowerCase().includes("timeout") ||
    error.toLowerCase().includes("connection");

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={8}
      maxW="500px"
      mx="auto"
      mt={8}
      textAlign="center"
      shadow="lg"
    >
      <VStack spacing={6}>
        {/* Error Icon */}
        <Box
          bg={useColorModeValue("red.50", "red.900")}
          p={4}
          borderRadius="full"
        >
          <Icon
            as={BsWifi}
            boxSize={8}
            color={useColorModeValue("red.500", "red.300")}
          />
        </Box>

        {/* Error Title */}
        <Heading
          size="lg"
          color={useColorModeValue("gray.800", "white")}
          fontWeight="bold"
        >
          {title}
        </Heading>

        {/* Error Message */}
        <Text color={textColor} fontSize="md" lineHeight="tall">
          {isNetworkError
            ? "We're having trouble connecting to our servers. This might be due to network restrictions or connectivity issues."
            : error}
        </Text>

        {/* Network-specific suggestions */}
        {isNetworkError && (
          <Alert
            status="info"
            borderRadius="lg"
            bg={useColorModeValue("blue.50", "blue.900")}
            border="1px"
            borderColor={useColorModeValue("blue.200", "blue.600")}
          >
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Connection Tip:</AlertTitle>
              <AlertDescription fontSize="sm">
                If you're in a restricted region, try using a VPN to access the
                content.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Action Buttons */}
        <VStack spacing={3} w="full">
          <Button
            onClick={onRetry}
            colorScheme="purple"
            size="lg"
            w="full"
            leftIcon={<Icon as={BsArrowClockwise} />}
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s"
          >
            Try Again
          </Button>

          {isNetworkError && (
            <HStack spacing={4} w="full">
              <Button
                as="a"
                href="https://www.cloudflare.com/learning/access-management/what-is-a-vpn/"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                colorScheme="blue"
                size="md"
                flex={1}
                leftIcon={<Icon as={BsShield} />}
                fontSize="sm"
              >
                Learn about VPN
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                colorScheme="gray"
                size="md"
                flex={1}
                fontSize="sm"
              >
                Refresh Page
              </Button>
            </HStack>
          )}
        </VStack>

        {/* Additional Help Text */}
        <Text fontSize="xs" color={textColor} mt={4}>
          If the problem persists, please check your internet connection or try
          again later.
        </Text>
      </VStack>
    </Box>
  );
};

export default ErrorFallback;
