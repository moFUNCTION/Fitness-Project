import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Select,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import axios from "../../../../axiosConfig/axiosInstance";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
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
  const { id } = useParams();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isLoading },
    getValues,
  } = useForm({
    defaultValues: async () => {
      const res = await axios.get(`permissions/${id}/permissions`, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      const Data = res.data?.data[0]?.models || [];
      const DataObject = {};
      for (let item of Data) {
        DataObject[item.modelName] = item;
      }
      return DataObject;
    },
  });

  const onSubmit = async (data) => {
    try {
      const DataArray = [];
      for (let item in data) {
        DataArray.push({ ...data[item], modelName: item });
      }
      const req = await axios.post(
        `permissions/${id}`,
        {
          models: DataArray,
        },
        {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      );
      console.log(req);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Stack gap="3" p="3">
      <Heading size="md">تعديل الصلاحية</Heading>
      <Divider />
      <Flex
        as={Skeleton}
        isLoaded={!isLoading}
        p="5"
        borderRadius="lg"
        flexWrap="wrap"
        gap="3"
        bgColor="gray.200"
      >
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
              <Checkbox
                {...register(`${item.english}.fullAccess`)}
                bgColor="gray.50"
                p="3"
                borderRadius="md"
                checked={getValues()?.[item.english]?.fullAccess}
              >
                صلاحية كاملة
              </Checkbox>
              <Checkbox
                {...register(`${item.english}.read`)}
                bgColor="gray.50"
                p="3"
                borderRadius="md"
                checked={getValues()?.[item.english]?.read}
              >
                قراءة
              </Checkbox>
              <Checkbox
                {...register(`${item.english}.create`)}
                bgColor="gray.50"
                p="3"
                borderRadius="md"
                checked={getValues()?.[item.english]?.create}
              >
                انشاء
              </Checkbox>
              <Checkbox
                {...register(`${item.english}.update`)}
                bgColor="gray.50"
                p="3"
                borderRadius="md"
                checked={getValues()?.[item.english]?.update}
              >
                تحديث
              </Checkbox>
              <Checkbox
                {...register(`${item.english}.delete`)}
                bgColor="gray.50"
                p="3"
                borderRadius="md"
                checked={getValues()?.[item.english]?.delete}
              >
                حذف
              </Checkbox>
            </Stack>
          );
        })}
      </Flex>

      <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
        تحديث
      </Button>
    </Stack>
  );
}
