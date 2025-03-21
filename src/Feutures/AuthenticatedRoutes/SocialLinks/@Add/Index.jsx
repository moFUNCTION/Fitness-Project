import { Button, Input, Stack, useToast } from "@chakra-ui/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { IoIosLink } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useNavigate } from "react-router-dom";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
export default function Index() {
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { user } = useAuth();
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      const DataForm = new FormData();
      DataForm.append("title", data.title);
      DataForm.append("link", data.link);
      DataForm.append("image", data.image);
      const req = await axiosInstance.post("socialMediaLinks", DataForm, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تم الانشاء بنجاح",
        status: "success",
      });
      Navigate("/social-links");
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
      });
    }
  };
  return (
    <Stack p="3" w="100%">
      <Controller
        name="image"
        control={control}
        render={({ field }) => {
          return (
            <ImageUploader
              img={field.value}
              onRemoveImage={() => field.onChange()}
              onChangeImage={(file) => field.onChange(file)}
              label="رفع صورة "
            />
          );
        }}
      />
      <InputElement
        placeholder="العنوان"
        name="title"
        register={register}
        errors={errors}
      />
      <InputElement
        Icon={IoIosLink}
        placeholder="رابط"
        name="link"
        register={register}
        errors={errors}
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        colorScheme="blue"
      >
        اضافة
      </Button>
    </Stack>
  );
}
