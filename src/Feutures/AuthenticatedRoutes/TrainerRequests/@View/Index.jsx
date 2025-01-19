import React, { useState } from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import {
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { TrainerRequest } from "./Components/TrainerRequest";
export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/trainerRequests",
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  console.log(data);
  return (
    <Stack p="3" w="100%">
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
          اهلا بك في طلبات انضمام المدربين
        </Heading>
      </HStack>
      <Flex
        minH="400px"
        flexShrink="0"
        as={Skeleton}
        isLoaded={!loading}
        gap="10"
        justifyContent="center"
        flexWrap="wrap"
        alignItems="center"
      >
        {data?.data?.map((item) => {
          return <TrainerRequest {...item} key={item._id} />;
        })}
      </Flex>
      <Pagination
        isLoading={loading}
        totalPages={data?.paginationResult?.numberOfPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </Stack>
  );
}
