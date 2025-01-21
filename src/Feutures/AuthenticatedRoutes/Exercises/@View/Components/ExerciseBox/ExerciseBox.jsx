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
export const ExerciseBox = ({
  title,
  Description,
  video: { thumbnail, url },
  createdAt,
  loading,
  updatedAt,
  recoveryAndStretching,
  Cardio,
  Warmup,
  _id,
  onRender,
}) => {
  const toast = useToast();
  const { user } = useAuth();
  const {
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
    isOpen: isOpenedVideoModal,
  } = useDisclosure();
  const {
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
    isOpen: isOpenedDeleteModal,
  } = useDisclosure();
  const [videoId] = url ? url.split("/")?.slice(-1) : [];
  const {
    sendRequest,
    loading: sendRequestLoading,
    error: sendRequestError,
  } = useApiRequest();
  const HandleDelete = async () => {
    await sendRequest({
      method: "delete",
      url: `/Exercises/${_id}/moveToTrash`,
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
      />
      <Card as={Skeleton} isLoaded={!loading} w="100%" maxW="md">
        <CardBody>
          <Box
            overflow="hidden"
            borderRadius="lg"
            _hover={{
              ".player": {
                opacity: 1,
              },
            }}
            pos="relative"
          >
            <Stack
              opacity="0"
              className="player"
              pos="absolute"
              inset="0"
              zIndex="1"
              bgColor="blue.600"
              justifyContent="center"
              alignItems="center"
              transition="0.3s"
              cursor="pointer"
              onClick={onOpenVideoModal}
            >
              <FaPlay color="white" fontSize="40px" />
            </Stack>
            <LazyLoadedImage
              w="100%"
              h="200px"
              src={thumbnail}
              alt="image"
              borderRadius="lg"
              ImageProps={{
                objectFit: "cover",
              }}
            />
          </Box>

          <Stack mt="6" spacing="3">
            <Heading size="md">العنوان : {title}</Heading>
            <Text>الوصف : {Description || "لا يوجد وصف"}</Text>
            <Text>
              تم الانشاء : {new Date(createdAt).toLocaleString("ar-EG")}
            </Text>
            {updatedAt && (
              <Text>
                تم التحديث : {new Date(updatedAt).toLocaleString("ar-EG")}
              </Text>
            )}
            <Text>
              هل به تمارين تعافي واطالة :{recoveryAndStretching ? "نعم" : "لا"}
            </Text>
            <Text>هل به كارديو :{Cardio ? "نعم" : "لا"}</Text>
            <Text>هل به احماء : {Warmup ? "نعم" : "لا"}</Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Flex flexWrap="wrap" w="100%" justifyContent="center" gap="3">
            <Button as={Link} to={_id} variant="solid" colorScheme="blue">
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
