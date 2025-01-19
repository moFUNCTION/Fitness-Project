import { Button, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useFetch } from "../../../../../Hooks/useFetch/useFetch";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Pagination } from "../../../../../Components/Common/Pagination/Pagination";
import { LessonBox } from "./Components/LessonBox";
import { CgGym } from "react-icons/cg";

export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { courseId } = useParams();
  const { data, loading, HandleRender } = useFetch({
    endpoint: `/lessons/courseLessons/${courseId}`,
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
          اهلا بك في الدروس
          <CgGym />
        </Heading>
        <Button
          as={Link}
          to={`/courses/${courseId}/lessons/add`}
          colorScheme="blue"
        >
          اضافة درس
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
        {data?.data?.map((lesson) => {
          return (
            <LessonBox
              loading={loading}
              onRender={HandleRender}
              {...lesson}
              key={lesson._id}
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
