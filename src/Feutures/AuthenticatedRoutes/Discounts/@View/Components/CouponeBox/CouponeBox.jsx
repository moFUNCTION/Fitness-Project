import {
  Button,
  Modal,
  Td,
  Tr,
  useToast,
  Table,
  Thead,
  Tbody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { z } from "zod";
import { useAuth } from "../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useApiRequest } from "../../../../../../Hooks/useApiRequest/useApiRequest";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputElement } from "../../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { DeleteModal } from "../../../../../../Components/Common/DeleteModal/DeleteModal";
import { CiDiscount1 } from "react-icons/ci";
import { CenteredTextWithLines } from "../../../../../../Components/Common/CenteredTextWithLines/CenteredTextWithLines";
import { ChakraDatePicker } from "../../../../../../Components/Common/ChakraDatePicker/ChakraDatePicker";
Date.prototype.toCustomDateString = function () {
  const year = this.getFullYear();
  const month = String(this.getMonth() + 1).padStart(2, "0");
  const day = String(this.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const schema = z.object({
  name: z.string().min(1, { message: "الرجاء ادخال اسم للكوبون" }),
  expire: z
    .date({ message: "الرجاء ادخال تاريخ انتهاء الكوبون" })
    .or(z.string({ message: "الرجاء اضافة تاريخ انتهاء صلاحية الكود" })),
  discount: z.number({ message: "الرجاء ادخال قيمة الخصم" }),
});
const UpdateCouponeModal = ({
  onClose,
  isOpen,
  onRenderPage,
  defaultValues,
}) => {
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
    defaultValues,
  });
  const onSubmit = async (data) => {
    try {
      await onCreateDiscount({
        url: `/coupons/${defaultValues._id}`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: {
          ...data,
          expire: new Date(data.expire).toCustomDateString(),
        },
        method: "put",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم تحديث  كوبون بنجاح",
        status: "success",
      });
    } catch (err) {
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
        <ModalHeader>تحديث كوبون </ModalHeader>
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
            تحديث
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export const CouponeBox = ({
  _id,
  name,
  onRenderPage,
  discount,
  expire,
  numberOfUsage,
}) => {
  const { user } = useAuth();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { sendRequest: onDeleteTool, loading: DeleteLoadingEvent } =
    useApiRequest();
  const HandleDelete = async (data) => {
    try {
      await onDeleteTool({
        url: `/coupons/${_id}/moveToTrash`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: data,
        method: "delete",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم حذف  الكوبون بنجاح",
        status: "success",
      });
    } catch (err) {
      //   toast({
      //     title: "خطأ في حذف الجهاز",
      //     description: err.message,
      //     status: "err",
      //   });
      console.log(err);
    }
  };
  const {
    isOpen: isOpenDeleteModal,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();
  return (
    <>
      <DeleteModal
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        isLoading={DeleteLoadingEvent}
        onDelete={HandleDelete}
      />
      <UpdateCouponeModal
        isOpen={isOpen}
        onClose={onClose}
        defaultValues={{
          name,
          discount,
          expire,
          numberOfUsage,
          _id,
        }}
        onRenderPage={onRenderPage}
      />
      <Tr key={_id}>
        <Td>{name}</Td>
        <Td>{Math.floor(Number(discount))}</Td>
        <Td>{new Date(expire).toLocaleString("ar-EG")}</Td>
        <Td>
          <Button>{numberOfUsage}</Button>
        </Td>
        <Td>
          <Button
            size={{
              base: "sm",
              lg: "md",
            }}
            colorScheme="green"
            onClick={onOpen}
          >
            تعديل
          </Button>
        </Td>
        <Td>
          <Button
            size={{
              base: "sm",
              lg: "md",
            }}
            onClick={onOpenDeleteModal}
            isLoading={DeleteLoadingEvent}
            colorScheme="red"
          >
            حذف
          </Button>
        </Td>
      </Tr>
    </>
  );
};
