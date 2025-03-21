import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Heading,
  Skeleton,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { VideoUploader } from "../../../../Components/Common/VideoUploader/VideoUploader";
import { useMultipleFormSteps } from "../../../../Hooks/useMultipleFormSteps/useMultipleFormSteps";
import { VideoUploaderStep } from "./Steps/VideoUploader/VideoUploader";
import { FormWrapper } from "./FormWrapper/FormWrapper";
import { ProgressBar } from "../../../../Components/Common/ProgressBar/ProgressBar";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import { ExerciseTitleAndDescription } from "./Steps/ExerciseTitleAndDescription/ExerciseTitleAndDescription";
import { ExerciseInstructions } from "./Steps/ExerciseInstructions/ExerciseInstructions";
import { ExerciseBodyPart } from "./Steps/ExerciseBodyPart/ExerciseBodyPart";
import { ExerciseToolOrMachine } from "./Steps/ToolOrMachine/ToolOrMachine";
import { ExerciseDeepAnatomy } from "./Steps/ExerciseDeepAnatomy/ExerciseDeepAnatomy";
import { ExerciseExtraProps } from "./Steps/ExerciseExtraProps/ExerciseExtraProps";
import { schema } from "./schema";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { UploadProgressModal } from "../../../../Components/Common/UploadingPercentageModal/UploadingPercentageModal";
import { useWatch } from "react-hook-form";
import { uploadToVimeoWithTus } from "../../../../Utils/VimeoVideoUploader/VimeoVideoUploader";
import { useNavigate } from "react-router-dom";
const FormSteps = [
  {
    Component: ExerciseTitleAndDescription,
    fieldsRequired: ["title", "description"],
  },
  {
    Component: ExerciseInstructions,
    fieldsRequired: ["instructions"],
  },
  {
    Component: ExerciseBodyPart,
    fieldsRequired: ["bodyPart"],
  },
  {
    Component: ExerciseToolOrMachine,
    fieldsRequired: ["toolOrMachine"],
  },
  {
    Component: ExerciseDeepAnatomy,
    fieldsRequired: ["deepAnatomy"],
  },
  {
    Component: ExerciseExtraProps,
    fieldsRequired: [
      "Cardio",
      "Warmup",
      "recoveryAndStretching",
      "targetGender",
    ],
  },
  {
    Component: VideoUploaderStep,
    fieldsRequired: ["video"],
  },
];
const errorPaths = {
  instructions: {
    step: 1,
    message: {
      "too short instructions": "الرجاء كتابة الخطوات بشكل مفصل واطول قليلا",
    },
  },
};
export default function Index() {
  const [videoUploadedLink, setVideoUploadedLink] = useState();
  const [uploadingPercent, setUploadingPercent] = useState(0);
  const { user } = useAuth();
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const {
    currentStepIndex,
    wrapperTransionStyles,
    CurrentStep,
    formState: { errors, isSubmitting, isValidating },
    register,
    control,
    setValue,
    isLastStep,
    isFirstStep,
    handleSubmit,
    HandleNext,
    HandlePrev,
    isPending,
    HandleChangeCurrentStepIndex,
    setError,
  } = useMultipleFormSteps({
    steps: FormSteps,
    schema: schema,
    defaultValues: {
      Cardio: false,
      Warmup: false,
      recoveryAndStretching: false,
    },
  });
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

  const createExerciseHelper = useCallback(async (data) => {
    const req = await axiosInstance.post("/Exercises", data, {
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
      console.log(videoLink);
      await uploadVideoHelper({
        signedURL,
        videoLink,
        video: data.video,
        onError: () => {},
      });

      const DataSend = {
        ...data,
        bodyPart: data.bodyPart._id,
        toolOrMachine: data.toolOrMachine._id,
        deepAnatomy: data.deepAnatomy.map((item) => {
          return item._id;
        }),
        vimeo_video_Url: videoLink,
      };
      delete DataSend.video;

      await createExerciseHelper(DataSend);
      toast({
        title: "تم انشاء التمرينة بنجاح",
        status: "success",
      });
      Navigate("/exercises");
    } catch (err) {
      console.log(err);
      const error = err.response.data.errors[0];
      console.log(error);
      HandleChangeCurrentStepIndex(errorPaths[error.path].step);
      setError("root", errorPaths[error.path].message[error.message]);
      toast({
        title: "خطأ في انشاء التمرينة",
        status: "error",
      });
    }
  };
  console.log(video);
  return (
    <>
      <UploadProgressModal
        isOpen={uploadingPercent}
        uploadProgress={uploadingPercent}
        fileName={video?.name}
        fileSize={video?.size}
      />
      <FormWrapper>
        <Stack
          flexShrink="0"
          h="fit-content"
          alignItems="center"
          w="100%"
          maxW="600px"
          bgColor="white"
          p="3"
          borderRadius="lg"
          sx={{
            "> *": {
              flexShrink: 0,
            },
          }}
        >
          <ProgressBar
            size="sm"
            steps={FormSteps.length}
            current={currentStepIndex + 1}
          />
        </Stack>

        <Stack
          justifyContent="center"
          alignItems="center"
          p="3"
          borderRadius="lg"
          bgColor="white"
          w="100%"
          maxW="600px"
          gap="4"
          overflow="hidden"
        >
          <Heading
            display="flex"
            gap="3"
            alignItems="center"
            p="4"
            bgColor="gray.50"
            borderRadius="lg"
            size="sm"
          >
            اضافة تمرينة
            <CgGym />
          </Heading>
          {errors.root && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>خطأ</AlertTitle>
              <AlertDescription>{errors?.root?.message}</AlertDescription>
            </Alert>
          )}

          <motion.div
            style={{
              width: "100%",
              gap: "10px",
              display: "flex",
              flexDirection: "column",
              height: "fit-content",
            }}
            {...wrapperTransionStyles}
            key={currentStepIndex}
          >
            <CurrentStep
              errors={errors}
              currentStepIndex={currentStepIndex}
              register={register}
              control={control}
              setValue={setValue}
            />
          </motion.div>

          <Flex
            as={Skeleton}
            isLoaded={!isPending || !isValidating}
            w="100%"
            justifyContent="start"
            gap="3"
          >
            {isLastStep ? (
              <Button
                isLoading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                gap="3"
                colorScheme="green"
              >
                اضافة التمرينة
              </Button>
            ) : (
              <Button
                isLoading={isValidating}
                onClick={HandleNext}
                gap="3"
                colorScheme="blue"
              >
                <FaArrowRight />
                التالي
              </Button>
            )}

            <Button
              isDisabled={isFirstStep}
              onClick={HandlePrev}
              gap="3"
              colorScheme="blue"
              variant="outline"
            >
              السابق
              <FaArrowLeft />
            </Button>
          </Flex>
        </Stack>
      </FormWrapper>
    </>
  );
}
