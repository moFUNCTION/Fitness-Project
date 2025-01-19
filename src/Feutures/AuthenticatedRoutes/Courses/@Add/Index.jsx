import {
  Box,
  Button,
  Divider,
  Heading,
  Select,
  Skeleton,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { MdOutlineSubtitles } from "react-icons/md";
import { VideoUploader } from "../../../../Components/Common/VideoUploader/VideoUploader";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { PDFUploader } from "../../../../Components/Common/PdfUploader/PdfUploader";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonCreationSchema } from "./schema";
import { ErrorText } from "../../../../Components/Common/ErrorText/ErrorText";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { uploadToVimeoWithTus } from "../../../../Utils/VimeoVideoUploader/VimeoVideoUploader";
import { UploadProgressModal } from "../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";

export default function Index() {
  const Navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useFetch({
    endpoint: "/categories",
  });
  console.log(error);

  const [uploadingPercent, setUploadingPercent] = useState(0);
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    resolver: zodResolver(LessonCreationSchema),
    mode: "onBlur",
  });

  const createCourseHelper = useCallback(async (data) => {
    const req = await axiosInstance.post("/courses", data, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
      onUploadProgress: (data) => {
        console.log(data);
      },
    });
    return req;
  }, []);

  const onSubmit = async (data) => {
    try {
      const DataSend = new FormData();
      DataSend.append("title", data.title);
      DataSend.append("description", data.description);
      DataSend.append("price", data.price);
      if (!isNaN(data.priceAfterDiscount)) {
        DataSend.append("priceAfterDiscount", data.priceAfterDiscount);
      }
      DataSend.append("category", data.category);
      DataSend.append("image", data.image);
      await createCourseHelper(DataSend);
      toast({
        title: "تم انشاء الكورس بنجاح",
        status: "success",
      });
      Navigate(`/courses`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <UploadProgressModal
        isOpen={uploadingPercent}
        uploadProgress={uploadingPercent}
        fileName="ليس معرف"
        fileSize="ليس معرف"
      />
      <Stack
        sx={{
          "> *": {
            flexShrink: 0,
          },
        }}
        h="100%"
        w="100%"
        p="3"
        overflow="auto"
        spacing={4}
      >
        <Heading size="lg">انشاء كورس</Heading>
        <Divider />

        <InputElement
          Icon={MdOutlineSubtitles}
          placeholder="العنوان"
          register={register}
          name="title"
          errors={errors}
        />

        <InputElement
          Icon={MdOutlineSubtitles}
          placeholder="الوصف"
          register={register}
          as={Textarea}
          name="description"
          errors={errors}
        />
        <InputElement
          Icon={MdOutlineSubtitles}
          placeholder="السعر"
          type="number"
          register={register}
          name="price"
          errors={errors}
        />
        <InputElement
          Icon={MdOutlineSubtitles}
          placeholder="السعر بعد الخصم"
          type="number"
          register={register}
          name="priceAfterDiscount"
          errors={errors}
        />
        <Skeleton isLoaded={!loading}>
          <Select
            {...register("category")}
            cursor="pointer"
            variant="filled"
            placeholder="الرجاء ادخال صنف الكورس"
          >
            {data?.data?.map((item) => {
              return (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              );
            })}
          </Select>
        </Skeleton>
        <ErrorText>{errors.category?.message}</ErrorText>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUploader
              label="رفع صورة"
              img={field.value}
              onChangeImage={(file) => field.onChange(file)}
              onRemoveImage={() => field.onChange("")}
            />
          )}
        />
        <ErrorText>{errors.image?.message}</ErrorText>

        <Button
          isLoading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          colorScheme="blue"
          type="submit"
        >
          رفع الكورس
        </Button>
      </Stack>
    </>
  );
}
