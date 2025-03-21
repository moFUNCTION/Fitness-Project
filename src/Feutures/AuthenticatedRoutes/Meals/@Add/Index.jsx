import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  IconButton,
  SimpleGrid,
  useToast,
  Stack,
  Divider,
  Select,
} from "@chakra-ui/react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoAdd } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { VideoUploader } from "../../../../Components/Common/VideoUploader/VideoUploader";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { uploadToVimeoWithTus } from "../../../../Utils/VimeoVideoUploader/VimeoVideoUploader";
import { UploadProgressModal } from "../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { ErrorText } from "../../../../Components/Common/ErrorText/ErrorText";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
// Define the validation schema using Zod
const videoFileSchema = z.custom(
  (file) => {
    if (!(file instanceof File)) {
      return false;
    }

    const allowedMimeTypes = ["video/mp4", "video/avi", "video/mov"];
    if (!allowedMimeTypes.includes(file.type)) {
      return false;
    }

    const maxSizeInBytes = 300 * 1024 * 1024; // 300 MB
    if (file.size > maxSizeInBytes) {
      return false;
    }

    return true;
  },
  {
    message:
      "Invalid video file. Ensure it is a supported format (mp4, avi, mov) and under 100MB.",
  }
);

const mealSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  image: z.any(),
  video: videoFileSchema,
  howToMakeSteps: z
    .array(
      z.object({
        stepOrder: z.string().min(1, "Step order is required"),
        stepText_en: z.string().min(1, "English step text is required"),
        stepText_ar: z.string().min(1, "Arabic step text is required"),
      })
    )
    .min(1, "At least one step is required"),
  ingredients: z
    .array(z.string().min(1, "Ingredient is required"))
    .min(1, "At least one ingredient is required"),
  category: z.string().min(1, "Category is required"),
});

const MealForm = () => {
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const { user } = useAuth();
  const toast = useToast();

  const {
    data: MealsCategories,
    loading: MealsCategoriesLoading,
    HandleRender,
  } = useFetch({
    endpoint: "/mealsCategory",
    params: {
      limit: 100000000000000,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  console.log(MealsCategories);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      video: "",
      howToMakeSteps: [{ stepOrder: "1", stepText_en: "", stepText_ar: "" }],
      ingredients: [""],
      category: "",
    },
  });
  const video = useWatch({ control, name: "video" });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "howToMakeSteps",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const uploadVideoHelper = useCallback(
    async ({ signedURL, video, onError }) => {
      await uploadToVimeoWithTus({
        signedUrl: signedURL,
        file: video,
        fileSize: video.size,
        accessToken: user.data.token,
        onProgress: (data) => {
          setUploadingPercent(data);
        },
        onSuccess: () => {
          setUploadingPercent(0);
        },
        onError: onError,
      });
    },

    []
  );

  const createSignedUrlHelper = useCallback(async ({ video }) => {
    const data = await axiosInstance.post(
      `/vimeo/signed-url`,
      {
        size: video.size,
      },
      {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      }
    );
    const {
      data: { uploadLink: signedURL, videoUri },
    } = data;
    return { signedURL, videoUri };
  }, []);

  const createMealsHelper = useCallback(async (data) => {
    const req = await axiosInstance.post("/meals", data, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    return req;
  }, []);

  const onSubmit = async (data) => {
    try {
      const { signedURL, videoUri } = await createSignedUrlHelper({
        video: data.video,
      });
      const [videoId] = videoUri.split("/").slice(-1);
      const videoLink = `https://vimeo.com/${videoId}`;

      await uploadVideoHelper({
        signedURL,
        videoLink,
        video: data.video,
        onError: () => {},
      });

      const formData = new FormData();
      formData.append("title_en", data.title_en);
      formData.append("title_ar", data.title_ar);
      formData.append("description_en", data.description_en);
      formData.append("description_ar", data.description_ar);
      formData.append("vimeo_video_Url", videoLink);
      formData.append("category", data.category);
      if (data.image) {
        formData.append("image", data.image);
      }

      formData.append("howToMakeSteps", JSON.stringify(data.howToMakeSteps));
      formData.append("ingredients", JSON.stringify(data.ingredients));

      await createMealsHelper(formData);

      toast({
        title: "تم إنشاء الوجبة بنجاح",
        description: "Meal created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      reset();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <UploadProgressModal
        isOpen={uploadingPercent}
        uploadProgress={uploadingPercent}
        fileName={video?.name}
        fileSize={video?.size}
      />
      <Container w="100%" maxW="100%" py={10} dir="rtl">
        <Stack gap="4" as="form" onSubmit={handleSubmit(onSubmit)}>
          <Heading textAlign="right">إنشاء وجبة جديدة</Heading>
          <Divider />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Title Fields */}
            <FormControl isInvalid={errors.title_ar}>
              <FormLabel>عنوان الوجبة (بالعربية)</FormLabel>
              <Input
                {...register("title_ar")}
                placeholder="أدخل عنوان الوجبة بالعربية"
              />
              <FormErrorMessage>{errors.title_ar?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.title_en}>
              <FormLabel>عنوان الوجبة (بالإنجليزية)</FormLabel>
              <Input
                {...register("title_en")}
                placeholder="Enter meal title in English"
              />
              <FormErrorMessage>{errors.title_en?.message}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Description Fields */}
            <FormControl isInvalid={errors.description_ar}>
              <FormLabel>وصف الوجبة (بالعربية)</FormLabel>
              <Input
                {...register("description_ar")}
                placeholder="أدخل وصف الوجبة بالعربية"
              />
              <FormErrorMessage>
                {errors.description_ar?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description_en}>
              <FormLabel>وصف الوجبة (بالإنجليزية)</FormLabel>
              <Input
                {...register("description_en")}
                placeholder="Enter meal description in English"
              />
              <FormErrorMessage>
                {errors.description_en?.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={errors.category}>
              <FormLabel>الفئة</FormLabel>
              <Select {...register("category")} placeholder="فئة الوجبة">
                {MealsCategories?.data?.map((item) => {
                  return (
                    <option value={item._id} key={item._id}>
                      {item.title_AR || item.Title_AR}
                    </option>
                  );
                })}
              </Select>
              <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <Controller
            name="image"
            control={control}
            render={({ field }) => {
              return (
                <ImageUploader
                  img={field.value}
                  onRemoveImage={() => field.onChange()}
                  onChangeImage={(file) => field.onChange(file)}
                  label="رفع صورة للوجبة"
                />
              );
            }}
          />

          <Controller
            name="video"
            control={control}
            render={({ field }) => {
              return (
                <VideoUploader
                  video={field.value}
                  onChange={(file) => field.onChange(file)}
                />
              );
            }}
          />
          <ErrorText>{errors?.video?.message}</ErrorText>
          {/* Steps Section */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">خطوات التحضير</Heading>
              <Button
                leftIcon={<IoAdd />}
                colorScheme="teal"
                onClick={() =>
                  appendStep({
                    stepOrder: (stepFields.length + 1).toString(),
                    stepText_en: "",
                    stepText_ar: "",
                  })
                }
              >
                إضافة خطوة
              </Button>
            </Flex>

            <VStack spacing={4} align="stretch">
              {stepFields.map((field, index) => (
                <Box key={field.id} p={4} borderWidth="1px" borderRadius="md">
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl
                      isInvalid={errors.howToMakeSteps?.[index]?.stepOrder}
                    >
                      <FormLabel>ترتيب الخطوة</FormLabel>
                      <Input
                        {...register(`howToMakeSteps.${index}.stepOrder`)}
                        placeholder="1"
                      />
                      <FormErrorMessage>
                        {errors.howToMakeSteps?.[index]?.stepOrder?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.howToMakeSteps?.[index]?.stepText_ar}
                    >
                      <FormLabel>نص الخطوة (بالعربية)</FormLabel>
                      <Input
                        {...register(`howToMakeSteps.${index}.stepText_ar`)}
                        placeholder="أدخل نص الخطوة بالعربية"
                      />
                      <FormErrorMessage>
                        {errors.howToMakeSteps?.[index]?.stepText_ar?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.howToMakeSteps?.[index]?.stepText_en}
                    >
                      <FormLabel>نص الخطوة (بالإنجليزية)</FormLabel>
                      <Input
                        {...register(`howToMakeSteps.${index}.stepText_en`)}
                        placeholder="Enter step text in English"
                      />
                      <FormErrorMessage>
                        {errors.howToMakeSteps?.[index]?.stepText_en?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  {stepFields.length > 1 && (
                    <IconButton
                      icon={<MdOutlineDeleteOutline />}
                      colorScheme="red"
                      aria-label="Remove step"
                      size="sm"
                      mt={2}
                      onClick={() => removeStep(index)}
                    />
                  )}
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Ingredients Section */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">المكونات</Heading>
              <Button
                leftIcon={<IoAdd />}
                colorScheme="teal"
                onClick={() => appendIngredient("")}
              >
                إضافة مكون
              </Button>
            </Flex>

            <VStack spacing={3} align="stretch">
              {ingredientFields.map((field, index) => (
                <HStack key={field.id}>
                  <FormControl isInvalid={errors.ingredients?.[index]}>
                    <Input
                      {...register(`ingredients.${index}`)}
                      placeholder="أدخل المكون"
                    />
                    <FormErrorMessage>
                      {errors.ingredients?.[index]?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {ingredientFields.length > 1 && (
                    <IconButton
                      icon={<MdOutlineDeleteOutline />}
                      colorScheme="red"
                      aria-label="Remove ingredient"
                      onClick={() => removeIngredient(index)}
                    />
                  )}
                </HStack>
              ))}
            </VStack>
          </Box>

          <Flex justify="center" mt={8}>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="100%"
              maxW="md"
              isLoading={isSubmitting}
            >
              إنشاء الوجبة
            </Button>
          </Flex>
        </Stack>
      </Container>
    </>
  );
};

export default MealForm;
