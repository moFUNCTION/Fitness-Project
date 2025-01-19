import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  Flex,
  useDisclosure,
  Box,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { VideoViewerModal } from "../../../../../../Components/Common/VideoViewerModal/VideoViewerModal";
import { LazyLoadedImage } from "../../../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DeleteModal } from "../../../../../../Components/Common/DeleteModal/DeleteModal";
import { useApiRequest } from "../../../../../../Hooks/useApiRequest/useApiRequest";
import { useAuth } from "../../../../../../Context/UserDataContextProvider/UserDataContextProvder";
export const LessonBox = ({
  title,
  description,
  createdAt,
  image,
  loading,
  updatedAt,
  _id,
  onRender,
  type,
  video,
}) => {
  const toast = useToast();
  const { user } = useAuth();

  const {
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
    isOpen: isOpenedDeleteModal,
  } = useDisclosure();
  const {
    sendRequest,
    loading: sendRequestLoading,
    error: sendRequestError,
  } = useApiRequest();
  const HandleDelete = async () => {
    await sendRequest({
      method: "delete",
      url: `/lessons/${_id}`,
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    onRender();
    toast({
      title: "تم الحذف بنجاح",
      status: "success",
      position: "top-right",
      duration: 3000,
      isClosable: true,
    });
  };
  const {
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
    isOpen: isOpenedVideoModal,
  } = useDisclosure();
  const [videoId] = video?.url.split("/").slice(-1);

  return (
    <>
      <DeleteModal
        onDelete={HandleDelete}
        isLoading={sendRequestLoading}
        isOpen={isOpenedDeleteModal}
        onClose={onCloseDeleteModal}
      />
      <VideoViewerModal
        url={`https://player.vimeo.com/video/${videoId}`}
        isOpen={isOpenedVideoModal}
        onClose={onCloseVideoModal}
        size="2xl"
      />

      <Card as={Skeleton} isLoaded={!loading} w="100%" maxW="md">
        <CardBody>
          <LazyLoadedImage
            w="100%"
            h="200px"
            src={video?.thumbnail}
            alt="image"
            borderRadius="lg"
            ImageProps={{
              objectFit: "cover",
            }}
          />

          <Stack mt="6" spacing="3">
            <Heading size="md">العنوان : {title}</Heading>
            <Text>الوصف : {description || "لا يوجد وصف"}</Text>
            <Divider />

            <Text>
              تم الانشاء : {new Date(createdAt).toLocaleString("ar-EG")}
            </Text>
            {updatedAt && (
              <Text>
                تم التحديث : {new Date(updatedAt).toLocaleString("ar-EG")}
              </Text>
            )}
            <Text>
              الحالة : {type === "recorded" ? "مسجل" : "لم يتم تسجيله بعد"}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Flex flexWrap="wrap" w="100%" justifyContent="center" gap="3">
            <Button
              onClick={onOpenVideoModal}
              variant="solid"
              colorScheme="blue"
            >
              مشاهدة
            </Button>
            <Button variant="solid" colorScheme="green">
              تعديل
            </Button>
            <Button
              onClick={onOpenDeleteModal}
              variant="solid"
              colorScheme="red"
            >
              حذف
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </>
  );
};
