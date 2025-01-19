import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { FaUser } from "react-icons/fa";
import { MdArrowDropDown } from "react-icons/md";
import { Link } from "react-router-dom";
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
export const TrainerRequest = ({
  user: { username, email },
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
}) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack
      p="3"
      w="100%"
      border="1px"
      borderColor="gray.300"
      borderRadius="lg"
      maxW="md"
      gap="4"
    >
      <HStack gap="3">
        <IconButton borderRadius="full" colorScheme="blue" variant="outline">
          <FaUser />
        </IconButton>
        <Stack color="blue.800">
          <Heading size="xs">الاسم :{username}</Heading>
          <Heading size="xs">الايميل :{email}</Heading>
        </Stack>
      </HStack>
      <Stack borderRadius="md" bgColor="gray.50" p="3">
        <Text>
          تم الاضافة في : {new Date(createdAt).toLocaleString("ar-EG")}
        </Text>
      </Stack>
      <Stack
        gap="3"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        p="3"
        onClick={onToggle}
      >
        <Flex
          cursor="pointer"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading size="xs">بيانات المستخدم</Heading>
          <MdArrowDropDown />
        </Flex>
        <Divider />
        <Stack
          transition="0.3s"
          overflow="hidden"
          gap="2"
          h={isOpen ? "56" : "0px"}
        >
          <Text>الاسم : {name}</Text>
          <Text>العمر : {age}</Text>
          <Text>رقم الهاتف : {phone}</Text>
          <Text> عدد سنوات الخبرة : {yearsOfExperience}</Text>
          <Text> المكان : {location}</Text>
          <Text> الجنسية : {nationality}</Text>
          <Text> عدد المتدربين لديه : {numberOfTrainees}</Text>
        </Stack>
      </Stack>
      <Flex flexWrap="wrap" gap="3">
        <Button
          as={Link}
          to={_id}
          flexGrow="1"
          variant="outline"
          colorScheme="blue"
        >
          عرض الطلب
        </Button>
      </Flex>
      {status === "pending" && (
        <Heading
          size="sm"
          color="white"
          bgColor="blue.600"
          p="3"
          textAlign="center"
          borderRadius="lg"
        >
          لم يتم الرد عليه
        </Heading>
      )}
      {status === "approved" ? (
        <Heading
          size="sm"
          color="white"
          bg="green.600"
          p="3"
          textAlign="center"
          borderRadius="lg"
        >
          تم الموافقة عليه
        </Heading>
      ) : (
        status === "rejected" && (
          <Heading
            size="sm"
            bgColor="red.600"
            color="white"
            p="3"
            textAlign="center"
            borderRadius="lg"
          >
            تم الرفض
          </Heading>
        )
      )}
    </Stack>
  );
};
