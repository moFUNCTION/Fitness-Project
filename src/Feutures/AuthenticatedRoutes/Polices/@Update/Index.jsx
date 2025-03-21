import {
  Button,
  Input,
  Skeleton,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { schema } from "./schema";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";

export default function Index() {
  const { user } = useAuth();
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { id } = useParams();
  const { data, loading, error } = useFetch({
    endpoint: `Policies/${id}`,
  });
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  useEffect(() => {
    reset(data?.data);
  }, [JSON.stringify(data)]);

  const onSubmit = async (data) => {
    try {
      const req = await axiosInstance.put(`Policies/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تم الانشاء بنجاح",
        status: "success",
      });
      Navigate("/polices");
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
      });
    }
  };

  return (
    <Stack
      as={Skeleton}
      isLoaded={!loading}
      minH="300px"
      w="100%"
      p="3"
      gap="3"
    >
      <InputElement register={register} name="title" placeholder="العنوان" />
      <InputElement
        register={register}
        name="content"
        as={Textarea}
        placeholder="المحتوي"
        minH="300px"
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        colorScheme="green"
      >
        تحديث
      </Button>
    </Stack>
  );
}
