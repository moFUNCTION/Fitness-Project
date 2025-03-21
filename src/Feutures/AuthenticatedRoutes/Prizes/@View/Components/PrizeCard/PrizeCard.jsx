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
export const PrizeBox = ({
  title_ar,
  title_en,
  description_ar,
  description_en,
  createdAt,
  loading,
  updatedAt,
  _id,
  onRender,
  image,
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
  const {
    sendRequest,
    loading: sendRequestLoading,
    error: sendRequestError,
  } = useApiRequest();
  const HandleDelete = async () => {
    await sendRequest({
      method: "delete",
      url: `/prizes/${_id}`,
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

      <Card as={Skeleton} isLoaded={!loading} w="100%" maxW="md">
        <CardBody>
          <Box>
            <LazyLoadedImage
              w="100%"
              h="200px"
              src={image}
              alt="image"
              borderRadius="lg"
              ImageProps={{
                objectFit: "cover",
              }}
            />
          </Box>

          <Stack mt="6" spacing="3">
            <Heading size="md">العنوان : {title_ar}</Heading>
            <Text>الوصف : {description_ar || "لا يوجد وصف"}</Text>
            <Heading size="md">العنوان بالانجليزية : {title_en}</Heading>
            <Text>الوصف بالانجليزية : {description_en || "لا يوجد وصف"}</Text>
            <Text>
              تم الانشاء : {new Date(createdAt).toLocaleString("ar-EG")}
            </Text>
            {updatedAt && (
              <Text>
                تم التحديث : {new Date(updatedAt).toLocaleString("ar-EG")}
              </Text>
            )}
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Flex flexWrap="wrap" w="100%" justifyContent="center" gap="3">
            {/* <Button as={Link} to={_id} variant="solid" colorScheme="blue">
              مشاهدة
            </Button> */}
            <Button
              as={Link}
              to={`${_id}/update`}
              variant="solid"
              colorScheme="green"
            >
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
