import React from "react";
import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import Theme from "./theme";

const NavBar = () => {
  return (
    <HStack>
      <Image src={logo} boxSize={"60px"} alt="Logo" />
      <Text>NavBar</Text>
      <Theme />
    </HStack>
  );
};

export default NavBar;
