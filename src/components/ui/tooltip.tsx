import {
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps,
} from "@chakra-ui/react";
import * as React from "react";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  [key: string]: any;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const { children, content, ...rest } = props;

    return (
      <ChakraTooltip label={content as string} {...rest}>
        {children}
      </ChakraTooltip>
    );
  }
);
