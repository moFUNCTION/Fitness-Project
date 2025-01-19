import {
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { Link } from "react-router-dom";
import { GiMedicinePills } from "react-icons/gi";
import { SupplementCard } from "./Components/SupplementBox";

export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/supplements",
    params: {
      page,
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
          اهلا بك في المكملات الغذائية
          <GiMedicinePills />
        </Heading>
        <Button as={Link} to="add" colorScheme="blue">
          اضافة مكمل غذائي
        </Button>
      </HStack>
      <Flex
        minH="400px"
        flexShrink="0"
        as={Skeleton}
        isLoaded={!loading}
        gap="10"
        justifyContent="center"
        flexWrap="wrap"
      >
        {data?.data?.map((item) => {
          return <SupplementCard supplement={item} key={item._id} />;
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
