import React, { useEffect } from "react";
import { FormWrapper } from "../../Exercises/@Add/FormWrapper/FormWrapper";
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
import { ProgressBar } from "../../../../Components/Common/ProgressBar/ProgressBar";
import { useMultipleFormSteps } from "../../../../Hooks/useMultipleFormSteps/useMultipleFormSteps";
import { CgGym } from "react-icons/cg";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { PlanNameDescription } from "./Steps/PlanNameDescription/PlanNameDescription";
import { Days } from "./Steps/Days/Days";
import { schema } from "./schema";
import axiosInstance from "../../../../axiosConfig/axiosInstance";
import { useAuth } from "../../../../Context/UserDataContextProvider/UserDataContextProvder";
import { useNavigate, useParams } from "react-router-dom";
import { ImageUploader } from "./Steps/ImageUploader/ImageUploader";
import { useFetch } from "../../../../Hooks/useFetch/useFetch";
import { v4 } from "uuid";
const FormSteps = [
  {
    Component: PlanNameDescription,
    fieldsRequired: ["name", "description"],
  },
  {
    Component: ImageUploader,
  },
  {
    Component: Days,
  },
];
export default function Index() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });
  const { user } = useAuth();
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
    reset,
  } = useMultipleFormSteps({
    steps: FormSteps,
    schema: schema,
  });
  const { data, error, loading } = useFetch({
    endpoint: `/trainingPlan/${id}`,
    headers: {
      Authorization: `Bearer ${user.data.token}`,
    },
  });
  useEffect(() => {
    if (data) {
      reset({
        ...data?.data,
        days: data?.data?.days.map((day) => {
          const exercises = day.exercises.map((exercise) => {
            return {
              value: exercise,
              id: v4(),
            };
          });
          return {
            value: { ...day, exercises },
            id: v4(),
          };
        }),
      });
    }
  }, [JSON.stringify(data)]);
  const onSubmit = async (data) => {
    try {
      const DataSend = new FormData();
      DataSend.append(
        "days",
        JSON.stringify(
          data.days.map((day, index) => {
            return {
              ...day.value,
              dayNumber: index + 1,
              exercises: day.value.exercises.map((item) => {
                return { ...item.value, exercise: item.value.exercise._id };
              }),
            };
          })
        )
      );
      DataSend.append("image", data.image);
      DataSend.append("title", data.title);
      DataSend.append("description", data.description);
      DataSend.append("targetGender", data.targetGender);
      await axiosInstance.put(`/trainingPlan/${id}`, DataSend, {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      });
      toast({
        title: "تم تحديث الخطة بنجاح",
        status: "success",
      });
      Navigate("/training-plans");
    } catch (err) {
      console.log(err);
      toast({
        title: "خطأ في تحديث الخطة",
        status: "error",
      });
    }
  };

  return (
    <>
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
          <ProgressBar size="sm" steps={3} current={currentStepIndex} />
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
          as={Skeleton}
          isLoaded={!loading}
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
            تحديث خطة التمرين
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
                تحديث خطة التمرين
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
