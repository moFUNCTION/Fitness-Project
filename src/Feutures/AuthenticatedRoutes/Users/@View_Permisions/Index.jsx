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
  const { data, error } = useFetch({
    endpoint: `permissions/${id}/permissions`,
  });
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
        <Flex gap="3" alignItems="center">
          <Button as={Link} to="add" colorScheme="blue">
            اضافة صلاحية
          </Button>
        </Flex>
      </HStack>
      <Flex
        p="4"
        bgColor="gray.100"
        gap="3"
        as={Skeleton}
        isLoaded={!UserLoading}
        minH="700px"
        flexShrink="0"
      >
        {UserData.data && (
          <>
            <UserProfileBox {...UserData?.data} role="Not-Active" />
            <Stack
              w="100%"
              bgColor="white"
              h="100%"
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
