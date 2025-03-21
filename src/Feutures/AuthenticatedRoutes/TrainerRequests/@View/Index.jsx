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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TrainerRequest } from "./Components/TrainerRequest";
import {
  SearchField,
  Title,
} from "../../../../Components/Common/SearchField/SearchField";
const StatusList = [
  {
    title: "تم رفضه",
    color: "red",
    value: "rejected",
  },
  {
    title: "معلق",
    color: "orange",
    value: "pending",
  },
  {
    title: "تم الوفوق عليه",
    color: "green",
    value: "approved",
  },
];
export default function Index() {
  const [search] = useSearchParams();
  const Navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/trainerRequests",
    params: {
      page,
      status: search.get("status"),
      name: search.get("searchByName"),
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
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
      <Flex as={Skeleton} isLoaded={!loading} gap="3" p="3">
        {StatusList.map((status) => {
          return (
            <Button
              onClick={() => Navigate(`?status=${status.value}`)}
              colorScheme={status.color}
              key={status.value}
              variant={
                search.get("status") === status.value ? "outline" : "solid"
              }
            >
              {status.title}
            </Button>
          );
        })}
        <SearchField
          onSubmit={(value) => {
            Navigate(`?searchByName=${value}`);
          }}
          BtnStyles={{
            mr: "auto",
          }}
        >
          <Title>البحث عن طلب بالاسم</Title>
        </SearchField>
      </Flex>
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
