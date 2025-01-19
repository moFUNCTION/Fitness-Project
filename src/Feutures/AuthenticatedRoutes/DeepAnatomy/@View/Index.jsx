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
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import NoDataImage from "../../../../Assets/NoData/9264822.jpg";
import { LazyLoadedImage } from "../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useForm } from "react-hook-form";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
import { DeepAnatomy } from "./Components/DeepAnatomy/DeepAnatomy";
const schema = z.object({
  title: z.string().min(1, { message: "الرجاء ادخال اسم الالة" }),
});
const AdddeepAnatomyModal = ({ onClose, isOpen, onRenderPage }) => {
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { user } = useAuth();
  const { sendRequest: onCreateTool, loading, error } = useApiRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      await onCreateTool({
        url: `/deepAnatomy`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: data,
        method: "post",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم انشاء التشريح العميق بنجاح",
        status: "success",
      });
    } catch (err) {
      toast({
        title: "خطأ في انشاء التشريح العميق",
        description: err.message,
        status: "err",
      });
    }
  };
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>اضافة تشريح عميق </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputElement
            errors={errors}
            name="title"
            register={register}
            placeholder="اسم التشريح العميق"
            Icon={CgGym}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" variant="outline" ml={3} onClick={onClose}>
            غلق
          </Button>
          <Button
            isLoading={isSubmitting}
            colorScheme="green"
            onClick={handleSubmit(onSubmit)}
          >
            اضافة
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Index() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, loading, HandleRender } = useFetch({
    endpoint: "/deepAnatomy",
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <AdddeepAnatomyModal
        onRenderPage={HandleRender}
        isOpen={isOpen}
        onClose={onClose}
      />
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
            اهلا بك في التشريحات العميقة
            <MdQuiz />
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            اضافة تشريح عميق
          </Button>
        </HStack>
        <TableContainer
          as={Skeleton}
          flexShrink="0"
          minH="400px"
          isLoaded={!loading}
          w="100%"
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
                  <DeepAnatomy
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
          isLoading={loading}
        />
      </Stack>
    </>
  );
}
