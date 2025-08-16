import { useToast, UseToastOptions } from "@chakra-ui/react";

export const useCustomToast = () => {
  const toast = useToast();

  return {
    success: (options: UseToastOptions) =>
      toast({
        status: "success",
        duration: 5000,
        isClosable: true,
        ...options,
      }),
    error: (options: UseToastOptions) =>
      toast({ status: "error", duration: 5000, isClosable: true, ...options }),
    warning: (options: UseToastOptions) =>
      toast({
        status: "warning",
        duration: 5000,
        isClosable: true,
        ...options,
      }),
    info: (options: UseToastOptions) =>
      toast({ status: "info", duration: 5000, isClosable: true, ...options }),
  };
};

export const toaster = useCustomToast;

// Empty Toaster component for compatibility
export const Toaster = () => null;
