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
import { MealCategory } from "./Components/MealCategory/MealCategory";
import { DeleteModal } from "../../../../Components/Common/DeleteModal/DeleteModal";
const schema = z.object({
  title_AR: z.string().min(1, { message: "الرجاء ادخال العنوان بالعربية  " }),
  title_EN: z
    .string()
    .min(1, { message: "الرجاء ادخال العنوان بالانجليزية  " }),
});
const AddmealsCategoryModal = ({ onClose, isOpen, onRenderPage }) => {
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
        url: `/mealsCategory`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: {
          title_AR: data.title_AR,
          title_EN: data.title_EN,
        },
        method: "post",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم انشاء الصنف  بنجاح",
        status: "success",
      });
    } catch (err) {
      toast({
        title: "خطأ في انشاء الصنف ",
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
        <ModalBody gap="3" as={Stack}>
          <InputElement
            errors={errors}
            name="title_AR"
            register={register}
            placeholder="اسم الصنف بالعربية"
            Icon={CgGym}
          />

          <InputElement
            errors={errors}
            name="title_EN"
            register={register}
            placeholder="اسم الصنف بالانجليزية"
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
    endpoint: "/mealsCategory",
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  console.log(data);
  return (
    <>
      <AddmealsCategoryModal
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
            اهلا بك في اصناف الوجبات
            <MdQuiz />
          </Heading>
          <Button colorScheme="blue" onClick={onOpen}>
            اضافة صنف من الوجبات
          </Button>
        </HStack>
        <TableContainer
          as={Skeleton}
          minH="400px"
          isLoaded={!loading}
          overflow="auto"
          w="100%"
          flexShrink="0"
        >
          <Table size="lg">
            <Thead w="100%">
              <Tr>
                <Th>العنوان</Th>
                <Th>العنوان بالانجليزية</Th>
                <Th>تم الانشاء بتوقيت</Th>
                <Th>تم التحديث بتوقيت</Th>
                <Th>التعديل</Th>
                <Th>الحذف</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.map((item) => {
                return (
                  <MealCategory
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
