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
export const CourseBox = ({
  title,
  description,
  createdAt,
  image,
  loading,
  updatedAt,
  _id,
  onRender,
  price,
  priceAfterDiscount,
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
      url: `/courses/${_id}/moveToTrash`,
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
  console.log(image);
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

          <Stack mt="6" spacing="3">
            <Heading size="md">العنوان : {title}</Heading>
            <Text>الوصف : {description || "لا يوجد وصف"}</Text>
            <Divider />
            <Text>السعر : {price || "لا يوجد وصف"}</Text>
            <Text>السعر بعد الخصم : {priceAfterDiscount || "لا يوجد وصف"}</Text>

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
            <Button as={Link} to={_id} variant="solid" colorScheme="blue">
              التوجه
            </Button>
            <Button
              as={Link}
              to={`update/${_id}`}
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
