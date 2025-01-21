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
  Divider,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { z } from "zod";
import { useAuth } from "../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useApiRequest } from "../../../../../../Hooks/useApiRequest/useApiRequest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputElement } from "../../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { DeleteModal } from "../../../../../../Components/Common/DeleteModal/DeleteModal";
const schema = z.object({
  title_AR: z.string().min(1, { message: "الرجاء ادخال العنوان بالعربية  " }),
  title_EN: z
    .string()
    .min(1, { message: "الرجاء ادخال العنوان بالانجليزية  " }),
});
const UpdateMealsCategoryModal = ({ item, onClose, isOpen, onRenderPage }) => {
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
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title_AR: item?.Title_AR,
      title_En: item?.Title_AR,
    },
  });
  useEffect(() => {
    reset({
      title_AR: item?.Title_AR,
      title_EN: item?.Title_EN,
    });
  }, []);
  const onSubmit = async (data) => {
    try {
      await onCreateTool({
        url: `/mealsCategory/${item.id}`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: {
          title_AR: data.title_AR,
          title_EN: data.title_EN,
        },
        method: "put",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم تحديث الصنف بنجاح",
        status: "success",
      });
    } catch (err) {
      toast({
        title: "خطأ في تحديث  الصنف",
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
        <ModalHeader>تعديل الصنف </ModalHeader>
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
            تحديث
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export const MealCategory = ({
  _id,
  title,
  createdAt,
  updatedAt,
  onRenderPage,
  Title_AR,
  Title_EN,
  title_EN,
  title_AR,
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
        url: `/mealsCategory/${_id}/moveToTrash`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: data,
        method: "delete",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم حذف  الصنف بنجاح",
        status: "success",
      });
    } catch (err) {
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
      <UpdateMealsCategoryModal
        isOpen={isOpen}
        onClose={onClose}
        item={{
          Title_AR: Title_AR || title_AR,
          Title_EN: Title_EN || title_EN,
          id: _id,
        }}
        onRenderPage={onRenderPage}
      />
      <Tr key={_id}>
        <Td>{Title_AR || title_AR}</Td>
        <Td>{Title_EN || title_EN}</Td>
        <Td>{new Date(createdAt).toLocaleString()}</Td>
        <Td>{new Date(updatedAt).toLocaleString()}</Td>
        <Td>
          <Button colorScheme="green" onClick={onOpen}>
            تعديل
          </Button>
        </Td>
        <Td>
          <Button
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
