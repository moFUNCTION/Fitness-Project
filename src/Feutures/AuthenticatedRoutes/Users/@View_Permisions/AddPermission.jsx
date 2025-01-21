import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Select,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { z } from "zod";
const allowedModels = [
  { english: "User", arabic: "مستخدم" },
  { english: "BlacklistedToken", arabic: "رمز محظور" },
  { english: "Settings", arabic: "إعدادات" },
  { english: "Permission", arabic: "صلاحية" },
  { english: "BodyPart", arabic: "جزء الجسم" },
  { english: "Exercise", arabic: "تمرين" },
  { english: "MealsCalculation", arabic: "حساب الوجبات" },
  { english: "MealCategory", arabic: "فئة الوجبة" },
  { english: "Progress", arabic: "تقدم" },
  { english: "Coupon", arabic: "قسيمة" },
  { english: "Category", arabic: "فئة" },
  { english: "Course", arabic: "دورة" },
  { english: "Lesson", arabic: "درس" },
  { english: "Quiz", arabic: "اختبار" },
  { english: "Notification", arabic: "إشعار" },
  { english: "Order", arabic: "طلب" },
  { english: "TrainingPlan", arabic: "خطة تدريب" },
  { english: "TrainerRequest", arabic: "طلب مدرب" },
  { english: "Supplement", arabic: "مكمل غذائي" },
  { english: "Vitamin", arabic: "فيتامين" },
  { english: "Advertise", arabic: "إعلان" },
  { english: "Chat", arabic: "دردشة" },
  { english: "Message", arabic: "رسالة" },
];
export default function AddPermission() {
  return (
    <Stack gap="3" p="3">
      <Heading size="md">تعديل الصلاحية</Heading>
      <Divider />
      <Flex p="5" borderRadius="lg" flexWrap="wrap" gap="3" bgColor="gray.200">
        {allowedModels.map((item) => {
          return (
            <Stack
              bgColor="white"
              p="3"
              w="400px"
              flexGrow="1"
              maxW="100%"
              key={item.english}
            >
              <Heading mb="2" size="md">
                {item.arabic}
              </Heading>
              <Divider />
              <Checkbox bgColor="gray.50" p="3" borderRadius="md">
                صلاحية كاملة
              </Checkbox>
              <Checkbox bgColor="gray.50" p="3" borderRadius="md">
                قراءة
              </Checkbox>
              <Checkbox bgColor="gray.50" p="3" borderRadius="md">
                انشاء
              </Checkbox>
              <Checkbox bgColor="gray.50" p="3" borderRadius="md">
                تحديث
              </Checkbox>
              <Checkbox bgColor="gray.50" p="3" borderRadius="md">
                حذف
              </Checkbox>
            </Stack>
          );
        })}
      </Flex>

      <Button colorScheme="blue">تحديث</Button>
    </Stack>
  );
}
