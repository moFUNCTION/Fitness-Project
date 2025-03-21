import {
  Button,
  Input,
  Select,
  Skeleton,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorText } from "../../../../Components/Common/ErrorText/ErrorText";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useNavigate } from "react-router-dom";
const Models = [
  { en: "Courses", ar: "كورس", value: "Course" },
  { en: "Packages", ar: "باقة", value: "Package" },
  { en: "Exercises", ar: "تمرين", value: "Exercise" },
  { en: "Categories", ar: "فئة", value: "Category" },
  { en: "Supplements", ar: "مكمل غذائي", value: "Supplement" },
  { en: "Vitamins", ar: "فيتامين", value: "Vitamin" },
];
const schema = z.object({
  image: z
    .instanceof(File, { message: "يجب رفع صورة صالحة" }) // Validate that the image is a File object
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // Max file size: 5MB
      { message: "يجب أن لا يتجاوز حجم الصورة 5 ميجابايت" }
    )
    .refine(
      (file) => file.type.startsWith("image/"), // Ensure the file is an image
      { message: "يجب أن يكون الملف المرفوع صورة" }
    ),
  title: z
    .string()
    .min(3, { message: "يجب أن يكون العنوان على الأقل 3 أحرف" })
    .max(100, { message: "يجب أن لا يتجاوز العنوان 100 حرف" }), // Validate title length
  targetModel: z.string().min(1, { message: "يجب اختيار الفئة المستهدفة" }), // Ensure a target model is selected
  targetModelId: z.string().min(1, { message: "يجب اختيار العنصر المستهدف" }), // Ensure a target model ID is selected
});
export default function Index() {
  const Navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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
  const onSubmit = async (data) => {
    const FormFields = new FormData();
    for (let item in data) {
      if (item === "targetModel") {
        continue;
      }
      FormFields.append(item, data[item]);
    }
    FormFields.append(
      "targetModel",
      Models.find((model) => {
        return model.en === data.targetModel;
      }).value
    );

    try {
      const req = await axiosInstance.post(`advertise`, FormFields, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تم انشاء الاعلان بنجاح",
        status: "success",
      });
      Navigate("/ads");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Stack w="100%" p="3">
      <Controller
        control={control}
        name="image"
        render={({ field }) => {
          return (
            <>
              <ImageUploader
                img={field.value}
                onChangeImage={(image) => field.onChange(image)}
                onRemoveImage={() => field.onChange(undefined)}
                label="رفع صورة للاعلان"
              />
              <ErrorText>{errors?.image?.message}</ErrorText>
            </>
          );
        }}
      />

      <Input size="lg" {...register("title")} placeholder="عنوان" />
      <ErrorText>{errors?.title?.message}</ErrorText>
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

      <Button
        isLoading={isSubmitting}
        colorScheme="blue"
        onClick={handleSubmit(onSubmit)}
      >
        انشاء
      </Button>
    </Stack>
  );
}
