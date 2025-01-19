import React from "react";
import { Box, Flex, Divider, Text } from "@chakra-ui/react";

export const CenteredTextWithLines = ({ children, TextAlign, ...rest }) => {
  return (
    <Flex gap="4" align="center" width="100%" {...rest}>
      <Divider
        w={TextAlign === "left" ? "20px" : "100%"}
        borderColor="gray.400"
      />
      {children}
      <Divider
        borderColor="gray.400"
        w={TextAlign === "right" ? "20px" : "100%"}
      />
    </Flex>
  );
};
