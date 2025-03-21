import { Button, Input, Stack, useToast } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { IoIosLink } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdPhone } from "react-icons/md";
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
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      const req = await axiosInstance.post("contactUs", data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تم الانشاء بنجاح",
        status: "success",
      });
      Navigate("/contact-us");
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
      });
    }
  };
  return (
    <Stack p="3" w="100%">
      <InputElement
        placeholder="الاسم"
        name="name"
        register={register}
        errors={errors}
      />
      <InputElement
        placeholder="رقم الهاتف"
        name="phone"
        Icon={MdPhone}
        register={register}
        errors={errors}
      />
      <InputElement
        placeholder="الايميل"
        name="email"
        Icon={MdEmail}
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
