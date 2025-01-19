import {
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CenteredTextWithLines } from "../../../../Components/Common/CenteredTextWithLines/CenteredTextWithLines";
import { CgGym } from "react-icons/cg";
import { Link } from "react-router-dom";
import { MdFoodBank } from "react-icons/md";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { MealBox } from "./Components/MealBox";

export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/mealsCalculation",
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
          اهلا بك في الوجبات
          <MdFoodBank />
        </Heading>
        <Button as={Link} to="add" colorScheme="blue">
          اضافة وجبة
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
        {data?.data?.map((meal) => {
          console.log(meal);
          return <MealBox data={meal} key={meal._id} />;
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
