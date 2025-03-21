import React, { useState } from "react";
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
import { BiAward } from "react-icons/bi";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { PrizeBox } from "./Components/PrizeCard/PrizeCard";

export default function Index() {
  const [page, setPage] = useState(1);

  const { data, loading, error, HandleRender } = useFetch({
    endpoint: "prizes",
    params: {
      page,
    },
  });
  return (
    <Stack h="100%" overflow="auto" p="3" w="100%">
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
          اهلا بك في الجوائز
          <BiAward />
        </Heading>
        <Button as={Link} to="add" colorScheme="blue">
          اضافة جائزة
        </Button>
      </HStack>
      <Flex
        justifyContent="center"
        p="3"
        gap="3"
        wrap="wrap"
        as={Skeleton}
        isLoaded={!loading}
        minH="500px"
        flexShrink="0"
      >
        {data?.data?.map((item) => {
          return <PrizeBox key={item.id} {...item} onRender={HandleRender} />;
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
