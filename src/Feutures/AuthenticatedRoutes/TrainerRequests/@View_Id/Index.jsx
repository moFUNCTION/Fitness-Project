import React, { useState } from "react";
import {
  Skeleton,
  Stack,
  Box,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  Flex,
  Button,
  Heading,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Divider,
  Badge,
  GridItem,
  Grid,
} from "@chakra-ui/react";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { LazyLoadedImage } from "../../../../Components/Common/LazyLoadedImage/LazyLoadedImage";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
const DisapproveModal = ({
  isOpen,
  onClose,
  onSubmit,
  onChangeReason,
  reason,
  isLoading,
}) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>عدم الموافقة علي الطلب</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={reason}
            placeholder="السبب"
            onChange={onChangeReason}
          />
        </ModalBody>
        <ModalFooter gap="3">
          <Button colorScheme="blue" onClick={onClose}>
            غلق
          </Button>
          <Button colorScheme="red" onClick={onSubmit} isLoading={isLoading}>
            ارسال
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default function TrainerRequestDetails() {
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const { user } = useAuth();
  const { id } = useParams();
  const { data, loading } = useFetch({
    endpoint: `/trainerRequests/${id}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });

  const {
    user: { username, email: userEmail },
    createdAt,
    status,
    name,
    age,
    yearsOfExperience,
    phone,
    nationality,
    location,
    numberOfTrainees,
    introduceYourSelf,
    certificates,
    _id,
    note,
    reasonOfRejection,
    email,
  } = data?.data || { user: {} };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "yellow";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "تمت الموافقة";
      case "rejected":
        return "مرفوض";
      default:
        return "قيد المراجعة";
    }
  };

  const {
    sendRequest: deleteRequest,
    loading: deleteRequestLoading,
    error: deleteRequestError,
  } = useApiRequest();

  const HandleDelete = async () => {
    await deleteRequest({
      method: "delete",
      url: `/trainerRequests/${_id}/moveToTrash`,
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });

    toast({
      title: "تم الحذف بنجاح",
      status: "success",
    });
    Navigate("/trainer-requests");
  };

  const {
    sendRequest: ApproveRequest,
    loading: ApproveRequestLoading,
    error: ApproveRequestError,
  } = useApiRequest();

  const HandleApprove = async () => {
    await ApproveRequest({
      method: "put",
      url: `/trainerRequests/${_id}/accept`,
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });

    toast({
      title: "تم القبول بنجاح",
      status: "success",
    });
    Navigate("/trainer-requests");
  };

  const {
    sendRequest: disApproveRequest,
    loading: DisApproveLoading,
    error: DisApproveError,
  } = useApiRequest();

  const HandleDisApprove = async () => {
    await disApproveRequest({
      method: "put",
      url: `/trainerRequests/${_id}/reject`,
      body: {
        reasonOfRejection: reason,
      },
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });

    toast({
      title: "تم الرفض بنجاح",
      status: "success",
    });
    Navigate("/trainer-requests");
  };

  const [reason, setReason] = useState("");
  const {
    isOpen: isOpenDisapprovalModal,
    onOpen: onOpenDisapprovalModal,
    onClose: onCloseDisapprovalModal,
  } = useDisclosure();

  return (
    <>
      <DisapproveModal
        isOpen={isOpenDisapprovalModal}
        onClose={onCloseDisapprovalModal}
        onChangeReason={(e) => setReason(e.target.value)}
        reason={reason}
        onSubmit={HandleDisApprove}
        isLoading={DisApproveLoading}
      />
      <Stack p="6" gap="6" w="100%" as={Skeleton} isLoaded={!loading}>
        <Box>
          <Heading size="lg" mb="4">
            تفاصيل طلب المدرب
          </Heading>
          <Badge colorScheme={getStatusColor(status)} fontSize="md" p="2">
            {getStatusText(status)}
          </Badge>
        </Box>
        <Divider />

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={6}
          dir="rtl"
        >
          <GridItem>
            <Flex gap="8" flexWrap="wrap" align="stretch" spacing={4}>
              <Stack flexGrow="1" bgColor="gray.50" p="8" minW="300px">
                <Text fontWeight="bold" mb="2">
                  المعلومات الشخصية
                </Text>
                <Text>الاسم: {name}</Text>
                <Text>العمر: {age} سنة</Text>
                <Text>الجنسية: {nationality}</Text>
                <Text>الموقع: {location}</Text>
                <Text>رقم الهاتف: {phone}</Text>
                <Text>البريد الإلكتروني: {email}</Text>
              </Stack>

              <Stack flexGrow="1" bgColor="gray.50" p="8" minW="300px">
                <Text fontWeight="bold" mb="2">
                  معلومات المدرب
                </Text>
                <Text>سنوات الخبرة: {yearsOfExperience}</Text>
                <Text>عدد المتدربين: {numberOfTrainees}</Text>
                <Text>اسم المستخدم: {username}</Text>
                <Text>البريد الإلكتروني للحساب: {userEmail}</Text>
              </Stack>
            </Flex>
          </GridItem>

          <GridItem>
            <VStack
              flexGrow="1"
              bgColor="gray.50"
              p="8"
              minW="300px"
              align="stretch"
              spacing={4}
            >
              <Box>
                <Text fontWeight="bold" mb="2">
                  نبذة تعريفية
                </Text>
                <Text>{introduceYourSelf}</Text>
              </Box>

              {reasonOfRejection && (
                <Box>
                  <Text fontWeight="bold" color="red.500" mb="2">
                    سبب الرفض
                  </Text>
                  <Text>{reasonOfRejection}</Text>
                </Box>
              )}

              {note && (
                <Box>
                  <Text fontWeight="bold" mb="2">
                    ملاحظات
                  </Text>
                  <Text>{note}</Text>
                </Box>
              )}

              <Box>
                <Text fontWeight="bold" mb="2">
                  تاريخ التقديم
                </Text>
                <Text>{formatDate(createdAt)}</Text>
              </Box>
              {status === "pending" && (
                <Flex gap="3">
                  <Button
                    onClick={HandleApprove}
                    isLoading={ApproveRequestLoading}
                    colorScheme="green"
                  >
                    الموافقة عليه
                  </Button>
                  <Button onClick={onOpenDisapprovalModal} colorScheme="red">
                    الرفض
                  </Button>
                  <Button
                    onClick={HandleDelete}
                    isLoading={deleteRequestLoading}
                    colorScheme="red"
                  >
                    الحذف
                  </Button>
                </Flex>
              )}
            </VStack>
          </GridItem>
        </Grid>

        {certificates && certificates.length > 0 && (
          <Stack gap="5">
            <Heading size="md" fontWeight="bold">
              الشهادات
            </Heading>
            <Divider />
            <Flex gap={4}>
              {certificates.map((cert, index) => (
                <LazyLoadedImage
                  key={index}
                  src={cert}
                  alt={`شهادة ${index + 1}`}
                  borderRadius="md"
                  fallback={
                    <Box p="4" bg="gray.100" borderRadius="md">
                      صورة الشهادة غير متوفرة
                    </Box>
                  }
                  w="100%"
                  maxW="300px"
                />
              ))}
            </Flex>
          </Stack>
        )}
      </Stack>
    </>
  );
}
