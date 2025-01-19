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
import { Controller, useForm } from "react-hook-form";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { date, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
import { CouponeBox } from "./Components/CouponeBox/CouponeBox";
import { CiDiscount1 } from "react-icons/ci";
import { CenteredTextWithLines } from "../../../../Components/Common/CenteredTextWithLines/CenteredTextWithLines";

import { ChakraDatePicker } from "../../../../Components/Common/ChakraDatePicker/ChakraDatePicker";
Date.prototype.toCustomDateString = function () {
  const year = this.getFullYear();
  const month = String(this.getMonth() + 1).padStart(2, "0");
  const day = String(this.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const schema = z.object({
  name: z.string().min(1, { message: "الرجاء ادخال اسم للكوبون" }),
  expire: z.date({ message: "الرجاء ادخال تاريخ انتهاء الكوبون" }),
  discount: z.number({ message: "الرجاء ادخال قيمة الخصم" }),
});
const AddCouponModal = ({ onClose, isOpen, onRenderPage }) => {
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { user } = useAuth();
  const { sendRequest: onCreateDiscount, loading, error } = useApiRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      await onCreateDiscount({
        url: `/coupons`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: { ...data, expire: new Date(data.expire).toCustomDateString() },
        method: "post",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم انشاء  كوبون بنجاح",
        status: "success",
      });
    } catch (err) {
      // toast({
      //   title: "خطأ في انشاء  الكوبون",
      //   description: err.message,
      //   status: "err",
      // });
      console.log(err);
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
        <ModalHeader>اضافة كوبون </ModalHeader>
        <ModalCloseButton />
        <ModalBody as={Stack} gap="3">
          <InputElement
            errors={errors}
            name="name"
            register={register}
            placeholder="اسم الكوبون"
            Icon={CiDiscount1}
          />
          <Controller
            name="expire"
            control={control}
            render={({ field }) => {
              return (
                <Stack
                  borderRadius="lg"
                  border="1px"
                  borderColor="gray.300"
                  p="3"
                >
                  {field.value && (
                    <CenteredTextWithLines TextAlign="left">
                      <Text flexShrink="0">تاريخ الانتهاء</Text>
                    </CenteredTextWithLines>
                  )}

                  <ChakraDatePicker
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    placeholder="تاريخ الانتهاء"
                    minDate={Date.now()}
                  />
                </Stack>
              );
            }}
          />

          <InputElement
            errors={errors}
            name="discount"
            register={register}
            placeholder="قيمة الخصم"
            Icon={CiDiscount1}
            type="number"
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
    endpoint: "/coupons",
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
      <AddCouponModal
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
            size={{
              base: "sm",
              md: "md",
            }}
          >
            اهلا بك في الكوبونات
            <MdQuiz />
          </Heading>
          <Button
            size={{
              base: "sm",
              md: "md",
            }}
            colorScheme="blue"
            onClick={onOpen}
          >
            اضافة كوبون
          </Button>
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
                <Th>اسم الكوبون</Th>
                <Th>قيمة الخصم</Th>
                <Th>الصلاحية</Th>
                <Th>عدد الاستخدامات</Th>
                <Th>التعديل</Th>
                <Th>الحذف</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data?.map((item) => {
                return (
                  <CouponeBox
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
