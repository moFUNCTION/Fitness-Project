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
} from "@chakra-ui/react";
import React from "react";
import { z } from "zod";
import { useAuth } from "../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useApiRequest } from "../../../../../../Hooks/useApiRequest/useApiRequest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputElement } from "../../../../../../Components/Common/InputElement/InputElement";
import { CgGym } from "react-icons/cg";
import { DeleteModal } from "../../../../../../Components/Common/DeleteModal/DeleteModal";
const schema = z.object({
  title: z.string().min(1, { message: "الرجاء ادخال الاسم" }),
});
const UpdateToolOrMachineModal = ({ item, onClose, isOpen, onRenderPage }) => {
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
    defaultValues: {
      title: item?.title,
    },
  });
  const onSubmit = async (data) => {
    try {
      await onCreateTool({
        url: `/bodyParts/${item.id}`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: data,
        method: "put",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم تحديث الجهاز بنجاح",
        status: "success",
      });
    } catch (err) {
      toast({
        title: "خطأ في تحديث الجهاز",
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
        <ModalHeader>تعديل </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputElement
            errors={errors}
            name="title"
            register={register}
            placeholder="العنوان"
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
export const BodyPart = ({
  _id,
  title,
  createdAt,
  updatedAt,
  onRenderPage,
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
        url: `/bodyParts/${_id}/moveToTrash`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        body: data,
        method: "delete",
      });
      onClose();
      onRenderPage();
      toast({
        title: "تم حذف  بنجاح",
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
      <UpdateToolOrMachineModal
        isOpen={isOpen}
        onClose={onClose}
        item={{
          title,
          id: _id,
        }}
        onRenderPage={onRenderPage}
      />
      <Tr key={_id}>
        <Td>{title}</Td>
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
