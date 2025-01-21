import React from "react";
import { useRef } from "react";
import {
  Box,
  Text,
  Stack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Grid,
  GridItem,
  Divider,
  Icon,
  Avatar,
  Textarea,
  useToast,
  Flex,
  Checkbox,
} from "@chakra-ui/react";
import { FaCalendar, FaPhone, FaRuler, FaUser, FaWeight } from "react-icons/fa";
import { MdEdit, MdEmail, MdNotificationAdd } from "react-icons/md";
import { GiTargetPoster } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { useApiRequest } from "../../../../../Hooks/useApiRequest/useApiRequest";
import { useAuth } from "../../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { IoMdTrash } from "react-icons/io";
import { Link } from "react-router-dom";
import { DeleteModal } from "../../../../../Components/Common/DeleteModal/DeleteModal";

// Constants
const ARABIC_LABELS = {
  active: "نشط",
  inactive: "غير نشط",
  username: "اسم المستخدم",
  email: "البريد الإلكتروني",
  age: "العمر",
  gender: "الجنس",
  weight: "الوزن",
  height: "الطول",
  targetWeight: "الوزن المستهدف",
  contact: "معلومات الاتصال",
  memberSince: "عضو منذ",
  viewGoals: "عرض الأهداف",
  goalsData: "بيانات الأهداف",
  male: "ذكر",
  female: "أنثى",
  years: "سنة",
  sendNotification: "ارسال اشعار",
  message: "الرسالة",
  sendSuccess: "تم الارسال بنجاح",
};

// Sub-components
const StatusBadge = ({ active }) => (
  <Badge
    position="absolute"
    top={4}
    left={4}
    colorScheme={active ? "green" : "red"}
    borderRadius="full"
    px={3}
    py={1}
  >
    {active ? ARABIC_LABELS.active : ARABIC_LABELS.inactive}
  </Badge>
);

const UserHeader = ({ username, email, profileImg }) => (
  <Box textAlign="center" pt={4}>
    <Box
      bg="blue.50"
      w={16}
      h={16}
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mx="auto"
      mb={3}
    >
      <Avatar src={profileImg} color="blue.500" />
    </Box>
    <Text fontSize="2xl" fontWeight="bold">
      {username}
    </Text>
    <Text
      color="gray.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Icon as={MdEmail} size={16} />
      {email}
    </Text>
  </Box>
);

const InfoItem = ({ label, value, icon }) => (
  <Stack spacing={1} align="start">
    <Text fontSize="sm" color="gray.500">
      {label}
    </Text>
    <Text fontWeight="medium" display="flex" alignItems="center" gap={2}>
      {icon && <Icon as={icon} size={16} />}
      {value}
    </Text>
  </Stack>
);

const GoalsModal = ({ isOpen, onClose, goalsData }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
    <ModalOverlay backdropFilter="blur(5px)" />
    <ModalContent h="container.md" overflow="auto" dir="rtl">
      <ModalHeader borderBottom="1px" borderColor="gray.100" py={4}>
        {ARABIC_LABELS.goalsData}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody dir="ltr" py={6}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={6}
        >
          {Object.entries(goalsData).map(([key, value]) => (
            <GridItem borderRadius="lg" bgColor="gray.50" p="3" key={key}>
              <Stack spacing={1}>
                <Text fontSize="md" color="gray.500" capitalize>
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Text>
                {(typeof value === "string" || typeof value === "number") && (
                  <Text fontSize="md" color="gray.500" capitalize>
                    {value}
                  </Text>
                )}
              </Stack>
            </GridItem>
          ))}
        </Grid>
      </ModalBody>
    </ModalContent>
  </Modal>
);

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
          {ARABIC_LABELS.sendNotification}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Textarea ref={messageRef} placeholder={ARABIC_LABELS.message} />
          <Button
            onClick={handleSend}
            mt="2"
            colorScheme="orange"
            w="100%"
            isLoading={isLoading}
          >
            {ARABIC_LABELS.sendNotification}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Main component
export const UserProfileBox = ({
  active,
  age,
  email,
  gender,
  goalsData,
  length,
  phone,
  targetWeight,
  username,
  weight,
  createdAt,
  profileImg,
  _id,
  onRender,
  onSelect,
  isSelected,
  onRemoveSelection,
  role,
}) => {
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: "top-right",
  });

  const { user } = useAuth();
  const { sendRequest, loading: sendNotificationLoading } = useApiRequest();
  const { sendRequest: DeleteItem, loading: DeleteItemLoading } =
    useApiRequest();
  const {
    isOpen: isGoalsOpen,
    onOpen: onGoalsOpen,
    onClose: onGoalsClose,
  } = useDisclosure();
  const {
    isOpen: isNotificationOpen,
    onOpen: onNotificationOpen,
    onClose: onNotificationClose,
  } = useDisclosure();
  const {
    isOpen: isOpenedDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const formattedDate = new Date(createdAt).toLocaleDateString("ar-EG");

  const handleDeleteItem = async () => {
    await DeleteItem({
      url: `users/${_id}/moveToTrash`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    onCloseDeleteModal();
    onRender();
    toast({
      title: "تم الحذف بنجاح",
      status: "success",
    });
  };

  const handleSendNotification = async (message) => {
    await sendRequest({
      url: "notifications",
      method: "post",
      body: {
        users: [_id],
        message,
      },
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    onNotificationClose();
    toast({
      title: ARABIC_LABELS.sendSuccess,
      status: "success",
    });
  };

  return (
    <>
      <Box
        p={6}
        borderRadius="xl"
        boxShadow="lg"
        bg="white"
        position="relative"
        className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        dir="rtl"
        w="100%"
        maxW="md"
        h="fit-content"
      >
        <Checkbox
          isChecked={isSelected}
          size="lg"
          onChange={(e) => {
            if (e.target.checked) {
              onSelect(_id);
            } else {
              onRemoveSelection(_id);
            }
          }}
        />
        <StatusBadge active={active} />

        <Stack spacing={6}>
          <UserHeader
            username={username}
            email={email}
            profileImg={profileImg}
          />

          <Divider />

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <InfoItem
                label={ARABIC_LABELS.age}
                value={`${age} ${ARABIC_LABELS.years}`}
              />
            </GridItem>
            <GridItem>
              <InfoItem
                label={ARABIC_LABELS.gender}
                value={
                  gender === "male" ? ARABIC_LABELS.male : ARABIC_LABELS.female
                }
              />
            </GridItem>
            <GridItem>
              <InfoItem
                label={ARABIC_LABELS.weight}
                value={weight}
                icon={FaWeight}
              />
            </GridItem>
            <GridItem>
              <InfoItem
                label={ARABIC_LABELS.height}
                value={length}
                icon={FaRuler}
              />
            </GridItem>
          </Grid>

          <InfoItem
            label={ARABIC_LABELS.targetWeight}
            value={targetWeight}
            icon={GiTargetPoster}
          />

          <InfoItem
            label={ARABIC_LABELS.contact}
            value={phone}
            icon={FaPhone}
          />

          <InfoItem
            label={ARABIC_LABELS.memberSince}
            value={formattedDate}
            icon={FaCalendar}
          />
          <Flex wrap="wrap" gap="3">
            <Button
              onClick={onGoalsOpen}
              colorScheme="blue"
              size="lg"
              rightIcon={<Icon as={GoGoal} />}
              borderRadius="full"
              className="hover:shadow-md transition-shadow"
              flexGrow="1"
            >
              {ARABIC_LABELS.viewGoals}
            </Button>

            <Button
              colorScheme="orange"
              size="lg"
              rightIcon={<Icon as={MdNotificationAdd} />}
              borderRadius="full"
              onClick={onNotificationOpen}
              flexGrow="1"
            >
              {ARABIC_LABELS.sendNotification}
            </Button>
            {(role === "admin" || role === "sub-admin") && (
              <Button
                colorScheme="teal"
                size="lg"
                rightIcon={<Icon as={MdEdit} />}
                borderRadius="full"
                flexGrow="1"
                as={Link}
                to={`${_id}/permissions`}
              >
                الصلاحيات
              </Button>
            )}
          </Flex>
          <Flex wrap="wrap" gap="3">
            <Button
              colorScheme="green"
              size="lg"
              rightIcon={<Icon as={MdEdit} />}
              borderRadius="full"
              flexGrow="1"
              as={Link}
              to={`${_id}/Update`}
            >
              تحديث
            </Button>
            <Button
              colorScheme="red"
              size="lg"
              rightIcon={<Icon as={IoMdTrash} />}
              borderRadius="full"
              flexGrow="1"
              onClick={onOpenDeleteModal}
            >
              حذف
            </Button>
          </Flex>
        </Stack>
      </Box>

      <GoalsModal
        isOpen={isGoalsOpen}
        onClose={onGoalsClose}
        goalsData={goalsData}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={onNotificationClose}
        onSend={handleSendNotification}
        isLoading={sendNotificationLoading}
      />
      <DeleteModal
        isOpen={isOpenedDeleteModal}
        onClose={onCloseDeleteModal}
        onDelete={handleDeleteItem}
        isLoading={DeleteItemLoading}
      />
    </>
  );
};
