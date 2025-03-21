import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Image,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { CgGym } from "react-icons/cg";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { LazyLoadedImage } from "../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { DeleteModal } from "../../../../Components/Common/DeleteModal/DeleteModal";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
const AdvertiseCard = ({ data, onRender }) => {
  const toast = useToast();
  const { user } = useAuth();
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

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
      url: `/advertise/${data._id}`,
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
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        bg={cardBg}
      >
        <LazyLoadedImage
          src={data.image}
          alt={data.title}
          w="100%"
          h="200px"
          ImageProps={{
            objectFit: "cover",
          }}
        />

        <Stack p="4" spacing="3">
          <Heading size="md" color={textColor}>
            {data.title}
          </Heading>
          <Divider borderColor={dividerColor} />

          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color={textColor}>
              <strong>النموذج المستهدف:</strong> {data.targetModel}
            </Text>
            <Text fontSize="sm" color={textColor}>
              <strong>المعرف:</strong> {data.targetModelId}
            </Text>
          </Flex>

          <Text fontSize="sm" color={textColor}>
            <strong>تاريخ الإنشاء:</strong>{" "}
            {new Date(data.createdAt).toLocaleString("ar-EG")}
          </Text>
          <Text fontSize="sm" color={textColor}>
            <strong>تاريخ التحديث:</strong>{" "}
            {new Date(data.updatedAt).toLocaleString("ar-EG")}
          </Text>
          <Flex mt="4" gap="3">
            <Button colorScheme="green" as={Link} to={`${data._id}/update`}>
              تعديل
            </Button>
            <Button onClick={onOpenDeleteModal} colorScheme="red">
              ازالة
            </Button>
          </Flex>
        </Stack>
      </Box>
    </>
  );
};
export default function Index() {
  const [page, setPage] = useState(1);

  const { data, loading, error, HandleRender } = useFetch({
    endpoint: "advertise",
    params: {
      page,
    },
  });

  return (
    <Stack h="100%" overflow="auto" p="3" w="100%">
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
          اهلا بك في الاعلانات
          <CgGym />
        </Heading>
        <Button as={Link} to="add" colorScheme="blue">
          اضافة اعلان
        </Button>
      </HStack>
      <Flex
        justifyContent="center"
        p="3"
        gap="3"
        wrap="wrap"
        as={Skeleton}
        isLoaded={!loading}
        minH="500px"
        flexShrink="0"
      >
        {data?.data?.map((item) => {
          return (
            <AdvertiseCard key={item._id} data={item} onRender={HandleRender} />
          );
        })}
      </Flex>
      <Pagination
        isLoading={loading}
        totalPages={data?.paginationResult?.numberOfPages}
        currentPage={page}
        onPageChange={(page) => setPage(page)}
      />
    </Stack>
  );
}
