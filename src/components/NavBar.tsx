import React from "react";
import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import Theme from "./Theme";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between" padding="10px">
      <Image src={logo} boxSize={"60px"} alt="Logo" />
      <Theme />
    </HStack>
  );
};

export default NavBar;
