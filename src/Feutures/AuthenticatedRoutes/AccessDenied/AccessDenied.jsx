import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import Lottie from "lottie-react";
import React from "react";
import AnimationData from "../../../Assets/Access-Denied/Animation - 1722663423572.json";
import { BsWhatsapp } from "react-icons/bs";
export default function AccessDenied({ message }) {
  return (
    <Stack
      gap="3"
      alignItems="center"
      justifyContent="center"
      w="100%"
      h="100%"
      p="3"
    >
      <Box h="400px" bgColor="gray.100" overflow="hidden" borderRadius="lg">
        <Lottie
          animationData={AnimationData}
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        />
      </Box>
      <Heading
        w="100%"
        maxW="400px"
        lineHeight="8"
        textAlign="center"
        size="md"
      >
        {message}
      </Heading>
      <Button w="100%" maxW="400px" gap="3" colorScheme="whatsapp">
        التحدث الي مشرف
        <BsWhatsapp />
      </Button>
    </Stack>
  );
}
