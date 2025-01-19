import {
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  TableContainer,
  Textarea,
  Toast,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { GiMedicinePills } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { UserProfileBox } from "./Components/UserBox";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
const paths = [
  {
    name: "المشرفين",
    href: "admins",
  },
  {
    name: "المحررين",
    href: "sub-admins",
  },
  {
    name: "المدربين الرسميين",
    href: "ls-trainers",
  },
  {
    name: "المدربين المشتركين",
    href: "trainers",
  },
  {
    name: "المستخدمين",
    href: "trainees",
  },
];
const NotificationModal = ({ isOpen, onClose, onSend, isLoading }) => {
  const messageRef = useRef();

  const handleSend = () => {
    onSend(messageRef.current.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader borderBottom="1px" borderColor="gray.100" py={4}>
          ارسال اشعار
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Textarea ref={messageRef} placeholder="الرسالة" />
          <Button
            onClick={handleSend}
            mt="2"
            colorScheme="orange"
            w="100%"
            isLoading={isLoading}
          >
            ارسال اشعار
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default function Index() {
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: "top-right",
  });
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState("admins");
  const [page, setPage] = useState(1);
  const { data, loading, HandleRender } = useFetch({
    endpoint: `/users/getAll/${selectedRole}`,
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  const {
    isOpen: isNotificationOpen,
    onOpen: onNotificationOpen,
    onClose: onNotificationClose,
  } = useDisclosure();
  const {
    sendRequest: sendNotificationRequest,
    loading: sendNotificationLoading,
  } = useApiRequest();

  const handleSendNotification = async (message) => {
    await sendNotificationRequest({
      url: "notifications",
      method: "post",
      body: {
        users: [],
        message,
      },
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    onNotificationClose();
    toast({
      title: "تم الارسال",
      status: "success",
    });
  };

  return (
    <>
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={onNotificationClose}
        onSend={handleSendNotification}
        isLoading={sendNotificationLoading}
      />
      <Stack w="100%" p="3">
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
            اهلا بك في المستخدمين
            <GiMedicinePills />
          </Heading>
          <Flex gap="3" alignItems="center">
            <Button as={Link} to="add" colorScheme="blue">
              اضافة مستخدم
            </Button>
            <Button onClick={onNotificationOpen} colorScheme="orange">
              ارسال اشعار
            </Button>
          </Flex>
        </HStack>
        <Flex
          justifyContent="center"
          alignItems="center"
          bgColor="gray.50"
          p="3"
          borderRadius="lg"
          gap="3"
          wrap="wrap"
        >
          {paths.map((path) => {
            return (
              <Button
                variant={path.href === selectedRole ? "outline" : "solid"}
                colorScheme="blue"
                key={path.href}
                onClick={() => setSelectedRole(path.href)}
              >
                {path.name}
              </Button>
            );
          })}
        </Flex>
        <Flex
          p="3"
          minH="400px"
          as={Skeleton}
          isLoaded={!loading}
          fadeDuration={2}
          flexShrink="0"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          gap="5"
        >
          {data?.data?.map((item) => {
            return (
              <UserProfileBox {...item} key={item.id} onRender={HandleRender} />
            );
          })}
          {data?.data?.length === 0 && (
            <Heading
              size="md"
              border="1px"
              borderColor="gray.400"
              p="3"
              borderRadius="lg"
              w="100%"
              maxW="400px"
              textAlign="center"
            >
              لا يوجد بيانات
            </Heading>
          )}
        </Flex>

        <Pagination
          isLoading={loading}
          totalPages={data?.paginationResult?.numberOfPages}
          currentPage={page}
          onPageChange={(page) => setPage(page)}
        />
      </Stack>
    </>
  );
}
