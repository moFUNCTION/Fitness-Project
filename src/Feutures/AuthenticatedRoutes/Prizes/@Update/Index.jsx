import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Textarea,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";

const prizeSchema = z.object({
  title_ar: z.string().min(1, "عنوان الجائزة بالعربية مطلوب"),
  title_en: z.string().min(1, "عنوان الجائزة بالإنجليزية مطلوب"),
  description_ar: z.string().min(1, "وصف الجائزة بالعربية مطلوب"),
  description_en: z.string().min(1, "وصف الجائزة بالإنجليزية مطلوب"),
  image: z.any(),
});

const UpdatePrizePage = () => {
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
  });
  const { user } = useAuth();
  const { id } = useParams();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(prizeSchema),
  });

  const { data, loading, error } = useFetch({
    endpoint: `prizes/${id}`,
  });
  useEffect(() => {
    reset(data?.data);
  }, [JSON.stringify(data)]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title_ar", data.title_ar);
      formData.append("title_en", data.title_en);
      formData.append("description_ar", data.description_ar);
      formData.append("description_en", data.description_en);
      formData.append("image", data.image);
      const req = await axiosInstance.put(`prizes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تمت إضافة الجائزة بنجاح",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      Navigate("/prizes");
    } catch (error) {
      console.error("خطأ في إضافة الجائزة:", error);
      toast({
        title: "حدث خطأ أثناء إضافة الجائزة",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="100%" py={8}>
      <Heading size="lg" mb={6} textAlign="center">
        تحديث جائزة
      </Heading>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.title_ar}>
            <FormLabel>عنوان الجائزة بالعربية</FormLabel>
            <Input {...register("title_ar")} placeholder="أدخل عنوان الجائزة" />
            <FormErrorMessage>{errors.title_ar?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.title_en}>
            <FormLabel>عنوان الجائزة بالإنجليزية</FormLabel>
            <Input {...register("title_en")} placeholder="Enter prize title" />
            <FormErrorMessage>{errors.title_en?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.description_ar}>
            <FormLabel>وصف الجائزة بالعربية</FormLabel>
            <Textarea
              {...register("description_ar")}
              placeholder="أدخل وصف الجائزة"
              rows={4}
            />
            <FormErrorMessage>
              {errors.description_ar?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.description_en}>
            <FormLabel>وصف الجائزة بالإنجليزية</FormLabel>
            <Textarea
              {...register("description_en")}
              placeholder="Enter prize description"
              rows={4}
            />
            <FormErrorMessage>
              {errors.description_en?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.image}>
            <FormLabel>صورة الجائزة</FormLabel>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageUploader
                  onChangeImage={(file) => {
                    onChange(file);
                  }}
                  onRemoveImage={() => onChange()}
                  img={value}
                  label="رفع صورة الجائزة"
                />
              )}
            />
            <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
            w="full"
          >
            تحديث الجائزة
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default UpdatePrizePage;
