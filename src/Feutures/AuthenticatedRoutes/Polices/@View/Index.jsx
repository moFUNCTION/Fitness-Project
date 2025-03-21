import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { Link } from "react-router-dom";

export default function Index() {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const { data, loading, error, HandleRender } = useFetch({
    endpoint: "Policies",
    params: {
      page,
    },
  });
  console.log(data);
  return (
    <Stack w="100%" p="3">
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
          شروط الاستخدام
        </Heading>
      </HStack>

      <Accordion
        minH="400px"
        as={Skeleton}
        isLoaded={!loading}
        allowMultiple
        allowToggle
      >
        {data?.data?.map((item) => {
          return (
            <AccordionItem key={item._id}>
              <AccordionButton p="5">
                <Heading size="md" textAlign="right">
                  {item?.title}
                </Heading>
                <AccordionIcon mr="auto" />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {item?.content}
                <Flex gap="3" mt="3">
                  <Button
                    as={Link}
                    to={`${item._id}/update`}
                    colorScheme="green"
                  >
                    تحديث
                  </Button>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Pagination
        totalPages={data?.paginationResult?.numberOfPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </Stack>
  );
}
