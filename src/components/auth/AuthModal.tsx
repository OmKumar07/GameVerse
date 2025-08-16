import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState(initialMode);
  const overlayBg = useColorModeValue("blackAlpha.300", "blackAlpha.600");

  const handleSwitchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={overlayBg} backdropFilter="blur(10px)" />
      <ModalContent bg="transparent" shadow="none" maxW="fit-content">
        <ModalCloseButton
          position="absolute"
          right={4}
          top={4}
          zIndex={10}
          color="white"
          bg="blackAlpha.300"
          _hover={{ bg: "blackAlpha.500" }}
          borderRadius="full"
        />
        {mode === "login" ? (
          <LoginForm onSwitchToSignup={handleSwitchMode} onClose={onClose} />
        ) : (
          <SignupForm onSwitchToLogin={handleSwitchMode} onClose={onClose} />
        )}
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
