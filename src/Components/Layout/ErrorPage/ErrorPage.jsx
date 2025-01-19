import { Button, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import ErrorAnimation from "../../../Assets/Error/Animation - 1707156954178.json";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
export default function ErrorPage({
  errorMessage,
  navigateTo = "/main",
  ...rest
}) {
  return (
    <Stack
      w="100%"
      h="100%"
      alignItems="center"
      justifyContent="center"
      gap="4"
      p="3"
      {...rest}
    >
      <Lottie
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
        animationData={ErrorAnimation}
      />
      <Heading size="md">{errorMessage}</Heading>
      <Button
        as={Link}
        to={navigateTo}
        colorScheme="blue"
        w="100%"
        maxW="200px"
      >
        الرجوع للرئيسية
      </Button>
    </Stack>
  );
}
