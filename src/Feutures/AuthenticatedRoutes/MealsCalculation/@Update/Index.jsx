// MealForm.jsx
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  SimpleGrid,
  Heading,
  FormErrorMessage,
  useToast,
  Container,
  Divider,
  Fade,
  Select,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
// Arabic validation messages
const schema = z.object({
  title_AR: z.string().min(1, { message: "يرجى إدخال العنوان بالعربية" }),
  title_EN: z.string().min(1, { message: "يرجى إدخال العنوان بالإنجليزية" }),
  mealCategory: z.string().min(1, { message: "يرجى اختيار فئة الوجبة" }),
  image: z.any(),
  quantities: z
    .number({ message: "يجب أن تكون الكمية رقمًا صالحًا" })
    .min(0.01, { message: "يجب أن تكون الكمية أكبر من صفر" }),
  Calories: z
    .number({ message: "يجب إدخال قيمة صالحة للسعرات الحرارية" })
    .min(0, { message: "لا يمكن أن تكون السعرات الحرارية أقل من صفر" })
    .max(10000, { message: "قيمة السعرات الحرارية غير صالحة" }),
  Protein: z
    .number({ message: "يجب إدخال قيمة صالحة للبروتين" })
    .min(0, { message: "لا يمكن أن تكون كمية البروتين أقل من صفر" })
    .max(1000, { message: "قيمة البروتين غير صالحة" }),
  Carbohydrates: z
    .number({ message: "يجب إدخال قيمة صالحة للكربوهيدرات" })
    .min(0, { message: "لا يمكن أن تكون كمية الكربوهيدرات أقل من صفر" })
    .max(1000, { message: "قيمة الكربوهيدرات غير صالحة" }),
  Fats: z
    .number({ message: "يجب إدخال قيمة صالحة للدهون" })
    .min(0, { message: "لا يمكن أن تكون كمية الدهون أقل من صفر" })
    .max(1000, { message: "قيمة الدهون غير صالحة" }),
  Fiber: z
    .number({ message: "يجب إدخال قيمة صالحة للألياف" })
    .min(0, { message: "لا يمكن أن تكون كمية الألياف أقل من صفر" })
    .max(100, { message: "قيمة الألياف غير صالحة" }),
  Sugar: z
    .number({ message: "يجب إدخال قيمة صالحة للسكر" })
    .min(0, { message: "لا يمكن أن تكون كمية السكر أقل من صفر" })
    .max(100, { message: "قيمة السكر غير صالحة" }),
  Vitamin_A: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين أ" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين أ أقل من صفر" }),
  Vitamin_E: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين E" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين E أقل من صفر" }),
  Vitamin_C: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين C" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين C أقل من صفر" }),
  Vitamin_D: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين D" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين D أقل من صفر" }),
  Vitamin_B1: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب١" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب١ أقل من صفر" }),
  Vitamin_B2: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب٢" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب٢ أقل من صفر" }),
  Vitamin_B3: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب٣" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب٣ أقل من صفر" }),
  Vitamin_B5: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب٥" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب٥ أقل من صفر" }),
  Vitamin_B6: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب٦" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب٦ أقل من صفر" }),
  Vitamin_B7: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب٧" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب٧ أقل من صفر" }),
  Vitamin_B9: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب٩" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب٩ أقل من صفر" }),
  Vitamin_B12: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ب١٢" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ب١٢ أقل من صفر" }),
  Vitamin_K: z
    .number({ message: "يجب إدخال قيمة صالحة لفيتامين ك" })
    .min(0, { message: "لا يمكن أن تكون كمية فيتامين ك أقل من صفر" }),
  Calcium: z
    .number({ message: "يجب إدخال قيمة صالحة للكالسيوم" })
    .min(0, { message: "لا يمكن أن تكون كمية الكالسيوم أقل من صفر" }),
  Iron: z
    .number({ message: "يجب إدخال قيمة صالحة للحديد" })
    .min(0, { message: "لا يمكن أن تكون كمية الحديد أقل من صفر" }),
  Magnesium: z
    .number({ message: "يجب إدخال قيمة صالحة للمغنيسيوم" })
    .min(0, { message: "لا يمكن أن تكون كمية المغنيسيوم أقل من صفر" }),
  Phosphorus: z
    .number({ message: "يجب إدخال قيمة صالحة للفوسفور" })
    .min(0, { message: "لا يمكن أن تكون كمية الفوسفور أقل من صفر" }),
  Potassium: z
    .number({ message: "يجب إدخال قيمة صالحة للبوتاسيوم" })
    .min(0, { message: "لا يمكن أن تكون كمية البوتاسيوم أقل من صفر" }),
  Sodium: z
    .number({ message: "يجب إدخال قيمة صالحة للصوديوم" })
    .min(0, { message: "لا يمكن أن تكون كمية الصوديوم أقل من صفر" }),
  Zinc: z
    .number({ message: "يجب إدخال قيمة صالحة للزنك" })
    .min(0, { message: "لا يمكن أن تكون كمية الزنك أقل من صفر" }),
  Copper: z
    .number({ message: "يجب إدخال قيمة صالحة للنحاس" })
    .min(0, { message: "لا يمكن أن تكون كمية النحاس أقل من صفر" }),
  Manganese: z
    .number({ message: "يجب إدخال قيمة صالحة للمنغنيز" })
    .min(0, { message: "لا يمكن أن تكون كمية المنغنيز أقل من صفر" }),
  Selenium: z
    .number({ message: "يجب إدخال قيمة صالحة للسيلينيوم" })
    .min(0, { message: "لا يمكن أن تكون كمية السيلينيوم أقل من صفر" }),
});

const NumberField = ({ label, name, register, errors }) => {
  const [isVisible, setIsVisible] = useState(false);
  const fieldRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (fieldRef.current) {
      observer.observe(fieldRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={fieldRef} minH="80px">
      {isVisible && (
        <Fade in={true} transition={{ enter: { duration: 0.3 } }}>
          <FormControl isInvalid={errors?.[name]}>
            <FormLabel>{label}</FormLabel>
            <Input
              type="number"
              step="0.01"
              {...register(name, { valueAsNumber: true })}
              placeholder={`أدخل ${label}`}
            />
            <FormErrorMessage>{errors?.[name]?.message}</FormErrorMessage>
          </FormControl>
        </Fade>
      )}
    </Box>
  );
};
function Index() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    isClosable: true,
    duration: 3000,
  });
  const { user } = useAuth();

  const { data, loading, error } = useFetch({
    endpoint: `mealsCalculation/${id}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });

  const {
    data: MealsCategories,
    loading: MealsCategoriesLoading,
    error: MealsCategoriesError,
  } = useFetch({
    endpoint: "mealsCategory",
    params: {
      limit: 30,
    },
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    console.log(data?.data);
    reset({
      ...data?.data,
      title_AR: data?.data?.Title_AR || data?.data?.title_AR,
      title_EN: data?.data?.Title_EN || data?.data?.title_EN,
    });
  }, [JSON.stringify(data.data)]);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const DataSend = new FormData();
      for (let Field in data) {
        DataSend.append(Field, data[Field]);
      }
      await axiosInstance.put(`mealsCalculation/${id}`, DataSend, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تم إرسال النموذج بنجاح",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      Navigate("/meals-calculation");
    } catch (error) {
      console.log(error);
      toast({
        title: "خطأ في إرسال النموذج",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      as={Skeleton}
      isLoaded={!loading}
      py={8}
      w="100%"
      maxW="container"
    >
      <Box as="form" onSubmit={handleSubmit(onSubmit)} spacing={6}>
        <VStack spacing={6} align="stretch">
          <Controller
            name="image"
            control={control}
            render={({ field }) => {
              return (
                <ImageUploader
                  img={field.value}
                  onChangeImage={(image) => field.onChange(image)}
                  onRemoveImage={(image) => field.onChange(undefined)}
                  label="رفع صورة"
                />
              );
            }}
          />
          {/* Basic Information */}
          <Box>
            <Heading size="md" mb={4}>
              المعلومات الأساسية
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={errors.title_AR}>
                <FormLabel>العنوان (بالعربية)</FormLabel>
                <Input {...register("title_AR")} />
                <FormErrorMessage>{errors.title_AR?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.title_EN}>
                <FormLabel>العنوان (بالإنجليزية)</FormLabel>
                <Input {...register("title_EN")} />
                <FormErrorMessage>{errors.title_EN?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.mealCategory}>
                <FormLabel>فئة الوجبة</FormLabel>
                <Select placeholder="فئة الوجبة" {...register("mealCategory")}>
                  {MealsCategories?.data?.map((mealCategory) => {
                    return (
                      <option key={mealCategory._id} value={mealCategory._id}>
                        {mealCategory.Title_AR || mealCategory.title_AR}
                      </option>
                    );
                  })}
                </Select>
                <FormErrorMessage>
                  {errors.mealCategory?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.quantities}>
                <FormLabel>الكمية</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("quantities", { valueAsNumber: true })}
                />
                <FormErrorMessage>
                  {errors.quantities?.message}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Macronutrients */}
          <Box>
            <Heading size="md" mb={4}>
              المغذيات الكبرى
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <NumberField
                label="السعرات الحرارية"
                name="Calories"
                register={register}
                errors={errors}
              />
              <NumberField
                label="البروتين (جرام)"
                name="Protein"
                register={register}
                errors={errors}
              />
              <NumberField
                label="الكربوهيدرات (جرام)"
                name="Carbohydrates"
                register={register}
                errors={errors}
              />
              <NumberField
                label="الدهون (جرام)"
                name="Fats"
                register={register}
                errors={errors}
              />
              <NumberField
                label="الألياف (جرام)"
                name="Fiber"
                register={register}
                errors={errors}
              />
              <NumberField
                label="السكر (جرام)"
                name="Sugar"
                register={register}
                errors={errors}
              />
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Vitamins */}
          <Box>
            <Heading size="md" mb={4}>
              الفيتامينات
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <NumberField
                label="فيتامين أ"
                name="Vitamin_A"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين E"
                name="Vitamin_E"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين D"
                name="Vitamin_D"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين C"
                name="Vitamin_C"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب١"
                name="Vitamin_B1"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب٢"
                name="Vitamin_B2"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب٣"
                name="Vitamin_B3"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب٥"
                name="Vitamin_B5"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب٦"
                name="Vitamin_B6"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب٧"
                name="Vitamin_B7"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب٩"
                name="Vitamin_B9"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ب١٢"
                name="Vitamin_B12"
                register={register}
                errors={errors}
              />
              <NumberField
                label="فيتامين ك"
                name="Vitamin_K"
                register={register}
                errors={errors}
              />
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Minerals */}
          <Box>
            <Heading size="md" mb={4}>
              المعادن
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <NumberField
                label="الكالسيوم"
                name="Calcium"
                register={register}
                errors={errors}
              />
              <NumberField
                label="الحديد"
                name="Iron"
                register={register}
                errors={errors}
              />
              <NumberField
                label="المغنيسيوم"
                name="Magnesium"
                register={register}
                errors={errors}
              />
              <NumberField
                label="الفوسفور"
                name="Phosphorus"
                register={register}
                errors={errors}
              />
              <NumberField
                label="البوتاسيوم"
                name="Potassium"
                register={register}
                errors={errors}
              />
              <NumberField
                label="الصوديوم"
                name="Sodium"
                register={register}
                errors={errors}
              />
              <NumberField
                label="الزنك"
                name="Zinc"
                register={register}
                errors={errors}
              />
              <NumberField
                label="النحاس"
                name="Copper"
                register={register}
                errors={errors}
              />
              <NumberField
                label="المنغنيز"
                name="Manganese"
                register={register}
                errors={errors}
              />
              <NumberField
                label="السيلينيوم"
                name="Selenium"
                register={register}
                errors={errors}
              />
            </SimpleGrid>
          </Box>

          <Button
            mt={6}
            colorScheme="green"
            isLoading={isSubmitting}
            type="submit"
            size="lg"
          >
            تحديث
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default Index;
