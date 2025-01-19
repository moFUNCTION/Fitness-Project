import {
  Heading,
  HStack,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { TrashRaw } from "./Components/TrashRaw/TrashRaw";
export default function Index() {
  const { search, pathname } = useLocation();
  const [searchValue] = search.split("=").slice(-1);
  const Navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!search) {
      Navigate("?search=toolOrMachine");
    }
  }, [pathname]);

  const { data, loading, error, HandleRender } = useFetch({
    endpoint: `/${searchValue}/deleted/trash`,
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
          اهلا بك في سلة مهملات : {searchValue}
        </Heading>
      </HStack>
      <TableContainer
        as={Skeleton}
        flexShrink="0"
        minH="400px"
        isLoaded={!loading}
        w="100%"
        className="no-scroll-bar"
      >
        <Table
          size={{
            base: "sm",
            md: "md",
            lg: "lg",
          }}
        >
          <Thead w="100%">
            <Tr>
              <Th>العنوان</Th>
              <Th>الفئة</Th>
              <Th>تم الانشاء بتوقيت</Th>
              <Th>استرجاع</Th>
              <Th>الحذف</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data?.map((item) => {
              return (
                <TrashRaw
                  onRender={HandleRender}
                  {...item}
                  key={item._id}
                  category={searchValue}
                />
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        isLoading={loading}
        totalPages={data?.paginationResult?.numberOfPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </Stack>
  );
}
