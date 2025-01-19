import { Button, Heading, Stack, Textarea } from "@chakra-ui/react";
import React from "react";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { Controller, useForm } from "react-hook-form";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { ErrorText } from "../../../../Components/Common/ErrorText/ErrorText";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdOutlineSubtitles } from "react-icons/md";

export const schema = z.object({
  title: z
    .string()
    .min(3, { message: "يجب أن يكون العنوان على الأقل 3 أحرف" })
    .max(100, { message: "يجب أن لا يتجاوز العنوان 100 حرف" }),

  description: z
    .string()
    .min(10, { message: "يجب أن يكون الوصف على الأقل 10 أحرف" })
    .max(500, { message: "يجب أن لا يتجاوز الوصف 500 حرف" }),

  image: z.any(),
});

export default function AddChat() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      image: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      gap="2"
      p="3"
      borderRadius="lg"
      bgColor="white"
      w="100%"
    >
      <Heading mb="4" size="md">
        انشاء مجموعة
      </Heading>

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

      <Button isLoading={isSubmitting} colorScheme="blue" type="submit">
        انشاء الجروب
      </Button>
    </Stack>
  );
}
