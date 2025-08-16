import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ReactNode } from "react";
import theme from "../../theme";

interface ProviderProps {
  children: ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />
      {children}
    </ChakraProvider>
  );
}
