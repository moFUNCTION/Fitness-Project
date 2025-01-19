import {
  Button,
  CircularProgress,
  Divider,
  Heading,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { InputElement } from "../../../../Components/Common/InputElement/InputElement";
import { MdOutlineSubtitles } from "react-icons/md";
import { VideoUploader } from "../../../../Components/Common/VideoUploader/VideoUploader";
import { ImageUploader } from "../../../../Components/Common/ImageDragAndDropUploader/ImageUploader";
import { PDFUploader } from "../../../../Components/Common/PdfUploader/PdfUploader";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { ErrorText } from "../../../../Components/Common/ErrorText/ErrorText";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { uploadToVimeoWithTus } from "../../../../Utils/VimeoVideoUploader/VimeoVideoUploader";
import { UploadProgressModal } from "../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";

export default function Index() {
  const Navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const { data, loading } = useFetch({
    endpoint: `supplements/${id}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });

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
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  useEffect(() => {
    if (data) {
      reset(data?.data);
    }
  }, [JSON.stringify(data?.data)]);

  const video = useWatch({ control, name: "video" });

  const uploadVideoHelper = useCallback(
    async ({ signedURL, video, onError }) => {
      const videoUploaded = await uploadToVimeoWithTus({
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
    console.log(data);
    return { signedURL, videoUri };
  }, []);

  const createSupplementHelper = useCallback(async (data) => {
    const req = await axiosInstance.put(`/supplements/${id}`, data, {
      headers: {
        Authorization: `Bearer ${user.data.token}`,
      },
    });
    return req;
  }, []);

  const onSubmit = async (data) => {
    const DataSend = new FormData();
    try {
      if (data.video instanceof File) {
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
        DataSend.append("vimeo_video_Url", videoLink);
      }

      DataSend.append("title", data.title);
      DataSend.append("description", data.description);
      DataSend.append("image", data.image);

      await createSupplementHelper(DataSend);

      toast({
        title: "تم تحديث بنجاح",
        status: "success",
      });
      Navigate(`/supplements`);
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) {
    return (
      <Stack w="100%">
        <CircularProgress m="0 auto" mt="2" isIndeterminate />
      </Stack>
    );
  }

  return (
    <>
      <UploadProgressModal
        isOpen={uploadingPercent}
        uploadProgress={uploadingPercent}
        fileName={video?.name}
        fileSize={video?.size}
      />
      <Stack
        p="3"
        w="100%"
        as="form"
        h="100%"
        overflow="auto"
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
        sx={{
          "> *": {
            flexShrink: "0",
          },
        }}
      >
        <Heading size="md">انشاء مكمل غذائي</Heading>
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

        <Controller
          name="video"
          control={control}
          render={({ field }) => {
            console.log("asas", field);
            return (
              <VideoUploader
                video={field.value}
                onChange={(file) => field.onChange(file)}
              />
            );
          }}
        />
        <ErrorText>{errors.video?.message}</ErrorText>

        <Button isLoading={isSubmitting} colorScheme="blue" type="submit">
          تحديث المكمل الغذائي
        </Button>
      </Stack>
    </>
  );
}
