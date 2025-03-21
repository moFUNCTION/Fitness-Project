import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  Stack,
  TableContainer,
  Textarea,
  Toast,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState, useTransition } from "react";
import { GiMedicinePills } from "react-icons/gi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { Pagination } from "../../../../Components/Common/Pagination/Pagination";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { UserProfileBox } from "./Components/UserBox";
import { useApiRequest } from "../../../../Hooks/useApiRequest/useApiRequest";
import { MdCancel, MdNotifications } from "react-icons/md";
import { useForm, useWatch } from "react-hook-form";
import { ErrorText } from "../../../../Components/Common/ErrorText/ErrorText";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SearchField,
  Title,
} from "../../../../Components/Common/SearchField/SearchField";
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

const Models = [
  { en: "Courses", ar: "كورس", value: "Course" },
  { en: "Packages", ar: "باقة", value: "Package" },
  { en: "Exercises", ar: "تمرين", value: "Exercise" },
  { en: "Categories", ar: "فئة", value: "Category" },
  { en: "Supplements", ar: "مكمل غذائي", value: "Supplement" },
  { en: "Vitamins", ar: "فيتامين", value: "Vitamin" },
];

const schema = z.object({
  message: z
    .string()
    .min(3, { message: "يجب أن يكون الرسالة على الأقل 3 أحرف" })
    .max(100, { message: "يجب أن لا يتجاوز الرسالة 100 حرف" }), // Validate title length
  targetModel: z.string().min(1, { message: "يجب اختيار الفئة المستهدفة" }), // Ensure a target model is selected
  targetModelId: z.string().min(1, { message: "يجب اختيار العنصر المستهدف" }), // Ensure a target model ID is selected
  gender: z.any(),
});

const NotificationModal = ({ isOpen, onClose, onSend, isLoading }) => {
  const {
    register,
    formState: { errors },
    control,
    getValues,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const targetModel = useWatch({
    control,
    name: "targetModel",
  });
  const {
    data: Items,
    loading: ItemsLoading,
    error: ItemsError,
  } = useFetch({
    endpoint: targetModel,
    params: {
      limit: 100000,
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader borderBottom="1px" borderColor="gray.100" py={4}>
          ارسال اشعار
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody as={Stack} gap="5" py={6}>
          <Textarea {...register("message")} placeholder="الرسالة" />
          <ErrorText>{errors.message?.message}</ErrorText>
          <Select
            size="lg"
            {...register("targetModel")}
            placeholder="الفئة المستهدفة"
          >
            {Models.map((model) => {
              return (
                <option value={model.en} key={model.en}>
                  {model.ar}
                </option>
              );
            })}
          </Select>
          <ErrorText>{errors?.targetModel?.message}</ErrorText>

          <Skeleton isLoaded={!ItemsLoading}>
            <Select
              {...register("targetModelId")}
              size="lg"
              placeholder="العنصر المستهدف"
            >
              {Items?.data?.map((item) => {
                return (
                  <option value={item._id} key={item._id}>
                    {item.title}
                  </option>
                );
              })}
            </Select>
          </Skeleton>
          <ErrorText>{errors?.targetModelId?.message}</ErrorText>

          <Select {...register("gender")}>
            <option value="male">رجال</option>
            <option value="female">اناث</option>
          </Select>
          <Button
            onClick={handleSubmit(onSend)}
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
  const [search] = useSearchParams();
  const Navigate = useNavigate();
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: "top-right",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const HandleSelectUser = (id) => {
    setSelectedItems((prev) => [...prev, id]);
  };
  const HandleRemoveUserSelection = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item !== id));
  };
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState("admins");
  const [isPending, startTransition] = useTransition();
  const HandleChangeRole = (role) =>
    startTransition(() => setSelectedRole(role));
  const [page, setPage] = useState(1);
  const { data, loading, HandleRender } = useFetch({
    endpoint: `/users/getAll/${selectedRole}`,
    params: {
      page,
      [search.get("searchByName") && "username"]: search.get("searchByName"),
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

  const handleSendNotification = async (data) => {
    const DataWillSend = { ...data };
    DataWillSend.targetModel = Models.find((model) => {
      return model.en === data.targetModel;
    }).value;
    await sendNotificationRequest({
      url: "notifications",
      method: "post",
      body: {
        users: selectedItems,
        ...DataWillSend,
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
            <Button onClick={onNotificationOpen} gap="3" colorScheme="orange">
              ارسال اشعار
            </Button>
            <SearchField
              onSubmit={(value) => Navigate(`?searchByName=${value}`)}
            >
              <Title>البحث عن مستخدم</Title>
            </SearchField>
            {search.get("searchByName") && (
              <Button colorScheme="blue" onClick={() => Navigate()}>
                يتم البحث علي {search.get("searchByName")}
              </Button>
            )}
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
          as={Skeleton}
          isLoaded={!isPending}
        >
          {paths.map((path) => {
            return (
              <Button
                variant={path.href === selectedRole ? "outline" : "solid"}
                colorScheme="blue"
                key={path.href}
                onClick={() => HandleChangeRole(path.href)}
              >
                {path.name}
              </Button>
            );
          })}
        </Flex>
        {selectedItems.length >= 1 && (
          <Flex gap="4" justifyContent="center" p="3" bgColor="gray.100">
            <Button onClick={onNotificationOpen} gap="3" colorScheme="orange">
              ارسال اشعار للمستخدمين
              <MdNotifications />
            </Button>
            <IconButton onClick={() => setSelectedItems([])} colorScheme="red">
              <MdCancel />
            </IconButton>
          </Flex>
        )}

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
              <UserProfileBox
                {...item}
                key={item.id}
                onRender={HandleRender}
                onSelect={HandleSelectUser}
                onRemoveSelection={HandleRemoveUserSelection}
                isSelected={selectedItems.includes(item._id)}
              />
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
