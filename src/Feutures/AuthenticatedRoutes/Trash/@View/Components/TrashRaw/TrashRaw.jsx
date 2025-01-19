import { Button, Td, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";
import { useApiRequest } from "../../../../../../Hooks/useApiRequest/useApiRequest";
import { useAuth } from "../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { DeleteModal } from "../../../../../../Components/Common/DeleteModal/DeleteModal";

export const TrashRaw = ({ title, category, createdAt, _id, onRender }) => {
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { user } = useAuth();
  const {
    sendRequest: onRestore,
    error: onRestorError,
    loading: onRestoreLoading,
  } = useApiRequest();

  const HandleRestore = async () => {
    await onRestore({
      url: `${category}/${_id}/restore`,
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
      method: "put",
    });
    onRender();
    toast({
      title: "تم الاسترجاع بنجاح",
      status: "success",
    });
  };

  const {
    isOpen: isOpenDeleteModal,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();

  const { sendRequest: onDeleteTool, loading: DeleteLoadingEvent } =
    useApiRequest();

  const HandleDelete = async () => {
    try {
      await onDeleteTool({
        url: `/${category}/${_id}`,
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
        method: "delete",
      });
      onCloseDeleteModal();
      onRender();
      toast({
        title: "تم حذف  بنجاح",
        status: "success",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <DeleteModal
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        onDelete={HandleDelete}
        isLoading={DeleteLoadingEvent}
      />
      <Tr>
        <Td>{title}</Td>
        <Td>{category}</Td>
        <Td>{new Date(createdAt).toLocaleString("ar-EG")}</Td>
        <Td>
          <Button
            size={{
              base: "sm",
              md: "md",
            }}
            colorScheme="green"
            onClick={HandleRestore}
            isLoading={onRestoreLoading}
          >
            استرجاع
          </Button>
        </Td>
        <Td>
          <Button
            onClick={onOpenDeleteModal}
            size={{
              base: "sm",
              md: "md",
            }}
            colorScheme="red"
          >
            حذف
          </Button>
        </Td>
      </Tr>
    </>
  );
};
