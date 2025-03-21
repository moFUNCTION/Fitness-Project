import React, { useState } from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import {
  Button,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { Link } from "react-router-dom";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
export default function Index() {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const { data, loading, error, HandleRender } = useFetch({
    endpoint: "contactUs",
    params: {
      page,
    },
  });
  const HandleDelete = async (id) => {
    try {
      await axiosInstance.delete(`contactUs/${id}`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      HandleRender();
    } catch (err) {
      console.log(err);
    }
  };
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
          جهات التواصل
        </Heading>
        <Button colorScheme="blue" as={Link} to="add">
          اضافة
        </Button>
      </HStack>
      <TableContainer
        as={Skeleton}
        minH="400px"
        isLoaded={!loading}
        w="100%"
        flexShrink="0"
      >
        <Table size="lg">
          <Thead w="100%">
            <Tr>
              <Th>الاسم</Th>
              <Th>الايميل</Th>
              <Th>رقم الهاتف</Th>
              <Th>تم الانشاء بتوقيت</Th>
              <Th>تم التحديث بتوقيت</Th>
              <Th>التعديل</Th>
              <Th>الحذف</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data?.map((item) => {
              return (
                <Tr key={item._id}>
                  <Td>{item.name}</Td>
                  <Td>{item.email}</Td>
                  <Td>{item.phone}</Td>
                  <Td>{new Date(item.createdAt).toLocaleString()}</Td>
                  <Td>{new Date(item.updatedAt).toLocaleString()}</Td>
                  <Td>
                    <Button
                      colorScheme="green"
                      as={Link}
                      to={`${item._id}/update`}
                    >
                      تعديل
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      onClick={() => HandleDelete(item._id)}
                    >
                      حذف
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Pagination
        totalPages={data?.paginationResult?.numberOfPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </Stack>
  );
}
