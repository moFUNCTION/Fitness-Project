import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Container,
  Heading,
  VStack,
  useToast,
  Stack,
} from "@chakra-ui/react";
import { useAuth } from "../../../Context/UserDataContextProvider/UserDataContextProvder";
import { UserImageUploader } from "../../../Components/Common/UserImageUploader/UserImageUploader";
import Lottie from "lottie-react";
import AnimationData from "../../../Assets/ImageUploaderAnimation/imageUploaderAnimation.json";
import axiosInstance from "../../../axiosConfig/axiosInstance";
// Define validation schema using Zod
const userSchema = z.object({
  firstName: z.string().min(1, { message: "يجب إدخال الاسم الأول" }),
  lastName: z.string().min(1, { message: "يجب إدخال الاسم الأخير" }),
  title: z.string().min(1, { message: "يجب إدخال الوظيفة" }),
  phone: z
    .string()
    .regex(/^\d{11}$/, { message: "يجب أن يكون رقم الهاتف 11 رقماً" }),
});

// Component for updating user data
const UpdateUserForm = () => {
  const { user, onGetUserData } = useAuth();
  console.log(user.data);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user.data,
  });

  const toast = useToast();
  const image = useWatch({ control, name: "profileImg" });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("title", data.title);
      formData.append("profileImg", image);

      await axiosInstance.put("/users/changeMyData", formData, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      await onGetUserData();
      toast({
        title: "تم تحديث البيانات بنجاح",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "حدث خطأ أثناء التحديث",
        description: error.response?.data?.message || "يرجى المحاولة مرة أخرى",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack w="100%" bg="blue.300" p="4" overflow="auto">
      <Container maxW="md" p={6} borderRadius="lg" boxShadow="lg" bg="white">
        <Heading size="lg" textAlign="center" color="blue.800" mb={6}>
          تحديث بيانات المستخدم
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <UserImageUploader
              img={
                image instanceof File
                  ? image
                  : !image?.includes("undefined") && image
              }
              onChange={(file) => setValue("profileImg", file)}
              onRemove={() => setValue("profileImg", undefined)}
            >
              <Lottie
                style={{
                  width: "100px",
                }}
                animationData={AnimationData}
              />
            </UserImageUploader>
            <FormControl isInvalid={errors.firstName}>
              <FormLabel>الاسم الأول</FormLabel>
              <Input
                type="text"
                placeholder="أدخل الاسم الأول"
                {...register("firstName")}
              />
              <FormErrorMessage>
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>

            {/* Last Name */}
            <FormControl isInvalid={errors.lastName}>
              <FormLabel>الاسم الأخير</FormLabel>
              <Input
                type="text"
                placeholder="أدخل الاسم الأخير"
                {...register("lastName")}
              />
              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>

            {/* Title */}
            <FormControl isInvalid={errors.title}>
              <FormLabel>الوظيفة</FormLabel>
              <Input
                type="text"
                placeholder="أدخل الوظيفة"
                {...register("title")}
              />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>

            {/* Phone */}
            <FormControl isInvalid={errors.phone}>
              <FormLabel>الهاتف</FormLabel>
              <Input
                type="text"
                placeholder="أدخل رقم الهاتف"
                {...register("phone")}
              />
              <FormErrorMessage>
                {errors.phone && errors.phone.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="blue"
              type="submit"
              isFullWidth
              isLoading={isSubmitting}
              mt={4}
            >
              تحديث
            </Button>
          </VStack>
        </form>
      </Container>
    </Stack>
  );
};

export default UpdateUserForm;
