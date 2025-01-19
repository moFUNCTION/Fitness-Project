import React, { useState } from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Button, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import { CgGym } from "react-icons/cg";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { CourseBox } from "./Components/CourseBox/CourseBox";

export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/courses",
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
          اهلا بك في الكورسات
          <CgGym />
        </Heading>
        <Button as={Link} to="add" colorScheme="blue">
          اضافة كورس
        </Button>
      </HStack>
      <Flex
        flexShrink="0"
        gap="3"
        wrap="wrap"
        justifyContent="center"
        p="3"
        bgColor="gray.100"
        minH="400px"
      >
        {data?.data?.map((course) => {
          return (
            <CourseBox
              onRender={HandleRender}
              loading={loading}
              {...course}
              key={course._id}
            />
          );
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
