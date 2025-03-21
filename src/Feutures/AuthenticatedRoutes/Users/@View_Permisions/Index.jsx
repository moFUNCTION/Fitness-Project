import {
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Link, Outlet, useParams } from "react-router-dom";
import { GiMedicinePills } from "react-icons/gi";
import { UserProfileBox } from "../@View/Components/UserBox";

export default function Index() {
  const { id } = useParams();
  const { data, error, loading } = useFetch({
    endpoint: `permissions/${id}/permissions`,
  });
  console.log("saas", data);
  const {
    data: UserData,
    error: UserError,
    loading: UserLoading,
  } = useFetch({
    endpoint: `/users/${id}`,
  });
  console.log(UserData);

  return (
    <Stack w="100%" gap="3" p="3">
      <HStack
        justifyContent="space-between"
        p="4"
        borderRadius="md"
        bgColor="gray.100"
        flexWrap="wrap"
        gap="5"
      >
        <Heading
          color="blue.800"
          display="flex"
          gap="3"
          alignItems="center"
          size="md"
        >
          اهلا بك في صلاحيات المستخدم
          <GiMedicinePills />
        </Heading>
      </HStack>
      <Flex
        p="4"
        bgColor="gray.100"
        gap="3"
        as={Skeleton}
        w="100%"
        h="fit-content"
        isLoaded={!UserLoading}
        minH="700px"
        flexShrink="0"
        flexWrap={{
          base: "wrap",
          md: "nowrap",
        }}
      >
        {UserData.data && (
          <>
            <UserProfileBox {...UserData?.data} role="Not-Active" />
            <Stack
              w="100%"
              bgColor="white"
              h="fit-content"
              overflow="auto"
              borderRadius="xl"
              boxShadow="lg"
              p="3"
            >
              <Outlet />
            </Stack>
          </>
        )}
      </Flex>
    </Stack>
  );
}
