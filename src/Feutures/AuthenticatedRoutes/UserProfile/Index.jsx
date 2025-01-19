import React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Divider,
  Icon,
  Avatar,
  Stack,
  Button,
  Flex,
} from "@chakra-ui/react";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "../../../Context/UserDataContextProvider/UserDataContextProvder";
import { Link } from "react-router-dom";

export default function Index() {
  const {
    user: { data: userData },
  } = useAuth();

  return (
    <Stack
      w="100%"
      p="4"
      textAlign="right" // Align text to the right for Arabic
      gap="10"
    >
      <Stack
        h="160px"
        justifyContent="end"
        p="5"
        bgColor="gray.200"
        borderRadius="lg"
      >
        <Avatar
          pos="relative"
          top="10"
          size="2xl"
          src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
      </Stack>
      <VStack
        borderRadius="md"
        bgColor="gray.50"
        p="5"
        spacing={4}
        align="stretch"
      >
        <Heading size="md" color="teal.600">
          ملف المستخدم
        </Heading>

        <HStack>
          <Text fontWeight="bold">الاسم :</Text>
          <Text>{userData.username}</Text>
        </HStack>

        <HStack>
          <Icon as={FaEnvelope} color="teal.500" />
          <Text fontWeight="bold">البريد الإلكتروني:</Text>
          <Text>{userData.email}</Text>
        </HStack>

        <HStack>
          <Icon as={FaPhone} color="teal.500" />
          <Text fontWeight="bold">الهاتف:</Text>
          <Text>{userData.phone}</Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold">الدور:</Text>
          <Text>{userData.role}</Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold">نشط:</Text>
          <Icon
            as={userData.active ? FaCheckCircle : FaTimesCircle}
            color={userData.active ? "green.500" : "red.500"}
          />
        </HStack>

        <HStack>
          <Text fontWeight="bold">تم التحقق من البريد:</Text>
          <Icon
            as={userData.emailVerified ? FaCheckCircle : FaTimesCircle}
            color={userData.emailVerified ? "green.500" : "red.500"}
          />
        </HStack>

        <HStack>
          <Text fontWeight="bold">تسجيل بواسطة OAuth:</Text>
          <Icon
            as={userData.isOAuthUser ? FaCheckCircle : FaTimesCircle}
            color={userData.isOAuthUser ? "green.500" : "red.500"}
          />
        </HStack>
        <Flex flexWrap="wrap" gap="3">
          <Button colorScheme="green">تغيير كلمة المرور</Button>
          <Button
            as={Link}
            to="/user/update"
            colorScheme="green"
            variant="outline"
          >
            تحديث البيانات
          </Button>
          <Button colorScheme="red">حذف الحساب</Button>
        </Flex>
      </VStack>
    </Stack>
  );
}
