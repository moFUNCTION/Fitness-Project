import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Stack,
  Skeleton,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  HStack,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdQuiz } from "react-icons/md";
import { Pagination } from "../../../../../Components/Common/Pagination/Pagination";
import { useFetch } from "../../../../../Hooks/useFetch/useFetch";
import NoDataImage from "../../../../../Assets/NoData/9264822.jpg";
import { LazyLoadedImage } from "../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useForm } from "react-hook-form";
import { InputElement } from "../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiRequest } from "../../../../../Hooks/useApiRequest/useApiRequest";
export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/bodyParts",
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });

  return (
    <>
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
            اهلا بك في اجزاء الجسم
            <MdQuiz />
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
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
                <Th>العنوان</Th>
                <Th>تم الانشاء بتوقيت</Th>
                <Th>تم التحديث بتوقيت</Th>
                <Th>التعديل</Th>
                <Th>الحذف</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.map((item) => {
                return (
                  <BodyPart
                    onRenderPage={HandleRender}
                    key={item._id}
                    {...item}
                  />
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
    </>
  );
}
